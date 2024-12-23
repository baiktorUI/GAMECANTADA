import { VITE_API_URL } from './config';

export async function sendVote(index: number) {
  try {
    const response = await fetch(`${VITE_API_URL}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ index })
    });

    if (!response.ok) {
      throw new Error('Error sending vote');
    }

    return await response.json();
  } catch (err) {
    console.error('Error sending vote:', err);
    throw err;
  }
}