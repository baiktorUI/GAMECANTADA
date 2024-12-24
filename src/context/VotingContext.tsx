import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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
    console.log('Processing message in VotingContext:', data);
    if (data.type === 'STATE_UPDATE') {
      setIsVotingActive(data.payload.isActive);
      setOptions(data.payload.options);
      if (!data.payload.isActive) {
        setHasVoted(false);
      }
    }
  }, []);

  const { sendMessage } = useWebSocket(getWebSocketUrl(), handleMessage);

  const toggleVoting = useCallback(() => {
    console.log('Toggling voting...');
    sendMessage({ type: 'TOGGLE_VOTING' });
  }, [sendMessage]);

  const handleVote = useCallback((optionId: string) => {
    if (!isVotingActive || hasVoted) {
      console.log('Vote rejected:', { isVotingActive, hasVoted });
      return;
    }
    console.log('Sending vote for option:', optionId);
    sendMessage({ type: 'VOTE', payload: optionId });
    setHasVoted(true);
  }, [isVotingActive, hasVoted, sendMessage]);

  const handleNameChange = useCallback((optionId: string, newName: string) => {
    if (isVotingActive) {
      console.log('Name change rejected: voting is active');
      return;
    }
    console.log('Changing name for option:', optionId, newName);
    sendMessage({ type: 'CHANGE_NAME', payload: { id: optionId, name: newName } });
  }, [isVotingActive, sendMessage]);

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