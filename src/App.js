import React, { useState } from 'react';
import DeliveryHeader from './components/DeliveryHeader';
import DeliveryDashboard from './components/DeliveryDashboard';
import DeliveryOrders from './components/DeliveryOrders';
import DeliveryMap from './components/DeliveryMap';
import DeliverySettings from './components/DeliverySettings';
import DeliveryProfile from './components/DeliveryProfile';
import DeliveryFooter from './components/DeliveryFooter';
import AuthLogin from './components/AuthLogin';
import AuthRegister from './components/AuthRegister';
import AuthForgotPassword from './components/AuthForgotPassword';
import AdminSubscriptionPanel from './components/AdminSubscriptionPanel';

function App() {
  const [currentPage, setCurrentPage] = useState('login'); // Empezar en la página de login
  const [currentUser, setCurrentUser] = useState(null); // Para guardar el usuario logueado

  // Simulación de usuarios registrados (en una app real, esto vendría del backend)
  // Incluimos los datos que se guardarían en la DB para simular el comportamiento
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: '1', name: 'Admin', lastName: 'User', email: 'admin@admin', password: 'admin', role: 'admin', phone: '', transportType: null, availability: null, subscriptionActive: true, memberSince: '2023-01-01' }, // Admin por defecto
    { id: '2', name: 'Transportista', lastName: 'Ejemplo', email: 'transporter@example.com', password: 'transporter123', role: 'transporter', phone: '5512345678', transportType: 'Moto', availability: 'L-V 9-5', subscriptionActive: false, memberSince: '2023-01-05' },
    { id: '3', name: 'Cliente', lastName: 'Ejemplo', email: 'client@example.com', password: 'client123', role: 'customer', phone: '5598765432', transportType: null, availability: null, subscriptionActive: null, memberSince: '2023-01-15' },
  ]);

  // Estado para las suscripciones pendientes (para el admin)
  const [pendingSubscriptions, setPendingSubscriptions] = useState([]);

  const handleRegisterSuccess = (newUserData) => {
    // En una app real, el backend asignaría el ID y hashearía la contraseña
    const newUser = {
      id: (registeredUsers.length + 1).toString(), // ID simulado
      name: newUserData.first_name,
      lastName: newUserData.last_name,
      email: newUserData.email,
      password: newUserData.password, // Solo para simulación, NO en producción
      phone: newUserData.phone_number,
      role: newUserData.role,
      transportType: newUserData.transport_type,
      availability: newUserData.availability_schedule,
      subscriptionActive: newUserData.role === 'transporter' ? false : null,
      memberSince: new Date().toISOString().split('T')[0], // Fecha actual
    };
    setRegisteredUsers(prevUsers => [...prevUsers, newUser]);
    alert(`Usuario ${newUser.email} registrado con éxito!`);
  };

  const handleLoginSuccess = (user) => {
    // Aquí, el 'user' ya viene con todos los datos del backend, incluyendo el rol y estado de suscripción
    setCurrentUser(user);
    // Redirigir según el rol
    if (user.role === 'admin') {
      setCurrentPage('dashboard'); // Admin va al dashboard general
    } else {
      setCurrentPage('profile'); // Clientes y transportistas van a su perfil
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('authToken'); // Limpiar el token al cerrar sesión
    setCurrentPage('login');
    alert('Sesión cerrada correctamente.');
  };

  const handleAddPendingSubscription = (subscriptionData) => {
    setPendingSubscriptions(prev => [...prev, subscriptionData]);
  };

  const handleApproveSubscription = (subscriptionId, userId) => {
    // Simular aprobación: remover de pendientes y actualizar usuario a activo
    setPendingSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
    setRegisteredUsers(prevUsers => prevUsers.map(user => 
      user.id === userId ? { ...user, subscriptionActive: true } : user
    ));
    alert(`Suscripción ${subscriptionId} aprobada para el usuario ${userId}.`);
  };

  const handleRejectSubscription = (subscriptionId, userId) => {
    // Simular rechazo: remover de pendientes
    setPendingSubscriptions(prev => prev.filter(sub => sub.id !== subscriptionId));
    alert(`Suscripción ${subscriptionId} rechazada para el usuario ${userId}.`);
  };

  const renderPage = () => {
    // Si no hay usuario logueado, mostrar las páginas de autenticación
    if (!currentUser) {
      switch (currentPage) {
        case 'login':
          // Pasa la lista de usuarios registrados a AuthLogin para la simulación
          return <AuthLogin setCurrentPage={setCurrentPage} users={registeredUsers} onLoginSuccess={handleLoginSuccess} />;
        case 'register':
          return <AuthRegister setCurrentPage={setCurrentPage} onRegisterSuccess={handleRegisterSuccess} />;
        case 'forgotPassword':
          return <AuthForgotPassword setCurrentPage={setCurrentPage} />;
        default:
          // Por defecto, si no está logueado, va al login
          return <AuthLogin setCurrentPage={setCurrentPage} users={registeredUsers} onLoginSuccess={handleLoginSuccess} />;
      }
    }

    // Si hay usuario logueado, mostrar las páginas de la aplicación según el rol
    switch (currentPage) {
      case 'dashboard':
        // Solo el admin puede ver el dashboard general
        if (currentUser.role === 'admin') {
          return <DeliveryDashboard setCurrentPage={setCurrentPage} />;
        } else {
          alert('Acceso denegado. No tienes permisos para ver el dashboard general.');
          setCurrentPage('profile'); // Redirigir a su perfil si no es admin
          return null;
        }
      case 'orders':
        // Solo admin y transportista pueden ver todos los pedidos
        if (currentUser.role === 'admin' || currentUser.role === 'transporter') {
          return <DeliveryOrders statusFilter="all" />;
        } else {
          alert('Acceso denegado. No tienes permisos para ver todos los pedidos.');
          setCurrentPage('profile'); // Redirigir a su perfil si no tiene permisos
          return null;
        }
      case 'pendingOrders':
      case 'inRouteOrders':
      case 'completedOrders':
        // Estas vistas de pedidos filtrados también son para admin/transportista
        if (currentUser.role === 'admin' || currentUser.role === 'transporter') {
          return <DeliveryOrders statusFilter={currentPage.replace('Orders', '')} />;
        } else {
          alert('Acceso denegado. No tienes permisos para ver estos pedidos.');
          setCurrentPage('profile');
          return null;
        }
      case 'map':
        // Solo admin puede ver el mapa general
        if (currentUser.role === 'admin') {
          return <DeliveryMap />;
        } else {
          alert('Acceso denegado. No tienes permisos para ver el mapa general.');
          setCurrentPage('profile');
          return null;
        }
      case 'profile':
        // Pasa la función para añadir suscripciones pendientes al perfil
        return <DeliveryProfile currentUser={currentUser} onAddPendingSubscription={handleAddPendingSubscription} />; 
      case 'settings':
        return <DeliverySettings />;
      case 'adminSubscriptions': // Nueva ruta para el panel de admin
        if (currentUser.role === 'admin') {
          return (
            <AdminSubscriptionPanel 
              setCurrentPage={setCurrentPage} 
              pendingSubscriptions={pendingSubscriptions}
              onApproveSubscription={handleApproveSubscription}
              onRejectSubscription={handleRejectSubscription}
            />
          );
        } else {
          alert('Acceso denegado. No tienes permisos de administrador.');
          setCurrentPage('profile'); // Redirigir si no es admin
          return null;
        }
      default:
        // Si el usuario está logueado pero intenta ir a una página no definida o sin permisos
        return <DeliveryProfile currentUser={currentUser} />; // Redirigir a su perfil por defecto
    }
  };

  // Condicionalmente renderizar el Header y Footer solo si el usuario está logueado
  const showHeaderAndFooter = !!currentUser;

  return (
    <div className="min-h-screen flex flex-col">
      {showHeaderAndFooter && <DeliveryHeader currentPage={currentPage} setCurrentPage={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} />}
      <main className="flex-grow">
        {renderPage()}
      </main>
      {showHeaderAndFooter && <DeliveryFooter />}
    </div>
  );
}

export default App;