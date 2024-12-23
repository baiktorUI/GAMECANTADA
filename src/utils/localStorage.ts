const STORAGE_KEYS = {
  OPTIONS: 'voting-options',
  VOTES: 'voting-votes',
  ADMIN: 'voting-admin',
  VOTING_ENABLED: 'voting-enabled',
  HAS_VOTED: 'voting-has-voted'
} as const;

export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing data:', error);
  }
}

export { STORAGE_KEYS };