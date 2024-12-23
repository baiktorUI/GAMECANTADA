const getWebSocketUrl = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.host;
  return `${protocol}//${host}`;
};

export const VITE_WS_URL = getWebSocketUrl();
export const VITE_API_URL = window.location.origin;