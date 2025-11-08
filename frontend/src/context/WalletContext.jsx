import { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState('0')

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.send('eth_requestAccounts', [])
        const signer = await provider.getSigner()
        
        setProvider(provider)
        setSigner(signer)
        setAccount(accounts[0])
        setIsConnected(true)
        
        // Get balance
        const balance = await provider.getBalance(accounts[0])
        setBalance(ethers.formatEther(balance))
        
        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged)
        window.ethereum.on('chainChanged', () => window.location.reload())
      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    } else {
      alert('Please install MetaMask!')
    }
  }

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setAccount(accounts[0])
      if (provider) {
        const balance = await provider.getBalance(accounts[0])
        setBalance(ethers.formatEther(balance))
      }
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setIsConnected(false)
    setBalance('0')
  }

  useEffect(() => {
    // Check if already connected
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (accounts) => {
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            setProvider(provider)
            setSigner(signer)
            setAccount(accounts[0])
            setIsConnected(true)
            const balance = await provider.getBalance(accounts[0])
            setBalance(ethers.formatEther(balance))
          }
        })
    }
  }, [])

  const value = {
    account,
    provider,
    signer,
    isConnected,
    balance,
    connectWallet,
    disconnectWallet,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

