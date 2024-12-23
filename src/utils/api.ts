export async function fetchState() {
  const response = await fetch('/api/state');
  if (!response.ok) throw new Error('Error fetching state');
  return response.json();
}

export async function updateOptions(options: string[]) {
  const response = await fetch('/api/options', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ options })
  });
  if (!response.ok) throw new Error('Error updating options');
  return response.json();
}

export async function toggleVoting() {
  const response = await fetch('/api/toggle-voting', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Error toggling voting');
  return response.json();
}

export async function submitVote(index: number) {
  const response = await fetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index })
  });
  if (!response.ok) throw new Error('Error submitting vote');
  return response.json();
}