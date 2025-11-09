import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';
import { verifyAllDocuments } from '../utils/documentVerification.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { 
      name, age, citizenship, email, monthlyIncome, creditScore, password, walletAddress, role,
      // Document IDs (collected but not stored - for verification only)
      aadhaarNumber, incomeCertificateNumber, educationCertificateNumber, studentRegistrationNumber
    } = req.body;

    // Check if user already exists by email
    const existingUserByEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Check if wallet address is provided and already exists
    if (walletAddress) {
      const existingUserByWallet = await User.findOne({ walletAddress: walletAddress.toLowerCase().trim() });
      if (existingUserByWallet) {
        return res.status(400).json({ error: 'User with this wallet address already exists' });
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Determine user role
    const userRole = role === 'admin' ? 'admin' : 'borrower';

    // Verify documents only for borrowers (admin doesn't need document verification)
    let verificationResult = null;
    let studentRegNumber = '';
    if (userRole === 'borrower') {
      // Student registration is optional
      studentRegNumber = studentRegistrationNumber || educationCertificateNumber || '';
      verificationResult = verifyAllDocuments(
        aadhaarNumber,
        incomeCertificateNumber,
        studentRegNumber
      );
    }

    // Note: Document IDs are NOT stored in the database for privacy - only verification status is stored

    // Create user with verification status
    const user = new User({
      name: name.trim(),
      age,
      citizenship,
      email: email.toLowerCase().trim(),
      monthlyIncome: monthlyIncome || 0,
      creditScore: creditScore || 0,
      passwordHash,
      walletAddress: walletAddress ? walletAddress.toLowerCase().trim() : null,
      role: userRole,
      // Set verification flags based on document verification (only for borrowers)
      kycVerified: userRole === 'borrower' ? (verificationResult?.aadhaar.verified || false) : true,
      incomeVerified: userRole === 'borrower' ? (verificationResult?.income.verified || false) : true,
      // Education is optional - if not provided, defaults to true (verified)
      educationVerified: userRole === 'borrower' 
        ? (studentRegNumber ? (verificationResult?.education.verified || false) : true)
        : true,
      // Trusted if required documents (Aadhaar and Income) are verified, or if admin
      trusted: userRole === 'admin' 
        ? true 
        : (verificationResult?.aadhaar.verified && verificationResult?.income.verified)
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        kycVerified: user.kycVerified,
        incomeVerified: user.incomeVerified,
        educationVerified: user.educationVerified,
        trusted: user.trusted
      },
      verification: {
        aadhaar: verificationResult.aadhaar.message,
        income: verificationResult.income.message,
        education: verificationResult.education.message
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user (normalize email)
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Include role in response
        walletAddress: user.walletAddress,
        kycVerified: user.kycVerified,
        incomeVerified: user.incomeVerified,
        educationVerified: user.educationVerified,
        trusted: user.trusted
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      walletAddress: req.user.walletAddress,
      age: req.user.age,
      citizenship: req.user.citizenship,
      monthlyIncome: req.user.monthlyIncome,
      creditScore: req.user.creditScore
    }
  });
});

export default router;

