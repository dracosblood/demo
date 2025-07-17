import React, { useState } from 'react';

// Recibe 'users' como prop para simular la base de datos de usuarios
const AuthLogin = ({ setCurrentPage, users, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Simulación de llamada a un endpoint de backend para login
      // En una aplicación real, usarías fetch o axios para hacer la petición HTTP
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();

      // --- SIMULACIÓN DE VERIFICACIÓN DE CREDENCIALES EN EL FRONTEND ---
      const userFound = users.find(user => user.email === email && user.password === password);

      if (userFound) {
        // Simular que el backend devuelve un token y el objeto de usuario
        const data = { success: true, user: userFound, token: `fake-token-${userFound.id}` };
        
        localStorage.setItem('authToken', data.token);
        onLoginSuccess(data.user); // Pasa el usuario logueado a App.js
        alert(`¡Inicio de sesión exitoso como ${data.user.role}!`);
        
        // Redirigir según el rol
        if (data.user.role === 'admin') {
          setCurrentPage('dashboard'); // Admin va al dashboard general
        } else {
          setCurrentPage('profile'); // Clientes y transportistas van a su perfil
        }
      } else {
        alert('Credenciales incorrectas o usuario no registrado. Intenta de nuevo.');
      }
      // --- FIN SIMULACIÓN ---

    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Ocurrió un error al intentar iniciar sesión. Intenta de nuevo más tarde.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu_correo@ejemplo.com"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Entrar
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          <button
            onClick={() => setCurrentPage('forgotPassword')}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </p>
        <p className="text-center text-gray-600 mt-2">
          ¿No tienes una cuenta?{' '}
          <button
            onClick={() => setCurrentPage('register')}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Regístrate aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthLogin;