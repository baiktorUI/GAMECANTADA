export const MAX_OPTIONS = 3;
export const WS_RECONNECT_INTERVAL = 2000;
export const WS_MAX_RECONNECT_ATTEMPTS = 5;

export const API_ENDPOINTS = {
  STATE: '/api/state',
  OPTIONS: '/api/options',
  VOTE: '/api/vote',
  TOGGLE_VOTING: '/api/toggle-voting'
} as const;