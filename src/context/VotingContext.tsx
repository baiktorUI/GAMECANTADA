import React, { createContext, useContext, useState, useEffect } from 'react';

interface VotingState {
  options: string[];
  votes: number[];
  votingEnabled: boolean;
  hasVoted: boolean;
}

interface VotingContextType extends VotingState {
  setOptions: (options: string[]) => void;
  handleVote: (index: number) => void;
  toggleVoting: () => void;
}

const VotingContext = createContext<VotingContextType | null>(null);

const STORAGE_KEY = 'voting-state';

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VotingState>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {
      options: ['', '', ''],
      votes: [0, 0, 0],
      votingEnabled: false,
      hasVoted: false
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setOptions = (options: string[]) => {
    setState(prev => ({ ...prev, options }));
  };

  const handleVote = (index: number) => {
    if (!state.hasVoted && state.votingEnabled) {
      setState(prev => ({
        ...prev,
        votes: prev.votes.map((v, i) => i === index ? v + 1 : v),
        hasVoted: true
      }));
    }
  };

  const toggleVoting = () => {
    setState(prev => ({ ...prev, votingEnabled: !prev.votingEnabled }));
  };

  return (
    <VotingContext.Provider value={{
      ...state,
      setOptions,
      handleVote,
      toggleVoting
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