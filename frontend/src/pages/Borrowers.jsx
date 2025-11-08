import { motion } from 'framer-motion'
import { Plus, Clock, CheckCircle, XCircle } from 'lucide-react'
import { useWallet } from '../context/WalletContext'
import { useState } from 'react'

const Borrowers = () => {
  const { isConnected, account } = useWallet()
  const [showModal, setShowModal] = useState(false)
  const [loanAmount, setLoanAmount] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [interestRate, setInterestRate] = useState('')

  const loans = [
    {
      id: 1,
      amount: '2.5',
      term: '30',
      interestRate: '5',
      status: 'pending',
      createdAt: '2 hours ago',
    },
    {
      id: 2,
      amount: '1.0',
      term: '15',
      interestRate: '3',
      status: 'approved',
      createdAt: '1 day ago',
    },
    {
      id: 3,
      amount: '5.0',
      term: '60',
      interestRate: '7',
      status: 'rejected',
      createdAt: '3 days ago',
    },
  ]

  const handleSubmitLoan = (e) => {
    e.preventDefault()
    // TODO: Integrate with smart contract
    console.log('Submitting loan:', { loanAmount, loanTerm, interestRate })
    setShowModal(false)
    setLoanAmount('')
    setLoanTerm('')
    setInterestRate('')
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'approved':
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
        return 'bg-green-400/20 text-green-400'
      case 'rejected':
        return 'bg-red-400/20 text-red-400'
      default:
        return ''
    }
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

      <div className="grid grid-cols-1 gap-6">
        {loans.map((loan, index) => (
          <motion.div
            key={loan.id}
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
                    Loan #{loan.id}000
                  </h3>
                  <p className="text-gray-400 text-sm">{loan.createdAt}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  loan.status
                )}`}
              >
                {loan.status.toUpperCase()}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Amount</p>
                <p className="text-white font-semibold">{loan.amount} ETH</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Term</p>
                <p className="text-white font-semibold">{loan.term} days</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Interest Rate</p>
                <p className="text-white font-semibold">{loan.interestRate}%</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Loan Request Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
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
            <form onSubmit={handleSubmitLoan} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Loan Amount (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full glass-card p-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Loan Term (days)
                </label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full glass-card p-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full glass-card p-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                  required
                />
              </div>
              <div className="flex space-x-4 mt-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="flex-1 glass-card p-3 text-gray-300 hover:text-white"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 glass-card p-3 bg-primary-500/30 text-primary-300 hover:bg-primary-500/40"
                >
                  Submit Request
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

