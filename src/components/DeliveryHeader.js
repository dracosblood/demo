import React, { useState } from 'react';

const MenuIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className="h-8 w-8">
    <line x1='3' y1='6' x2='21' y2='6'></line>
    <line x1='3' y1='12' x2='21' y2='12'></line>
    <line x1='3' y1='18' x2='21' y2='18'></line>
  </svg>
);

const XIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className="h-8 w-8">
    <line x1='18' y1='6' x2='6' y2='18'></line>
    <line x1='6' y1='6' x2='18' y2='18'></line>
  </svg>
);

const HomeIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className="h-6 w-6">
    <path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'></path>
    <polyline points='9,22 9,12 15,12 15,22'></polyline>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className="h-6 w-6">
    <circle cx='9' cy='21' r='1'></circle>
    <circle cx='20' cy='21' r='1'></circle>
    <path d='m1 1 4 4 4.867 14.86a1 1 0 0 0 .99.82h9.286a1 1 0 0 0 .99-.82L23 6H6'></path>
  </svg>
);

const CogIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className="h-6 w-6">
    <circle cx='12' cy='12' r='3'></circle>
    <path d='M12 1v6m0 6v6m11-7h-6m-6 0H1m5.64-7.64l4.24 4.24m6.36 6.36l4.24 4.24M6.64 17.64l4.24-4.24m6.36-6.36l4.24-4.24'></path>
  </svg>
);

const MapIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className="h-6 w-6">
    <polygon points='1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6'></polygon>
    <line x1='8' y1='2' x2='8' y2='18'></line>
    <line x1='16' y1='6' x2='16' y2='22'></line>
  </svg>
);

const UserIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className="h-6 w-6">
    <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'></path>
    <circle cx='12' cy='7' r='4'></circle>
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className="h-6 w-6">
    <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'></path>
    <polyline points='17 16 22 12 17 8'></polyline>
    <line x1='22' y1='12' x2='10' y2='12'></line>
  </svg>
);


const DeliveryHeader = ({ currentPage, setCurrentPage, currentUser, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProfileMenuOpen(false); // Cerrar menú de perfil si se abre el hamburguesa
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    setIsMenuOpen(false); // Cerrar menú hamburguesa si se abre el de perfil
  };

  const navigateAndClose = (page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-md z-10 shadow-sm p-4 flex justify-between items-center border-b border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900">DeliveryExpress</h1>
      
      {/* Navegación principal para pantallas grandes */}
      <nav className="hidden md:flex space-x-4">
        {currentUser && currentUser.role === 'admin' && (
          <button
            onClick={() => navigateAndClose('dashboard')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentPage === 'dashboard'
                ? 'bg-black text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Inicio
          </button>
        )}
        {currentUser && (currentUser.role === 'admin' || currentUser.role === 'transporter') && (
          <button
            onClick={() => navigateAndClose('orders')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentPage === 'orders'
                ? 'bg-black text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pedidos
          </button>
        )}
        {currentUser && currentUser.role === 'admin' && (
          <button
            onClick={() => navigateAndClose('map')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentPage === 'map'
                ? 'bg-black text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Mapa
          </button>
        )}
        {currentUser && currentUser.role === 'admin' && (
          <button
            onClick={() => navigateAndClose('adminSubscriptions')}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              currentPage === 'adminSubscriptions'
                ? 'bg-black text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Admin
          </button>
        )}
      </nav>

      {/* Sección de usuario y menú hamburguesa para móviles */}
      <div className="flex items-center space-x-4">
        {currentUser && (
          <div className="relative">
            <button onClick={toggleProfileMenu} className="flex items-center space-x-2 text-gray-700 hover:text-black">
              <span className="hidden sm:block font-medium">
                {currentUser.name} ({currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)})
              </span>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold">
                {currentUser.name.charAt(0)}
              </div>
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20 border border-gray-200">
                <button
                  onClick={() => navigateAndClose('profile')}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>Mi Perfil</span>
                </button>
                <button
                  onClick={() => navigateAndClose('settings')}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <CogIcon className="h-5 w-5" />
                  <span>Ajustes</span>
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogoutIcon className="h-5 w-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Menú hamburguesa para móviles */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 hover:text-black">
            {isMenuOpen ? (
              <XIcon />
            ) : (
              <MenuIcon />
            )}
          </button>
        </div>
      </div>

      {/* Menú desplegable para móviles (cuando se activa el hamburguesa) */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 border-t border-gray-200">
          <button
            onClick={() => navigateAndClose('dashboard')}
            className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-3 border-l-4 border-blue-500"
          >
            <HomeIcon />
            <span>Inicio</span>
          </button>
          <button
            onClick={() => navigateAndClose('orders')}
            className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-3 border-l-4 border-green-500"
          >
            <ShoppingCartIcon />
            <span>Pedidos</span>
          </button>
          <button
            onClick={() => navigateAndClose('map')}
            className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-3 border-l-4 border-purple-500"
          >
            <MapIcon />
            <span>Mapa</span>
          </button>
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => navigateAndClose('adminSubscriptions')}
              className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-3 border-l-4 border-yellow-500"
            >
              <CogIcon /> {/* Usamos CogIcon para Admin en el menú móvil */}
              <span>Admin</span>
            </button>
          )}
          <button
            onClick={() => navigateAndClose('profile')}
            className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-3 border-l-4 border-red-500"
          >
            <UserIcon />
            <span>Perfil</span>
          </button>
          <button
            onClick={() => navigateAndClose('settings')}
            className="w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-100 flex items-center space-x-3 border-l-4 border-orange-500"
          >
            <CogIcon />
            <span>Ajustes</span>
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={onLogout}
            className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 flex items-center space-x-3 border-l-4 border-red-600"
          >
            <LogoutIcon />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default DeliveryHeader;