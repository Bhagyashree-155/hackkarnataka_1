import express from 'express';
import LoanType from '../models/LoanType.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all active loan types (public)
router.get('/', async (req, res) => {
  try {
    const loanTypes = await LoanType.find({ isActive: true })
      .select('-createdBy')
      .sort({ name: 1 });
    
    res.json({ loanTypes, count: loanTypes.length });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get loan type by ID
router.get('/:id', async (req, res) => {
  try {
    const loanType = await LoanType.findById(req.params.id);
    if (!loanType) {
      return res.status(404).json({ error: 'Loan type not found' });
    }
    res.json({ loanType });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create loan type (Admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, description, interestRate, minAmount, maxAmount, minTenure, maxTenure } = req.body;

    const loanType = new LoanType({
      name,
      description,
      interestRate,
      minAmount: minAmount || 0,
      maxAmount: maxAmount || 1000000,
      minTenure: minTenure || 30,
      maxTenure: maxTenure || 3650,
      createdBy: req.user._id
    });

    await loanType.save();

    res.status(201).json({
      success: true,
      loanType
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update loan type (Admin only)
router.patch('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, description, interestRate, minAmount, maxAmount, minTenure, maxTenure, isActive } = req.body;
    
    const loanType = await LoanType.findById(req.params.id);
    if (!loanType) {
      return res.status(404).json({ error: 'Loan type not found' });
    }

    if (name) loanType.name = name;
    if (description !== undefined) loanType.description = description;
    if (interestRate !== undefined) loanType.interestRate = interestRate;
    if (minAmount !== undefined) loanType.minAmount = minAmount;
    if (maxAmount !== undefined) loanType.maxAmount = maxAmount;
    if (minTenure !== undefined) loanType.minTenure = minTenure;
    if (maxTenure !== undefined) loanType.maxTenure = maxTenure;
    if (isActive !== undefined) loanType.isActive = isActive;
    loanType.updatedAt = new Date();

    await loanType.save();

    res.json({
      success: true,
      loanType
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete loan type (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const loanType = await LoanType.findById(req.params.id);
    if (!loanType) {
      return res.status(404).json({ error: 'Loan type not found' });
    }

    // Soft delete - set isActive to false
    loanType.isActive = false;
    await loanType.save();

    res.json({
      success: true,
      message: 'Loan type deactivated'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

