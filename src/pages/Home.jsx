"use client";
// Home.jsx - Parte 1: Imports, hooks y lógica de estado

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Calendar, Clock } from "lucide-react";
import { useEthereum } from "../context/EthereumContext";

export default function Home() {
  const navigate = useNavigate();
  const { isConnected, connect, addFrequentRoute } = useEthereum();
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    date: "",
    time: getCurrentTime(),
  });
  const [errors, setErrors] = useState({});

  // Obtiene la hora actual en formato HH:MM
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' });
  }

  const cities = [
    "Quito","Guayaquil","Cuenca","Santo Domingo","Machala","Durán",
    "Manta","Portoviejo","Loja","Ambato","Esmeraldas","Quevedo",
    "Riobamba","Milagro","Ibarra",
  ];

  // Maneja cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Validación del formulario
  const validateForm = () => {
    const newErr = {};
    if (!formData.origin) newErr.origin = "Seleccione una ciudad de origen";
    if (!formData.destination) newErr.destination = "Seleccione una ciudad de destino";
    else if (formData.origin === formData.destination) newErr.destination = "El destino debe ser diferente al origen";
    if (!formData.date) newErr.date = "Seleccione una fecha";
    else {
      const sel = new Date(formData.date);
      const today = new Date(); today.setHours(0,0,0,0);
      if (sel < today) newErr.date = "La fecha no puede ser en el pasado";
    }
    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  // Home.jsx - Parte 2: Manejo de submit y render de formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    // Conectar wallet si no está
    if (!isConnected) {
      try { await connect(); } catch { return; }
    }
    // Agregar ruta frecuente
    addFrequentRoute({ from: formData.origin, to: formData.destination });
    // Navegar a listado con parámetros
    navigate(
      `/companies?from=${formData.origin}&to=${formData.destination}` +
      `&date=${formData.date}&time=${formData.time}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-16 sm:px-10 sm:py-20">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Viaja seguro con BoletoExpress
          </h1>
          <p className="mt-2 text-lg text-gray-300">
            Compra tus boletos interprovinciales de forma segura y verificable con tecnología blockchain
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <div className="px-6 py-8 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              {/* Origen */}
              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
                  Ciudad de Origen
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    className={`block w-full py-3 px-3 border ${errors.origin ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] sm:text-sm`}
                  >
                    <option value="">Seleccionar origen</option>
                    {cities.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.origin && <p className="mt-2 text-sm text-red-600">{errors.origin}</p>}
              </div>

              {/* Home.jsx - Parte 3: Destino, fecha, hora y CTA */}
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                  Ciudad de Destino
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <select
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className={`block w-full py-3 px-3 border ${errors.destination ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] sm:text-sm`}
                  >
                    <option value="">Seleccionar destino</option>
                    {cities.map(city => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.destination && <p className="mt-2 text-sm text-red-600">{errors.destination}</p>}
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Fecha de Viaje
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`block w-full py-3 px-3 border ${errors.date ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] sm:text-sm`}
                  />
                </div>
                {errors.date && <p className="mt-2 text-sm text-red-600">{errors.date}</p>}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Hora de Viaje
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="block w-full py-3 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center px-6 py-3 bg-[#D24848] text-white font-medium rounded-md hover:bg-[#B83A3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D24848]"
              >
                <Search className="h-5 w-5 mr-2" />
                Buscar Rutas
              </button>
            </div>
          </form>

          {/* Beneficios */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900">¿Por qué BoletoExpress?</h2>
            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-sm font-medium text-gray-900">Seguridad Blockchain</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Tus boletos son NFTs verificables en la blockchain, imposibles de falsificar.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-sm font-medium text-gray-900">Verificación QR</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Escanea el código QR para verificar la autenticidad del boleto al instante.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-sm font-medium text-gray-900">Sin Intermediarios</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Compra directamente a las compañías de transporte sin comisiones adicionales.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
