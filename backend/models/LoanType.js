import mongoose from 'mongoose';

const loanTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  interestRate: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  minAmount: {
    type: Number,
    default: 0
  },
  maxAmount: {
    type: Number,
    default: 1000000
  },
  minTenure: {
    type: Number, // in days
    default: 30
  },
  maxTenure: {
    type: Number, // in days
    default: 3650 // 10 years
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

loanTypeSchema.index({ isActive: 1 });
loanTypeSchema.index({ name: 1 }, { unique: true });

export default mongoose.model('LoanType', loanTypeSchema);

