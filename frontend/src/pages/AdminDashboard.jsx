import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, Activity, Eye, CheckCircle, XCircle, Loader2, Clock } from 'lucide-react'
import { useWallet } from '../context/WalletContext'
import { useState, useEffect } from 'react'
import { loansAPI } from '../services/api.js'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { isConnected } = useWallet()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [pendingLoans, setPendingLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        // Redirect if not admin
        if (parsedUser.role && parsedUser.role !== 'admin') {
          navigate('/borrower-dashboard')
          return
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
    fetchPendingLoans()
  }, [navigate])

  const fetchPendingLoans = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await loansAPI.getAllLoans({ status: 'pending' })
      setPendingLoans(response.loans || [])
    } catch (err) {
      console.error('Error fetching pending loans:', err)
      setError(err.message || 'Failed to fetch loan requests')
      setPendingLoans([])
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
      const response = await loansAPI.approveRejectLoan(
        loan._id || loan.id, 
        'approved',
        ''
      )
      
      if (response.success || response.loan) {
        setSuccess('Loan approved successfully!')
        await fetchPendingLoans()
      }
    } catch (err) {
      console.error('Error approving loan:', err)
      setError(err.message || 'Failed to approve loan')
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
        await fetchPendingLoans()
      }
    } catch (err) {
      console.error('Error rejecting loan:', err)
      setError(err.message || 'Failed to reject loan')
    } finally {
      setProcessing(null)
    }
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

  const stats = [
    {
      title: 'Pending Loans',
      value: pendingLoans.length.toString(),
      change: 'Review Required',
      icon: Clock,
      color: 'text-yellow-400',
    },
    {
      title: 'Total Loans',
      value: '0',
      change: 'All Time',
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      title: 'Active Borrowers',
      value: '0',
      change: 'Currently',
      icon: Users,
      color: 'text-blue-400',
    },
    {
      title: 'Total Volume',
      value: '0 ETH',
      change: 'All Time',
      icon: Activity,
      color: 'text-purple-400',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">
          {user ? `Welcome, ${user.name}!` : 'Manage loans and borrowers'}
        </p>
      </motion.div>

      {user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Name</p>
              <p className="text-white font-semibold">{user.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="text-white font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Role</p>
              <p className="text-white font-semibold capitalize">{user.role}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success/Error Messages */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6 bg-green-500/20 border border-green-500/50 text-green-400"
        >
          {success}
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6 bg-red-500/20 border border-red-500/50 text-red-400"
        >
          {error}
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card glass-card-hover p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <span className="text-gray-400 text-xs">
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Pending Loans Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Pending Loan Requests</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/lenders')}
            className="glass-card px-4 py-2 text-primary-300 hover:bg-white/10"
          >
            View All Loans
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            <span className="ml-3 text-gray-400">Loading loan requests...</span>
          </div>
        ) : pendingLoans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No pending loan requests at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingLoans.slice(0, 5).map((loan, index) => {
              const isProcessing = processing === (loan._id || loan.id)
              const borrowerName = loan.userId?.name || 'Unknown Borrower'
              
              return (
                <motion.div
                  key={loan._id || loan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {loan.loanType || 'Loan'} Request #{loan._id?.slice(-6) || loan.id}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Borrower: <span className="text-primary-300">{borrowerName}</span>
                      </p>
                      <p className="text-gray-400 text-sm">{formatDateTimeIST(loan.createdAt)}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-400/20 text-yellow-400">
                      PENDING
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Amount</p>
                      <p className="text-white font-semibold">{loan.amount} ETH</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Term</p>
                      <p className="text-white font-semibold">{loan.tenure} days</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Interest Rate</p>
                      <p className="text-white font-semibold">
                        {loan.interestRate ? `${loan.interestRate}%` : 'Will use loan type rate'}
                      </p>
                    </div>
                  </div>

                  {/* Document Verification Status */}
                  {loan.userId && (
                    <div className="mb-4 p-3 glass-card bg-white/5 rounded-lg">
                      <h4 className="text-white text-sm font-semibold mb-2">Document Verification</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-gray-400">Aadhaar</p>
                          <p className={loan.userId.kycVerified ? 'text-green-400' : 'text-red-400'}>
                            {loan.userId.kycVerified ? '✅' : '❌'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Income</p>
                          <p className={loan.userId.incomeVerified ? 'text-green-400' : 'text-red-400'}>
                            {loan.userId.incomeVerified ? '✅' : '❌'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Education</p>
                          <p className={loan.userId.educationVerified ? 'text-green-400' : 'text-yellow-400'}>
                            {loan.userId.educationVerified ? '✅' : '⚠️'}
                          </p>
                        </div>
                      </div>
                      {loan.userId.trusted && (
                        <p className="text-green-400 text-xs mt-2 font-semibold">
                          ✅ Borrower is Trusted
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApprove(loan)}
                      disabled={isProcessing}
                      className="flex-1 glass-card p-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Approve</span>
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(loan._id || loan.id)}
                      disabled={isProcessing}
                      className="flex-1 glass-card p-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/lenders')}
                      className="glass-card p-2 text-primary-400 hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default AdminDashboard

