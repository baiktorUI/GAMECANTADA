// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/api/ws",
      "dest": "/api/websocket.js"
    },
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}

// api/websocket.js
import { createServer } from 'http';
import { Server } from 'ws';
import { parse } from 'url';

const server = createServer();
const wss = new Server({ server });

// Estado global
let voteState = {
  options: ['', '', ''],
  votes: [0, 0, 0],
  votingEnabled: false,
  connectedClients: 0
};

wss.on('connection', (ws) => {
  voteState.connectedClients++;

  // Enviar estado actual al nuevo cliente
  ws.send(JSON.stringify({
    type: 'STATE_UPDATE',
    payload: voteState
  }));

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.type) {
      case 'VOTE':
        if (voteState.votingEnabled) {
          voteState.votes[data.payload.optionIndex]++;
          broadcastState();
        }
        break;

      case 'UPDATE_OPTIONS':
        voteState.options = data.payload.options;
        broadcastState();
        break;

      case 'TOGGLE_VOTING':
        voteState.votingEnabled = data.payload.enabled;
        broadcastState();
        break;
    }
  });

  ws.on('close', () => {
    voteState.connectedClients--;
  });
});

function broadcastState() {
  const message = JSON.stringify({
    type: 'STATE_UPDATE',
    payload: voteState
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export default function handler(req, res) {
  if (!res.socket.server.ws) {
    res.socket.server.ws = wss;
  }
  
  res.end();
}
