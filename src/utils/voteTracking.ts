// Prefijo para las claves de localStorage
const VOTE_PREFIX = 'vote-session-';

// Obtiene el ID de la sesión actual basado en las opciones
export function getCurrentSessionId(options: string[]): string {
  return btoa(options.join('|'));
}

export function hasUserVotedInSession(sessionId: string): boolean {
  return localStorage.getItem(`${VOTE_PREFIX}${sessionId}`) === 'true';
}

export function markUserAsVotedInSession(sessionId: string): void {
  localStorage.setItem(`${VOTE_PREFIX}${sessionId}`, 'true');
}

// Limpia votos antiguos (opcional, para mantenimiento)
export function cleanupOldVotes(): void {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(VOTE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}