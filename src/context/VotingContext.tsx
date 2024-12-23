import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadQuestions, saveQuestions, saveVote, hasVoted } from '../utils/storage';
import { generateUserId } from '../utils/user';
import type { Question } from '../types';

interface VotingContextType {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  handleVote: (questionId: number, optionIndex: number) => void;
  hasUserVoted: () => boolean;
}

const VotingContext = createContext<VotingContextType | null>(null);

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestionsState] = useState<Question[]>(() => loadQuestions());
  const [userId] = useState(() => generateUserId());

  useEffect(() => {
    // Escuchar cambios en el almacenamiento
    const handleStorageChange = () => {
      const newQuestions = loadQuestions();
      setQuestionsState(newQuestions);
    };

    // Escuchar eventos de storage y el evento personalizado
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('questionsUpdated', handleStorageChange);

    // Actualización periódica
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('questionsUpdated', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const setQuestions = (newQuestions: Question[]) => {
    saveQuestions(newQuestions);
    setQuestionsState(newQuestions);
  };

  const handleVote = (questionId: number, optionIndex: number) => {
    if (!hasVoted(userId)) {
      const updatedQuestions = questions.map(q => 
        q.id === questionId
          ? { ...q, votes: q.votes.map((v, i) => i === optionIndex ? v + 1 : v) }
          : q
      );
      setQuestions(updatedQuestions);
      saveVote(userId, questionId);
    }
  };

  const hasUserVoted = () => hasVoted(userId);

  return (
    <VotingContext.Provider value={{
      questions,
      setQuestions,
      handleVote,
      hasUserVoted
    }}>
      {children}
    </VotingContext.Provider>
  );
}

export function useVoting() {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting debe ser usado dentro de VotingProvider');
  }
  return context;
}