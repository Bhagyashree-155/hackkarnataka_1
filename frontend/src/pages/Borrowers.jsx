import { motion } from 'framer-motion'
import { Plus, Clock, CheckCircle, XCircle, Loader2, CreditCard, DollarSign } from 'lucide-react'
import { useWallet } from '../context/WalletContext'
import { useState, useEffect } from 'react'
import { loansAPI, loanTypesAPI } from '../services/api.js'
import { calculateEMI } from '../utils/emiCalculator.js'
import { repayLoan as repayLoanContract } from '../utils/contract.js'

const Borrowers = () => {
  const { isConnected, account, signer } = useWallet()
  const [showModal, setShowModal] = useState(false)
  const [selectedLoanType, setSelectedLoanType] = useState('')
  const [loanAmount, setLoanAmount] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [address, setAddress] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [loans, setLoans] = useState([])
  const [loanTypes, setLoanTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [emiPreview, setEmiPreview] = useState(null)
  const [selectedLoanForRepayment, setSelectedLoanForRepayment] = useState(null)

  // Fetch loans and loan types on component mount
  useEffect(() => {
    fetchLoans()
    fetchLoanTypes()
  }, [])

  // Calculate EMI when loan type, amount, or term changes
  useEffect(() => {
    if (selectedLoanType && loanAmount && loanTerm) {
      const loanType = loanTypes.find(lt => lt.name === selectedLoanType)
      if (loanType) {
        const emi = calculateEMI(parseFloat(loanAmount), loanType.interestRate, parseInt(loanTerm))
        setEmiPreview(emi)
      }
    } else {
      setEmiPreview(null)
    }
  }, [selectedLoanType, loanAmount, loanTerm, loanTypes])

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

  const fetchLoanTypes = async () => {
    try {
      const response = await loanTypesAPI.getAllLoanTypes()
      console.log('Loan types response:', response)
      setLoanTypes(response.loanTypes || [])
      if (response.loanTypes && response.loanTypes.length === 0) {
        console.warn('No loan types found')
      }
    } catch (err) {
      console.error('Error fetching loan types:', err)
      setError(`Failed to load loan types: ${err.message}`)
    }
  }

  const handleSubmitLoan = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Validations
      if (!selectedLoanType) {
        setError('Please select a loan type')
        setSubmitting(false)
        return
      }

      const loanType = loanTypes.find(lt => lt.name === selectedLoanType)
      if (!loanType) {
        setError('Invalid loan type selected')
        setSubmitting(false)
        return
      }

      const amount = parseFloat(loanAmount)
      const term = parseInt(loanTerm)

      if (!amount || amount < 0.01 || amount > 1000000) {
        setError('Loan amount must be between 0.01 and 1,000,000 ETH')
        setSubmitting(false)
        return
      }

      if (!term || term < 30 || term > 3650) {
        setError('Loan term must be between 30 and 3650 days')
        setSubmitting(false)
        return
      }

      if (!accountNumber || accountNumber.length < 5) {
        setError('Account number must be at least 5 digits')
        setSubmitting(false)
        return
      }

      if (!address || address.length < 10) {
        setError('Address must be at least 10 characters')
        setSubmitting(false)
        return
      }

      if (!mobileNumber || mobileNumber.length < 10 || mobileNumber.length > 15) {
        setError('Mobile number must be 10-15 digits')
        setSubmitting(false)
        return
      }

      const loanData = {
        loanType: selectedLoanType,
        amount: amount,
        purpose: `${selectedLoanType} loan`,
        employmentStatus: 'employed',
        tenure: term,
        accountDetails: {
          accountNumber: accountNumber.trim(),
          address: address.trim(),
          mobileNumber: mobileNumber.trim()
        },
        emiPreview: emiPreview || {}
      }

      const response = await loansAPI.createLoan(loanData)
      
      if (response.success) {
        setSuccess('Loan request submitted successfully!')
        setShowModal(false)
        resetForm()
        await fetchLoans()
      }
    } catch (err) {
      console.error('Error submitting loan:', err)
      setError(err.message || 'Failed to submit loan request')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedLoanType('')
    setLoanAmount('')
    setLoanTerm('')
    setAccountNumber('')
    setAddress('')
    setMobileNumber('')
    setEmiPreview(null)
  }

  const handleRepayment = async (loanId, emiNumber) => {
    if (!isConnected || !account) {
      setError('Please connect your wallet to make a payment')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      // Get loan details to calculate repayment amount
      const loan = loans.find(l => (l._id || l.id) === loanId)
      if (!loan) {
        throw new Error('Loan not found')
      }

      // Calculate repayment amount (EMI amount)
      const repaymentAmount = loan.emiPreview?.monthlyEMI || loan.amount
      
      // If loan has blockchainLoanId, use smart contract
      if (loan.blockchainLoanId !== undefined && loan.blockchainLoanId !== null) {
        // Use smart contract for repayment
        if (!signer) {
          throw new Error('Wallet signer not available')
        }

        // Convert repayment amount to ETH (assuming EMI is in rupees, convert to ETH)
        // For now, use loan amount in ETH directly
        const ethAmount = loan.amount.toString()
        
        setSuccess('Processing payment on blockchain...')
        const tx = await repayLoanContract(signer, loan.blockchainLoanId, ethAmount)
        await tx.wait()
        setSuccess('Payment successful! Transaction: ' + tx.hash)
      } else {
        // Fallback to backend API repayment
        // Get the first unpaid EMI
        const loanDetails = await loansAPI.getLoan(loanId)
        let nextEmiNumber = 1
        
        if (loanDetails.repayments && loanDetails.repayments.length > 0) {
          const unpaidRepayment = loanDetails.repayments.find(r => r.status === 'pending' || r.status === 'overdue')
          if (unpaidRepayment) {
            nextEmiNumber = unpaidRepayment.emiNumber
          }
        }
        
        const response = await loansAPI.makeRepayment(loanId, { 
          emiNumber: nextEmiNumber, 
          amount: repaymentAmount 
        })
        if (response.success) {
          setSuccess('Payment processed successfully!')
        }
      }

      // Refresh loans
      await fetchLoans()
      setSelectedLoanForRepayment(null)
    } catch (err) {
      console.error('Error processing repayment:', err)
      setError(err.message || 'Failed to process payment')
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
          {loans.map((loan, index) => {
            const loanType = loanTypes.find(lt => lt.name === loan.loanType)
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
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(loan.status)}
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {loan.loanType || 'Loan'} #{loan._id?.slice(-6) || loan.id}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {formatDateTimeIST(loan.createdAt)}
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
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Loan Type</p>
                    <p className="text-white font-semibold">{loan.loanType || 'N/A'}</p>
                  </div>
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
                    <p className="text-white font-semibold">
                      {loan.interestRate ? `${loan.interestRate}%` : loanType ? `${loanType.interestRate}%` : 'Pending'}
                    </p>
                  </div>
                </div>
                {loan.emiPreview && loan.emiPreview.monthlyEMI && (
                  <div className="mt-4 p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                    <p className="text-gray-400 text-sm mb-2">EMI Preview</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs">Monthly EMI</p>
                        <p className="text-white font-semibold">{loan.emiPreview.monthlyEMI.toFixed(2)} ETH</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Total Interest</p>
                        <p className="text-white font-semibold">{loan.emiPreview.totalInterest.toFixed(2)} ETH</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs">Total Amount</p>
                        <p className="text-white font-semibold">{loan.emiPreview.totalAmount.toFixed(2)} ETH</p>
                      </div>
                    </div>
                  </div>
                )}
                {(loan.status === 'active' || loan.status === 'approved') && (
                  <div className="mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedLoanForRepayment(loan)}
                      className="glass-card px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 flex items-center space-x-2"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span>Make Payment</span>
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Loan Request Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => !submitting && setShowModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-8 max-w-2xl w-full my-8"
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
              {/* Loan Type Selection */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Select Loan Type *
                </label>
                <select
                  value={selectedLoanType}
                  onChange={(e) => setSelectedLoanType(e.target.value)}
                  className="w-full glass-card p-3 text-white bg-black/80 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                  required
                  disabled={submitting}
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                >
                  <option value="" style={{ backgroundColor: '#000' }}>Choose a loan type...</option>
                  {loanTypes.map((type) => (
                    <option key={type._id || type.id} value={type.name} style={{ backgroundColor: '#000' }}>
                      {type.name} - {type.interestRate}% interest
                    </option>
                  ))}
                </select>
                {selectedLoanType && (
                  <p className="text-gray-400 text-xs mt-1">
                    {loanTypes.find(lt => lt.name === selectedLoanType)?.description}
                  </p>
                )}
              </div>

              {/* Loan Amount */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Loan Amount (ETH) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max="1000000"
                  value={loanAmount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (parseFloat(val) >= 0.01 && parseFloat(val) <= 1000000)) {
                      setLoanAmount(val);
                    }
                  }}
                  className="w-full glass-card p-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                  required
                  disabled={submitting}
                  placeholder="Enter amount (0.01 - 1000000)"
                />
                {loanAmount && (parseFloat(loanAmount) < 0.01 || parseFloat(loanAmount) > 1000000) && (
                  <p className="text-red-400 text-xs mt-1">Amount must be between 0.01 and 1,000,000 ETH</p>
                )}
              </div>

              {/* Loan Term */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  Loan Term (days) *
                </label>
                <input
                  type="number"
                  min="30"
                  max="3650"
                  value={loanTerm}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || (parseInt(val) >= 30 && parseInt(val) <= 3650)) {
                      setLoanTerm(val);
                    }
                  }}
                  className="w-full glass-card p-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                  required
                  disabled={submitting}
                  placeholder="Enter days (30 - 3650)"
                />
                {loanTerm && (parseInt(loanTerm) < 30 || parseInt(loanTerm) > 3650) && (
                  <p className="text-red-400 text-xs mt-1">Term must be between 30 and 3650 days</p>
                )}
              </div>

              {/* Account Details */}
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-white font-semibold mb-3">Account Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Account Number *
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full glass-card p-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Address *
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows="3"
                      className="w-full glass-card p-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full glass-card p-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {/* EMI Preview */}
              {emiPreview && emiPreview.monthlyEMI > 0 && (
                <div className="p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                  <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>EMI Preview</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Monthly EMI</p>
                      <p className="text-white font-semibold text-lg">{emiPreview.monthlyEMI.toFixed(2)} ETH</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Total Interest</p>
                      <p className="text-white font-semibold text-lg">{emiPreview.totalInterest.toFixed(2)} ETH</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Total Amount</p>
                      <p className="text-white font-semibold text-lg">{emiPreview.totalAmount.toFixed(2)} ETH</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 mt-6">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
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

      {/* Repayment Modal */}
      {selectedLoanForRepayment && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedLoanForRepayment(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Make Payment
            </h2>
            <p className="text-gray-400 mb-4">
              Loan: {selectedLoanForRepayment.amount} ETH
            </p>
            <div className="space-y-2">
              <p className="text-gray-300 text-sm">
                Payment functionality will be integrated with your wallet.
              </p>
              <p className="text-gray-400 text-xs">
                This will process the next EMI payment for this loan.
              </p>
            </div>
            <div className="flex space-x-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedLoanForRepayment(null)}
                className="flex-1 glass-card p-3 text-gray-300 hover:text-white"
              >
                Close
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRepayment(selectedLoanForRepayment._id, 1)}
                className="flex-1 glass-card p-3 bg-green-500/30 text-green-400 hover:bg-green-500/40"
              >
                Process Payment
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Borrowers
