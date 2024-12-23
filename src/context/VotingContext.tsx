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

export function useVoting() {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
}

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>(() => loadQuestions());
  const [userId] = useState(() => generateUserId());

  // Sincronizar cambios entre pestañas
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'voting-questions') {
        const newQuestions = event.newValue ? JSON.parse(event.newValue) : [];
        setQuestions(newQuestions);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Actualizar preguntas periódicamente
  useEffect(() => {
    const interval = setInterval(() => {
      const storedQuestions = loadQuestions();
      if (JSON.stringify(storedQuestions) !== JSON.stringify(questions)) {
        setQuestions(storedQuestions);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [questions]);

  const handleVote = (questionId: number, optionIndex: number) => {
    if (!hasVoted(userId)) {
      const updatedQuestions = questions.map(q => 
        q.id === questionId
          ? { ...q, votes: q.votes.map((v, i) => i === optionIndex ? v + 1 : v) }
          : q
      );
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);
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