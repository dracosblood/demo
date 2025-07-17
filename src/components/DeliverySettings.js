import React, { useState } from 'react';

const DeliverySettings = () => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveSettings = () => {
    alert('Configuración guardada:\nURL de Google Sheet: ' + sheetUrl + '\nAPI Key: ' + apiKey + '\nNotificaciones: ' + notificationsEnabled);
  };

  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Ajustes de la Aplicación</h2>
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Conexión con Google Sheets</h3>
        <div className="mb-4">
          <label htmlFor="sheetUrl" className="block text-gray-700 text-sm font-medium mb-2">URL de Google Sheet:</label>
          <input
            type="text"
            id="sheetUrl"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          />
          <p className="text-gray-500 text-xs mt-1">Introduce la URL completa de tu hoja de cálculo de Google.</p>
        </div>
        <div className="mb-6">
          <label htmlFor="apiKey" className="block text-gray-700 text-sm font-medium mb-2">Google API Key:</label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
          />
          <p className="text-gray-500 text-xs mt-1">Necesaria para acceder a los datos de tu hoja de cálculo.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Notificaciones</h3>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifications"
            checked={notificationsEnabled}
            onChange={(e) => setNotificationsEnabled(e.target.checked)}
            className="h-5 w-5 text-black rounded focus:ring-black"
          />
          <label htmlFor="notifications" className="ml-3 text-gray-700 text-base font-medium">Habilitar notificaciones push</label>
        </div>
        <p className="text-gray-500 text-xs mt-2">Recibe alertas en tiempo real sobre el estado de tus pedidos.</p>
      </div>

      <button
        onClick={handleSaveSettings}
        className="w-full sm:w-auto bg-black text-white py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors duration-300 shadow-md hover:shadow-lg"
      >
        Guardar Ajustes
      </button>
    </div>
  );
};

export default DeliverySettings;