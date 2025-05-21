"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEthereum } from "../context/EthereumContext";
import {
  ChevronDown,
  Send,
  HelpCircle,
  MessageSquare,
  Phone,
} from "lucide-react";

const faqs = [
  {
    question: "¿Cómo funciona la verificación de boletos con blockchain?",
    answer:
      "Cada boleto se emite como un NFT (Token No Fungible) en la blockchain de Ethereum. Esto garantiza que cada boleto sea único y verificable. Al escanear el código QR, se verifica la autenticidad del boleto directamente en la blockchain, lo que hace imposible la falsificación.",
  },
  {
    question: "¿Qué necesito para comprar un boleto?",
    answer:
      "Para comprar un boleto necesitas una wallet de Ethereum como MetaMask configurada en la red de prueba Goerli. No necesitas ETH real, solo ETH de prueba que puedes obtener gratuitamente en un faucet de Goerli.",
  },
  {
    question: "¿Puedo transferir mi boleto a otra persona?",
    answer:
      "Sí, al ser un NFT, puedes transferir tu boleto a cualquier otra dirección de Ethereum. Sin embargo, debes tener en cuenta que la empresa de transporte puede requerir identificación que coincida con el comprador original.",
  },
  {
    question: "¿Qué pasa si pierdo mi teléfono o acceso a mi wallet?",
    answer:
      "Si pierdes acceso a tu wallet, puedes recuperarla usando tu frase semilla (seed phrase). Es importante que guardes esta frase en un lugar seguro. Si no puedes recuperar tu wallet, no podrás acceder a tus boletos.",
  },
  {
    question: "¿Cómo puedo obtener un reembolso?",
    answer:
      'Las políticas de reembolso dependen de cada empresa de transporte. En general, debes contactar directamente con la empresa y proporcionar el ID de tu boleto NFT. Si el reembolso es aprobado, el boleto será marcado como "reembolsado" en la blockchain.',
  },
];

export default function Support() {
  const navigate = useNavigate();
  const { isConnected, connect } = useEthereum();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Esta funcionalidad simularía el envío del formulario de contacto.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleReportIncident = async () => {
    if (!isConnected) {
      try {
        await connect();
      } catch {
        alert("Necesitas conectar tu wallet para reportar incidencias.");
        return;
      }
    }
    navigate("/verification");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-6">
          <h1 className="text-2xl font-bold text-white">Soporte y Contacto</h1>
          <p className="text-gray-300">
            Estamos aquí para ayudarte con cualquier duda o problema
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 text-[#D24848] mr-2" />
                Contáctanos
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {["name", "email", "subject"].map((field) => (
                  <div key={field}>
                    <label
                      htmlFor={field}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {field === "name"
                        ? "Nombre completo"
                        : field === "email"
                        ? "Correo electrónico"
                        : "Asunto"}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      id={field}
                      name={field}
                      value={formData[field ]}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] p-2 sm:text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-[#D24848] focus:border-[#D24848] p-2 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="flex justify-center items-center px-4 py-2 bg-[#D24848] text-white rounded-md hover:bg-[#B83A3A] transition-colors duration-200"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Enviar Mensaje
                </button>

                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                    <Phone className="h-4 w-4 text-[#D24848] mr-2" />
                    Contacto directo
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Teléfono: +593 2 123 4567
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Email: soporte@boletoexpress.ec
                  </p>
                  <p className="text-sm text-gray-600">
                    Horario: Lunes a Viernes, 8:00 – 18:00
                  </p>
                </div>
              </form>
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 text-[#D24848] mr-2" />
                Preguntas Frecuentes
              </h2>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border rounded-md overflow-hidden">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center p-4 text-left"
                    >
                      <span className="font-medium text-gray-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transition-transform ${
                          expandedFaq === idx ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {expandedFaq === idx && (
                      <div className="p-4 bg-gray-50 border-t">
                        <p className="text-sm text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleReportIncident}
                className="mt-6 w-full flex justify-center items-center px-4 py-3 bg-[#D24848] text-white rounded-md hover:bg-[#B83A3A] transition-colors duration-200"
              >
                Reportar Incidencia
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
