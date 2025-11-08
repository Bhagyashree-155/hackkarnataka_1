# Implementation Plan - New Loan Features

## Features to Implement:

1. ✅ **Loan Types with Interest Rates**
   - Backend: LoanType model created
   - Backend: Loan types API routes created
   - Frontend: Need to add loan type selection

2. ✅ **Account Details in Loan Form**
   - Backend: Account details added to LoanApplication model
   - Frontend: Need to add account details fields

3. ✅ **EMI Calculation & Preview**
   - Backend: EMI calculator utility exists
   - Frontend: Need to add EMI calculation and display

4. ✅ **Repayment Interface**
   - Backend: Repayment endpoint exists
   - Frontend: Need to add repayment UI for borrowers

## Next Steps:

1. Update Borrowers.jsx with:
   - Loan type selection dropdown
   - Account details fields (account number, address, mobile)
   - EMI calculation and preview
   - Repayment interface for approved loans

2. Update Lenders.jsx to:
   - Show loan types with interest rates
   - Use loan type interest rate when approving

3. Create initial loan types in database

