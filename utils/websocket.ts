import { VITE_WS_URL } from './config';

class VotingWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private onVoteUpdate: ((votes: number[]) => void) | null = null;

  connect(onVoteUpdate: (votes: number[]) => void) {
    this.onVoteUpdate = onVoteUpdate;
    this.establishConnection();
  }

  private establishConnection() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    try {
      this.ws = new WebSocket(VITE_WS_URL);

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'VOTE_UPDATE' && this.onVoteUpdate) {
            this.onVoteUpdate(data.votes);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      this.ws.onclose = () => {
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