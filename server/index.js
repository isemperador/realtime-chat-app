/**
 * ============================================================
 *  PROYECTO 1: CHAT APP EN TIEMPO REAL - server/index.js
 *  Semana 9 - Socket.io + Express + HTTP
 * ============================================================
 *  QUÉ HACE ESTE ARCHIVO (según lo pedido en clase):
 *  1. Configurar Express
 *  2. Crear servidor HTTP
 *  3. Integrar Socket.io
 * ============================================================
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// 1. CONFIGURAR EXPRESS
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: "*", // En producción: especificar dominio del cliente
  methods: ["GET", "POST"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba (health check)
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '✅ Servidor Chat Socket.io funcionando',
    puerto: PORT,
    endpoints: {
      health: 'GET /',
      socket: 'ws://localhost:' + PORT
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. CREAR SERVIDOR HTTP
// IMPORTANTE: No usar app.listen directamente. 
// Creamos un servidor HTTP para que Express y Socket.io compartan el mismo puerto.
const httpServer = http.createServer(app);

// 3. INTEGRAR SOCKET.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Importar lógica de sockets (modularizada)
const chatSocketHandler = require('./sockets/chatSocket');

// Activar manejador de sockets
chatSocketHandler(io);

// INICIAR SERVIDOR
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║  🚀 Servidor Chat iniciado          ║
  ║  📡 Puerto: ${PORT}                  ║
  ║  🌐 http://localhost:${PORT}          ║
  ║  🔌 Socket.io listo                 ║
  ╚══════════════════════════════════════╝
  `);
});
