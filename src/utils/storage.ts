// Simulación de almacenamiento persistente usando localStorage
const STORAGE_KEY = 'voting-questions';
const ADMIN_KEY = 'is-admin';

export function saveQuestions(questions: Question[]): void {
  try {
    // Asegurarse de que solo el admin puede guardar preguntas
    if (localStorage.getItem(ADMIN_KEY) === 'true') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
      // Sincronizar con sessionStorage para redundancia
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    }
  } catch (error) {
    console.error('Error saving questions:', error);
  }
}

export function loadQuestions(): Question[] {
  try {
    // Intentar cargar desde localStorage primero
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Si no hay datos en localStorage, intentar desde sessionStorage
    const sessionStored = sessionStorage.getItem(STORAGE_KEY);
    if (sessionStored) {
      // Sincronizar con localStorage
      localStorage.setItem(STORAGE_KEY, sessionStored);
      return JSON.parse(sessionStored);
    }
    
    return [];
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
}

export function setAdminStatus(isAdmin: boolean): void {
  localStorage.setItem(ADMIN_KEY, String(isAdmin));
}