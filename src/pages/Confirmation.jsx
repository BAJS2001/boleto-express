"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, Link } from "react-router-dom"
import { Check, Download, Share2, MapPin, Calendar, Ticket } from "lucide-react"
import QRCode from "react-qr-code"

export default function Confirmation() {
  const { tokenId } = useParams()
  const location = useLocation()
  const [ticketDetails, setTicketDetails] = useState({
    from: "",
    to: "",
    date: "",
    company: "",
    status: "valid",
  })

  useEffect(() => {
    // Parse query parameters
    const params = new URLSearchParams(location.search)

    setTicketDetails({
      from: params.get("from") || "",
      to: params.get("to") || "",
      date: params.get("date") || "",
      company: params.get("company") || "",
      status: "valid",
    })
  }, [location.search])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ""

    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleAddToWallet = () => {
    alert("Esta funcionalidad simularía la adición del NFT a una wallet digital.")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Mi boleto de BoletoExpress",
          text: `Boleto de ${ticketDetails.from} a ${ticketDetails.to} con ${ticketDetails.company}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      alert("La funcionalidad de compartir no está disponible en este navegador.")
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-50 px-6 py-4 border-b border-green-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-medium text-green-800">¡Compra exitosa!</h1>
              <p className="text-sm text-green-600">Tu boleto ha sido emitido como NFT</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex justify-center">
            <div className="p-3 bg-white border border-gray-200 rounded-lg">
              <QRCode value={`https://boletoexpress.ec/verify/${tokenId}`} size={180} level="H" />
            </div>
          </div>

          <div className="mb-6 text-center">
            <p className="text-sm text-gray-500">ID del Boleto (NFT)</p>
            <p className="font-mono text-lg font-medium">{tokenId}</p>
          </div>

          <div className="mb-6 border rounded-lg p-4 bg-gray-50">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Detalles del Boleto</h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#D24848] mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Ruta</p>
                  <p className="font-medium">
                    {ticketDetails.from} - {ticketDetails.to}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-[#D24848] mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">{formatDate(ticketDetails.date)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Ticket className="h-5 w-5 text-[#D24848] mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Empresa</p>
                  <p className="font-medium">{ticketDetails.company}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handleAddToWallet}
              className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D24848] hover:bg-[#B83A3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D24848] transition-colors duration-200"
            >
              <Download className="h-5 w-5 mr-2" />
              Añadir a Wallet
            </button>

            <button
              onClick={handleShare}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D24848] transition-colors duration-200"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Compartir Boleto
            </button>

            <Link to="/" className="text-center text-sm text-[#D24848] hover:text-[#B83A3A] font-medium">
              Volver al inicio
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Boleto guardado en tu wallet. ¡Buen viaje!</p>
            <p className="text-xs text-gray-400 mt-1">
              Muestra este código QR al personal de la empresa de transporte para abordar.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
