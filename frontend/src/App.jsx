import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import BorrowerDashboard from './pages/BorrowerDashboard'
import Borrowers from './pages/Borrowers'
import Lenders from './pages/Lenders'
import Login from './pages/Login'
import Register from './pages/Register'
import { WalletProvider } from './context/WalletContext'
import { useState, useEffect } from 'react'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

// Role-based Dashboard Route
const RoleBasedDashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error('Error parsing user data:', error)
        // Clear invalid data
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // If no user data, show default dashboard (will redirect if needed)
  if (!user) {
    return <BorrowerDashboard />
  }

  if (user.role === 'admin') {
    return <AdminDashboard />
  } else {
    return <BorrowerDashboard />
  }
}

function App() {
  try {
    return (
      <WalletProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <motion.main
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" />} />
                          <Route path="/dashboard" element={<RoleBasedDashboard />} />
                          <Route path="/admin-dashboard" element={<AdminDashboard />} />
                          <Route path="/borrower-dashboard" element={<BorrowerDashboard />} />
                          <Route path="/borrowers" element={<Borrowers />} />
                          <Route path="/lenders" element={<Lenders />} />
                        </Routes>
                      </motion.main>
                    </>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </WalletProvider>
    )
  } catch (error) {
    console.error('App error:', error)
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #1e293b, #7e22ce, #1e293b)',
        color: 'white',
        padding: '20px'
      }}>
        <div>
          <h1>App Error</h1>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    )
  }
}

export default App

