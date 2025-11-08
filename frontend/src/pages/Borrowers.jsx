import { motion } from 'framer-motion'
import { Plus, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useWallet } from '../context/WalletContext'
import { useState, useEffect } from 'react'
import { loansAPI } from '../services/api.js'

const Borrowers = () => {
  const { isConnected, account } = useWallet()
  const [showModal, setShowModal] = useState(false)
  const [loanAmount, setLoanAmount] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Fetch loans on component mount
  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await loansAPI.getAllLoans()
      setLoans(response.loans || [])
    } catch (err) {
      console.error('Error fetching loans:', err)
      setError(err.message || 'Failed to fetch loans')
      setLoans([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitLoan = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const loanData = {
        loanType: 'personal', // Default loan type
        amount: parseFloat(loanAmount),
        purpose: 'General purpose',
        employmentStatus: 'employed',
        tenure: parseInt(loanTerm),
        interestRate: parseFloat(interestRate),
      }

      const response = await loansAPI.createLoan(loanData)
      
      if (response.success) {
        setSuccess('Loan request submitted successfully!')
        setShowModal(false)
        setLoanAmount('')
        setLoanTerm('')
        setInterestRate('')
        // Refresh loans list
        await fetchLoans()
      }
    } catch (err) {
      console.error('Error submitting loan:', err)
      setError(err.message || 'Failed to submit loan request')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'approved':
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-400/20 text-yellow-400'
      case 'approved':
      case 'active':
        return 'bg-green-400/20 text-green-400'
      case 'rejected':
        return 'bg-red-400/20 text-red-400'
      default:
        return ''
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    return `${diffDays} days ago`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Borrowers</h1>
          <p className="text-gray-400">Manage your loan requests</p>
        </div>
        {isConnected && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="glass-card glass-card-hover px-6 py-3 flex items-center space-x-2 text-primary-300"
          >
            <Plus className="w-5 h-5" />
            <span>Request Loan</span>
          </motion.button>
        )}
      </motion.div>

      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-8 text-center"
        >
          <p className="text-gray-300">
            Connect your wallet to request loans
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
          <span className="ml-3 text-gray-400">Loading loans...</span>
        </div>
      ) : loans.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 text-center"
        >
          <p className="text-gray-400 text-lg">
            No loan requests yet. Click "Request Loan" to create one.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {loans.map((loan, index) => (
            <motion.div
              key={loan._id || loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass-card glass-card-hover p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(loan.status)}
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Loan #{loan._id?.slice(-6) || loan.id}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {formatDate(loan.createdAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    loan.status
                  )}`}
                >
                  {loan.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Amount</p>
                  <p className="text-white font-semibold">{loan.amount} ETH</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Term</p>
                  <p className="text-white font-semibold">{loan.tenure} days</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">Interest Rate</p>
                  <p className="text-white font-semibold">{loan.interestRate}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Loan Request Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !submitting && setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Request a Loan
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-400 text-sm rounded">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmitLoan} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Loan Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full glass-card p-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Loan Term (days)
                </label>
                <input
                  type="number"
                  min="1"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full glass-card p-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full glass-card p-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="flex space-x-4 mt-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="flex-1 glass-card p-3 text-gray-300 hover:text-white"
                  disabled={submitting}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 glass-card p-3 bg-primary-500/30 text-primary-300 hover:bg-primary-500/40 flex items-center justify-center space-x-2"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Request</span>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Borrowers
