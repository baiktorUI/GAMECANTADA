import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadQuestions, saveQuestions } from '../utils/storage';
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
  const userId = generateUserId();

  useEffect(() => {
    // Cargar preguntas iniciales
    const storedQuestions = loadQuestions();
    if (storedQuestions.length > 0) {
      setQuestionsState(storedQuestions);
    }

    // Configurar actualizaciones periódicas
    const interval = setInterval(() => {
      const currentQuestions = loadQuestions();
      if (JSON.stringify(currentQuestions) !== JSON.stringify(questions)) {
        setQuestionsState(currentQuestions);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const setQuestions = (newQuestions: Question[]) => {
    saveQuestions(newQuestions);
    setQuestionsState(newQuestions);
  };

  const handleVote = (questionId: number, optionIndex: number) => {
    const updatedQuestions = questions.map(q => 
      q.id === questionId
        ? { ...q, votes: q.votes.map((v, i) => i === optionIndex ? v + 1 : v) }
        : q
    );
    setQuestions(updatedQuestions);
    localStorage.setItem(`vote-${userId}`, 'true');
  };

  const hasUserVoted = () => {
    return localStorage.getItem(`vote-${userId}`) === 'true';
  };

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