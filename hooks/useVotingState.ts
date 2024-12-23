import { useState } from 'react';
import type { Question } from '../types';

export function useVotingState() {
  const [votedQuestions, setVotedQuestions] = useState<Set<number>>(new Set());

  const hasVoted = (questionId: number) => votedQuestions.has(questionId);

  const recordVote = (questionId: number) => {
    setVotedQuestions(prev => new Set([...prev, questionId]));
  };

  const resetVotes = () => {
    setVotedQuestions(new Set());
  };

  return {
    hasVoted,
    recordVote,
    resetVotes
  };
}