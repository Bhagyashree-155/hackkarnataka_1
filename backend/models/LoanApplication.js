import mongoose from 'mongoose';

const loanApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loanType: {
    type: String,
    required: true
    // No enum restriction - accepts any loan type name from LoanType collection
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  },
  employmentStatus: {
    type: String,
    required: true,
    enum: ['employed', 'self-employed', 'unemployed', 'student']
  },
  monthlyIncome: {
    type: Number,
    default: 0
  },
  collateralValue: {
    type: Number,
    default: 0
  },
  collateralInfo: {
    type: String,
    trim: true
  },
  tenure: {
    type: Number,
    required: true,
    min: 1
  },
  interestRate: {
    type: Number,
    required: false,
    min: 0,
    max: 100,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'defaulted'],
    default: 'pending'
  },
  eligibilityChecked: {
    type: Boolean,
    default: false
  },
  eligibilityResults: {
    ageCheck: { type: Boolean, default: false },
    citizenshipCheck: { type: Boolean, default: false },
    incomeCheck: { type: Boolean, default: false },
    creditScoreCheck: { type: Boolean, default: false },
    activeLoansCheck: { type: Boolean, default: false },
    collateralCheck: { type: Boolean, default: false },
    debtToIncomeCheck: { type: Boolean, default: false },
    documentsCheck: { type: Boolean, default: false }
  },
  adminRemarks: {
    type: String,
    trim: true
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  blockchainTxHash: {
    type: String
  },
  blockchainLoanId: {
    type: Number
  },
  // Account details for disbursement
  accountDetails: {
    accountNumber: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    mobileNumber: {
      type: String,
      trim: true
    }
  },
  // EMI preview (calculated before approval)
  emiPreview: {
    monthlyEMI: {
      type: Number
    },
    totalInterest: {
      type: Number
    },
    totalAmount: {
      type: Number
    }
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

loanApplicationSchema.index({ userId: 1 });
loanApplicationSchema.index({ status: 1 });
loanApplicationSchema.index({ createdAt: -1 });

export default mongoose.model('LoanApplication', loanApplicationSchema);

