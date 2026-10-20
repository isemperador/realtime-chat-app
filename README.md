# 💬 Realtime Chat App - Semana 9

Chat en tiempo real con `Socket.io` + `Express` + `React`.

## 🚀 Inicio rápido
```bash
# Terminal 1 - Servidor
cd server
npm install
npm run dev   # http://localhost:5000

# Terminal 2 - Cliente
cd client
npm install
npm start     # http://localhost:3000
```

Abre 2 pestañas con nombres distintos para probar.

## 📁 Estructura
```
realtime-chat-app/
├── server/
│   ├── index.js              # Express + HTTP + Socket.io
│   └── sockets/chatSocket.js # Eventos: send_message, receive_message, disconnect
└── client/
    ├── src/
    │   ├── components/ChatBox.jsx, Message.jsx, UsersList.jsx
    │   ├── pages/Chat.jsx
    │   ├── services/socket.js # Conexión singleton
    │   └── App.js
```

## 🔌 Eventos Socket.io
| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `join_chat` | cliente → servidor | Usuario entra con username |
| `send_message` | cliente → servidor | Envía mensaje |
| `receive_message` | servidor → todos | Broadcast del mensaje |
| `typing` / `user_typing` | ambos | Indicador escribiendo |
| `disconnect` | sistema | Usuario sale |

---

Proyecto académico - Semana 9
