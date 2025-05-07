"use client"

import { useState, useEffect } from "react"
import { useEthereum } from "../context/EthereumContext"
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react"

export default function Profile() {
  const { account, balance, disconnect } = useEthereum()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Fetch user's NFT tickets
    const fetchTickets = async () => {
      setLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock NFT tickets data
      const mockTickets = Array.from({ length: 6 }, (_, i) => ({
        id: Math.floor(Math.random() * 1000000).toString(),
        from: i % 2 === 0 ? "Quito" : "Guayaquil",
        to: i % 2 === 0 ? "Guayaquil" : "Cuenca",
        date: new Date(Date.now() - i * 86400000 * 15).toISOString().split("T")[0],
        company: ["TransExpress", "EcuaBus", "Flota Imbabura", "Turismo Ecuador"][i % 4],
        image: `https://picsum.photos/seed/${i + 100}/200/200`,
      }))

      setTickets(mockTickets)
      setLoading(false)
    }

    fetchTickets()
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDisconnect = () => {
    disconnect()
    window.location.href = "/"
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-16 w-16 rounded-full bg-[#D24848] flex items-center justify-center text-white">
                <Wallet className="h-8 w-8" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
                <p className="text-gray-300">Gestiona tu cuenta y boletos</p>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8 border-b pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Información de la Wallet</h2>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Dirección</p>
                <div className="flex items-center">
                  <p className="font-mono text-sm break-all">{account}</p>
                  <button
                    onClick={copyToClipboard}
                    className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                    title="Copiar dirección"
                  >
                    {copied ? <span className="text-green-500 text-xs">¡Copiado!</span> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Balance</p>
                <p className="text-xl font-medium">{balance} ETH</p>
              </div>
              <div>
                <a
                  href={`https://goerli.etherscan.io/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#D24848] hover:text-[#B83A3A] flex items-center"
                >
                  Ver en Etherscan
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Mis Boletos NFT</h2>

            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D24848] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Cargando boletos...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square bg-gray-100">
                      <img
                        src={ticket.image || "/placeholder.svg"}
                        alt={`Boleto ${ticket.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500">NFT ID: {ticket.id.substring(0, 8)}...</p>
                      <p className="font-medium mt-1">
                        {ticket.from} - {ticket.to}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gray-600">{ticket.date}</p>
                        <p className="text-sm font-medium text-[#D24848]">{ticket.company}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && tickets.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No tienes boletos NFT todavía</p>
                <a href="/" className="mt-2 inline-block text-[#D24848] hover:text-[#B83A3A]">
                  Comprar mi primer boleto
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
