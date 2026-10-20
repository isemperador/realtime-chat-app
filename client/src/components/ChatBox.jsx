/**
 * Componente: ChatBox.jsx
 * Caja de mensajes + input de envío
 * Props: mensajes, username, onSendMessage, typingUser
 */
import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import socket from '../services/socket';
import '../styles/Chat.css';

const ChatBox = ({ mensajes, username, onSendMessage, typingUser }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, typingUser]);

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Emitir "escribiendo"
    socket.emit('typing', { username, isTyping: true });

    // Dejar de mostrar "escribiendo" después de 1.5s sin escribir
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { username, isTyping: false });
    }, 1500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    onSendMessage(input.trim());
    setInput('');
    socket.emit('typing', { username, isTyping: false });
  };

  return (
    <div className="chatbox-container">
      {/* Área de mensajes */}
      <div className="messages-area">
        {mensajes.length === 0 ? (
          <div className="empty-chat">
            <p>💬 No hay mensajes aún. ¡Sé el primero en escribir!</p>
          </div>
        ) : (
          mensajes.map((msg) => (
            <Message 
              key={msg.id} 
              mensaje={msg} 
              isOwn={msg.username === username} 
            />
          ))
        )}

        {typingUser && (
          <div className="typing-indicator">
            <span className="dot"></span><span className="dot"></span><span className="dot"></span>
            <em>{typingUser} está escribiendo...</em>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form className="input-area" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={handleInputChange}
          className="chat-input"
          maxLength={500}
        />
        <button type="submit" className="send-btn" disabled={!input.trim()}>
          Enviar ✈️
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
