"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useEthereum } from "../context/EthereumContext"
import { Bell, Wallet, Menu, X, ChevronDown } from "lucide-react"

export default function Header({ toggleSidebar, isConnected, setIsConnected }) {
  const { account, balance, connect, disconnect } = useEthereum()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleConnect = async () => {
    await connect()
    setIsConnected(true)
  }

  const handleDisconnect = () => {
    disconnect()
    setIsConnected(false)
    setDropdownOpen(false)
  }

  const notifications = [
    { id: 1, text: "Nueva ruta frecuente: Quito - Guayaquil" },
    { id: 2, text: "Oferta: 20% de descuento en rutas a Cuenca" },
  ]

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {isConnected && (
              <button
                onClick={toggleSidebar}
                className="mr-2 p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900">BoletoExpress</span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Home
              </Link>
              <Link to="/companies" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                Rutas
              </Link>
              {isConnected && (
                <>
                  <Link to="/history" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Historial
                  </Link>
                  <Link to="/support" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Soporte
                  </Link>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center">
            {isConnected && (
              <div className="relative mr-4">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-full text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[#D24848] rounded-full">
                    {notifications.length}
                  </span>
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">Notificaciones</p>
                      </div>
                      {notifications.map((notification) => (
                        <div key={notification.id} className="px-4 py-3 hover:bg-gray-100">
                          <p className="text-sm text-gray-700">{notification.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="relative">
              {isConnected ? (
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <Wallet className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="hidden md:inline">
                    {account.substring(0, 6)}...{account.substring(account.length - 4)}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D24848] hover:bg-[#B83A3A] focus:outline-none"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Conectar Wallet
                </button>
              )}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">Wallet</p>
                      <p className="text-xs text-gray-500 truncate">{account}</p>
                    </div>
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm text-gray-700">Balance:</p>
                      <p className="text-sm font-medium text-gray-900">{balance} ETH</p>
                    </div>
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Mi Perfil
                    </button>
                    <button
                      onClick={handleDisconnect}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Desconectar
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="md:hidden ml-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/companies"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rutas
            </Link>
            {isConnected && (
              <>
                <Link
                  to="/history"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Historial
                </Link>
                <Link
                  to="/support"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Soporte
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
