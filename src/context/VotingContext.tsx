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
    throw new Error('useVoting debe ser usado dentro de VotingProvider');
  }
  return context;
}

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestionsState] = useState<Question[]>(() => loadQuestions());
  const [userId] = useState(() => generateUserId());

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'voting-questions') {
        const newQuestions = loadQuestions();
        setQuestionsState(newQuestions);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Actualización periódica
    const interval = setInterval(() => {
      const newQuestions = loadQuestions();
      if (JSON.stringify(newQuestions) !== JSON.stringify(questions)) {
        setQuestionsState(newQuestions);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [questions]);

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