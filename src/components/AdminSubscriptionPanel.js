import React, { useState } from 'react';

const AdminSubscriptionPanel = ({ setCurrentPage, pendingSubscriptions, onApproveSubscription, onRejectSubscription }) => {
  // pendingSubscriptions se recibe ahora como prop desde App.js

  const handleApprove = (subscriptionId, userId) => {
    onApproveSubscription(subscriptionId, userId);
  };

  const handleReject = (subscriptionId, userId) => {
    onRejectSubscription(subscriptionId, userId);
  };

  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración - Suscripciones</h2>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Suscripciones Pendientes de Aprobación</h3>
        {pendingSubscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Suscripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transportista</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Pago</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprobante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sub.transporterName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sub.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${sub.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sub.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                      <a href={sub.proof} target="_blank" rel="noopener noreferrer">Ver</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleApprove(sub.id, sub.userId)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-150 mr-2"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleReject(sub.id, sub.userId)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-150"
                      >
                        Rechazar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No hay suscripciones pendientes de aprobación.</p>
        )}
      </div>
    </div>
  );
};

export default AdminSubscriptionPanel;