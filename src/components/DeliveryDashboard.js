import React from 'react';

const DeliveryDashboard = ({ setCurrentPage }) => {
  const stats = [
    { label: 'Pedidos Pendientes', value: 5, color: 'bg-red-500', page: 'pendingOrders' },
    { label: 'Pedidos en Ruta', value: 12, color: 'bg-yellow-500', page: 'inRouteOrders' },
    { label: 'Pedidos Entregados Hoy', value: 45, color: 'bg-green-500', page: 'completedOrders' },
    { label: 'Usuarios Registrados', value: 150, color: 'bg-purple-500', page: 'dashboard' }, // Simulado
  ];

  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Panel de Control</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(stat.page)}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start transition-all duration-300 hover:shadow-xl hover:scale-105 text-left"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 ${stat.color}`}>
              {stat.value.toString().charAt(0)}
            </div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-2">{stat.label}</p>
            <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => setCurrentPage('orders')}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Ver Todos los Pedidos
          </button>
          <button
            onClick={() => setCurrentPage('adminSubscriptions')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Gestionar Suscripciones
          </button>
          <button
            onClick={() => alert('Funcionalidad de nuevo pedido en desarrollo')}
            className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Crear Nuevo Pedido
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Últimas Actividades</h3>
        <ul className="space-y-4">
          <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Pedido #1001 entregado por Juan Pérez</span>
            <span className="text-gray-500 text-sm">Hace 5 minutos</span>
          </li>
          <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Nuevo pedido #1002 asignado a María López</span>
            <span className="text-gray-500 text-sm">Hace 15 minutos</span>
          </li>
          <li className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700">Ruta optimizada para 3 pedidos</span>
            <span className="text-gray-500 text-sm">Hace 30 minutos</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DeliveryDashboard;