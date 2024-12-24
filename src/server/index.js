import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const PORT = 8080;
const server = createServer();
const wss = new WebSocketServer({ server });

let votingState = {
  isActive: false,
  options: [
    { id: '1', name: 'Option 1', votes: 0 },
    { id: '2', name: 'Option 2', votes: 0 },
    { id: '3', name: 'Option 3', votes: 0 },
  ],
};

const broadcast = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify(message));
    }
  });
};

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  // Send current state to new client
  ws.send(JSON.stringify({ type: 'STATE_UPDATE', payload: votingState }));

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);

      switch (message.type) {
        case 'TOGGLE_VOTING':
          votingState.isActive = !votingState.isActive;
          if (!votingState.isActive) {
            votingState.options = votingState.options.map(opt => ({ ...opt, votes: 0 }));
          }
          break;

        case 'VOTE':
          if (votingState.isActive) {
            const option = votingState.options.find(opt => opt.id === message.payload);
            if (option) {
              option.votes += 1;
            }
          }
          break;

        case 'CHANGE_NAME':
          if (!votingState.isActive) {
            const option = votingState.options.find(opt => opt.id === message.payload.id);
            if (option) {
              option.name = message.payload.name;
            }
          }
          break;
      }

      broadcast({ type: 'STATE_UPDATE', payload: votingState });
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server is running on port ${PORT}`);
});