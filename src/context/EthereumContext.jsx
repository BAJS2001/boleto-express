"use client"

import { createContext, useState, useContext } from "react"
import { connectWallet, mintTicket, verifyTicket } from "../utils/ethereum"

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

  // Connect wallet function
  const connect = async () => {
    setLoading(true)
    setError(null)
    try {
      const { account, balance } = await connectWallet()
      setAccount(account)
      setBalance(balance)
      setIsConnected(true)
      localStorage.setItem("isConnected", "true")
      localStorage.setItem("account", account)
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
    localStorage.removeItem("isConnected")
    localStorage.removeItem("account")
  }

  // Mint ticket function
  const purchaseTicket = async (from, to, date, time, seat, company) => {
    setLoading(true)
    setError(null)
    try {
      const tokenId = await mintTicket(from, to, seat)
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
      const isValid = await verifyTicket(tokenId)
      return isValid
    } catch (err) {
      setError(err.message)
      console.error("Error verifying ticket:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const value = {
    account,
    balance,
    isConnected,
    loading,
    error,
    connect,
    disconnect,
    purchaseTicket,
    validateTicket,
  }

  return <EthereumContext.Provider value={value}>{children}</EthereumContext.Provider>
}
