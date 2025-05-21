"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import { useEthereum } from "../context/EthereumContext";

export default function Sidebar({ isOpen, setIsOpen }) {
  const { account, contract, frequentRoutes, isConnected, loading } = useEthereum();
  const [recentTickets, setRecentTickets] = useState([]);

  // No mostramos si no están conectados
  if (!isConnected) return null;

  useEffect(() => {
    async function loadTickets() {
      if (!contract || !account) return setRecentTickets([]);
      try {
        const balance = await contract.balanceOf(account);
        const arr = [];
        for (let i = 0; i < balance.toNumber(); i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(account, i);
          const t = await contract.getTicket(tokenId);
          arr.push({
            id: tokenId.toString(),
            from: t.origin,
            to: t.destination,
            date: new Date(t.timestamp * 1000).toLocaleDateString(),
          });
        }
        setRecentTickets(arr);
      } catch (e) {
        console.error("Error cargando tickets:", e);
      }
    }
    loadTickets();
  }, [account, contract]);

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:h-screen`}
    >
      <div className="h-full flex flex-col overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Mi Panel</h2>
        </div>

        {/* Rutas Frecuentes */}
        <div className="p-4 border-b">
          <div className="flex items-center mb-3">
            <MapPin className="h-5 w-5 text-[#D24848] mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Rutas Frecuentes</h3>
          </div>
          <ul className="space-y-2">
            {frequentRoutes.map((route, idx) => (
              <li key={idx}>
                <Link
                  to={`/companies?from=${route.from}&to=${route.to}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md p-2"
                >
                  <span>{route.from} - {route.to}</span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Boletos Comprados */}
        <div className="p-4 border-b flex-1 overflow-y-auto">
          <div className="flex items-center mb-3">
            <Clock className="h-5 w-5 text-[#D24848] mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Boletos Comprados</h3>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-xs text-gray-500">Cargando...</p>
            ) : recentTickets.length === 0 ? (
              <p className="text-xs text-gray-500">No hay boletos aún.</p>
            ) : (
              recentTickets.map((ticket) => (
                <div key={ticket.id} className="bg-gray-50 rounded-md p-3 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-500">#{ticket.id}</span>
                    <span className="text-xs text-gray-500">{ticket.date}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {ticket.from} → {ticket.to}
                  </div>
                </div>
              ))
            )}
          </div>
          <Link
            to="/history"
            onClick={() => setIsOpen(false)}
            className="block mt-3 text-sm text-[#D24848] hover:text-[#B83A3A] font-medium"
          >
            Ver todo el Historial
          </Link>
        </div>

        <div className="mt-auto p-4 border-t">
          <Link
            to="/verification"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D24848] hover:bg-[#B83A3A]"
          >
            Verificar Boleto
          </Link>
        </div>
      </div>
    </div>
  );
}
