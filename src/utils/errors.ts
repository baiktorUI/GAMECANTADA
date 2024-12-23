export class VotingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VotingError';
  }
}

export const ERROR_MESSAGES = {
  INVALID_VOTE: 'Voto inválido',
  VOTING_DISABLED: 'La votación está desactivada',
  ALREADY_VOTED: 'Ya has votado',
  INVALID_OPTIONS: 'Opciones inválidas',
  SERVER_ERROR: 'Error del servidor'
} as const;