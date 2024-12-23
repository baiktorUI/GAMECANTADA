// Sistema de seguimiento de votos usando localStorage y sessionStorage para redundancia
const VOTE_PREFIX = 'vote-session-';
const SESSION_PREFIX = 'voting-session-';

export function getCurrentSessionId(options: string[]): string {
  // Crear un ID único basado en las opciones disponibles
  return btoa(options.join('|'));
}

export function hasUserVotedInSession(sessionId: string): boolean {
  // Verificar tanto localStorage como sessionStorage
  const localVoted = localStorage.getItem(`${VOTE_PREFIX}${sessionId}`);
  const sessionVoted = sessionStorage.getItem(`${SESSION_PREFIX}${sessionId}`);
  return localVoted === 'true' || sessionVoted === 'true';
}

export function markUserAsVotedInSession(sessionId: string): void {
  // Guardar en ambos storages para mayor seguridad
  try {
    localStorage.setItem(`${VOTE_PREFIX}${sessionId}`, 'true');
    sessionStorage.setItem(`${SESSION_PREFIX}${sessionId}`, 'true');
  } catch (error) {
    console.error('Error al guardar el voto:', error);
  }
}

export function getVoteCount(sessionId: string): number {
  const count = localStorage.getItem(`${VOTE_PREFIX}${sessionId}-count`);
  return count ? parseInt(count, 10) : 0;
}