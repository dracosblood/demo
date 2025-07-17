import React, { useState } from 'react';

const AuthForgotPassword = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      // Simulación de llamada a un endpoint de backend para recuperar contraseña
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });
      // const data = await response.json();

      const data = await new Promise(resolve => setTimeout(() => {
        // Simular respuesta del backend
        if (email.includes('@')) { // Simular que el email es válido
          resolve({ success: true, message: `Se ha enviado un enlace de recuperación a ${email}.` });
        } else {
          resolve({ success: false, message: 'Correo electrónico no válido.' });
        }
      }, 1000));

      if (data.success) {
        alert(data.message + ' Por favor, revisa tu bandeja de entrada.');
        setCurrentPage('login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error al recuperar contraseña:', error);
      alert('Ocurrió un error al intentar recuperar la contraseña. Intenta de nuevo más tarde.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Recuperar Contraseña</h2>
        <p className="text-gray-600 text-center mb-6">
          Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <form onSubmit={handleResetPassword}>
          <div className="mb-6">
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
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Restablecer Contraseña
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6">
          <button
            onClick={() => setCurrentPage('login')}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Volver al Inicio de Sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForgotPassword;