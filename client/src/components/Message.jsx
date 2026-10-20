/**
 * Componente: Message.jsx
 * Renderiza una burbuja de mensaje
 * Props: mensaje { username, mensaje, timestamp }, isOwn (si es del usuario actual)
 */
import React from 'react';
import '../styles/Chat.css';

const Message = ({ mensaje, isOwn }) => {
  const fecha = new Date(mensaje.timestamp);
  const hora = fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

  // Mensaje del sistema (ej: "Juan se unió")
  if (mensaje.tipo === 'sistema') {
    return (
      <div className="system-message">
        <span>📢 {mensaje.mensaje}</span>
      </div>
    );
  }

  return (
    <div className={`message-row ${isOwn ? 'own' : 'other'}`}>
      <div className={`message-bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
        {!isOwn && <div className="message-username">{mensaje.username}</div>}
        <div className="message-text">{mensaje.mensaje}</div>
        <div className="message-time">{hora}</div>
      </div>
    </div>
  );
};

export default Message;
