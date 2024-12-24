export const WS_PORT = 8080;

export const getWebSocketUrl = () => {
  // For development in WebContainer environment
  return `ws://${window.location.hostname.replace('preview', '8080')}.local-credentialless.webcontainer.io`;
};