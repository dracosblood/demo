import React, { useState } from 'react';

const AuthRegister = ({ setCurrentPage, onRegisterSuccess }) => {
  const [userType, setUserType] = useState(''); // 'client' or 'transporter'
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [transportType, setTransportType] = useState('');
  const [availability, setAvailability] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor, verifica.');
      return;
    }

    const userData = {
      first_name: name,
      last_name: lastName,
      email: email,
      password: password, // Enviar la contraseña en texto plano al backend para que la hashee
      phone_number: phone,
      role: userType === 'client' ? 'customer' : 'transporter',
      transport_type: userType === 'transporter' ? transportType : null,
      availability_schedule: userType === 'transporter' ? availability : null,
    };

    try {
      // Simulación de llamada a un endpoint de backend para registro
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // });
      // const data = await response.json();

      const data = await new Promise(resolve => setTimeout(() => {
        // Simular respuesta del backend
        if (Math.random() > 0.1) { // 90% de éxito
          resolve({ success: true, message: 'Usuario registrado con éxito.', user: { ...userData, id: Date.now().toString() } });
        } else { // 10% de fallo (ej. email ya existe)
          resolve({ success: false, message: 'Error al registrar usuario. El email podría ya estar en uso.' });
        }
      }, 1000)); // Simular un retraso de red

      if (data.success) {
        onRegisterSuccess(data.user); // Notificar a App.js que el registro fue exitoso
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setCurrentPage('login');
        }, 2000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      alert('Ocurrió un error al intentar registrarse. Intenta de nuevo más tarde.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Crear Cuenta</h2>

        {showSuccessMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
            <strong className="font-bold">¡Éxito!</strong>
            <span className="block sm:inline"> Tu cuenta ha sido creada. Redirigiendo...</span>
          </div>
        )}

        <div className="mb-6">
          <p className="block text-gray-700 text-sm font-medium mb-2">¿Qué tipo de cuenta quieres crear?</p>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setUserType('client')}
              className={`px-6 py-3 rounded-xl transition-colors duration-300 shadow-md ${
                userType === 'client' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Soy Cliente
            </button>
            <button
              type="button"
              onClick={() => setUserType('transporter')}
              className={`px-6 py-3 rounded-xl transition-colors duration-300 shadow-md ${
                userType === 'transporter' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Soy Transportista
            </button>
          </div>
        </div>

        {userType && (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-2">Nombre:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-gray-700 text-sm font-medium mb-2">Apellido:</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Tu apellido"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              />
            </div>
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
            <div className="mb-4">
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
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium mb-2">Confirmar Contraseña:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=""
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-gray-700 text-sm font-medium mb-2">Número de Teléfono:</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: 5512345678"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                required
              />
            </div>

            {userType === 'transporter' && (
              <>
                <div className="mb-4">
                  <label htmlFor="transportType" className="block text-gray-700 text-sm font-medium mb-2">Tipo de Transporte:</label>
                  <select
                    id="transportType"
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                    required
                  >
                    <option value="">Selecciona uno</option>
                    <option value="Taxi">Taxi</option>
                    <option value="Transporte de Mercancía">Transporte de Mercancía</option>
                    <option value="Encomienda">Encomienda</option>
                    <option value="Moto">Moto</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label htmlFor="availability" className="block text-gray-700 text-sm font-medium mb-2">Horario de Disponibilidad:</label>
                  <textarea
                    id="availability"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="Ej: Lunes a Viernes de 9 AM a 6 PM"
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
                    required
                  ></textarea>
                </div>
              </>
            )}
            
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors duration-300 shadow-md hover:shadow-lg"
            >
              Registrarse
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-6">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={() => setCurrentPage('login')}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Inicia Sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthRegister;