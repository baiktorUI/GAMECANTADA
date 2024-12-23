import type { Question } from '../types';

const STORAGE_KEY = 'voting-questions';
const VOTES_KEY = 'user-votes';

export function saveQuestions(questions: Question[]): void {
  try {
    // Usar sessionStorage para las preguntas para que sean accesibles entre pestañas
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    // También guardar en localStorage para persistencia
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    // Disparar un evento personalizado para notificar cambios
    window.dispatchEvent(new Event('questionsUpdated'));
  } catch (error) {
    console.error('Error al guardar preguntas:', error);
  }
}

export function loadQuestions(): Question[] {
  try {
    // Intentar cargar primero desde sessionStorage
    const sessionStored = sessionStorage.getItem(STORAGE_KEY);
    if (sessionStored) {
      return JSON.parse(sessionStored);
    }
    // Si no existe en sessionStorage, intentar desde localStorage
    const localStored = localStorage.getItem(STORAGE_KEY);
    if (localStored) {
      // Sincronizar con sessionStorage
      sessionStorage.setItem(STORAGE_KEY, localStored);
      return JSON.parse(localStored);
    }
    return [];
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
    sessionStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  } catch (error) {
    console.error('Error al guardar voto:', error);
  }
}

export function getVotes(): Record<string, number> {
  try {
    const stored = localStorage.getItem(VOTES_KEY) || sessionStorage.getItem(VOTES_KEY);
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