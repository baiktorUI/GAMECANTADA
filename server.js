import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ 
  server,
  path: '/ws'  // Especificar la ruta del WebSocket
});

// Estado inicial
const state = {
  options: ['', '', ''],
  votes: [0, 0, 0],
  votingEnabled: false
};

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Configuración de CORS y JSON
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Función para enviar actualizaciones
function broadcastState() {
  const message = JSON.stringify({
    type: 'STATE_UPDATE',
    ...state
  });
  
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

// Rutas API
app.get('/api/state', (req, res) => {
  res.json(state);
});

app.post('/api/options', (req, res) => {
  const { options } = req.body;
  if (Array.isArray(options) && options.length === 3) {
    state.options = options;
    broadcastState();
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Opciones inválidas' });
  }
});

app.post('/api/vote', (req, res) => {
  const { index } = req.body;
  if (typeof index === 'number' && index >= 0 && index < 3 && state.votingEnabled) {
    state.votes[index]++;
    broadcastState();
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Voto inválido' });
  }
});

app.post('/api/toggle-voting', (req, res) => {
  state.votingEnabled = !state.votingEnabled;
  broadcastState();
  res.json({ success: true });
});

// Conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('New WebSocket connection');
  ws.send(JSON.stringify({
    type: 'STATE_UPDATE',
    ...state
  }));
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});