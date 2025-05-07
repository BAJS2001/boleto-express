"use client"

import { useState, useRef, useEffect } from "react"
import { useEthereum } from "../context/EthereumContext"
import { Camera, Check, X, RefreshCw } from "lucide-react"

export default function Verification() {
  const { validateTicket, loading } = useEthereum()
  const [tokenId, setTokenId] = useState("")
  const [verificationResult, setVerificationResult] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [manualInput, setManualInput] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Simulate camera functionality
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      // In a real app, we would use:
      // navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      // For this demo, we'll just show a placeholder

      const timer = setTimeout(() => {
        // Simulate QR code detection after 3 seconds
        handleManualVerify("123456789")
        setCameraActive(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [cameraActive])

  const startCamera = () => {
    setCameraActive(true)
    setVerificationResult(null)
  }

  const stopCamera = () => {
    setCameraActive(false)
  }

  const toggleInputMethod = () => {
    setManualInput(!manualInput)
    setCameraActive(false)
    setVerificationResult(null)
  }

  const handleInputChange = (e) => {
    setTokenId(e.target.value)
  }

  const handleManualVerify = async (id = null) => {
    const idToVerify = id || tokenId

    if (!idToVerify) {
      alert("Por favor, ingrese un ID de boleto válido")
      return
    }

    try {
      const isValid = await validateTicket(idToVerify)

      setVerificationResult({
        tokenId: idToVerify,
        isValid,
        details: {
          from: "Quito",
          to: "Guayaquil",
          date: "2023-05-15",
          company: "TransExpress",
        },
      })
    } catch (error) {
      console.error("Error verifying ticket:", error)
      setVerificationResult({
        tokenId: idToVerify,
        isValid: false,
        error: "Error al verificar el boleto",
      })
    }
  }

  const handleMarkAsUsed = async () => {
    // Simulate marking the ticket as used
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setVerificationResult((prev) => ({
      ...prev,
      isValid: false,
      usedAt: new Date().toISOString(),
    }))
  }

  const resetVerification = () => {
    setVerificationResult(null)
    setTokenId("")
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-6">
          <h1 className="text-2xl font-bold text-white">Verificación de Boletos</h1>
          <p className="text-gray-300">Escanea o ingresa el ID del boleto para verificar su validez</p>
        </div>

        <div className="p-6">
          {!verificationResult ? (
            <>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {manualInput ? "Ingreso Manual" : "Escanear QR"}
                  </h2>
                  <button
                    onClick={toggleInputMethod}
                    className="text-sm text-[#D24848] hover:text-[#B83A3A] font-medium"
                  >
                    {manualInput ? "Usar cámara" : "Ingreso manual"}
                  </button>
                </div>

                {manualInput ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="tokenId" className="block text-sm font-medium text-gray-700 mb-1">
                        ID del Boleto (NFT)
                      </label>
                      <input
                        type="text"
                        id="tokenId"
                        value={tokenId}
                        onChange={handleInputChange}
                        placeholder="Ingrese el ID del boleto"
                        className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] sm:text-sm p-3"
                      />
                    </div>
                    <button
                      onClick={() => handleManualVerify()}
                      disabled={loading}
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D24848] hover:bg-[#B83A3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D24848] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                          Verificando...
                        </>
                      ) : (
                        "Verificar Boleto"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                      {cameraActive ? (
                        <>
                          <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            autoPlay
                            playsInline
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-white rounded-lg opacity-50"></div>
                          </div>
                          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black bg-opacity-50 py-1">
                            Simulando escaneo de QR...
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-8">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">La cámara no está activa</p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={cameraActive ? stopCamera : startCamera}
                      className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D24848] hover:bg-[#B83A3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D24848] transition-colors duration-200"
                    >
                      {cameraActive ? (
                        <>
                          <X className="h-5 w-5 mr-2" />
                          Detener Cámara
                        </>
                      ) : (
                        <>
                          <Camera className="h-5 w-5 mr-2" />
                          Iniciar Cámara
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Instrucciones:</h3>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Escanea el código QR del boleto o ingresa el ID manualmente</li>
                  <li>Verifica que el boleto sea válido y no haya sido usado</li>
                  <li>Marca el boleto como usado después de verificarlo</li>
                </ol>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div
                className={`p-4 rounded-lg ${verificationResult.isValid ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${verificationResult.isValid ? "bg-green-100" : "bg-red-100"}`}
                  >
                    {verificationResult.isValid ? (
                      <Check className={`h-6 w-6 text-green-600`} />
                    ) : (
                      <X className={`h-6 w-6 text-red-600`} />
                    )}
                  </div>
                  <div className="ml-3">
                    <h2
                      className={`text-lg font-medium ${verificationResult.isValid ? "text-green-800" : "text-red-800"}`}
                    >
                      {verificationResult.isValid ? "Boleto Válido" : "Boleto Inválido o Ya Usado"}
                    </h2>
                    <p className={`text-sm ${verificationResult.isValid ? "text-green-600" : "text-red-600"}`}>
                      ID: {verificationResult.tokenId}
                    </p>
                  </div>
                </div>
              </div>

              {verificationResult.isValid && verificationResult.details && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="text-md font-medium text-gray-900 mb-3">Detalles del Boleto</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 w-24">Origen:</span>
                      <span className="text-sm font-medium">{verificationResult.details.from}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 w-24">Destino:</span>
                      <span className="text-sm font-medium">{verificationResult.details.to}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 w-24">Fecha:</span>
                      <span className="text-sm font-medium">{verificationResult.details.date}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 w-24">Empresa:</span>
                      <span className="text-sm font-medium">{verificationResult.details.company}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-3">
                {verificationResult.isValid && (
                  <button
                    onClick={handleMarkAsUsed}
                    className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D24848] hover:bg-[#B83A3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D24848] transition-colors duration-200"
                  >
                    Marcar como Usado
                  </button>
                )}

                <button
                  onClick={resetVerification}
                  className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Verificar Otro Boleto
                </button>
              </div>

              {verificationResult.usedAt && (
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Este boleto ha sido marcado como usado el {new Date(verificationResult.usedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
