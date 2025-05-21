"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEthereum } from "../context/EthereumContext";

export default function History() {
  const navigate = useNavigate();
  const {
    account,
    contract,
    loading: ethLoading,
    fetchTicket,
  } = useEthereum();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;

  useEffect(() => {
    async function loadHistory() {
      if (!contract || !account) {
        setTickets([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const balanceBN = await contract.balanceOf(account);
        const balance = balanceBN.toNumber();
        const arr = [];
        for (let i = 0; i < balance; i++) {
          const tokenIdBN = await contract.tokenOfOwnerByIndex(account, i);
          const tokenId = tokenIdBN.toString();
          const data = await fetchTicket(tokenId);
          arr.push({
            tokenId,
            origin: data.origin,
            destination: data.destination,
            timestamp: data.timestamp,
          });
        }
        // orden cronológico descendente
        arr.sort((a, b) => b.timestamp - a.timestamp);
        setTickets(arr);
      } catch (err) {
        console.error("Error cargando historial:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [contract, account, fetchTicket]);
  // cálculo de paginación
  const totalPages = Math.ceil(tickets.length / ticketsPerPage);
  const startIdx = (currentPage - 1) * ticketsPerPage;
  const currentTickets = tickets.slice(
    startIdx,
    startIdx + ticketsPerPage
  );

  // formatea timestamp
  const formatDate = (ts) =>
    new Date(ts * 1000).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-6">
          <h1 className="text-2xl font-bold text-white">Historial de Viajes</h1>
          <p className="text-gray-300">
            Consulta todos tus boletos anteriores
          </p>
        </div>

        <div className="p-6">
          {(loading || ethLoading) ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D24848] mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando historial...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      NFT ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ruta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTickets.map((t) => (
                    <tr key={t.tokenId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {t.tokenId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-[#D24848] mr-1" />
                          {t.origin} → {t.destination}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-[#D24848] mr-1" />
                          {formatDate(t.timestamp)}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          {new Date(t.timestamp * 1000).toLocaleTimeString("es-EC", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() =>
                            navigate(
                              `/purchase?from=${t.origin}&to=${t.destination}`
                            )
                          }
                          className="text-[#D24848] hover:text-[#B83A3A]"
                        >
                          Repetir compra
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && !ethLoading && tickets.length > ticketsPerPage && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 mt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border rounded disabled:opacity-50"
              >
                <ChevronLeft className="inline h-5 w-5" />
              </button>

              <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border rounded disabled:opacity-50"
              >
                <ChevronRight className="inline h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
