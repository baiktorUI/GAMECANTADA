const BASE_URL = 'https://gamecantada.vercel.app';

export function generateVotingUrl(options: string[]): string {
  // Generamos un identificador único basado en las opciones
  const sessionId = btoa(options.join('|'));
  return `${BASE_URL}/votacio/guanyador?s=${sessionId}`;
}

export function parseVotingUrl(url: string): string[] {
  try {
    const searchParams = new URL(url).searchParams;
    const sessionId = searchParams.get('s');
    if (!sessionId) return [];
    
    return atob(sessionId).split('|');
  } catch {
    return [];
  }
}