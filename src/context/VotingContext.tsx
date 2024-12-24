import React, { createContext, useContext, useState, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import { getWebSocketUrl } from '../config/websocket';

interface VotingOption {
  id: string;
  name: string;
  votes: number;
}

interface VotingContextType {
  isVotingActive: boolean;
  options: VotingOption[];
  hasVoted: boolean;
  toggleVoting: () => void;
  handleVote: (optionId: string) => void;
  handleNameChange: (optionId: string, newName: string) => void;
}

const VotingContext = createContext<VotingContextType | null>(null);

export function VotingProvider({ children }: { children: React.ReactNode }) {
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [options, setOptions] = useState<VotingOption[]>([
    { id: '1', name: 'Option 1', votes: 0 },
    { id: '2', name: 'Option 2', votes: 0 },
    { id: '3', name: 'Option 3', votes: 0 },
  ]);

  const handleMessage = useCallback((data: any) => {
    if (data.type === 'STATE_UPDATE') {
      setIsVotingActive(data.payload.isActive);
      setOptions(data.payload.options);
      if (!data.payload.isActive) {
        setHasVoted(false);
      }
    }
  }, []);

  const { sendMessage } = useWebSocket(getWebSocketUrl(), handleMessage);

  const toggleVoting = () => {
    sendMessage({ type: 'TOGGLE_VOTING' });
  };

  const handleVote = (optionId: string) => {
    if (!isVotingActive || hasVoted) return;
    sendMessage({ type: 'VOTE', payload: optionId });
    setHasVoted(true);
  };

  const handleNameChange = (optionId: string, newName: string) => {
    if (isVotingActive) return;
    sendMessage({ type: 'CHANGE_NAME', payload: { id: optionId, name: newName } });
  };

  return (
    <VotingContext.Provider value={{
      isVotingActive,
      options,
      hasVoted,
      toggleVoting,
      handleVote,
      handleNameChange,
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