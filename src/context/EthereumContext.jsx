"use client"

import { createContext, useState, useContext } from "react"
import {
  connectWallet as utilConnectWallet,
  mintTicket as utilMintTicket,
  verifyTicket as utilVerifyTicket,
  isUsed as utilIsUsed,
  getTicket as utilGetTicket,
} from "../utils/ethereum"

const EthereumContext = createContext()

export function useEthereum() {
  return useContext(EthereumContext)
}

export function EthereumProvider({ children }) {
  const [account, setAccount] = useState("")
  const [balance, setBalance] = useState("0")
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [contract, setContract] = useState(null)
  const [frequentRoutes, setFrequentRoutes] = useState([])

  // Connect wallet function
  const connect = async () => {
    setLoading(true)
    setError(null)
    try {
      const { account, balance, provider, signer, contract } = await utilConnectWallet()
      setAccount(account)
      setBalance(balance)
      setIsConnected(true)
      setContract(contract)
      // Load stored frequent routes if exist
      const stored = JSON.parse(localStorage.getItem('frequentRoutes') || '[]')
      setFrequentRoutes(stored)
    } catch (err) {
      setError(err.message)
      console.error("Error connecting wallet:", err)
    } finally {
      setLoading(false)
    }
  }

  // Disconnect wallet function
  const disconnect = () => {
    setAccount("")
    setBalance("0")
    setIsConnected(false)
    setContract(null)
  }

  // Add a new frequent route
  const addFrequentRoute = (route) => {
    const updated = [route, ...frequentRoutes.filter(r => r.from !== route.from || r.to !== route.to)]
      .slice(0, 5)
    setFrequentRoutes(updated)
    localStorage.setItem('frequentRoutes', JSON.stringify(updated))
  }

  // Mint ticket function
  const purchaseTicket = async (origin, destination, seat, priceEth) => {
    setLoading(true)
    setError(null)
    try {
      // Track frequent route
      addFrequentRoute({ from: origin, to: destination })
      const tokenId = await utilMintTicket(origin, destination, seat, priceEth)
      return tokenId
    } catch (err) {
      setError(err.message)
      console.error("Error minting ticket:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Verify ticket function
  const validateTicket = async (tokenId) => {
    setLoading(true)
    setError(null)
    try {
      const receipt = await utilVerifyTicket(tokenId)
      return receipt
    } catch (err) {
      setError(err.message)
      console.error("Error verifying ticket:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Check if ticket is used
  const checkUsed = async (tokenId) => {
    if (!contract) throw new Error('No contract loaded')
    return await utilIsUsed(tokenId)
  }

  // Fetch ticket details
  const fetchTicket = async (tokenId) => {
    if (!contract) throw new Error('No contract loaded')
    return await utilGetTicket(tokenId)
  }

  const value = {
    account,
    balance,
    isConnected,
    loading,
    error,
    contract,
    frequentRoutes,
    connect,
    disconnect,
    purchaseTicket,
    validateTicket,
    checkUsed,
    fetchTicket,
    addFrequentRoute,
  }

  return <EthereumContext.Provider value={value}>{children}</EthereumContext.Provider>
}
