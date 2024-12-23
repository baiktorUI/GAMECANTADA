import React, { createContext, useContext, useState, useEffect } from 'react';
import { votingWebSocket } from '../utils/websocket';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/localStorage';

interface VotingState {
  options: string[];
  votes: number[];
  votingEnabled: boolean;
  hasVoted: boolean;
}

interface VotingContextType extends VotingState {
  setOptions: (options: string[]) => void;
  toggleVoting: () => void;
  handleVote: (index: number) => void;
}

const VotingContext = createContext<VotingContextType | null>(null);

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VotingState>({
    options: ['', '', ''],
    votes: [0, 0, 0],
    votingEnabled: false,
    hasVoted: getStoredData(STORAGE_KEYS.HAS_VOTED, false)
  });

  useEffect(() => {
    votingWebSocket.connect((newVotes) => {
      setState(prev => ({ ...prev, votes: newVotes }));
    });

    return () => {
      votingWebSocket.disconnect();
    };
  }, []);

  const setOptions = (newOptions: string[]) => {
    fetch('/api/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ options: newOptions })
    });
    setState(prev => ({ ...prev, options: newOptions }));
  };

  const toggleVoting = () => {
    fetch('/api/toggle-voting', { method: 'POST' });
    setState(prev => ({ ...prev, votingEnabled: !prev.votingEnabled }));
  };

  const handleVote = async (index: number) => {
    if (state.hasVoted || !state.votingEnabled) return;

    try {
      await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });

      setState(prev => ({ ...prev, hasVoted: true }));
      setStoredData(STORAGE_KEYS.HAS_VOTED, true);
    } catch (error) {
      console.error('Error al votar:', error);
    }
  };

  return (
    <VotingContext.Provider value={{ ...state, setOptions, toggleVoting, handleVote }}>
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