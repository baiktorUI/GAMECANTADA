const BASE_URL = 'https://gamecantada.vercel.app';

export function generateVotingUrl(): string {
  return `${BASE_URL}/votacio/guanyador`;
}