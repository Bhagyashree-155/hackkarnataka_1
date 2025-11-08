import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Eye } from 'lucide-react'
import { useWallet } from '../context/WalletContext'
import { useState } from 'react'

const Lenders = () => {
  const { isConnected } = useWallet()
  const [selectedLoan, setSelectedLoan] = useState(null)

  const loanRequests = [
    {
      id: 1,
      borrower: '0x1234...5678',
      amount: '2.5',
      term: '30',
      interestRate: '5',
      status: 'pending',
      createdAt: '2 hours ago',
    },
    {
      id: 2,
      borrower: '0xabcd...efgh',
      amount: '1.0',
      term: '15',
      interestRate: '3',
      status: 'pending',
      createdAt: '5 hours ago',
    },
    {
      id: 3,
      borrower: '0x9876...5432',
      amount: '5.0',
      term: '60',
      interestRate: '7',
      status: 'pending',
      createdAt: '1 day ago',
    },
  ]

  const handleApprove = (loanId) => {
    // TODO: Integrate with smart contract
    console.log('Approving loan:', loanId)
  }

  const handleReject = (loanId) => {
    // TODO: Integrate with smart contract
    console.log('Rejecting loan:', loanId)
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

      <div className="grid grid-cols-1 gap-6">
        {loanRequests.map((loan, index) => (
          <motion.div
            key={loan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="glass-card glass-card-hover p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Loan Request #{loan.id}000
                </h3>
                <p className="text-gray-400 text-sm">
                  Borrower: <span className="font-mono">{loan.borrower}</span>
                </p>
                <p className="text-gray-400 text-sm">{loan.createdAt}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-400/20 text-yellow-400">
                PENDING
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Amount</p>
                <p className="text-white font-semibold text-lg">
                  {loan.amount} ETH
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Term</p>
                <p className="text-white font-semibold text-lg">
                  {loan.term} days
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Interest Rate</p>
                <p className="text-white font-semibold text-lg">
                  {loan.interestRate}%
                </p>
              </div>
            </div>

            {isConnected && (
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleApprove(loan.id)}
                  className="flex-1 glass-card p-3 bg-green-500/20 text-green-400 hover:bg-green-500/30 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>Approve</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleReject(loan.id)}
                  className="flex-1 glass-card p-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-5 h-5" />
                  <span>Reject</span>
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
        ))}
      </div>

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
            className="glass-card p-8 max-w-lg w-full"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Loan Details #{selectedLoan.id}000
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm mb-1">Borrower Address</p>
                <p className="text-white font-mono">{selectedLoan.borrower}</p>
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
                  {selectedLoan.term} days
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Interest Rate</p>
                <p className="text-white text-xl font-semibold">
                  {selectedLoan.interestRate}%
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Created</p>
                <p className="text-white">{selectedLoan.createdAt}</p>
              </div>
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

