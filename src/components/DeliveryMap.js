import React from 'react';

const DeliveryMap = () => {
  // Este es un placeholder para el mapa interactivo.
  // En una aplicación real, aquí integrarías una librería de mapas como Google Maps API o Leaflet.
  // Por ahora, simulamos un mapa con un iframe de Google Maps.
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.5900000000002!2d-99.1687!3d19.4326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1f8d2b1f8d2b1%3A0x85d1f8d2b1f8d2b1!2sMexico%20City%2C%20CDMX%2C%20Mexico!5e0!3m2!1sen!2sus!4v1678901234567!5m2!1sen!2sus";

  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Mapa de Entregas</h2>
      <div className="bg-white rounded-2xl shadow-lg p-6 h-[600px] flex items-center justify-center overflow-hidden">
        <iframe
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0, borderRadius: '1rem' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de Entregas"
        ></iframe>
      </div>
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Leyenda del Mapa</h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            <span className="w-4 h-4 bg-red-500 rounded-full mr-3"></span>
            <span className="text-gray-700">Pedidos Pendientes</span>
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></span>
            <span className="text-gray-700">Pedidos en Ruta</span>
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 bg-green-500 rounded-full mr-3"></span>
            <span className="text-gray-700">Pedidos Entregados</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DeliveryMap;