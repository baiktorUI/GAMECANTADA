import type { Question } from '../types';

const STORAGE_KEY = 'voting-questions';
const VOTES_KEY = 'user-votes';

export function saveQuestions(questions: Question[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  } catch (error) {
    console.error('Error al guardar preguntas:', error);
  }
}

export function loadQuestions(): Question[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error al cargar preguntas:', error);
    return [];
  }
}

export function saveVote(userId: string, questionId: number): void {
  try {
    const votes = getVotes();
    votes[userId] = questionId;
    localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  } catch (error) {
    console.error('Error al guardar voto:', error);
  }
}

export function getVotes(): Record<string, number> {
  try {
    const stored = localStorage.getItem(VOTES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error al cargar votos:', error);
    return {};
  }
}

export function hasVoted(userId: string): boolean {
  const votes = getVotes();
  return votes.hasOwnProperty(userId);
}