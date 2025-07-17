import React from 'react';

const DeliveryFooter = () => {
  return (
    <footer className="bg-gray-900 text-white p-6 text-center text-sm mt-10">
      <p>&copy; {new Date().getFullYear()} DeliveryExpress. Todos los derechos reservados.</p>
      <p className="mt-2">Diseñado con pasión por Nerd IA.</p>
    </footer>
  );
};

export default DeliveryFooter;