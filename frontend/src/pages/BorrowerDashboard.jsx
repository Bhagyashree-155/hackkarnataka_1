import { motion } from 'framer-motion'
import { Plus, Clock, CheckCircle, XCircle, Loader2, DollarSign, TrendingUp, Activity } from 'lucide-react'
import { useWallet } from '../context/WalletContext'
import { useState, useEffect } from 'react'
import { loansAPI, loanTypesAPI } from '../services/api.js'
import { useNavigate } from 'react-router-dom'

const BorrowerDashboard = () => {
  const { isConnected, account } = useWallet()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        // Redirect if not borrower
        if (parsedUser.role && parsedUser.role !== 'borrower') {
          navigate('/admin-dashboard')
          return
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
    fetchLoans()
  }, [navigate])

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

  const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'approved')
  const pendingLoans = loans.filter(l => l.status === 'pending')
  const totalLoanAmount = loans.reduce((sum, loan) => sum + (parseFloat(loan.amount) || 0), 0)

  const stats = [
    {
      title: 'Active Loans',
      value: activeLoans.length.toString(),
      change: 'Currently Active',
      icon: CheckCircle,
      color: 'text-green-400',
    },
    {
      title: 'Pending Requests',
      value: pendingLoans.length.toString(),
      change: 'Awaiting Approval',
      icon: Clock,
      color: 'text-yellow-400',
    },
    {
      title: 'Total Loans',
      value: loans.length.toString(),
      change: 'All Time',
      icon: TrendingUp,
      color: 'text-blue-400',
    },
    {
      title: 'Total Amount',
      value: `${totalLoanAmount.toFixed(2)} ETH`,
      change: 'Borrowed',
      icon: DollarSign,
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
        <h1 className="text-4xl font-bold text-white mb-2">Borrower Dashboard</h1>
        <p className="text-gray-400">
          {user ? `Welcome back, ${user.name}!` : 'Manage your loans and requests'}
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6 bg-red-500/20 border border-red-500/50 text-red-400"
        >
          {error}
        </motion.div>
      )}

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

      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-8 text-center"
        >
          <p className="text-gray-300 mb-4">
            Connect your wallet to request loans and make payments
          </p>
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

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-8"
      >
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/borrowers')}
            className="glass-card p-4 text-left hover:bg-white/15 transition-all"
          >
            <div className="flex items-center space-x-3">
              <Plus className="w-6 h-6 text-primary-400" />
              <div>
                <p className="text-white font-medium">Request a Loan</p>
                <p className="text-gray-400 text-sm">Create a new loan request</p>
              </div>
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/borrowers')}
            className="glass-card p-4 text-left hover:bg-white/15 transition-all"
          >
            <div className="flex items-center space-x-3">
              <DollarSign className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-white font-medium">Make Payment</p>
                <p className="text-gray-400 text-sm">Pay for your active loans</p>
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Recent Loans */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Loans</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/borrowers')}
            className="glass-card px-4 py-2 text-primary-300 hover:bg-white/10"
          >
            View All
          </motion.button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            <span className="ml-3 text-gray-400">Loading loans...</span>
          </div>
        ) : loans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No loans yet.</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/borrowers')}
              className="glass-card px-6 py-3 text-primary-300 hover:bg-white/10"
            >
              Request Your First Loan
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {loans.slice(0, 5).map((loan, index) => (
              <motion.div
                key={loan._id || loan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(loan.status)}
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {loan.loanType || 'Loan'} #{loan._id?.slice(-6) || loan.id}
                      </h3>
                      <p className="text-gray-400 text-sm">{formatDateTimeIST(loan.createdAt)}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(loan.status)}`}>
                    {loan.status?.toUpperCase() || 'PENDING'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
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
                      {loan.interestRate ? `${loan.interestRate}%` : 'Pending'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default BorrowerDashboard

