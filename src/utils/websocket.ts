class VotingWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private onStateUpdate: ((state: any) => void) | null = null;

  connect(onStateUpdate: (state: any) => void) {
    this.onStateUpdate = onStateUpdate;
    this.establishConnection();
  }

  private establishConnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    try {
      // Usar la URL del WebSocket del servidor Express
      this.ws = new WebSocket('ws://localhost:3001');

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'STATE_UPDATE' && this.onStateUpdate) {
            console.log('Received state update:', data); // Para debugging
            this.onStateUpdate({
              votes: data.votes,
              options: data.options,
              votingEnabled: data.votingEnabled
            });
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        this.reconnectAttempts++;
        setTimeout(() => this.establishConnection(), 2000);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (err) {
      console.error('Error establishing WebSocket connection:', err);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const votingWebSocket = new VotingWebSocket();