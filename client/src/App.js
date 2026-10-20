/**
 * App.js - Punto de entrada React
 * Maneja login simple (ingreso de username) y renderiza Chat.jsx
 */
import React, { useState } from 'react';
import Chat from './pages/Chat';
import './styles/Chat.css';

function App() {
  const [username, setUsername] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [inputName, setInputName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;
    setUsername(inputName.trim());
    setIsLogged(true);
  };

  const handleLogout = () => {
    setIsLogged(false);
    setUsername('');
    setInputName('');
  };

  // Vista LOGIN
  if (!isLogged) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1>💬 Realtime Chat App</h1>
          <p className="subtitle">Socket.io + React + Express</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <label>Ingresa tu nombre de usuario:</label>
            <input
              type="text"
              placeholder="Ej: Carlos, Ana, Luis..."
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="login-input"
              maxLength={20}
              required
            />
            <button type="submit" className="login-btn">Entrar al Chat →</button>
          </form>

          <div className="login-info">
            <p>✨ Proyecto Semana 9 - Chat en Tiempo Real</p>
            <small>Abre 2 pestañas con nombres distintos para probar el chat</small>
          </div>
        </div>
      </div>
    );
  }

  // Vista CHAT
  return <Chat username={username} onLogout={handleLogout} />;
}

export default App;
