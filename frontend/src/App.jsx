import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Borrowers from './pages/Borrowers'
import Lenders from './pages/Lenders'
import { WalletProvider } from './context/WalletContext'

function App() {
  return (
    <WalletProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/borrowers" element={<Borrowers />} />
              <Route path="/lenders" element={<Lenders />} />
            </Routes>
          </motion.main>
        </div>
      </Router>
    </WalletProvider>
  )
}

export default App

