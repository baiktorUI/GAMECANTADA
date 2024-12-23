import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { createServer } from 'http';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuración de límites para manejar alta concurrencia
const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ 
  server,
  path: '/',
  clientTracking: true,
  maxPayload: 1024 * 16,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024
  }
});

app.use(cors());
app.use(express.json({ limit: '16kb' }));
app.use(express.static('dist', {
  maxAge: '1h',
  etag: true,
  lastModified: true
}));

// Estado compartido con estructura optimizada
const state = {
  votes: new Uint32Array(3),
  options: ['', '', ''],
  votingEnabled: false,
  lastBroadcast: Date.now(),
  broadcastDebounceTime: 100 // ms
};

// Gestión de clientes con limpieza automática
const clients = new Map();

function heartbeat() {
  this.isAlive = true;
}

// Limpieza de conexiones muertas
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
        state: {
          votes: Array.from(state.votes),
          options: state.options,
          votingEnabled: state.votingEnabled
        }
      });

      wss.clients.forEach(client => {
        if (client.readyState === 1) { // WebSocket.OPEN
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
  clients.set(ws, Date.now());
  
  // Enviar estado inicial
  ws.send(JSON.stringify({ 
    type: 'STATE_UPDATE',
    state: {
      votes: Array.from(state.votes),
      options: state.options,
      votingEnabled: state.votingEnabled
    }
  }));

  ws.on('close', () => {
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    ws.terminate();
  });
});

// Limpieza de recursos al cerrar
wss.on('close', () => {
  clearInterval(interval);
});

// Rate limiting optimizado
const voteLimiter = rateLimit({
  windowMs: 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !state.votingEnabled // Skip rate limit if voting is disabled
});

// API endpoints optimizados
app.post('/vote', voteLimiter, (req, res) => {
  const { index } = req.body;
  if (
    typeof index === 'number' && 
    index >= 0 && 
    index < state.votes.length && 
    state.votingEnabled
  ) {
    Atomics.add(state.votes, index, 1);
    debouncedBroadcast();
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid vote' });
  }
});

app.post('/options', (req, res) => {
  const { options } = req.body;
  if (Array.isArray(options) && options.length === state.options.length) {
    state.options = options;
    debouncedBroadcast();
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid options' });
  }
});

app.post('/toggle-voting', (req, res) => {
  state.votingEnabled = !state.votingEnabled;
  debouncedBroadcast();
  res.json({ success: true });
});

// Servir la aplicación
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});