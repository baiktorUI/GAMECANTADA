// En una aplicación real, esto se manejaría con una base de datos
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function isValidSessionId(sessionId: string): boolean {
  return sessionId.length > 0;
}