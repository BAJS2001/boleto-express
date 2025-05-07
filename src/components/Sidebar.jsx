import { Link } from "react-router-dom"
import { MapPin, Clock, ChevronRight } from "lucide-react"

export default function Sidebar({ isOpen, setIsOpen }) {
  // Mock data for recent routes
  const frequentRoutes = [
    { id: 1, from: "Quito", to: "Guayaquil" },
    { id: 2, from: "Quito", to: "Cuenca" },
    { id: 3, from: "Guayaquil", to: "Salinas" },
  ]

  // Mock data for recent tickets
  const recentTickets = [
    { id: 101, from: "Quito", to: "Guayaquil", date: "2023-05-15", company: "TransExpress" },
    { id: 102, from: "Guayaquil", to: "Cuenca", date: "2023-04-22", company: "EcuaBus" },
    { id: 103, from: "Quito", to: "Ibarra", date: "2023-03-10", company: "Flota Imbabura" },
  ]

  return (
    <div
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:h-screen`}
    >
      <div className="h-full flex flex-col overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Mi Panel</h2>
        </div>

        {/* Frequent Routes Section */}
        <div className="p-4 border-b">
          <div className="flex items-center mb-3">
            <MapPin className="h-5 w-5 text-[#D24848] mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Rutas Frecuentes</h3>
          </div>
          <ul className="space-y-2">
            {frequentRoutes.map((route) => (
              <li key={route.id}>
                <Link
                  to={`/companies?from=${route.from}&to=${route.to}`}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md p-2"
                >
                  <span>
                    {route.from} - {route.to}
                  </span>
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Tickets Section */}
        <div className="p-4 border-b">
          <div className="flex items-center mb-3">
            <Clock className="h-5 w-5 text-[#D24848] mr-2" />
            <h3 className="text-sm font-medium text-gray-700">Boletos Comprados</h3>
          </div>
          <div className="space-y-3">
            {recentTickets.map((ticket) => (
              <div key={ticket.id} className="bg-gray-50 rounded-md p-3 shadow-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-500">{ticket.company}</span>
                  <span className="text-xs text-gray-500">{ticket.date}</span>
                </div>
                <div className="text-sm font-medium">
                  {ticket.from} - {ticket.to}
                </div>
              </div>
            ))}
          </div>
          <Link to="/history" className="block mt-3 text-sm text-[#D24848] hover:text-[#B83A3A] font-medium">
            Ver todo el Historial
          </Link>
        </div>

        <div className="mt-auto p-4 border-t">
          <Link
            to="/verification"
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#D24848] hover:bg-[#B83A3A]"
          >
            Verificar Boleto
          </Link>
        </div>
      </div>
    </div>
  )
}
