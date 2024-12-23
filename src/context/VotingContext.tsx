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
  setOptions: (options: string[]) => Promise<void>;
  toggleVoting: () => Promise<void>;
  handleVote: (index: number) => Promise<void>;
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
    const fetchInitialState = async () => {
      try {
        const response = await fetch('/api/state');
        const data = await response.json();
        setState(prev => ({
          ...prev,
          options: data.options,
          votes: data.votes,
          votingEnabled: data.votingEnabled
        }));
      } catch (error) {
        console.error('Error fetching initial state:', error);
      }
    };

    fetchInitialState();

    votingWebSocket.connect((newState) => {
      setState(prev => ({
        ...prev,
        options: newState.options,
        votes: newState.votes,
        votingEnabled: newState.votingEnabled
      }));
    });

    return () => votingWebSocket.disconnect();
  }, []);

  const setOptions = async (newOptions: string[]) => {
    try {
      const response = await fetch('/api/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ options: newOptions })
      });

      if (!response.ok) {
        throw new Error('Error updating options');
      }

      setState(prev => ({ ...prev, options: newOptions }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleVoting = async () => {
    try {
      const response = await fetch('/api/toggle-voting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Error toggling voting state');
      }

      setState(prev => ({ ...prev, votingEnabled: !prev.votingEnabled }));
    } catch (error) {
      console.error('Error:', error);
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
      console.error('Error:', error);
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