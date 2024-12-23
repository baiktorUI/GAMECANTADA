const API_BASE = '';

export async function fetchState() {
  console.log('Fetching state...');
  const response = await fetch(`${API_BASE}/api/state`);
  if (!response.ok) {
    const error = await response.text();
    console.error('Error fetching state:', error);
    throw new Error('Error fetching state');
  }
  const data = await response.json();
  console.log('State fetched:', data);
  return data;
}

export async function updateOptions(options: string[]) {
  console.log('Updating options:', options);
  const response = await fetch(`${API_BASE}/api/options`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ options })
  });
  if (!response.ok) {
    const error = await response.text();
    console.error('Error updating options:', error);
    throw new Error('Error updating options');
  }
  const data = await response.json();
  console.log('Options updated:', data);
  return data;
}

export async function toggleVoting() {
  console.log('Toggling voting...');
  const response = await fetch(`${API_BASE}/api/toggle-voting`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) {
    const error = await response.text();
    console.error('Error toggling voting:', error);
    throw new Error('Error toggling voting');
  }
  const data = await response.json();
  console.log('Voting toggled:', data);
  return data;
}

export async function submitVote(index: number) {
  console.log('Submitting vote:', index);
  const response = await fetch(`${API_BASE}/api/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ index })
  });
  if (!response.ok) {
    const error = await response.text();
    console.error('Error submitting vote:', error);
    throw new Error('Error submitting vote');
  }
  const data = await response.json();
  console.log('Vote submitted:', data);
  return data;
}