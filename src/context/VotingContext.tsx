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

export function useVoting() {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
}

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VotingState>({
    options: ['', '', ''],
    votes: [0, 0, 0],
    votingEnabled: false,
    hasVoted: getStoredData(STORAGE_KEYS.HAS_VOTED, false)
  });

  useEffect(() => {
    votingWebSocket.connect((data) => {
      setState(prev => ({
        ...prev,
        votes: data.votes,
        options: data.options,
        votingEnabled: data.votingEnabled
      }));
    });

    return () => {
      votingWebSocket.disconnect();
    };
  }, []);

  const setOptions = async (newOptions: string[]) => {
    try {
      await fetch('/api/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ options: newOptions })
      });
    } catch (error) {
      console.error('Error updating options:', error);
    }
  };

  const toggleVoting = async () => {
    try {
      await fetch('/api/toggle-voting', { method: 'POST' });
    } catch (error) {
      console.error('Error toggling voting:', error);
    }
  };

  const handleVote = async (index: number) => {
    if (state.hasVoted || !state.votingEnabled) return;

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ index })
      });

      if (response.ok) {
        setState(prev => ({ ...prev, hasVoted: true }));
        setStoredData(STORAGE_KEYS.HAS_VOTED, true);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  return (
    <VotingContext.Provider value={{ ...state, setOptions, toggleVoting, handleVote }}>
      {children}
    </VotingContext.Provider>
  );
}