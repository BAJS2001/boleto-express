"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Calendar, Clock } from "lucide-react"

export default function Home() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    date: "",
    time: getCurrentTime(),
  })
  const [errors, setErrors] = useState({})

  // Get current time in HH:MM format
  function getCurrentTime() {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    return `${hours}:${minutes}`
  }

  // List of cities in Ecuador
  const cities = [
    "Quito",
    "Guayaquil",
    "Cuenca",
    "Santo Domingo",
    "Machala",
    "Durán",
    "Manta",
    "Portoviejo",
    "Loja",
    "Ambato",
    "Esmeraldas",
    "Quevedo",
    "Riobamba",
    "Milagro",
    "Ibarra",
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.origin) {
      newErrors.origin = "Seleccione una ciudad de origen"
    }

    if (!formData.destination) {
      newErrors.destination = "Seleccione una ciudad de destino"
    } else if (formData.origin === formData.destination) {
      newErrors.destination = "El destino debe ser diferente al origen"
    }

    if (!formData.date) {
      newErrors.date = "Seleccione una fecha"
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        newErrors.date = "La fecha no puede ser en el pasado"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Save to localStorage if needed
      localStorage.setItem("lastSearch", JSON.stringify(formData))

      // Navigate to companies list with query params
      navigate(
        `/companies?from=${formData.origin}&to=${formData.destination}&date=${formData.date}&time=${formData.time}`,
      )
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-16 sm:px-10 sm:py-20">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Viaja seguro con BoletoExpress</h1>
          <p className="mt-2 text-lg text-gray-300">
            Compra tus boletos interprovinciales de forma segura y verificable con tecnología blockchain
          </p>
        </div>

        <div className="px-6 py-8 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
                  Ciudad de Origen
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="origin"
                    name="origin"
                    value={formData.origin}
                    onChange={handleChange}
                    className={`block w-full pl-10 py-3 border ${errors.origin ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] sm:text-sm`}
                  >
                    <option value="">Seleccionar origen</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.origin && <p className="mt-2 text-sm text-red-600">{errors.origin}</p>}
              </div>

              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                  Ciudad de Destino
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    className={`block w-full pl-10 py-3 border ${errors.destination ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] sm:text-sm`}
                  >
                    <option value="">Seleccionar destino</option>
                    {cities.map((city) => (
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
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`block w-full pl-10 py-3 border ${errors.date ? "border-red-300" : "border-gray-300"} rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] sm:text-sm`}
                  />
                </div>
                {errors.date && <p className="mt-2 text-sm text-red-600">{errors.date}</p>}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Hora de Viaje
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`block w-full pl-10 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] sm:text-sm`}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[#D24848] hover:bg-[#B83A3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D24848] transition-colors duration-200"
              >
                <Search className="h-5 w-5 mr-2" />
                Buscar Rutas
              </button>
            </div>
          </form>

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
  )
}

function MapPin(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
