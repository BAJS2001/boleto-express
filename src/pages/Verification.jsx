"use client";

import { useState, useRef, useEffect } from "react";
import { useEthereum } from "../context/EthereumContext";
import { Camera, Check, X, RefreshCw } from "lucide-react";

export default function Verification() {
  const {
    validateTicket,
    fetchTicket,
    checkUsed,
    markUsed,
    loading,
  } = useEthereum();

  const [tokenId, setTokenId] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [manualInput, setManualInput] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Simulación de cámara (puedes reemplazarla con un lector real)
  useEffect(() => {
    // esta línea evita que el efecto corra en SSR
    if (typeof window === "undefined") return;

    if (cameraActive && videoRef.current) {
      // aquí ya puedes usar document, navigator.mediaDevices, etc.
      const timer = setTimeout(() => {
        handleManualVerify("123456789");
        setCameraActive(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [cameraActive]);
  const startCamera = () => {
    setVerificationResult(null);
    setCameraActive(true);
  };

  const stopCamera = () => {
    setCameraActive(false);
  };

  const toggleInputMethod = () => {
    setVerificationResult(null);
    setManualInput((m) => !m);
    setCameraActive(false);
  };

  const handleInputChange = (e) => {
    setTokenId(e.target.value);
  };

  const handleManualVerify = async (id = null) => {
    const idToVerify = id || tokenId.trim();
    if (!idToVerify) {
      alert("Por favor, ingresa un ID de boleto válido.");
      return;
    }

    try {
      // 1) Verificamos validez
      const isValidOnChain = await validateTicket(idToVerify);

      // 2) Obtenemos datos del NFT
      const data = await fetchTicket(idToVerify);

      // 3) Comprobamos si ya fue usado
      const alreadyUsed = await checkUsed(idToVerify);

      setVerificationResult({
        tokenId: idToVerify,
        isValid: isValidOnChain && !alreadyUsed,
        used: alreadyUsed,
        details: {
          from: data.origin,
          to: data.destination,
          date: new Date(data.timestamp * 1000).toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          company: data.company,
        },
      });
    } catch (err) {
      console.error("Error verificando ticket:", err);
      setVerificationResult({
        tokenId: idToVerify,
        isValid: false,
        error: "Error al verificar en la blockchain",
      });
    }
  };

  const handleMarkAsUsed = async () => {
    if (!verificationResult?.tokenId) return;
    await markUsed(verificationResult.tokenId);
    // Re-check estado usado
    const nowUsed = await checkUsed(verificationResult.tokenId);
    setVerificationResult((prev) => ({
      ...prev,
      isValid: false,
      used: nowUsed,
      usedAt: new Date().toISOString(),
    }));
  };

  const resetVerification = () => {
    setVerificationResult(null);
    setTokenId("");
    setCameraActive(false);
    setManualInput(false);
  };
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-6">
          <h1 className="text-2xl font-bold text-white">Verificación de Boletos</h1>
          <p className="text-gray-300">
            Escanea o ingresa el ID del boleto para verificar su validez
          </p>
        </div>

        <div className="p-6">
          {!verificationResult ? (
            <>
              {/* Modo de ingreso */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">
                    {manualInput ? "Ingreso Manual" : "Escanear QR"}
                  </h2>
                  <button
                    onClick={toggleInputMethod}
                    className="text-sm text-[#D24848] hover:text-[#B83A3A]"
                  >
                    {manualInput ? "Usar Cámara" : "Ingreso Manual"}
                  </button>
                </div>

                {manualInput ? (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="tokenId"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        ID del Boleto (NFT)
                      </label>
                      <input
                        type="text"
                        id="tokenId"
                        value={tokenId}
                        onChange={handleInputChange}
                        placeholder="Ingresa el ID del boleto"
                        className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] p-3"
                      />
                    </div>
                    <button
                      onClick={() => handleManualVerify()}
                      disabled={loading}
                      className="w-full flex justify-center items-center px-4 py-2 bg-[#D24848] text-white rounded-md hover:bg-[#B83A3A] disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
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
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-white rounded-lg opacity-50" />
                          </div>
                          <div className="absolute bottom-4 inset-x-0 text-center text-white bg-black bg-opacity-50 py-1 text-sm">
                            Simulando escaneo de QR...
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-8">
                          <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Cámara inactiva</p>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={cameraActive ? stopCamera : startCamera}
                      className="w-full flex justify-center items-center px-4 py-2 bg-[#D24848] text-white rounded-md hover:bg-[#B83A3A]"
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

              {/* Instrucciones */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Instrucciones:
                </h3>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                  <li>
                    Escanea el código QR o ingresa el ID manualmente.
                  </li>
                  <li>
                    Verifica que el boleto sea válido y no esté usado.
                  </li>
                  <li>
                    Marca el boleto como usado tras la verificación.
                  </li>
                </ol>
              </div>
            </>
          ) : (
            <>
              {/* Resultado de la verificación */}
              <div
                className={`p-4 rounded-lg ${verificationResult.isValid
                    ? "bg-green-50 border border-green-100"
                    : "bg-red-50 border border-red-100"
                  }`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${verificationResult.isValid
                        ? "bg-green-100"
                        : "bg-red-100"
                      }`}
                  >
                    {verificationResult.isValid ? (
                      <Check className="h-6 w-6 text-green-600" />
                    ) : (
                      <X className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div className="ml-3">
                    <h2
                      className={`text-lg font-medium ${verificationResult.isValid
                          ? "text-green-800"
                          : "text-red-800"
                        }`}
                    >
                      {verificationResult.isValid
                        ? "Boleto Válido"
                        : "Boleto Inválido o Usado"}
                    </h2>
                    <p
                      className={`text-sm ${verificationResult.isValid
                          ? "text-green-600"
                          : "text-red-600"
                        }`}
                    >
                      ID: {verificationResult.tokenId}
                    </p>
                  </div>
                </div>

                {verificationResult.error && (
                  <p className="mt-2 text-sm text-red-600">
                    {verificationResult.error}
                  </p>
                )}
              </div>

              {/* Detalles y acciones */}
              {verificationResult.isValid && verificationResult.details && (
                <div className="border rounded-lg p-4 bg-gray-50 mt-4">
                  <h3 className="text-md font-medium text-gray-900 mb-3">
                    Detalles del Boleto
                  </h3>
                  {Object.entries(verificationResult.details).map(
                    ([key, val]) => (
                      <div
                        key={key}
                        className="flex justify-between text-sm text-gray-700"
                      >
                        <span className="capitalize">{key}:</span>
                        <span>{val}</span>
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="flex flex-col space-y-3 mt-4">
                {verificationResult.isValid && !verificationResult.used && (
                  <button
                    onClick={handleMarkAsUsed}
                    className="w-full flex justify-center items-center px-4 py-2 bg-[#D24848] text-white rounded-md hover:bg-[#B83A3A]"
                  >
                    Marcar como Usado
                  </button>
                )}
                <button
                  onClick={resetVerification}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Verificar Otro Boleto
                </button>
              </div>

              {verificationResult.usedAt && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md text-sm text-yellow-800">
                  Este boleto fue marcado como usado el{" "}
                  {new Date(verificationResult.usedAt).toLocaleString()}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
