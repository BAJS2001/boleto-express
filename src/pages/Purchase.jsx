"use client";

import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useEthereum } from "../context/EthereumContext";
import { MapPin, Calendar, Clock, CreditCard, Wallet } from "lucide-react";

export default function Purchase() {
  const { companyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isConnected,
    connect,
    purchaseTicket,
    loading: ethLoading,
    error: ethError,
  } = useEthereum();

  const [company, setCompany] = useState(null);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seat: 1,
    paymentMethod: "ethereum",
  });
  const [errors, setErrors] = useState({});
  const [purchaseStatus, setPurchaseStatus] = useState("idle");

  // Parte 1: Inicialización y parsing de query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setFormData(prev => ({
      ...prev,
      from: params.get("from") || "",
      to: params.get("to") || "",
      date: params.get("date") || new Date().toISOString().split('T')[0],
      time: params.get("time") || new Date().toLocaleTimeString('es-EC',{hour:'2-digit',minute:'2-digit'}),
    }));

    // Mock de detalles de compañía
    const mockCompanies = {
      1: { id:1,name: "TransExpress",logo: "🚌", price: 12.5, departureTime: "08:00", arrivalTime: "12:30", duration: "4h 30m" },
      2: { id:2,name: "EcuaBus",logo: "🚍", price: 10.0, departureTime: "09:15", arrivalTime: "14:00", duration: "4h 45m" },
      3: { id:3,name: "Flota Imbabura",logo: "🚐", price: 11.75, departureTime: "10:30", arrivalTime: "15:15", duration: "4h 45m" },
      4: { id:4,name: "Turismo Ecuador",logo: "🚎", price: 15.0, departureTime: "12:00", arrivalTime: "16:30", duration: "4h 30m" },
      5: { id:5,name: "Cooperativa Azuay",logo: "🚌", price: 11.25, departureTime: "14:30", arrivalTime: "19:15", duration: "4h 45m" },
      6: { id:6,name: "Expreso Esmeraldas",logo: "🚍", price: 10.5, departureTime: "16:00", arrivalTime: "20:45", duration: "4h 45m" },
    };
    setCompany(mockCompanies[companyId] || null);
  }, [companyId, location.search]);

  // Parte 2: Manejo de inputs y validaciones
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErr = {};
    if (formData.seat < 1 || formData.seat > 50) {
      newErr.seat = 'El número de asiento debe estar entre 1 y 50';
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Conectar si no conectado
    if (!isConnected) {
      try {
        await connect();
      } catch {
        setErrors({ connection: 'Error al conectar con MetaMask.' });
        return;
      }
    }
    if (!validateForm()) return;

    setPurchaseStatus('processing');
    try {
      // Parte 3: Llamada on-chain
      const tokenId = await purchaseTicket(
        formData.from,
        formData.to,
        formData.seat,
        company.price
      );
      setPurchaseStatus('success');
      navigate(
        `/confirmation/${tokenId}?from=${formData.from}&to=${formData.to}&date=${formData.date}&company=${company.name}`
      );
    } catch {
      setPurchaseStatus('error');
      setErrors({ submission: 'Error al procesar el pago.' });
    }
  };

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  };

  if (!company) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D24848] mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-6">
          <div className="flex items-center">
            <div className="text-4xl mr-4">{company.logo}</div>
            <div>
              <h1 className="text-2xl font-bold text-white">{company.name}</h1>
              <p className="text-gray-300">Compra de boleto</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 border-b pb-4">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Detalles del viaje</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-[#D24848] mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Ruta</p>
                  <p className="font-medium">{formData.from} - {formData.to}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-[#D24848] mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">{formatDate(formData.date)}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-[#D24848] mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Horario</p>
                  <p className="font-medium">Salida: {company.departureTime} - Llegada: {company.arrivalTime}</p>
                  <p className="text-sm text-gray-500">Duración: {company.duration}</p>
                </div>
              </div>
              <div className="flex items-start">
                <CreditCard className="h-5 w-5 text-[#D24848] mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Precio</p>
                  <p className="font-medium text-[#D24848]">${company.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Selección de asiento</h2>
              <div className="flex items-center">
                <label htmlFor="seat" className="block text-sm font-medium text-gray-700 mr-3">Número de asiento:</label>
                <input
                  type="number"
                  id="seat"
                  name="seat"
                  min="1"
                  max="50"
                  value={formData.seat}
                  onChange={handleChange}
                  className={`w-20 border ${errors.seat ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] p-2`}
                />
              </div>
              {errors.seat && <p className="mt-2 text-sm text-red-600">{errors.seat}</p>}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-3">Método de pago</h2>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ethereum"
                    checked
                    disabled
                    className="h-4 w-4 text-[#D24848] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Ethereum (MetaMask)</span>
                </label>
              </div>
            </div>

            {(errors.connection || errors.submission) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                {errors.connection || errors.submission}
              </div>
            )}

            <button
              type="submit"
              disabled={ethLoading || purchaseStatus === 'processing'}
              className="w-full flex justify-center items-center px-6 py-3 bg-[#D24848] text-white rounded-md hover:bg-[#B83A3A] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {ethLoading || purchaseStatus === 'processing' ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Wallet className="h-5 w-5 mr-2" />
                  Pagar con MetaMask
                </>
              )}
            </button>

            <p className="mt-2 text-xs text-gray-500 text-center">
              Al hacer clic en "Pagar con MetaMask", confirmas la transacción en tu wallet.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
