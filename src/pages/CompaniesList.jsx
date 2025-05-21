"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Clock, Calendar, MapPin, ArrowRight, Star, Users } from "lucide-react";
import { useEthereum } from "../context/EthereumContext";

export default function CompaniesList() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isConnected, connect } = useEthereum();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    // Parse query parameters and set defaults
    const params = new URLSearchParams(location.search);
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const today = new Date();
    const dateParam =
      params.get("date") || today.toISOString().split("T")[0];
    const timeParam =
      params.get("time") ||
      today.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" });

    setSearchParams({ from, to, date: dateParam, time: timeParam });

    // Simulate API call to fetch companies
    const fetchCompanies = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data for companies
      const mockCompanies = [
        { id: 1, name: "TransExpress", logo: "🚌", rating: 4.7, departureTime: "08:00", arrivalTime: "12:30", duration: "4h 30m", price: 12.5, available: 25, features: ["WiFi", "A/C", "Baño"] },
        { id: 2, name: "EcuaBus", logo: "🚍", rating: 4.5, departureTime: "09:15", arrivalTime: "14:00", duration: "4h 45m", price: 10.0, available: 18, features: ["WiFi", "A/C"] },
        { id: 3, name: "Flota Imbabura", logo: "🚐", rating: 4.2, departureTime: "10:30", arrivalTime: "15:15", duration: "4h 45m", price: 11.75, available: 12, features: ["A/C", "Baño"] },
        { id: 4, name: "Turismo Ecuador", logo: "🚎", rating: 4.8, departureTime: "12:00", arrivalTime: "16:30", duration: "4h 30m", price: 15.0, available: 8, features: ["WiFi", "A/C", "Baño", "TV"] },
        { id: 5, name: "Cooperativa Azuay", logo: "🚌", rating: 4.3, departureTime: "14:30", arrivalTime: "19:15", duration: "4h 45m", price: 11.25, available: 20, features: ["WiFi", "A/C"] },
        { id: 6, name: "Expreso Esmeraldas", logo: "🚍", rating: 4.1, departureTime: "16:00", arrivalTime: "20:45", duration: "4h 45m", price: 10.5, available: 15, features: ["A/C"] },
      ];

      // Ordena por precio ascendente
      mockCompanies.sort((a, b) => a.price - b.price);

      setCompanies(mockCompanies);
      setLoading(false);
    };

    fetchCompanies();
  }, [location.search]);

  const handleSelectCompany = async (companyId) => {
    // Si no está conectado, força conexión
    if (!isConnected) {
      try {
        await connect();
      } catch {
        return;
      }
    }
    navigate(
      `/purchase/${companyId}?from=${searchParams.from}&to=${searchParams.to}&date=${searchParams.date}&time=${searchParams.time}`
    );
  };

  // Formateo de fecha para mostrar en UI
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Banner: Invita a conectar wallet si no está */}
      {!isConnected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Conecta tu wallet</p>
          <p>Debes conectar tu wallet para poder comprar boletos.</p>
          <button onClick={connect} className="mt-2 px-4 py-2 bg-[#D24848] text-white rounded-md">
            Conectar Wallet
          </button>
        </div>
      )}

      {/* Cabecera de resultados */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900">Resultados de búsqueda</h1>
            <div className="mt-2 flex items-center text-gray-600">
              <MapPin className="h-5 w-5 text-[#D24848] mr-1" />
              <span className="font-medium">{searchParams.from}</span>
              <ArrowRight className="h-4 w-4 mx-2" />
              <span className="font-medium">{searchParams.to}</span>
            </div>
            <div className="mt-1 flex items-center text-gray-600">
              <Calendar className="h-5 w-5 text-[#D24848] mr-1" />
              <span>{formatDate(searchParams.date)}</span>
              <Clock className="h-5 w-5 text-[#D24848] ml-3 mr-1" />
              <span>{searchParams.time}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Empresas encontradas:</span>
            <span className="text-xl font-bold">{companies.length}</span>
          </div>
        </div>
      </div>

      {/* Spinner mientras busca */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D24848] mx-auto"></div>
            <p className="mt-4 text-gray-600">Buscando las mejores opciones...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map((company, index) => (
            <div
              key={company.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${index === 0 ? "border-2 border-[#D24848]" : ""
                }`}
            >
              {index === 0 && (
                <div className="bg-[#D24848] text-white text-xs font-bold px-3 py-1 text-center">
                  MEJOR PRECIO
                </div>
              )}
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="text-4xl mr-4">{company.logo}</div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
                      <div className="flex items-center mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">{company.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <div className="flex flex-col items-center">
                      <div className="text-sm text-gray-500">Salida</div>
                      <div className="font-bold">{company.departureTime}</div>
                    </div>

                    <div className="hidden md:block">
                      <div className="w-20 h-0.5 bg-gray-300 relative">
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                          {company.duration}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-sm text-gray-500">Llegada</div>
                      <div className="font-bold">{company.arrivalTime}</div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-sm text-gray-500">Asientos</div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="font-bold">{company.available}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-sm text-gray-500">Precio</div>
                      <div className={`font-bold ${index === 0 ? "text-[#D24848]" : ""}`}>
                        ${company.price.toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSelectCompany(company.id)}
                      className="w-full md:w-auto px-6 py-2 bg-[#D24848] text-white font-medium rounded-md hover:bg-[#B83A3A] transition-colors duration-200"
                    >
                      Seleccionar
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {company.features.map((feature, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
