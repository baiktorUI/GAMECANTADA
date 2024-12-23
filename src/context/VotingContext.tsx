import React, { createContext, useContext, useState, useEffect } from 'react';
import { votingWebSocket } from '../utils/websocket';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/localStorage';
import * as api from '../utils/api';

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
    const initializeState = async () => {
      try {
        const initialState = await api.fetchState();
        setState(prev => ({
          ...prev,
          options: initialState.options,
          votes: initialState.votes,
          votingEnabled: initialState.votingEnabled
        }));
      } catch (error) {
        console.error('Error initializing state:', error);
      }
    };

    initializeState();

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
      await api.updateOptions(newOptions);
    } catch (error) {
      console.error('Error updating options:', error);
    }
  };

  const toggleVoting = async () => {
    try {
      await api.toggleVoting();
    } catch (error) {
      console.error('Error toggling voting:', error);
    }
  };

  const handleVote = async (index: number) => {
    if (state.hasVoted || !state.votingEnabled) return;

    try {
      await api.submitVote(index);
      setState(prev => ({ ...prev, hasVoted: true }));
      setStoredData(STORAGE_KEYS.HAS_VOTED, true);
    } catch (error) {
      console.error('Error submitting vote:', error);
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