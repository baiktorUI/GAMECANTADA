import React, { useState, useEffect } from 'react';
import { AdminScreen } from './components/AdminScreen';
import { VotingScreen } from './components/VotingScreen';
import { initializeFirebase, votingService } from './services/firebase';
import type { VotingState } from './types/voting';
import './index.css';
import './VotingApp.css';

// Inicializar Firebase
initializeFirebase();

const VotingApp: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [votingState, setVotingState] = useState<VotingState>({
    isActive: false,
    hasEnded: false,
    votes: {
      blau: 0,
      taronja: 0
    }
  });

  useEffect(() => {
    // Detectar si es admin por la URL (ej: ?admin=true)
    const params = new URLSearchParams(window.location.search);
    const adminParam = params.get('admin');
    setIsAdmin(adminParam === 'true');

    // Escuchar cambios en tiempo real
    const unsubscribe = votingService.subscribeToVotes((votes) => {
      setVotingState(prev => ({
        ...prev,
        votes
      }));
    });

    // Escuchar estado de la votación
    const unsubscribeState = votingService.subscribeToVotingState((state) => {
      setVotingState(prev => ({
        ...prev,
        isActive: state.isActive,
        hasEnded: state.hasEnded
      }));
    });

    return () => {
      unsubscribe();
      unsubscribeState();
    };
  }, []);

  const handleStartVoting = async () => {
    await votingService.startVoting();
  };

  const handleEndVoting = async () => {
    await votingService.endVoting();
  };

  const handleResetVoting = async () => {
    await votingService.resetVoting();
  };

  const handleVote = async (team: 'blau' | 'taronja') => {
    await votingService.vote(team);
  };

  if (isAdmin) {
    return (
      <AdminScreen
        votingState={votingState}
        onStartVoting={handleStartVoting}
        onEndVoting={handleEndVoting}
        onResetVoting={handleResetVoting}
      />
    );
  }

  return (
    <VotingScreen
      votingState={votingState}
      onVote={handleVote}
    />
  );
};

export default VotingApp;
