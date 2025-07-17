import React, { useState } from 'react';
import { defaultDrivers } from '../mock/drivers'; // Importar los drivers

const RequestOrderModal = ({ onClose, onSubmit }) => {
  const [orderDetails, setOrderDetails] = useState('');
  const [selectedTransportType, setSelectedTransportType] = useState('all');
  const [sortCriteria, setSortCriteria] = useState('reputation'); // 'reputation', 'time', 'deliveries'

  // Simular datos de transportistas con más detalles para los filtros
  // Filtrar solo transportistas con subscriptionActive: true
  const availableDrivers = defaultDrivers.filter(driver => {
    // En una app real, aquí se verificaría el estado de suscripción del transportista desde el backend
    // Por ahora, simulamos que todos los drivers en defaultDrivers están "activos" para la búsqueda
    return true; 
  }).map(driver => ({
    ...driver,
    reputation: Math.floor(Math.random() * 5) + 1, // Calificación de 1 a 5
    averageTime: Math.floor(Math.random() * 60) + 10, // Tiempo promedio en minutos
    totalDeliveries: Math.floor(Math.random() * 200) + 50, // Cantidad de entregas
  }));

  const filteredAndSortedDrivers = availableDrivers
    .filter(driver => {
      if (selectedTransportType === 'all') return true;
      return driver.transportType === selectedTransportType;
    })
    .sort((a, b) => {
      if (sortCriteria === 'reputation') {
        return b.reputation - a.reputation; // Mayor reputación primero
      } else if (sortCriteria === 'time') {
        return a.averageTime - b.averageTime; // Menor tiempo primero
      } else if (sortCriteria === 'deliveries') {
        return b.totalDeliveries - a.totalDeliveries; // Mayor cantidad de entregas primero
      }
      return 0;
    });

  const handleRequest = (driver) => {
    if (!orderDetails) {
      alert('Por favor, ingresa los detalles del pedido.');
      return;
    }
    onSubmit(orderDetails, driver);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Realizar Nuevo Pedido
        </h3>

        <div className="mb-6">
          <label htmlFor="orderDetails" className="block text-gray-700 text-sm font-medium mb-2">Detalles del Pedido:</label>
          <textarea
            id="orderDetails"
            value={orderDetails}
            onChange={(e) => setOrderDetails(e.target.value)}
            placeholder="Describe tu pedido (ej. 3 tacos al pastor, dirección de recogida, dirección de entrega)"
            rows="4"
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
          ></textarea>
        </div>

        <h4 className="text-xl font-bold text-gray-900 mb-4">Buscar Transportista</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="flex flex-col">
            <label htmlFor="transportTypeFilter" className="text-gray-700 text-sm font-medium mb-2">Tipo de Transporte:</label>
            <select
              id="transportTypeFilter"
              value={selectedTransportType}
              onChange={(e) => setSelectedTransportType(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
            >
              <option value="all">Todos</option>
              <option value="Taxi">Taxi</option>
              <option value="Transporte de Mercancía">Transporte de Mercancía</option>
              <option value="Encomienda">Encomienda</option>
              <option value="Moto">Moto</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-2">Ordenar por:</label>
            <button
              onClick={() => setSortCriteria('reputation')}
              className={`w-full py-2 rounded-lg transition-colors duration-200 ${
                sortCriteria === 'reputation' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Mejor Reputación
            </button>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-2 invisible">.</label> {/* Placeholder para alinear */}
            <button
              onClick={() => setSortCriteria('time')}
              className={`w-full py-2 rounded-lg transition-colors duration-200 ${
                sortCriteria === 'time' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Mejor Tiempo
            </button>
          </div>
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm font-medium mb-2 invisible">.</label> {/* Placeholder para alinear */}
            <button
              onClick={() => setSortCriteria('deliveries')}
              className={`w-full py-2 rounded-lg transition-colors duration-200 ${
                sortCriteria === 'deliveries' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Más Entregas
            </button>
          </div>
        </div>

        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-6">
          {filteredAndSortedDrivers.length > 0 ? (
            filteredAndSortedDrivers.map(driver => (
              <div key={driver.id} className="flex items-center justify-between p-3 mb-2 bg-gray-50 rounded-lg shadow-sm">
                <div>
                  <p className="font-bold text-gray-900">{driver.name} ({driver.transportType})</p>
                  <p className="text-sm text-gray-600">Calificación: {driver.reputation} ★</p>
                  <p className="text-sm text-gray-600">Tiempo Promedio: {driver.averageTime} min</p>
                  <p className="text-sm text-gray-600">Entregas: {driver.totalDeliveries}</p>
                </div>
                <button
                  onClick={() => handleRequest(driver)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Solicitar
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No se encontraron transportistas con los filtros seleccionados.</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestOrderModal;