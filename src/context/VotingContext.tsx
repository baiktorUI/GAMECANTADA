import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadQuestions, saveQuestions } from '../utils/storage';
import type { Question } from '../types';

interface VotingContextType {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  hasVoted: (questionId: number) => boolean;
  recordVote: (questionId: number) => void;
  handleVote: (questionId: number, optionIndex: number) => void;
}

const VotingContext = createContext<VotingContextType | null>(null);

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const [questions, setQuestions] = useState<Question[]>(() => loadQuestions());
  const [votedQuestions, setVotedQuestions] = useState<Set<number>>(new Set());

  // Guardar preguntas cuando cambien
  useEffect(() => {
    saveQuestions(questions);
  }, [questions]);

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

  const hasVoted = (questionId: number) => votedQuestions.has(questionId);

  const recordVote = (questionId: number) => {
    setVotedQuestions(prev => new Set([...prev, questionId]));
  };

  const handleVote = (questionId: number, optionIndex: number) => {
    if (!hasVoted(questionId)) {
      const updatedQuestions = questions.map(q => 
        q.id === questionId
          ? { ...q, votes: q.votes.map((v, i) => i === optionIndex ? v + 1 : v) }
          : q
      );
      setQuestions(updatedQuestions);
      recordVote(questionId);
    }
  };

  return (
    <VotingContext.Provider value={{
      questions,
      setQuestions,
      hasVoted,
      recordVote,
      handleVote,
    }}>
      {children}
    </VotingContext.Provider>
  );
}

export function useVoting() {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
}