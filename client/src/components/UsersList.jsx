/**
 * Componente: UsersList.jsx
 * Muestra lista de usuarios conectados
 */
import React from 'react';
import '../styles/Chat.css';

const UsersList = ({ usuarios, currentUser }) => {
  return (
    <div className="users-list-panel">
      <h3 className="users-title">👥 Usuarios conectados ({usuarios.length})</h3>
      
      {usuarios.length === 0 ? (
        <p className="no-users">Nadie conectado aún</p>
      ) : (
        <ul className="users-ul">
          {usuarios.map((user) => (
            <li 
              key={user.id} 
              className={`user-item ${user.username === currentUser ? 'current-user' : ''}`}
            >
              <span className="user-dot"></span>
              <span className="user-name">{user.username}</span>
              {user.username === currentUser && <span className="you-badge">TÚ</span>}
            </li>
          ))}
        </ul>
      )}

      <div className="users-footer">
        <small>Sala: sala-general</small>
      </div>
    </div>
  );
};

export default UsersList;
