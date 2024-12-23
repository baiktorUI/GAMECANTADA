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
      // Usar la URL relativa para que funcione en desarrollo y producción
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'STATE_UPDATE' && this.onStateUpdate) {
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