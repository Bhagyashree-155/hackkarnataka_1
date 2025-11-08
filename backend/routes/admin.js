import express from 'express';
import LoanApplication from '../models/LoanApplication.js';
import User from '../models/User.js';
import Repayment from '../models/Repayment.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all pending loan applications
router.get('/loans/pending', authenticate, isAdmin, async (req, res) => {
  try {
    const loans = await LoanApplication.find({ status: 'pending' })
      .populate('userId', 'name email age citizenship monthlyIncome creditScore')
      .sort({ createdAt: -1 });

    res.json({ loans, count: loans.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all borrowers
router.get('/borrowers', authenticate, isAdmin, async (req, res) => {
  try {
    const borrowers = await User.find({ role: 'borrower' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.json({ borrowers, count: borrowers.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get borrower profile with loan history
router.get('/borrowers/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const borrower = await User.findById(req.params.id).select('-passwordHash');
    if (!borrower) {
      return res.status(404).json({ error: 'Borrower not found' });
    }

    const loans = await LoanApplication.find({ userId: borrower._id })
      .sort({ createdAt: -1 });

    const repayments = await Repayment.find({ userId: borrower._id })
      .populate('loanId')
      .sort({ dueDate: -1 });

    res.json({
      borrower,
      loans,
      repayments
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', authenticate, isAdmin, async (req, res) => {
  try {
    const totalLoans = await LoanApplication.countDocuments();
    const pendingLoans = await LoanApplication.countDocuments({ status: 'pending' });
    const activeLoans = await LoanApplication.countDocuments({ status: 'active' });
    const totalBorrowers = await User.countDocuments({ role: 'borrower' });
    
    const loans = await LoanApplication.find({ status: 'active' });
    const totalVolume = loans.reduce((sum, loan) => sum + loan.amount, 0);

    const overdueRepayments = await Repayment.countDocuments({
      status: 'overdue',
      dueDate: { $lt: new Date() }
    });

    res.json({
      totalLoans,
      pendingLoans,
      activeLoans,
      totalBorrowers,
      totalVolume,
      overdueRepayments
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

