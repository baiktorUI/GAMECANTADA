import type { Question } from '../types';

const STORAGE_KEY = 'voting-questions';

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