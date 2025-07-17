export const defaultOrders = [
  { id: '1001', customer: 'Ana García', address: 'Calle Falsa 123', status: 'Pendiente', driver: 'Sin asignar', createdAt: '2023-10-26', type: 'Comida' },
  { id: '1002', customer: 'Luis Martínez', address: 'Av. Siempre Viva 45', status: 'En Ruta', driver: 'Juan Pérez', createdAt: '2023-10-25', type: 'Paquetería' },
  { id: '1003', customer: 'Sofía Rodríguez', address: 'Blvd. de los Sueños 67', status: 'Entregado', driver: 'María López', createdAt: '2023-10-24', type: 'Documentos' },
  { id: '1004', customer: 'Carlos Sánchez', address: 'Paseo de la Reforma 89', status: 'Pendiente', driver: 'Sin asignar', createdAt: '2023-10-26', type: 'Comida' },
  { id: '1005', customer: 'Elena Díaz', address: 'Calle del Sol 101', status: 'En Ruta', driver: 'Pedro Gómez', createdAt: '2023-10-25', type: 'Otros' },
  { id: '1006', customer: 'Roberto Gómez', address: 'Av. Insurgentes 200', status: 'Entregado', driver: 'Juan Pérez', createdAt: '2023-10-23', type: 'Comida' },
  { id: '1007', customer: 'Isabel Flores', address: 'Calle Pino Suárez 50', status: 'Pendiente', driver: 'Sin asignar', createdAt: '2023-10-26', type: 'Paquetería' },
  { id: '1008', customer: 'Jorge Vargas', address: 'Av. Reforma 10', status: 'En Ruta', driver: 'María López', createdAt: '2023-10-25', type: 'Documentos' },
  { id: '1009', customer: 'Daniela Castro', address: 'Calle Madero 15', status: 'Entregado', driver: 'Pedro Gómez', createdAt: '2023-10-22', type: 'Comida' },
  { id: '1010', customer: 'Fernando Herrera', address: 'Av. Juárez 30', status: 'Pendiente', driver: 'Sin asignar', createdAt: '2023-10-26', type: 'Otros' },
  // Añadimos algunos pedidos para Juan Pérez para el historial
  { id: '1011', customer: 'Juan Pérez', address: 'Av. Siempre Viva 742', status: 'Entregado', driver: 'María López', createdAt: '2023-09-10', type: 'Comida', rating: 5, ratingComment: 'Excelente servicio, llegó rapidísimo!' },
  { id: '1012', customer: 'Juan Pérez', address: 'Av. Siempre Viva 742', status: 'Entregado', driver: 'Pedro Gómez', createdAt: '2023-09-20', type: 'Paquetería', rating: 4, ratingComment: 'Buen servicio, el paquete llegó intacto.' },
  { id: '1013', customer: 'Juan Pérez', address: 'Av. Siempre Viva 742', status: 'Pendiente', driver: 'Sin asignar', createdAt: '2023-10-27', type: 'Comida' },
];