"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { EthereumProvider } from "./context/EthereumContext"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Home from "./pages/Home"
import CompaniesList from "./pages/CompaniesList"
import Purchase from "./pages/Purchase"
import Confirmation from "./pages/Confirmation"
import Verification from "./pages/Verification"
import History from "./pages/History"
import Profile from "./pages/Profile"
import Support from "./pages/Support"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  // Check if user is connected on load
  useEffect(() => {
    const connected = localStorage.getItem("isConnected")
    if (connected === "true") {
      setIsConnected(true)
    }
  }, [])

  return (
    <EthereumProvider>
      <Router>
        <div className="flex min-h-screen bg-gray-50">
          {isConnected && <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />}
          <div className="flex flex-col flex-1">
            <Header
              toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              isConnected={isConnected}
              setIsConnected={setIsConnected}
            />
            <main className="flex-1 p-4 md:p-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/companies" element={<CompaniesList />} />
                <Route path="/purchase/:companyId" element={<Purchase />} />
                <Route path="/confirmation/:tokenId" element={<Confirmation />} />
                <Route path="/verification" element={<Verification />} />
                <Route path="/history" element={<History />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/support" element={<Support />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </EthereumProvider>
  )
}

export default App
