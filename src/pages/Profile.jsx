"use client";

import { useState, useEffect } from "react";
import { useEthereum } from "../context/EthereumContext";
import { Wallet, LogOut, Copy, ExternalLink } from "lucide-react";

export default function Profile() {
  const { account, balance, disconnect, contract, fetchTicket } = useEthereum();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Carga los NFT tickets on-chain
  useEffect(() => {
    async function loadTickets() {
      if (!contract || !account) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const balanceBN = await contract.balanceOf(account);
        const count = balanceBN.toNumber();
        const arr = [];
        for (let i = 0; i < count; i++) {
          const tokenIdBN = await contract.tokenOfOwnerByIndex(account, i);
          const tokenId = tokenIdBN.toString();
          const data = await fetchTicket(tokenId);
          arr.push({
            tokenId,
            from: data.origin,
            to: data.destination,
            date: data.timestamp,
          });
        }
        setTickets(arr);
      } catch (err) {
        console.error("Error cargando tickets:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, [contract, account, fetchTicket]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisconnect = () => {
    disconnect();
    window.location.href = "/";
  };

  const formatDate = (ts) => {
    return new Date(ts * 1000).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
                    {copied ? (
                      <span className="text-green-500 text-xs">¡Copiado!</span>
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D24848] mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando boletos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {tickets.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg col-span-full">
                    <p className="text-gray-500">No tienes boletos NFT todavía</p>
                    <a href="/" className="mt-2 inline-block text-[#D24848] hover:text-[#B83A3A]">
                      Comprar mi primer boleto
                    </a>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div
                      key={ticket.tokenId}
                      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <p className="text-xs text-gray-500">NFT ID: {ticket.tokenId}</p>
                        <p className="font-medium mt-1">
                          {ticket.from} → {ticket.to}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(ticket.date)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
