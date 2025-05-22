// src/pages/Confirmation.jsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, Download, Share2, MapPin, Calendar, Ticket } from "lucide-react";
import QRCode from "react-qr-code";
import { useEthereum } from "../context/EthereumContext";

export default function Confirmation() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { fetchTicket } = useEthereum(); // ya no usamos checkUsed
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [used, setUsed] = useState(false);

  useEffect(() => {
    async function loadTicket() {
      setLoading(true);
      try {
        const data = await fetchTicket(tokenId);
        setTicket({
          origin:      data.origin,
          destination: data.destination,
          seat:        data.seat,
          timestamp:   data.timestamp,
          passenger:   data.passenger,
        });
        // Usamos directamente el campo `used` que viene en `data`
        setUsed(data.used);
      } catch (err) {
        console.error("Error cargando ticket:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTicket();
  }, [tokenId, fetchTicket]);

  const formatDate = (ts) => {
    const date = new Date(ts * 1000);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading || !ticket) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D24848]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-green-50 px-6 py-4 border-b border-green-100">
          <div className="flex items-center">
            <Check className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <h1 className="text-lg font-medium text-green-800">¡Compra exitosa!</h1>
              <p className="text-sm text-green-600">Tu boleto ha sido emitido como NFT</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 flex justify-center">
            <div className="p-3 bg-white border border-gray-200 rounded-lg">
              <QRCode value={tokenId} size={180} level="H" />
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
                  <p className="font-medium">{ticket.origin} - {ticket.destination}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-[#D24848] mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">{formatDate(ticket.timestamp)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Ticket className="h-5 w-5 text-[#D24848] mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Asiento</p>
                  <p className="font-medium">{ticket.seat}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={() => alert('Añadido a tu wallet')}
              className="flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D24848] hover:bg-[#B83A3A]"
            >
              <Download className="h-5 w-5 mr-2" />
              Añadir a Wallet
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Mi boleto BoletoExpress',
                    text: `Boleto de ${ticket.origin} a ${ticket.destination}`,
                    url: window.location.href,
                  });
                } else alert('Compartir no disponible');
              }}
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Compartir Boleto
            </button>

            <button
              onClick={() => navigate('/')}
              className="text-center text-sm text-[#D24848] hover:text-[#B83A3A] font-medium"
            >
              Volver al inicio
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {used
                ? 'Ticket marcado como usado'
                : 'Boleto listo para usar. ¡Buen viaje!'}
            </p>
            {!used && (
              <p className="mt-1 text-xs text-gray-400">
                Muestra este QR para verificar.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
