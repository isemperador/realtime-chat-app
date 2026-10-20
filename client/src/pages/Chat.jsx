/**
 * Página principal: Chat.jsx
 * Gestiona estado global del chat: mensajes, usuarios, socket events
 */
import React, { useState, useEffect } from 'react';
import ChatBox from '../components/ChatBox';
import UsersList from '../components/UsersList';
import socket from '../services/socket';
import '../styles/Chat.css';

const Chat = ({ username, onLogout }) => {
  const [mensajes, setMensajes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [typingUser, setTypingUser] = useState(null);

  useEffect(() => {
    // --- Conectar socket ---
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('join_chat', { username });

    // --- Listeners ---
    const onReceive = (msg) => {
      setMensajes((prev) => [...prev, msg]);
    };

    const onHistory = (historial) => {
      setMensajes(historial);
    };

    const onUsersList = (lista) => {
      setUsuarios(lista);
    };

    const onUserJoined = (data) => {
      setMensajes((prev) => [...prev, {
        id: 'sys-' + Date.now(),
        mensaje: data.mensaje,
        tipo: 'sistema',
        timestamp: data.timestamp
      }]);
      setUsuarios(data.usuarios);
    };

    const onUserLeft = (data) => {
      setMensajes((prev) => [...prev, {
        id: 'sys-' + Date.now(),
        mensaje: data.mensaje,
        tipo: 'sistema',
        timestamp: new Date().toISOString()
      }]);
      setUsuarios(data.usuarios);
    };

    const onTyping = ({ username: quien, isTyping }) => {
      if (quien === username) return; // No mostrar mi propio typing
      setTypingUser(isTyping ? quien : null);
    };

    socket.on('receive_message', onReceive);
    socket.on('chat_history', onHistory);
    socket.on('users_list', onUsersList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('user_typing', onTyping);

    // Cleanup
    return () => {
      socket.off('receive_message', onReceive);
      socket.off('chat_history', onHistory);
      socket.off('users_list', onUsersList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('user_typing', onTyping);
    };
  }, [username]);

  const handleSendMessage = (texto) => {
    socket.emit('send_message', {
      username,
      mensaje: texto,
      timestamp: new Date().toISOString()
    });
  };

  const handleLogout = () => {
    socket.disconnect();
    onLogout();
  };

  return (
    <div className="chat-layout">
      {/* Header */}
      <header className="chat-header">
        <div className="header-left">
          <h2>💬 Chat en Tiempo Real</h2>
          <span className="status-connected">● Conectado como <strong>{username}</strong></span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Salir</button>
      </header>

      <div className="chat-body">
        <UsersList usuarios={usuarios} currentUser={username} />
        <ChatBox 
          mensajes={mensajes} 
          username={username} 
          onSendMessage={handleSendMessage}
          typingUser={typingUser}
        />
      </div>
    </div>
  );
};

export default Chat;
