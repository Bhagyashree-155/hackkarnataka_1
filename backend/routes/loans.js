import express from 'express';
import LoanApplication from '../models/LoanApplication.js';
import Repayment from '../models/Repayment.js';
import Document from '../models/Document.js';
import User from '../models/User.js';
import LoanType from '../models/LoanType.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { checkEligibility, checkSuspiciousActivity } from '../utils/eligibility.js';
import { generateEMISchedule, calculateEMI, calculateTotalInterest } from '../utils/emiCalculator.js';

const router = express.Router();

// Get all loans (with filters)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, loanType, userId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (loanType) query.loanType = loanType;
    if (userId) query.userId = userId;
    if (req.user.role === 'borrower') {
      query.userId = req.user._id;
    }

    const loans = await LoanApplication.find(query)
      .populate('userId', 'name email kycVerified incomeVerified educationVerified trusted')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ loans, count: loans.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get loan by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const loan = await LoanApplication.findById(req.params.id)
      .populate('userId', 'name email age citizenship monthlyIncome creditScore kycVerified incomeVerified educationVerified trusted')
      .populate('approvedBy', 'name email');

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Check authorization
    if (req.user.role === 'borrower' && loan.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get repayments
    const repayments = await Repayment.find({ loanId: loan._id }).sort({ emiNumber: 1 });
    
    // Get documents
    const documents = await Document.find({ loanId: loan._id });

    res.json({
      loan,
      repayments,
      documents
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create loan application
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      loanType,
      amount,
      purpose,
      employmentStatus,
      monthlyIncome,
      collateralValue,
      collateralInfo,
      tenure,
      interestRate,
      accountDetails,
      emiPreview
    } = req.body;

    // Get user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is trusted (all documents verified)
    // This will be checked during loan approval

    // Get active loans count
    const activeLoansCount = await LoanApplication.countDocuments({
      userId: user._id,
      status: { $in: ['pending', 'approved', 'active'] }
    });

    // Calculate total debt
    const activeLoans = await LoanApplication.find({
      userId: user._id,
      status: { $in: ['approved', 'active'] }
    });
    const totalDebt = activeLoans.reduce((sum, loan) => sum + loan.amount, 0) + amount;

    // Get documents
    const documents = await Document.find({ userId: user._id });

    // Create loan application
    const loanApplication = new LoanApplication({
      userId: user._id,
      loanType,
      amount,
      purpose,
      employmentStatus,
      monthlyIncome: monthlyIncome || user.monthlyIncome,
      collateralValue: collateralValue || 0,
      collateralInfo: collateralInfo || '',
      tenure,
      // Interest rate will be set by lender when approving
      interestRate: interestRate || null,
      accountDetails: accountDetails || {},
      emiPreview: emiPreview || {}
    });

    // Check eligibility
    const eligibility = await checkEligibility(
      user,
      loanApplication,
      activeLoansCount,
      totalDebt - amount, // Existing debt only
      documents
    );

    loanApplication.eligibilityChecked = true;
    loanApplication.eligibilityResults = eligibility.results;

    // Check for suspicious activity
    const suspiciousCheck = checkSuspiciousActivity(loanApplication, user);
    
    // Store eligibility and suspicious check results but don't auto-reject
    // Let lenders/admin manually review and decide
    if (suspiciousCheck.isSuspicious) {
      loanApplication.adminRemarks = `⚠️ Suspicious activity detected: ${suspiciousCheck.flags.join(', ')}. Review required.`;
    } else if (!eligibility.isEligible) {
      // Store which eligibility checks failed
      const failedChecks = Object.entries(eligibility.results)
        .filter(([_, passed]) => !passed)
        .map(([check, _]) => check.replace('Check', '').toLowerCase());
      loanApplication.adminRemarks = `⚠️ Eligibility concerns: ${failedChecks.join(', ')}. Review required.`;
    }

    // Default to pending status - let lenders/admin review and decide
    loanApplication.status = 'pending';

    await loanApplication.save();

    res.status(201).json({
      success: true,
      loan: loanApplication,
      eligibility: eligibility.results,
      isEligible: eligibility.isEligible,
      suspicious: suspiciousCheck
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Approve/Reject loan (Admin only)
router.patch('/:id/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const loan = await LoanApplication.findById(req.params.id).populate('userId');

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (status === 'approved') {
      // Get interest rate from loan type
      const loanTypeData = await LoanType.findOne({ name: loan.loanType, isActive: true });
      if (!loanTypeData) {
        return res.status(400).json({ error: 'Loan type not found or inactive' });
      }
      const finalInterestRate = loanTypeData.interestRate;

      // Get borrower and check if required documents are verified (trusted)
      const borrower = loan.userId;
      if (borrower) {
        // Check if required documents are verified (Aadhaar and Income are required, Education is optional)
        const requiredDocumentsVerified = borrower.kycVerified && borrower.incomeVerified;
        
        if (!requiredDocumentsVerified) {
          loan.status = 'rejected';
          loan.adminRemarks = `Loan rejected: Required documents not verified. KYC: ${borrower.kycVerified ? '✅' : '❌'}, Income: ${borrower.incomeVerified ? '✅' : '❌'}`;
          await loan.save();
          return res.status(400).json({ 
            error: `Loan cannot be approved. Required documents must be verified. KYC: ${borrower.kycVerified ? 'Verified' : 'Not Verified'}, Income: ${borrower.incomeVerified ? 'Verified' : 'Not Verified'}`,
            loan
          });
        }

        // Mark borrower as trusted if required documents verified
        if (requiredDocumentsVerified && !borrower.trusted) {
          borrower.trusted = true;
          await borrower.save();
        }
      }

      loan.interestRate = finalInterestRate;
      loan.status = 'approved';
      loan.approvedBy = req.user._id;
      loan.approvedAt = new Date();
      
      // Calculate tenure in months (convert days to months)
      const tenureMonths = Math.ceil(loan.tenure / 30);
      
      // Generate EMI schedule
      const emiSchedule = generateEMISchedule(
        loan.amount,
        loan.interestRate,
        tenureMonths,
        new Date()
      );

      // Create repayment records
      for (const emi of emiSchedule) {
        const repayment = new Repayment({
          loanId: loan._id,
          userId: loan.userId,
          emiNumber: emi.emiNumber,
          dueDate: emi.dueDate,
          amount: emi.amount,
          principal: emi.principal,
          interest: emi.interest,
          status: 'pending'
        });
        await repayment.save();
      }

      loan.status = 'active';
    } else if (status === 'rejected') {
      loan.status = 'rejected';
    }

    if (remarks) {
      loan.adminRemarks = remarks;
    }

    await loan.save();

    res.json({
      success: true,
      loan
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Make repayment
router.post('/:id/repay', authenticate, async (req, res) => {
  try {
    // Extract emiNumber and amount from request body
    // Ensure proper type conversion
    const emiNumber = req.body.emiNumber ? (typeof req.body.emiNumber === 'number' ? req.body.emiNumber : parseInt(req.body.emiNumber, 10)) : null;
    const amount = req.body.amount ? (typeof req.body.amount === 'number' ? req.body.amount : parseFloat(req.body.amount)) : null;

    const loan = await LoanApplication.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Find the next unpaid repayment
    // If emiNumber is provided and is a valid number, use it; otherwise find the first unpaid one
    let repayment;
    if (emiNumber && !isNaN(emiNumber) && emiNumber > 0) {
      repayment = await Repayment.findOne({
        loanId: loan._id,
        emiNumber: Number(emiNumber), // Ensure it's a number
        status: { $in: ['pending', 'overdue'] }
      });
    } else {
      // Find the first unpaid repayment
      repayment = await Repayment.findOne({
        loanId: loan._id,
        status: { $in: ['pending', 'overdue'] }
      }).sort({ emiNumber: 1 });
    }

    if (!repayment) {
      return res.status(404).json({ error: 'Repayment not found' });
    }

    const now = new Date();
    const daysDelayed = Math.max(0, Math.floor((now - repayment.dueDate) / (1000 * 60 * 60 * 24)));

    // Calculate penalty
    let penalty = 0;
    if (daysDelayed > 10) {
      penalty = repayment.amount * 0.02; // 2% of EMI
    }

    // Ensure amount is a number
    const paidAmount = (amount && !isNaN(amount)) ? Number(amount) : repayment.amount;
    repayment.paidAmount = paidAmount;
    repayment.paidDate = now;
    repayment.daysDelayed = daysDelayed;
    repayment.penalty = penalty;
    repayment.status = repayment.paidAmount >= repayment.amount ? 'paid' : 'partial';

    await repayment.save();

    // Check if all repayments are paid
    const remainingRepayments = await Repayment.countDocuments({
      loanId: loan._id,
      status: { $in: ['pending', 'overdue'] }
    });

    if (remainingRepayments === 0) {
      loan.status = 'completed';
      await loan.save();
    }

    res.json({
      success: true,
      repayment
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

