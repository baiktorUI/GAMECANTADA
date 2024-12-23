import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Estado compartido optimizado
const state = {
  votes: new Uint32Array(3),
  options: ['', '', ''],
  votingEnabled: false,
  lastBroadcast: Date.now(),
  broadcastDebounceTime: 100
};

// Gestión de conexiones
const clients = new Set();

// Limpieza de conexiones muertas
function heartbeat() {
  this.isAlive = true;
}

const interval = setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.isAlive === false) {
      clients.delete(ws);
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// Broadcast optimizado con debounce
let broadcastTimeout = null;
function debouncedBroadcast() {
  if (broadcastTimeout) return;
  
  broadcastTimeout = setTimeout(() => {
    const now = Date.now();
    if (now - state.lastBroadcast >= state.broadcastDebounceTime) {
      const message = JSON.stringify({
        type: 'STATE_UPDATE',
        votes: Array.from(state.votes),
        options: state.options,
        votingEnabled: state.votingEnabled
      });

      wss.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(message);
        }
      });
      
      state.lastBroadcast = now;
    }
    broadcastTimeout = null;
  }, state.broadcastDebounceTime);
}

wss.on('connection', (ws) => {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  clients.add(ws);
  
  ws.send(JSON.stringify({
    type: 'STATE_UPDATE',
    votes: Array.from(state.votes),
    options: state.options,
    votingEnabled: state.votingEnabled
  }));

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// API endpoints optimizados
app.use(express.json());

const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 1000; // 1 segundo
const MAX_REQUESTS = 100; // máximo 100 votos por segundo

app.post('/api/vote', (req, res) => {
  const clientIp = req.ip;
  const now = Date.now();
  
  // Limpieza de rate limit antiguo
  if (rateLimit.has(clientIp)) {
    const { timestamp } = rateLimit.get(clientIp);
    if (now - timestamp > RATE_LIMIT_WINDOW) {
      rateLimit.delete(clientIp);
    }
  }

  // Verificar rate limit
  if (rateLimit.has(clientIp)) {
    const { count } = rateLimit.get(clientIp);
    if (count >= MAX_REQUESTS) {
      return res.status(429).json({ error: 'Too many requests' });
    }
    rateLimit.get(clientIp).count++;
  } else {
    rateLimit.set(clientIp, { count: 1, timestamp: now });
  }

  const { index } = req.body;
  if (typeof index === 'number' && index >= 0 && index < state.votes.length && state.votingEnabled) {
    Atomics.add(state.votes, index, 1);
    debouncedBroadcast();
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid vote' });
  }
});

app.post('/api/options', (req, res) => {
  const { options } = req.body;
  if (Array.isArray(options) && options.length === state.options.length) {
    state.options = options;
    debouncedBroadcast();
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid options' });
  }
});

app.post('/api/toggle-voting', (req, res) => {
  state.votingEnabled = !state.votingEnabled;
  debouncedBroadcast();
  res.json({ success: true });
});

// Servir archivos estáticos
app.use(express.static('dist'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});