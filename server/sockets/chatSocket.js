/**
 * ============================================================
 *  PROYECTO 1: CHAT APP - sockets/chatSocket.js
 *  Manejador de eventos Socket.io
 * ============================================================
 *  EVENTOS IMPLEMENTADOS:
 *  - connection     : cuando un usuario se conecta
 *  - join_chat      : usuario entra con su nombre
 *  - send_message   : envía mensaje a todos
 *  - typing         : indicador "escribiendo..."
 *  - disconnect     : usuario se desconecta
 *  - receive_message: evento emitido a los clientes
 * ============================================================
 */

// Lista en memoria de usuarios conectados
// En producción usarías Redis o DB
let usuariosConectados = [];
let historialMensajes = [];

module.exports = (io) => {

  io.on('connection', (socket) => {
    console.log(`🔵 Nuevo cliente conectado: ${socket.id}`);

    // ---------------------------------------------------------
    // EVENTO: join_chat
    // Cuando el usuario ingresa su nombre
    // ---------------------------------------------------------
    socket.on('join_chat', ({ username }) => {
      // Guardar info en el socket
      socket.username = username;
      socket.join("sala-general");

      // Agregar a lista
      usuariosConectados.push({
        id: socket.id,
        username: username,
        conectadoEn: new Date().toISOString()
      });

      console.log(`👤 ${username} se unió (${socket.id})`);

      // Avisar a TODOS que alguien entró
      io.emit('user_joined', {
        username,
        mensaje: `${username} se ha unido al chat`,
        usuarios: usuariosConectados,
        timestamp: new Date().toISOString()
      });

      // Enviar historial al recién llegado
      socket.emit('chat_history', historialMensajes);

      // Actualizar lista de usuarios para todos
      io.emit('users_list', usuariosConectados);
    });

    // ---------------------------------------------------------
    // EVENTO: send_message  ->  receive_message
    // ---------------------------------------------------------
    socket.on('send_message', (data) => {
      // data esperado: { username, mensaje, timestamp }
      const nuevoMensaje = {
        id: Date.now().toString(),
        username: data.username || socket.username || 'Anónimo',
        mensaje: data.mensaje,
        timestamp: data.timestamp || new Date().toISOString(),
        socketId: socket.id
      };

      // Guardar en historial (máx 100 mensajes)
      historialMensajes.push(nuevoMensaje);
      if (historialMensajes.length > 100) historialMensajes.shift();

      console.log(`💬 [${nuevoMensaje.username}]: ${nuevoMensaje.mensaje}`);

      // Emitir a TODOS (incluido el emisor)
      io.emit('receive_message', nuevoMensaje);
    });

    // ---------------------------------------------------------
    // EVENTO: typing (usuario está escribiendo)
    // ---------------------------------------------------------
    socket.on('typing', ({ username, isTyping }) => {
      // broadcast = a todos MENOS al emisor
      socket.broadcast.emit('user_typing', { username, isTyping });
    });

    // ---------------------------------------------------------
    // EVENTO: disconnect
    // ---------------------------------------------------------
    socket.on('disconnect', () => {
      console.log(`🔴 Cliente desconectado: ${socket.id} (${socket.username || 'sin nombre'})`);

      // Remover de lista
      usuariosConectados = usuariosConectados.filter(u => u.id !== socket.id);

      // Avisar a los demás
      if (socket.username) {
        io.emit('user_left', {
          username: socket.username,
          mensaje: `${socket.username} ha salido`,
          usuarios: usuariosConectados
        });
      }

      io.emit('users_list', usuariosConectados);
    });

    // Evento extra útil: obtener usuarios
    socket.on('get_users', () => {
      socket.emit('users_list', usuariosConectados);
    });
  });
};
