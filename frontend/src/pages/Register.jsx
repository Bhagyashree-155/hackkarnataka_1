import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet, User, Mail, Lock, Calendar, MapPin, DollarSign, CreditCard } from 'lucide-react'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    citizenship: 'Resident',
    email: '',
    monthlyIncome: '',
    creditScore: '',
    password: '',
    confirmPassword: '',
    walletAddress: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (parseInt(formData.age) < 18 || parseInt(formData.age) > 60) {
      setError('Age must be between 18 and 60')
      return
    }

    if (formData.citizenship !== 'Resident') {
      setError('Only Residents are eligible for loans')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          age: parseInt(formData.age),
          citizenship: formData.citizenship,
          email: formData.email,
          monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
          creditScore: parseInt(formData.creditScore) || 0,
          password: formData.password,
          walletAddress: formData.walletAddress || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Store token and user data
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 max-w-2xl w-full"
      >
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <Wallet className="w-12 h-12 text-primary-400 mx-auto" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400">Register for BlockGenix loan services</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                <User className="inline w-4 h-4 mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full glass-card px-4 py-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                <Calendar className="inline w-4 h-4 mr-2" />
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="60"
                className="w-full glass-card px-4 py-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                placeholder="25"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                <MapPin className="inline w-4 h-4 mr-2" />
                Citizenship
              </label>
              <select
                name="citizenship"
                value={formData.citizenship}
                onChange={handleChange}
                className="w-full glass-card px-4 py-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                required
              >
                <option value="Resident">Resident</option>
                <option value="Non-Resident">Non-Resident</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full glass-card px-4 py-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                <DollarSign className="inline w-4 h-4 mr-2" />
                Monthly Income (₹)
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                min="0"
                className="w-full glass-card px-4 py-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                placeholder="50000"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                <CreditCard className="inline w-4 h-4 mr-2" />
                Credit Score
              </label>
              <input
                type="number"
                name="creditScore"
                value={formData.creditScore}
                onChange={handleChange}
                min="0"
                max="900"
                className="w-full glass-card px-4 py-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                placeholder="750"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                <Lock className="inline w-4 h-4 mr-2" />
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full glass-card px-4 py-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2">
                <Lock className="inline w-4 h-4 mr-2" />
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full glass-card px-4 py-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              <Wallet className="inline w-4 h-4 mr-2" />
              Wallet Address (Optional)
            </label>
            <input
              type="text"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              className="w-full glass-card px-4 py-3 text-white bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-primary-400 font-mono text-sm"
              placeholder="0x..."
            />
            <p className="text-gray-400 text-xs mt-1">
              Connect your MetaMask wallet address (optional)
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full glass-card p-3 bg-primary-500/30 text-primary-300 hover:bg-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register

