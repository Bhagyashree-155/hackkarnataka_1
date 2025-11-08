import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Eye, Loader2 } from 'lucide-react'
import { useWallet } from '../context/WalletContext'
import { useState, useEffect } from 'react'
import { loansAPI } from '../services/api.js'

const Lenders = () => {
  const { isConnected } = useWallet()
  const [selectedLoan, setSelectedLoan] = useState(null)
  const [loanRequests, setLoanRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Fetch pending loans on component mount
  useEffect(() => {
    fetchPendingLoans()
  }, [])

  const fetchPendingLoans = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await loansAPI.getAllLoans({ status: 'pending' })
      setLoanRequests(response.loans || [])
    } catch (err) {
      console.error('Error fetching pending loans:', err)
      setError(err.message || 'Failed to fetch loan requests')
      setLoanRequests([])
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (loan) => {
    if (!window.confirm(`Are you sure you want to approve this ${loan.loanType || 'loan'}?`)) {
      return
    }

    setProcessing(loan._id || loan.id)
    setError(null)
    setSuccess(null)

    try {
      // Approve without interest rate - backend will use loan type interest rate
      const response = await loansAPI.approveRejectLoan(
        loan._id || loan.id, 
        'approved',
        ''
      )
      
      if (response.success || response.loan) {
        setSuccess('Loan approved successfully!')
        // Refresh loans list
        await fetchPendingLoans()
        if (selectedLoan?._id === loan._id) {
          setSelectedLoan(null)
        }
      }
    } catch (err) {
      console.error('Error approving loan:', err)
      setError(err.message || 'Failed to approve loan. You may need admin access.')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (loanId) => {
    if (!window.confirm('Are you sure you want to reject this loan?')) {
      return
    }

    setProcessing(loanId)
    setError(null)
    setSuccess(null)

    try {
      const response = await loansAPI.approveRejectLoan(loanId, 'rejected')
      
      if (response.success || response.loan) {
        setSuccess('Loan rejected successfully!')
        // Refresh loans list
        await fetchPendingLoans()
        if (selectedLoan?._id === loanId) {
          setSelectedLoan(null)
        }
      }
    } catch (err) {
      console.error('Error rejecting loan:', err)
      setError(err.message || 'Failed to reject loan. You may need admin access.')
    } finally {
      setProcessing(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    // Convert to IST (UTC+5:30)
    const istDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
    const diffMs = now - istDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  const formatDateTimeIST = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatAddress = (address) => {
    if (!address) return 'N/A'
    if (address.length <= 10) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Lenders</h1>
        <p className="text-gray-400">
          Review and manage loan requests from borrowers
        </p>
      </motion.div>

      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-8 text-center"
        >
          <p className="text-gray-300">
            Connect your wallet to start lending
          </p>
        </motion.div>
      )}

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6 bg-green-500/20 border border-green-500/50 text-green-400"
        >
          {success}
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6 bg-red-500/20 border border-red-500/50 text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          <span className="ml-3 text-gray-400">Loading loan requests...</span>
        </div>
      ) : loanRequests.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center"
        >
          <p className="text-gray-400 text-lg">
            No pending loan requests at the moment.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {loanRequests.map((loan, index) => {
            const isProcessing = processing === (loan._id || loan.id)
            const borrowerAddress = loan.userId?.walletAddress || loan.borrower || 'N/A'
            const borrowerName = loan.userId?.name || 'Unknown Borrower'
            
            return (
              <motion.div
                key={loan._id || loan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card glass-card-hover p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">
                      {loan.loanType || 'Loan'} Request #{loan._id?.slice(-6) || loan.id}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Borrower: <span className="font-mono text-primary-300">{borrowerName}</span>
                    </p>
                    <p className="text-gray-400 text-sm">
                      Wallet: <span className="font-mono">{formatAddress(borrowerAddress)}</span>
                    </p>
                    <p className="text-gray-400 text-sm">{formatDateTimeIST(loan.createdAt)}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-400/20 text-yellow-400">
                    PENDING
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Loan Type</p>
                    <p className="text-white font-semibold text-lg">
                      {loan.loanType || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Amount</p>
                    <p className="text-white font-semibold text-lg">
                      {loan.amount} ETH
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Term</p>
                    <p className="text-white font-semibold text-lg">
                      {loan.tenure} days
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Interest Rate</p>
                    <p className="text-white font-semibold text-lg">
                      {loan.interestRate ? `${loan.interestRate}%` : 'Will use loan type rate'}
                    </p>
                  </div>
                </div>

                {/* Document Verification Status */}
                {loan.userId && (
                  <div className="mb-6 p-4 glass-card bg-white/5 rounded-lg">
                    <h4 className="text-white font-semibold mb-3">Document Verification Status</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Aadhaar (KYC)</p>
                        <p className={`text-sm font-semibold ${loan.userId.kycVerified ? 'text-green-400' : 'text-red-400'}`}>
                          {loan.userId.kycVerified ? '✅ Verified' : '❌ Not Verified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Income Certificate</p>
                        <p className={`text-sm font-semibold ${loan.userId.incomeVerified ? 'text-green-400' : 'text-red-400'}`}>
                          {loan.userId.incomeVerified ? '✅ Verified' : '❌ Not Verified'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Education Certificate (Optional)</p>
                        <p className={`text-sm font-semibold ${loan.userId.educationVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                          {loan.userId.educationVerified ? '✅ Verified' : '⚠️ Not Provided (Optional)'}
                        </p>
                      </div>
                    </div>
                    {loan.userId.trusted && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-green-400 text-sm font-semibold">
                          ✅ Required Documents Verified - Borrower is Trusted
                        </p>
                      </div>
                    )}
                    {!loan.userId.trusted && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-red-400 text-sm font-semibold">
                          ❌ Required Documents Not Verified - Cannot Approve Loan
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Aadhaar and Income Certificate must be verified
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {isConnected && (
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(loan)}
                      disabled={isProcessing}
                      className="flex-1 glass-card p-3 bg-green-500/20 text-green-400 hover:bg-green-500/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Approve</span>
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(loan._id || loan.id)}
                      disabled={isProcessing}
                      className="flex-1 glass-card p-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          <span>Reject</span>
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedLoan(loan)}
                      className="glass-card p-3 text-primary-400 hover:bg-white/10 flex items-center justify-center"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Loan Details Modal */}
      {selectedLoan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLoan(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Loan Details #{selectedLoan._id?.slice(-6) || selectedLoan.id}
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Borrower Name</p>
                <p className="text-white">{selectedLoan.userId?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Borrower Email</p>
                <p className="text-white">{selectedLoan.userId?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Borrower Wallet</p>
                <p className="text-white font-mono text-sm">{selectedLoan.userId?.walletAddress || selectedLoan.borrower || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Loan Type</p>
                <p className="text-white text-xl font-semibold">{selectedLoan.loanType || 'Personal'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Loan Amount</p>
                <p className="text-white text-xl font-semibold">
                  {selectedLoan.amount} ETH
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Loan Term</p>
                <p className="text-white text-xl font-semibold">
                  {selectedLoan.tenure} days
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Interest Rate</p>
                <p className="text-white text-xl font-semibold">
                  {selectedLoan.interestRate ? `${selectedLoan.interestRate}%` : 'Will use loan type rate'}
                </p>
              </div>
              {/* Document Verification Status */}
              {selectedLoan.userId && (
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-lg font-bold text-white mb-3">Document Verification Status</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Aadhaar (KYC)</p>
                      <p className={`text-sm font-semibold ${selectedLoan.userId.kycVerified ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedLoan.userId.kycVerified ? '✅ Verified' : '❌ Not Verified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Income Certificate</p>
                      <p className={`text-sm font-semibold ${selectedLoan.userId.incomeVerified ? 'text-green-400' : 'text-red-400'}`}>
                        {selectedLoan.userId.incomeVerified ? '✅ Verified' : '❌ Not Verified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Education Certificate (Optional)</p>
                      <p className={`text-sm font-semibold ${selectedLoan.userId.educationVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                        {selectedLoan.userId.educationVerified ? '✅ Verified' : '⚠️ Not Provided (Optional)'}
                      </p>
                    </div>
                    {selectedLoan.userId.trusted && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-green-400 text-sm font-semibold">
                          ✅ Required Documents Verified - Borrower is Trusted
                        </p>
                      </div>
                    )}
                    {!selectedLoan.userId.trusted && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-red-400 text-sm font-semibold">
                          ❌ Required Documents Not Verified - Cannot Approve Loan
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Aadhaar and Income Certificate must be verified
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selectedLoan.accountDetails && (
                <>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Account Number</p>
                    <p className="text-white font-mono text-sm">{selectedLoan.accountDetails.accountNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Address</p>
                    <p className="text-white text-sm">{selectedLoan.accountDetails.address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Mobile Number</p>
                    <p className="text-white text-sm">{selectedLoan.accountDetails.mobileNumber || 'N/A'}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-gray-400 text-sm mb-1">Created</p>
                <p className="text-white">{formatDateTimeIST(selectedLoan.createdAt)}</p>
              </div>
              {selectedLoan.eligibilityResults && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Eligibility</p>
                  <p className="text-white text-sm">
                    {selectedLoan.eligibilityResults.isEligible ? '✅ Eligible' : '❌ Not Eligible'}
                  </p>
                </div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedLoan(null)}
              className="mt-6 w-full glass-card p-3 text-primary-300 hover:bg-white/10"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Lenders
