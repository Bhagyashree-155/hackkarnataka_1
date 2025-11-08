import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import { useWallet } from '../context/WalletContext'

const Dashboard = () => {
  const { isConnected } = useWallet()

  const stats = [
    {
      title: 'Total Loans',
      value: '1,234',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      title: 'Active Borrowers',
      value: '456',
      change: '+8.2%',
      icon: Users,
      color: 'text-blue-400',
    },
    {
      title: 'Active Lenders',
      value: '789',
      change: '+15.3%',
      icon: TrendingUp,
      color: 'text-purple-400',
    },
    {
      title: 'Total Volume',
      value: '1,234 ETH',
      change: '+23.1%',
      icon: Activity,
      color: 'text-yellow-400',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">
          Welcome to BlockGenix - Decentralized Micro-Lending Platform
        </p>
      </motion.div>

      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 mb-8 text-center"
        >
          <p className="text-gray-300 mb-4">
            Connect your wallet to start using BlockGenix
          </p>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card glass-card-hover p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <span className="text-green-400 text-sm font-semibold">
                {stat.change}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <motion.div
          variants={itemVariants}
          className="glass-card glass-card-hover p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div>
                  <p className="text-white text-sm font-medium">
                    Loan #{item}000
                  </p>
                  <p className="text-gray-400 text-xs">2 hours ago</p>
                </div>
                <span className="text-primary-400 font-semibold">
                  {item}.5 ETH
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="glass-card glass-card-hover p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full glass-card p-4 text-left hover:bg-white/15 transition-all"
            >
              <p className="text-white font-medium">Request a Loan</p>
              <p className="text-gray-400 text-sm">Create a new loan request</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full glass-card p-4 text-left hover:bg-white/15 transition-all"
            >
              <p className="text-white font-medium">Become a Lender</p>
              <p className="text-gray-400 text-sm">Start lending and earn interest</p>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Dashboard

