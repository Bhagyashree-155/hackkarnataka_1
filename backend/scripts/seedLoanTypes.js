import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LoanType from '../models/LoanType.js';
import User from '../models/User.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blockgenix';

const loanTypes = [
  {
    name: 'Personal Loan',
    description: 'For personal expenses and needs',
    interestRate: 12.5,
    minAmount: 1000,
    maxAmount: 500000,
    minTenure: 30,
    maxTenure: 1825 // 5 years
  },
  {
    name: 'Home Loan',
    description: 'For purchasing or renovating your home',
    interestRate: 8.5,
    minAmount: 50000,
    maxAmount: 5000000,
    minTenure: 365,
    maxTenure: 7300 // 20 years
  },
  {
    name: 'Vehicle Loan',
    description: 'For purchasing vehicles',
    interestRate: 9.5,
    minAmount: 10000,
    maxAmount: 2000000,
    minTenure: 180,
    maxTenure: 3650 // 10 years
  },
  {
    name: 'Education Loan',
    description: 'For education expenses',
    interestRate: 7.5,
    minAmount: 5000,
    maxAmount: 1000000,
    minTenure: 90,
    maxTenure: 5475 // 15 years
  },
  {
    name: 'Business Loan',
    description: 'For business expansion and needs',
    interestRate: 11.5,
    minAmount: 50000,
    maxAmount: 10000000,
    minTenure: 180,
    maxTenure: 3650 // 10 years
  }
];

async function seedLoanTypes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get first admin user or create a default one
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      // Get any user to use as creator
      adminUser = await User.findOne();
    }

    const createdBy = adminUser ? adminUser._id : null;

    // Clear existing loan types
    await LoanType.deleteMany({});
    console.log('🗑️  Cleared existing loan types');

    // Create loan types
    for (const loanTypeData of loanTypes) {
      const loanType = new LoanType({
        ...loanTypeData,
        createdBy
      });
      await loanType.save();
      console.log(`✅ Created loan type: ${loanType.name} (${loanType.interestRate}%)`);
    }

    console.log(`\n✅ Successfully seeded ${loanTypes.length} loan types!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedLoanTypes();

