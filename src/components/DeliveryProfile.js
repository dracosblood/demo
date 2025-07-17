import React, { useState } from 'react';
import { defaultOrders } from '../mock/orders'; // Importar los pedidos
import { defaultDrivers } from '../mock/drivers'; // Importar los drivers
import DeliveryRating from './DeliveryRating'; // Importar el componente de calificación
import RequestOrderModal from './RequestOrderModal'; // Importar el nuevo modal

// Contenido del archivo mysql_schema.sql como una cadena de texto
const mysqlSchemaContent = `
-- Este archivo contiene el esquema de la base de datos MySQL.
-- Puedes exportar este contenido y ejecutarlo en tu gestor de MySQL (phpMyAdmin, MySQL Workbench, etc.)
-- para crear las tablas necesarias.

-- Para exportar:
-- 1. Copia todo el contenido de este archivo.
-- 2. Pégalo en tu cliente MySQL (por ejemplo, la pestaña SQL en phpMyAdmin o una nueva query en MySQL Workbench).
-- 3. Ejecuta el script.

-- Tabla para Tipos de Transporte
CREATE TABLE IF NOT EXISTS transport_types (
    transport_type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar tipos de transporte predefinidos
INSERT IGNORE INTO transport_types (type_name) VALUES
('Taxi'),
('Transporte de Mercancía'),
('Encomienda'),
('Moto');

-- Tabla para Usuarios (principal)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Almacenar hashes de contraseñas, no contraseñas en texto plano
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(20),
    role ENUM('admin', 'transporter', 'customer') DEFAULT 'customer', -- Roles actualizados
    address VARCHAR(255),
    member_since DATE DEFAULT (CURRENT_DATE),
    -- Campos específicos para transportistas (se pueden mover a una tabla 'transporter_profiles' si hay muchos campos)
    transport_type_id INT,
    availability_schedule TEXT,
    subscription_active BOOLEAN DEFAULT FALSE, -- Para la suscripción del transportista
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transport_type_id) REFERENCES transport_types(transport_type_id) ON DELETE SET NULL
);

-- Tabla para Tipos de Pedido
CREATE TABLE IF NOT EXISTS order_types (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Insertar tipos de pedido predefinidos
INSERT IGNORE INTO order_types (type_name) VALUES
('Comida'),
('Paquetería'),
('Documentos'),
('Otros');

-- Tabla para Repartidores (ahora más ligada a users, pero mantenemos driver_id para consistencia con orders)
-- Esta tabla podría ser redundante si toda la info del driver está en 'users' y 'users.role' es 'transporter'.
-- Se mantiene para simular la estructura de los mocks y la relación con 'orders'.
CREATE TABLE IF NOT EXISTS drivers (
    driver_id VARCHAR(255) PRIMARY KEY, -- Usar un ID alfanumérico para consistencia con mocks
    user_id INT UNIQUE NOT NULL, -- Relación directa con la tabla users
    name VARCHAR(255) NOT NULL, -- Redundante pero útil para reportes rápidos
    phone_number VARCHAR(20), -- Redundante
    status ENUM('Disponible', 'En Servicio', 'Fuera de Servicio') NOT NULL,
    current_location VARCHAR(255), -- Simula la ubicación actual
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabla para Pedidos (general)
CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(255) PRIMARY KEY, -- Usar un ID alfanumérico para consistencia con mocks
    customer_user_id INT NOT NULL, -- Relación con la tabla users (cliente que hizo el pedido)
    customer_name VARCHAR(255) NOT NULL, -- Redundante pero útil para reportes rápidos
    customer_address VARCHAR(255) NOT NULL,
    status ENUM('Pendiente', 'En Ruta', 'Entregado', 'Cancelado') NOT NULL,
    driver_id VARCHAR(255), -- Relación con la tabla drivers
    order_type_id INT, -- Relación con la tabla order_types
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE SET NULL,
    FOREIGN KEY (order_type_id) REFERENCES order_types(type_id) ON DELETE SET NULL
);

-- Tabla para Detalles del Pedido (información adicional, incluyendo transportista)
CREATE TABLE IF NOT EXISTS order_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255) UNIQUE NOT NULL, -- Relación con la tabla orders
    item_description TEXT,
    special_instructions TEXT,
    estimated_delivery_time DATETIME,
    actual_delivery_time DATETIME,
    driver_notes TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Tabla para Calificaciones de Pedidos
CREATE TABLE IF NOT EXISTS order_ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(255) NOT NULL,
    user_id INT NOT NULL, -- Usuario que dio la calificación
    driver_id VARCHAR(255), -- Repartidor que recibió la calificación (opcional, si la calificación es para el repartidor)
    stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE SET NULL
);

-- Tabla para Pagos de Suscripción de Transportistas
CREATE TABLE IF NOT EXISTS subscriptions (
    subscription_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- Transportista que realiza el pago
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    proof_of_payment_url VARCHAR(255), -- URL del comprobante de pago
    status ENUM('Pendiente', 'Aprobado', 'Rechazado') DEFAULT 'Pendiente',
    approved_by_user_id INT, -- Administrador que aprobó
    approval_date TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_user_id) REFERENCES users(user_id) ON DELETE SET NULL
);


-- Tablas de estado de pedidos (para vistas rápidas o reportes específicos)
CREATE TABLE IF NOT EXISTS pending_orders (
    order_id VARCHAR(255) PRIMARY KEY,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS in_route_orders (
    order_id VARCHAR(255) PRIMARY KEY,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS delivered_orders (
    order_id VARCHAR(255) PRIMARY KEY,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);

-- Índices para optimización de consultas
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_driver_id ON orders (driver_id);
CREATE INDEX idx_orders_type_id ON orders (order_type_id);
CREATE INDEX idx_drivers_status ON drivers (status);
CREATE INDEX idx_drivers_transport_type_id ON drivers (transport_type_id);
CREATE INDEX idx_order_ratings_order_id ON order_ratings (order_id);
CREATE INDEX idx_order_ratings_user_id ON order_ratings (user_id);
CREATE INDEX idx_order_ratings_driver_id ON order_ratings (driver_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions (user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions (status);


-- Ejemplo de inserción de datos (para pruebas)
-- Insertar usuarios
INSERT IGNORE INTO users (user_id, username, email, password_hash, first_name, last_name, phone_number, role, address, member_since, transport_type_id, availability_schedule, subscription_active) VALUES
(1, 'admin_user', 'admin@example.com', '$2a$10$abcdefghijklmnopqrstuvwxy.ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 'Admin', 'User', NULL, 'admin', NULL, '2023-01-01', NULL, NULL, TRUE),
(2, 'transporter_user', 'transporter@example.com', '$2a$10$abcdefghijklmnopqrstuvwxy.ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 'Transportista', 'Ejemplo', '5512345678', 'transporter', NULL, '2023-01-05', (SELECT transport_type_id FROM transport_types WHERE type_name = 'Moto'), 'Lunes a Viernes 9 AM - 5 PM', FALSE),
(3, 'client_user', 'client@example.com', '$2a$10$abcdefghijklmnopqrstuvwxy.ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 'Cliente', 'Ejemplo', '55-1234-5678', 'customer', 'Calle Falsa 123, Colonia Centro, CDMX', '2023-01-15', NULL, NULL, NULL);

-- Insertar repartidores (ligados a usuarios)
INSERT IGNORE INTO drivers (driver_id, user_id, name, phone_number, status, current_location) VALUES
('DRV001', (SELECT user_id FROM users WHERE username = 'transporter_user'), 'Transportista Ejemplo', '5512345678', 'En Servicio', 'Lat: 19.4326, Lng: -99.1332'),
('DRV002', (SELECT user_id FROM users WHERE username = 'client_user'), 'María López', '5587654321', 'Disponible', 'Lat: 19.4000, Lng: -99.1500'); -- Este no está ligado a un user_id para simular un caso

-- Insertar pedidos
INSERT IGNORE INTO orders (order_id, customer_user_id, customer_name, customer_address, status, driver_id, order_type_id, created_at) VALUES
('ORD001', (SELECT user_id FROM users WHERE username = 'client_user'), 'Cliente Ejemplo', 'Av. Siempre Viva 742', 'Pendiente', NULL, (SELECT type_id FROM order_types WHERE type_name = 'Comida'), '2023-10-26 10:00:00'),
('ORD002', (SELECT user_id FROM users WHERE username = 'client_user'), 'Cliente Ejemplo', 'Calle Falsa 123', 'En Ruta', 'DRV001', (SELECT type_id FROM order_types WHERE type_name = 'Paquetería'), '2023-10-25 11:30:00'),
('ORD003', (SELECT user_id FROM users WHERE username = 'client_user'), 'Blvd. de los Sueños 456', 'Entregado', 'DRV002', (SELECT type_id FROM order_types WHERE type_name = 'Documentos'), '2023-10-24 14:00:00');

-- Insertar detalles de pedidos
INSERT IGNORE INTO order_details (order_id, item_description, special_instructions, estimated_delivery_time, actual_delivery_time, driver_notes) VALUES
('ORD001', '3 tacos al pastor, 1 coca cola', 'Con mucha salsa verde', '2023-10-26 11:00:00', NULL, NULL),
('ORD002', 'Paquete pequeño', 'Entregar en recepción', '2023-10-25 12:00:00', '2023-10-25 11:55:00', 'Cliente muy amable');

-- Insertar calificaciones de pedidos (ejemplo)
INSERT IGNORE INTO order_ratings (order_id, user_id, driver_id, stars, comment) VALUES
('ORD003', (SELECT user_id FROM users WHERE username = 'client_user'), 'DRV002', 5, 'Excelente servicio, el repartidor fue muy amable y rápido.');

-- Actualizar tablas de estado (simulado, en un sistema real esto sería automático por triggers o lógica de negocio)
INSERT IGNORE INTO pending_orders (order_id) VALUES ('ORD001');
INSERT IGNORE INTO in_route_orders (order_id) VALUES ('ORD002');
INSERT IGNORE INTO delivered_orders (order_id) VALUES ('ORD003');
`;

const DeliveryProfile = ({ currentUser, onAddPendingSubscription }) => { // Recibe el usuario actual y la función de aprobación
  // Usamos el currentUser pasado por props
  const [user, setUser] = useState(currentUser);

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrderToRate, setSelectedOrderToRate] = useState(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [currentRatingComment, setCurrentRatingComment] = useState('');

  const [showPaymentModal, setShowPaymentModal] = useState(false); // Nuevo estado para el modal de pago
  const [paymentProofUrl, setPaymentProofUrl] = useState(''); // Estado para la URL del comprobante

  const [showRequestOrderModal, setShowRequestOrderModal] = useState(false); // Estado para el modal de solicitud de pedido
  const [showSqlModal, setShowSqlModal] = useState(false); // Estado para el modal de SQL

  // Filtrar los pedidos del usuario actual (simulado)
  // Para clientes: pedidos donde el customer_name coincide con el nombre del usuario
  // Para transportistas: pedidos donde el driver_name coincide con el nombre del usuario
  const userOrders = defaultOrders.filter(order => {
    if (user.role === 'customer') {
      return order.customer === user.name;
    } else if (user.role === 'transporter') {
      return order.driver === user.name;
    }
    return false; // Admin no ve pedidos aquí
  });

  // Estadísticas para transportistas (simuladas)
  const transporterStats = {
    totalDeliveries: userOrders.filter(order => order.status === 'Entregado').length,
    averageRating: userOrders.filter(order => order.rating).reduce((acc, order) => acc + order.rating, 0) / userOrders.filter(order => order.rating).length || 0,
    deliveriesInRoute: userOrders.filter(order => order.status === 'En Ruta').length,
  };

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

  const handleViewDetails = (orderId) => {
    const order = defaultOrders.find(o => o.id === orderId); // Buscar en todos los pedidos
    if (order) {
      const driverInfo = defaultDrivers.find(d => d.name === order.driver);
      let details = `Detalles del Pedido ${order.id}:\n`;
      details += `Cliente: ${order.customer}\n`;
      details += `Dirección: ${order.address}\n`;
      details += `Tipo de Pedido: ${order.type || 'N/A'}\n`;
      details += `Estado: ${order.status}\n`;
      details += `Fecha de Realización: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}\n`;
      details += `Repartidor: ${order.driver || 'Sin asignar'}\n`;
      if (driverInfo) {
        details += `Teléfono del Repartidor: ${driverInfo.phone}\n`;
        details += `Estado del Repartidor: ${driverInfo.status}\n`;
      } else if (order.driver !== 'Sin asignar') {
        details += `Información del repartidor no disponible.\n`;
      }
      if (order.rating) {
        details += `Calificación: ${order.rating} estrellas (${order.ratingComment})\n`;
      }
      alert(details);
    }
  };

  const handleRateOrderClick = (order) => {
    setSelectedOrderToRate(order);
    setCurrentRating(order.rating || 0); // Si ya tiene calificación, la muestra
    setCurrentRatingComment(order.ratingComment || '');
    setShowRatingModal(true);
  };

  const handleRatingSubmit = () => {
    if (selectedOrderToRate && currentRating > 0) {
      // Aquí simularíamos el envío de la calificación a la base de datos
      alert(`Calificación enviada para el pedido ${selectedOrderToRate.id}:\nEstrellas: ${currentRating}\nComentario: ${currentRatingComment}`);
      
      // Actualizar el mock data para reflejar la calificación (solo para demostración)
      // En una app real, esto se manejaría con un estado global o recargando datos del backend
      
      setShowRatingModal(false);
      setSelectedOrderToRate(null);
      setCurrentRating(0);
      setCurrentRatingComment('');
    } else {
      alert('Por favor, selecciona una calificación.');
    }
  };

  const handleOpenPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const handleSendPaymentProof = async () => {
    if (!paymentProofUrl) {
      alert('Por favor, ingresa la URL del comprobante de pago.');
      return;
    }
    alert(`Simulando envío de comprobante de pago: ${paymentProofUrl}. El administrador lo revisará.`);
    try {
      // Simulación de llamada a un endpoint de backend para enviar comprobante
      // const response = await fetch('/api/transporters/validate-payment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('authToken')}` },
      //   body: JSON.stringify({ userId: user.id, proofUrl: paymentProofUrl }) // Enviar ID de usuario y URL del comprobante
      // });
      // const data = await response.json();

      const data = await new Promise(resolve => setTimeout(() => {
        // Simular respuesta del backend
        if (Math.random() > 0.3) { // 70% de éxito
          resolve({ success: true, message: 'Comprobante enviado. Pendiente de aprobación.' });
        } else {
          resolve({ success: false, message: 'Error al enviar comprobante. Intenta de nuevo.' });
        }
      }, 1000));

      if (data.success) {
        alert(data.message);
        // Actualizar el estado local del usuario para reflejar que el pago está pendiente
        setUser(prevUser => ({ ...prevUser, subscriptionActive: false })); 
        setShowPaymentModal(false);
        setPaymentProofUrl('');
        // Notificar a App.js para agregar esta suscripción a la lista de pendientes del admin
        onAddPendingSubscription({ 
          id: `SUB${Math.floor(Math.random() * 100000)}`, // ID único simulado
          transporterName: user.name,
          email: user.email,
          amount: 50.00, // Monto simulado
          date: new Date().toISOString().split('T')[0],
          proof: paymentProofUrl,
          userId: user.id,
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error al validar pago:', error);
      alert('Ocurrió un error al intentar validar el pago. Intenta de nuevo más tarde.');
    }
  };

  const handleRequestOrder = () => {
    setShowRequestOrderModal(true);
  };

  const handleOrderRequestSubmit = (orderDetails, selectedTransporter) => {
    alert(`Pedido solicitado:\nDetalles: ${orderDetails}\nTransportista: ${selectedTransporter.name}`);
    setShowRequestOrderModal(false);
  };

  const handleShowSql = () => {
    setShowSqlModal(true);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(mysqlSchemaContent)
      .then(() => alert('Código SQL copiado al portapapeles.'))
      .catch(err => console.error('Error al copiar el SQL:', err));
  };

  return (
    <div className="p-6 pt-24 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h2>
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-4xl font-bold mr-6">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-2">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="mb-4">
            <p className="text-gray-500 text-sm font-medium">Teléfono:</p>
            <p className="text-gray-800 text-lg">{user.phone}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-500 text-sm font-medium">Dirección Principal:</p>
            <p className="text-gray-800 text-lg">{user.address}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-500 text-sm font-medium">Miembro desde:</p>
            <p className="text-gray-800 text-lg">{new Date(user.memberSince || '2023-01-01').toLocaleDateString('es-MX')}</p>
          </div>

          {user.role === 'transporter' && (
            <>
              <div className="mb-4">
                <p className="text-gray-500 text-sm font-medium">Tipo de Transporte:</p>
                <p className="text-gray-800 text-lg">{user.transportType || 'N/A'}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-500 text-sm font-medium">Horario de Disponibilidad:</p>
                <p className="text-gray-800 text-lg">{user.availability || 'N/A'}</p>
              </div>
              <div className="mb-4">
                <p className="text-gray-500 text-sm font-medium">Suscripción:</p>
                {user.subscriptionActive ? (
                  <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">Activa</span>
                ) : (
                  <span className="inline-block bg-red-100 text-red-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">Inactiva / Pendiente de Aprobación</span>
                )}
                {!user.subscriptionActive && (
                  <button
                    onClick={handleOpenPaymentModal}
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors duration-300 shadow-md"
                  >
                    Validar Pago de Suscripción
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <button
          onClick={() => alert('Funcionalidad de editar perfil en desarrollo')}
          className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Editar Perfil
        </button>

        {user.role === 'admin' && (
          <button
            onClick={handleShowSql}
            className="w-full mt-4 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Mostrar SQL de la Base de Datos
          </button>
        )}
      </div>

      {user.role === 'transporter' && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Estadísticas de Repartidor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-500 text-sm">Envíos Realizados</p>
              <p className="text-3xl font-bold text-gray-900">{transporterStats.totalDeliveries}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Calificación Promedio</p>
              <p className="text-3xl font-bold text-gray-900">{transporterStats.averageRating.toFixed(1)} <span className="text-yellow-400">★</span></p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Envíos en Ruta</p>
              <p className="text-3xl font-bold text-gray-900">{transporterStats.deliveriesInRoute}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {user.role === 'customer' ? 'Mis Pedidos' : 'Mis Envíos'}
        </h3>
        {userOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  {user.role === 'customer' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calificación</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.type || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    {user.role === 'customer' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.rating ? (
                          <DeliveryRating initialRating={order.rating} readOnly={true} />
                        ) : (
                          <span className="text-gray-500">Sin calificar</span>
                        )}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(order.id)}
                        className="text-black hover:text-gray-700 transition-colors duration-150 mr-3"
                      >
                        Ver Detalles
                      </button>
                      {user.role === 'customer' && order.status === 'Entregado' && (
                        <button
                          onClick={() => handleRateOrderClick(order)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-150"
                        >
                          {order.rating ? 'Editar Calificación' : 'Calificar'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No tienes pedidos registrados aún.</p>
        )}
      </div>

      {/* Botón para realizar pedido (visible para clientes y transportistas) */}
      {(user.role === 'customer' || user.role === 'transporter') && (
        <div className="mt-8 text-center">
          <button
            onClick={handleRequestOrder}
            className="bg-black text-white py-3 px-8 rounded-xl hover:bg-gray-800 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Realizar Nuevo Pedido
          </button>
        </div>
      )}

      {/* Modal de Calificación */}
      {showRatingModal && selectedOrderToRate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Calificar Pedido {selectedOrderToRate.id}
            </h3>
            <div className="flex flex-col items-center mb-6">
              <DeliveryRating 
                initialRating={currentRating} 
                onRatingChange={(rating, comment) => {
                  setCurrentRating(rating);
                  setCurrentRatingComment(comment);
                }} 
              />
              <textarea
                className="w-full mt-4 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
                rows="3"
                placeholder="Comentarios adicionales (opcional)"
                value={currentRatingComment}
                onChange={(e) => setCurrentRatingComment(e.target.value)}
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowRatingModal(false)}
                className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleRatingSubmit}
                className="px-6 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Enviar Calificación
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Comprobante de Pago */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Subir Comprobante de Pago
            </h3>
            <div className="mb-6">
              <label htmlFor="paymentProof" className="block text-gray-700 text-sm font-medium mb-2">URL del Comprobante:</label>
              <input
                type="text"
                id="paymentProof"
                value={paymentProofUrl}
                onChange={(e) => setPaymentProofUrl(e.target.value)}
                placeholder="https://ejemplo.com/comprobante.jpg"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              />
              <p className="text-gray-500 text-xs mt-1">Ingresa la URL de la imagen de tu comprobante de pago.</p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendPaymentProof}
                className="px-6 py-2 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors"
              >
                Enviar Comprobante
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de SQL */}
      {showSqlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl h-3/4 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Esquema de la Base de Datos (MySQL)
            </h3>
            <div className="flex-grow overflow-auto bg-gray-100 p-4 rounded-lg mb-4">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">{mysqlSchemaContent}</pre>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCopySql}
                className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Copiar al Portapapeles
              </button>
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Solicitud de Pedido */}
      {showRequestOrderModal && (
        <RequestOrderModal 
          onClose={() => setShowRequestOrderModal(false)} 
          onSubmit={handleOrderRequestSubmit} 
          drivers={defaultDrivers} // Pasamos los drivers disponibles
        />
      )}
    </div>
  );
};

export default DeliveryProfile;