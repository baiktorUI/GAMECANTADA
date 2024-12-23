import type { Question } from '../types';

const STORAGE_KEY = 'voting-questions';
const VOTES_KEY = 'voting-votes';

export function saveQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    // Broadcast el cambio a otras pestañas
    window.dispatchEvent(new StorageEvent('storage', {
      key: STORAGE_KEY,
      newValue: JSON.stringify(questions)
    }));
  } catch (error) {
    console.error('Error saving questions:', error);
  }
}

export function loadQuestions(): Question[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
}

export function saveVote(userId: string, questionId: number): void {
  try {
    const votes = getVotes();
    votes[userId] = questionId;
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  } catch (error) {
    console.error('Error saving vote:', error);
  }
}

export function getVotes(): Record<string, number> {
  try {
    const stored = localStorage.getItem(VOTES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading votes:', error);
    return {};
  }
}

export function hasVoted(userId: string): boolean {
  const votes = getVotes();
  return userId in votes;
}