import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Wallet, Menu, X, LogOut, User } from 'lucide-react'
import { useWallet } from '../context/WalletContext'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const { account, isConnected, connectWallet, disconnectWallet, balance } = useWallet()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/login')
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-card sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Wallet className="w-8 h-8 text-primary-400" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              BlockGenix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded-lg transition-all ${
                location.pathname === '/dashboard'
                  ? 'bg-primary-500/30 text-primary-300'
                  : 'text-gray-300 hover:text-primary-400'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/borrowers"
              className={`px-4 py-2 rounded-lg transition-all ${
                location.pathname === '/borrowers'
                  ? 'bg-primary-500/30 text-primary-300'
                  : 'text-gray-300 hover:text-primary-400'
              }`}
            >
              Borrowers
            </Link>
            <Link
              to="/lenders"
              className={`px-4 py-2 rounded-lg transition-all ${
                location.pathname === '/lenders'
                  ? 'bg-primary-500/30 text-primary-300'
                  : 'text-gray-300 hover:text-primary-400'
              }`}
            >
              Lenders
            </Link>
          </div>

          {/* User Info & Wallet Button */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <div className="glass-card px-4 py-2 flex items-center space-x-2">
                <User className="w-4 h-4 text-primary-300" />
                <span className="text-sm text-gray-300">{user.name}</span>
              </div>
            )}
            {isConnected ? (
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center space-x-3"
              >
                <div className="glass-card px-4 py-2">
                  <span className="text-sm text-gray-300">
                    {parseFloat(balance).toFixed(4)} ETH
                  </span>
                </div>
                <div className="glass-card px-4 py-2">
                  <span className="text-sm text-primary-300 font-mono">
                    {formatAddress(account)}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={disconnectWallet}
                  className="glass-card px-4 py-2 text-sm text-red-400 hover:text-red-300"
                >
                  Disconnect
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                className="glass-card px-6 py-2 flex items-center space-x-2 text-primary-300 hover:text-primary-200"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </motion.button>
            )}
            {user && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="glass-card px-4 py-2 flex items-center space-x-2 text-red-400 hover:text-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 space-y-2"
          >
            <Link
              to="/dashboard"
              className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/borrowers"
              className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Borrowers
            </Link>
            <Link
              to="/lenders"
              className="block px-4 py-2 rounded-lg text-gray-300 hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              Lenders
            </Link>
            {user && (
              <div className="px-4 py-2">
                <div className="text-sm text-gray-300 mb-2">{user.name}</div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400"
                >
                  Logout
                </button>
              </div>
            )}
            {isConnected ? (
              <div className="px-4 py-2 space-y-2">
                <div className="text-sm text-gray-300">
                  {formatAddress(account)}
                </div>
                <div className="text-sm text-gray-300">
                  {parseFloat(balance).toFixed(4)} ETH
                </div>
                <button
                  onClick={disconnectWallet}
                  className="text-sm text-red-400"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="w-full glass-card px-4 py-2 text-primary-300 flex items-center justify-center space-x-2"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar

