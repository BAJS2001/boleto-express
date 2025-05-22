// src/context/EthereumContext.jsx
"use client"

import { createContext, useState, useContext } from "react"
import {
  connectWallet as ethConnect,
  mintTicket as ethMintTicket,
  verifyTicket as ethVerifyTicket,
  isUsed as ethIsUsed,
  getTicket as ethGetTicket,
} from "../utils/ethereum"

const EthereumContext = createContext()

export function useEthereum() {
  return useContext(EthereumContext)
}

export function EthereumProvider({ children }) {
  const [account, setAccount] = useState("")
  const [balance, setBalance] = useState("0")
  const [contract, setContract] = useState(null)
  const [frequentRoutes, setFrequentRoutes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("frequentRoutes")) || []
    } catch {
      return []
    }
  })
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Conecta la wallet, carga contrato y datos
  const connect = async () => {
    setLoading(true)
    setError(null)
    try {
      // Suponemos que ethConnect retorna { account, balance, contract }
      const { account, balance, contract } = await ethConnect()
      setAccount(account)
      setBalance(balance)
      setContract(contract)
      setIsConnected(true)
      localStorage.setItem("isConnected", "true")
      localStorage.setItem("account", account)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Desconecta la wallet
  const disconnect = () => {
    setAccount("")
    setBalance("0")
    setContract(null)
    setIsConnected(false)
    localStorage.removeItem("isConnected")
    localStorage.removeItem("account")
  }

  // Compra de ticket (mint)
  const purchaseTicket = async (origin, destination, seat, priceUsd) => {
    setLoading(true)
    setError(null)
    try {
      if (!isConnected) await connect()
      const tokenId = await ethMintTicket(origin, destination, seat, priceUsd)
      return tokenId
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Obtiene datos del ticket on-chain
  const fetchTicket = async (tokenId) => {
    setLoading(true)
    setError(null)
    try {
      if (!isConnected) await connect()
      const ticket = await ethGetTicket(tokenId)
      const used = await ethIsUsed(tokenId)
      return { ...ticket, used }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Verifica si un ticket está usado (lee on-chain)
  const validateTicket = async (tokenId) => {
    setLoading(true)
    setError(null)
    try {
      if (!isConnected) await connect()
      const used = await ethIsUsed(tokenId)
      return !used
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Marca un ticket como usado (solo owner)
  const markAsUsed = async (tokenId) => {
    setLoading(true)
    setError(null)
    try {
      if (!isConnected) await connect()
      await ethVerifyTicket(tokenId)
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Agrega una ruta frecuente (estado + localStorage)
  const addFrequentRoute = (route) => {
    setFrequentRoutes(prev => {
      const next = [...prev, route]
      try {
        localStorage.setItem("frequentRoutes", JSON.stringify(next))
      } catch (e) {
        console.error("Error guardando rutas frecuentes:", e)
      }
      return next
    })
  }

  const value = {
    account,
    balance,
    contract,
    frequentRoutes,
    isConnected,
    loading,
    error,
    connect,
    disconnect,
    purchaseTicket,
    fetchTicket,
    validateTicket,
    markAsUsed,
    addFrequentRoute,
  }

  return (
    <EthereumContext.Provider value={value}>
      {children}
    </EthereumContext.Provider>
  )
}
