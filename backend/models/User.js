import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 60
  },
  citizenship: {
    type: String,
    required: true,
    enum: ['Resident', 'Non-Resident']
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  monthlyIncome: {
    type: Number,
    default: 0
  },
  creditScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 900
  },
  role: {
    type: String,
    enum: ['borrower', 'admin', 'lender'],
    default: 'borrower'
  },
  passwordHash: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String
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

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ walletAddress: 1 }, { unique: true, sparse: true });

export default mongoose.model('User', userSchema);

