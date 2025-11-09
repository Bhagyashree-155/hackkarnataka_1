import { ethers } from 'ethers'

// Contract ABI - This will be generated after compiling the contract
// For now, we'll use a basic structure
export const LOAN_CONTRACT_ABI = [
  'function createLoan(uint256 _amount, uint256 _term, uint256 _interestRate) external returns (uint256)',
  'function approveLoan(uint256 _loanId) external payable',
  'function rejectLoan(uint256 _loanId) external',
  'function repayLoan(uint256 _loanId) external payable',
  'function markAsDefaulted(uint256 _loanId) external',
  'function getLoan(uint256 _loanId) external view returns (tuple(uint256 id, address borrower, address lender, uint256 amount, uint256 term, uint256 interestRate, uint256 createdAt, uint256 dueDate, uint256 repaidAmount, uint8 status))',
  'function getBorrowerLoans(address _borrower) external view returns (uint256[])',
  'function getLenderLoans(address _lender) external view returns (uint256[])',
  'function getTotalLoans() external view returns (uint256)',
  'function calculateRepaymentAmount(uint256 _loanId) external view returns (uint256)',
  'event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 amount, uint256 term, uint256 interestRate)',
  'event LoanApproved(uint256 indexed loanId, address indexed lender, address indexed borrower)',
  'event LoanRejected(uint256 indexed loanId, address indexed lender)',
  'event LoanRepaid(uint256 indexed loanId, address indexed borrower, uint256 amount)',
  'event LoanDefaulted(uint256 indexed loanId, address indexed borrower)',
]

// Contract address - Update this after deploying
// This should be set from environment variables or deployment output
// Default to localhost deployment address
export const LOAN_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3'

/**
 * Get contract instance
 * @param {ethers.Signer} signer - The signer from wallet
 * @returns {ethers.Contract} Contract instance
 */
export const getLoanContract = (signer) => {
  if (!LOAN_CONTRACT_ADDRESS) {
    throw new Error('Contract address not set. Please deploy the contract first.')
  }
  return new ethers.Contract(LOAN_CONTRACT_ADDRESS, LOAN_CONTRACT_ABI, signer)
}

/**
 * Create a new loan request
 * @param {ethers.Signer} signer - The signer from wallet
 * @param {string} amount - Loan amount in ETH (will be converted to wei)
 * @param {number} term - Loan term in days
 * @param {number} interestRate - Interest rate in basis points (e.g., 500 = 5%)
 * @returns {Promise<ethers.ContractTransactionResponse>} Transaction response
 */
export const createLoan = async (signer, amount, term, interestRate) => {
  const contract = getLoanContract(signer)
  const amountInWei = ethers.parseEther(amount.toString())
  const tx = await contract.createLoan(amountInWei, term, interestRate)
  return tx
}

/**
 * Approve and fund a loan
 * @param {ethers.Signer} signer - The signer from wallet
 * @param {number} loanId - ID of the loan to approve
 * @param {string} amount - Amount to send in ETH (will be converted to wei)
 * @returns {Promise<ethers.ContractTransactionResponse>} Transaction response
 */
export const approveLoan = async (signer, loanId, amount) => {
  const contract = getLoanContract(signer)
  const amountInWei = ethers.parseEther(amount.toString())
  const tx = await contract.approveLoan(loanId, { value: amountInWei })
  return tx
}

/**
 * Reject a loan request
 * @param {ethers.Signer} signer - The signer from wallet
 * @param {number} loanId - ID of the loan to reject
 * @returns {Promise<ethers.ContractTransactionResponse>} Transaction response
 */
export const rejectLoan = async (signer, loanId) => {
  const contract = getLoanContract(signer)
  const tx = await contract.rejectLoan(loanId)
  return tx
}

/**
 * Repay a loan
 * @param {ethers.Signer} signer - The signer from wallet
 * @param {number} loanId - ID of the loan to repay
 * @param {string} amount - Amount to repay in ETH (will be converted to wei)
 * @returns {Promise<ethers.ContractTransactionResponse>} Transaction response
 */
export const repayLoan = async (signer, loanId, amount) => {
  const contract = getLoanContract(signer)
  const amountInWei = ethers.parseEther(amount.toString())
  const tx = await contract.repayLoan(loanId, { value: amountInWei })
  return tx
}

/**
 * Get loan details
 * @param {ethers.Provider} provider - The provider
 * @param {number} loanId - ID of the loan
 * @returns {Promise<Object>} Loan object
 */
export const getLoan = async (provider, loanId) => {
  const contract = new ethers.Contract(LOAN_CONTRACT_ADDRESS, LOAN_CONTRACT_ABI, provider)
  const loan = await contract.getLoan(loanId)
  return {
    id: loan.id.toString(),
    borrower: loan.borrower,
    lender: loan.lender,
    amount: ethers.formatEther(loan.amount),
    term: loan.term.toString(),
    interestRate: loan.interestRate.toString(),
    createdAt: new Date(Number(loan.createdAt) * 1000),
    dueDate: loan.dueDate.toString() !== '0' ? new Date(Number(loan.dueDate) * 1000) : null,
    repaidAmount: ethers.formatEther(loan.repaidAmount),
    status: ['Pending', 'Approved', 'Rejected', 'Active', 'Repaid', 'Defaulted'][loan.status],
  }
}

/**
 * Get all loans for a borrower
 * @param {ethers.Provider} provider - The provider
 * @param {string} borrowerAddress - Address of the borrower
 * @returns {Promise<Array<number>>} Array of loan IDs
 */
export const getBorrowerLoans = async (provider, borrowerAddress) => {
  const contract = new ethers.Contract(LOAN_CONTRACT_ADDRESS, LOAN_CONTRACT_ABI, provider)
  const loanIds = await contract.getBorrowerLoans(borrowerAddress)
  return loanIds.map(id => id.toString())
}

/**
 * Get all loans for a lender
 * @param {ethers.Provider} provider - The provider
 * @param {string} lenderAddress - Address of the lender
 * @returns {Promise<Array<number>>} Array of loan IDs
 */
export const getLenderLoans = async (provider, lenderAddress) => {
  const contract = new ethers.Contract(LOAN_CONTRACT_ADDRESS, LOAN_CONTRACT_ABI, provider)
  const loanIds = await contract.getLenderLoans(lenderAddress)
  return loanIds.map(id => id.toString())
}

/**
 * Calculate repayment amount for a loan
 * @param {ethers.Provider} provider - The provider
 * @param {number} loanId - ID of the loan
 * @returns {Promise<string>} Repayment amount in ETH
 */
export const calculateRepaymentAmount = async (provider, loanId) => {
  const contract = new ethers.Contract(LOAN_CONTRACT_ADDRESS, LOAN_CONTRACT_ABI, provider)
  const amount = await contract.calculateRepaymentAmount(loanId)
  return ethers.formatEther(amount)
}

