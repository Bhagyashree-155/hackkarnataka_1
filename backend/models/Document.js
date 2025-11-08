import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
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
  docType: {
    type: String,
    required: true,
    enum: ['id_proof', 'address_proof', 'income_proof', 'collateral_proof', 'other']
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  mimeType: {
    type: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  }
});

documentSchema.index({ loanId: 1 });
documentSchema.index({ userId: 1 });
documentSchema.index({ docType: 1 });

export default mongoose.model('Document', documentSchema);

