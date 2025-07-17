import React, { useState } from 'react';
import { defaultOrders } from '../mock/orders';
import { defaultDrivers } from '../mock/drivers'; // Importar los drivers

const DeliveryOrders = ({ statusFilter = 'all' }) => {
  const [orders, setOrders] = useState(defaultOrders);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('all'); // Estado para el filtro de repartidor
  const [orderType, setOrderType] = useState('all'); // Nuevo estado para el filtro de tipo de pedido

  const filteredOrders = orders.filter(order => {
    // Filtrar por estado
    let statusMatch = true;
    if (statusFilter === 'pending') statusMatch = order.status === 'Pendiente';
    else if (statusFilter === 'inRoute') statusMatch = order.status === 'En Ruta';
    else if (statusFilter === 'completed') statusMatch = order.status === 'Entregado';

    // Filtrar por fecha (asumiendo que cada orden tiene una propiedad 'createdAt' en formato 'YYYY-MM-DD')
    const orderDate = new Date(order.createdAt || '2023-01-01'); // Usar createdAt o una fecha por defecto
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    let dateMatch = true;
    if (start && orderDate < start) dateMatch = false;
    if (end && orderDate > end) dateMatch = false;

    // Filtrar por repartidor
    let driverMatch = true;
    if (selectedDriver !== 'all') {
      driverMatch = order.driver === selectedDriver;
    }

    // Filtrar por tipo de pedido (asumiendo que cada orden tiene una propiedad 'type')
    let typeMatch = true;
    if (orderType !== 'all') {
      typeMatch = order.type === orderType;
    }

    return statusMatch && dateMatch && driverMatch && typeMatch;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-red-100 text-red-800';
      case 'En Ruta':
        return 'bg-yellow-100 text-yellow-800';
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTitle = () => {
    switch (statusFilter) {
      case 'pending':
        return 'Pedidos Pendientes';
      case 'inRoute':
        return 'Pedidos en Ruta';
      case 'completed':
        return 'Pedidos Finalizados';
      case 'all':
      default:
        return 'Todos los Pedidos';
    }
  };

  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">{getTitle()}</h2>
      
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label htmlFor="startDate" className="text-gray-700 text-sm font-medium mb-2">Fecha de Inicio:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="endDate" className="text-gray-700 text-sm font-medium mb-2">Fecha Fin:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="driverFilter" className="text-gray-700 text-sm font-medium mb-2">Repartidor:</label>
          <select
            id="driverFilter"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          >
            <option value="all">Todos</option>
            {defaultDrivers.map(driver => (
              <option key={driver.id} value={driver.name}>{driver.name}</option>
            ))}
            <option value="Sin asignar">Sin asignar</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="orderTypeFilter" className="text-gray-700 text-sm font-medium mb-2">Tipo de Pedido:</label>
          <select
            id="orderTypeFilter"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          >
            <option value="all">Todos</option>
            <option value="Comida">Comida</option>
            <option value="Paquetería">Paquetería</option>
            <option value="Documentos">Documentos</option>
            <option value="Otros">Otros</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repartidor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.type || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.driver}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => alert(`Detalles del pedido ${order.id}`)}
                        className="text-black hover:text-gray-700 transition-colors duration-150 mr-3"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => alert(`Asignar repartidor a ${order.id}`)}
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                      >
                        Asignar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No hay pedidos en esta categoría con los filtros seleccionados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrders;