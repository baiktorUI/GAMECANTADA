import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/localStorage';
import { votingWebSocket } from '../utils/websocket';
import { sendVote } from '../utils/api';

interface VotingState {
  options: string[];
  votes: number[];
  votingEnabled: boolean;
  hasVoted: boolean;
}

interface VotingContextType {
  options: string[];
  votes: number[];
  votingEnabled: boolean;
  hasVoted: boolean;
  setOptions: (options: string[]) => void;
  toggleVoting: () => void;
  handleVote: (index: number) => Promise<void>;
}

const VotingContext = createContext<VotingContextType | null>(null);

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VotingState>({
    options: getStoredData(STORAGE_KEYS.OPTIONS, ['', '', '']),
    votes: getStoredData(STORAGE_KEYS.VOTES, [0, 0, 0]),
    votingEnabled: getStoredData(STORAGE_KEYS.VOTING_ENABLED, false),
    hasVoted: getStoredData(STORAGE_KEYS.HAS_VOTED, false)
  });

  useEffect(() => {
    votingWebSocket.connect((votes) => {
      setState(prev => ({ ...prev, votes }));
    });

    return () => votingWebSocket.disconnect();
  }, []);

  const setOptions = (newOptions: string[]) => {
    setState(prev => ({ ...prev, options: newOptions }));
    setStoredData(STORAGE_KEYS.OPTIONS, newOptions);
  };

  const toggleVoting = () => {
    setState(prev => ({ 
      ...prev, 
      votingEnabled: !prev.votingEnabled 
    }));
    setStoredData(STORAGE_KEYS.VOTING_ENABLED, !state.votingEnabled);
  };

  const handleVote = async (index: number) => {
    if (!state.hasVoted && state.votingEnabled) {
      try {
        await sendVote(index);
        setState(prev => ({ ...prev, hasVoted: true }));
        setStoredData(STORAGE_KEYS.HAS_VOTED, true);
      } catch (err) {
        console.error('Error voting:', err);
      }
    }
  };

  const value = {
    ...state,
    setOptions,
    toggleVoting,
    handleVote
  };

  return (
    <VotingContext.Provider value={value}>
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