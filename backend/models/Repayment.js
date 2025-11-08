import mongoose from 'mongoose';

const repaymentSchema = new mongoose.Schema({
  loanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoanApplication',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emiNumber: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  principal: {
    type: Number,
    required: true
  },
  interest: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'partial'],
    default: 'pending'
  },
  penalty: {
    type: Number,
    default: 0
  },
  paidDate: {
    type: Date
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  daysDelayed: {
    type: Number,
    default: 0
  },
  blockchainTxHash: {
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

repaymentSchema.index({ loanId: 1 });
repaymentSchema.index({ userId: 1 });
repaymentSchema.index({ dueDate: 1 });
repaymentSchema.index({ status: 1 });

export default mongoose.model('Repayment', repaymentSchema);

