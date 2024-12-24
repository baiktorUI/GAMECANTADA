// WebSocket configuration
export const WS_PORT = 8080;

export const getWebSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const hostname = window.location.hostname;
  return `${protocol}//${hostname}:${WS_PORT}`;
};