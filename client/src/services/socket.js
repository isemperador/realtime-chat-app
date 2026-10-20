/**
 * ============================================================
 *  PROYECTO 1: CHAT APP - client/services/socket.js
 *  Conexión al backend con socket.io-client
 * ============================================================
 *  Este archivo centraliza la conexión para no crear 
 *  múltiples sockets en cada componente.
 * ============================================================
 */

import { io } from 'socket.io-client';

// URL del backend - cambiar en producción
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Crear UNA sola instancia de socket (Singleton)
const socket = io(SOCKET_URL, {
  autoConnect: false, // Nos conectamos manualmente después del login
  transports: ['websocket', 'polling']
});

// Listeners de depuración (opcional)
socket.on('connect', () => {
  console.log('✅ Conectado al servidor:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Desconectado del servidor');
});

socket.on('connect_error', (err) => {
  console.error('⚠️ Error de conexión:', err.message);
});

export default socket;

// También exportamos función para conectar con username
export const connectSocket = (username) => {
  if (!socket.connected) {
    socket.connect();
    // Una vez conectado, avisar quién soy
    socket.on('connect', () => {
      socket.emit('join_chat', { username });
    });
    // Si ya estaba conectado
    if (socket.connected) {
      socket.emit('join_chat', { username });
    }
  } else {
    socket.emit('join_chat', { username });
  }
};
