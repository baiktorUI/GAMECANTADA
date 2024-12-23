import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/localStorage';

interface VotingContextType {
  options: string[];
  votes: number[];
  votingEnabled: boolean;
  hasVoted: boolean;
  setOptions: (options: string[]) => void;
  handleVote: (index: number) => void;
  toggleVoting: () => void;
}

const VotingContext = createContext<VotingContextType | null>(null);

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const [options, setOptions] = useState(() => 
    getStoredData(STORAGE_KEYS.OPTIONS, ['', '', ''])
  );
  const [votes, setVotes] = useState(() => 
    getStoredData(STORAGE_KEYS.VOTES, [0, 0, 0])
  );
  const [votingEnabled, setVotingEnabled] = useState(() => 
    getStoredData(STORAGE_KEYS.VOTING_ENABLED, false)
  );
  const [hasVoted, setHasVoted] = useState(() => 
    getStoredData(STORAGE_KEYS.HAS_VOTED, false)
  );

  useEffect(() => {
    setStoredData(STORAGE_KEYS.OPTIONS, options);
    setStoredData(STORAGE_KEYS.VOTES, votes);
    setStoredData(STORAGE_KEYS.VOTING_ENABLED, votingEnabled);
    setStoredData(STORAGE_KEYS.HAS_VOTED, hasVoted);
  }, [options, votes, votingEnabled, hasVoted]);

  const handleVote = (index: number) => {
    if (!hasVoted && votingEnabled) {
      setVotes(prev => prev.map((v, i) => i === index ? v + 1 : v));
      setHasVoted(true);
    }
  };

  const toggleVoting = () => {
    setVotingEnabled(prev => !prev);
  };

  return (
    <VotingContext.Provider value={{
      options,
      votes,
      votingEnabled,
      hasVoted,
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