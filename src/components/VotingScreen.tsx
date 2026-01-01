import React, { useState, useEffect } from 'react';
import type { VotingState } from '../types/voting';

interface VotingScreenProps {
  votingState: VotingState;
  onVote: (team: 'blau' | 'taronja') => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({ votingState, onVote }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'blau' | 'taronja' | null>(null);
  const [checking, setChecking] = useState(true);

  // Verificar en Firebase si este dispositivo ya votó
  useEffect(() => {
    const checkVote = async () => {
      const { votingService, getDeviceId } = await import('../services/firebase');
      const deviceId = getDeviceId();
      const voteData = await votingService.hasVoted(deviceId);
      
      if (voteData) {
        setHasVoted(true);
        setSelectedTeam(voteData.team);
      }
      setChecking(false);
    };
    
    checkVote();
  }, []);

  const handleVote = async (team: 'blau' | 'taronja') => {
    if (hasVoted || !votingState.isActive || checking) return;
    
    setHasVoted(true);
    setSelectedTeam(team);
    
    await onVote(team);
  };

  // PANTALLA: Esperando a que inicie la votación
  if (!votingState.isActive && !votingState.hasEnded) {
    return (
      <div className="app-container flex items-center justify-center">
        <div className="waiting-container">
          <div className="waiting-icon">⏳</div>
          <h2 className="waiting-title">Esperant a començar...</h2>
          <p className="waiting-subtitle">La votació començarà aviat</p>
        </div>
      </div>
    );
  }

  // PANTALLA: Votación finalizada
  if (votingState.hasEnded) {
    return (
      <div className="app-container flex items-center justify-center">
        <div className="ended-container">
          <div className="ended-icon">✅</div>
          <h2 className="ended-title">Votació finalitzada</h2>
          <p className="ended-subtitle">Gràcies per participar!</p>
          {hasVoted && selectedTeam && (
            <div className="voted-team">
              Has votat per: <strong>EQUIP {selectedTeam.toUpperCase()}</strong>
            </div>
          )}
        </div>
      </div>
    );
  }

  // PANTALLA: Ya ha votado
  if (hasVoted) {
    return (
      <div className="app-container flex items-center justify-center">
        <div className="voted-container">
          <div className="voted-icon">✅</div>
          <h2 className="voted-title">Vot registrat!</h2>
          <p className="voted-subtitle">
            Has votat per: <strong>EQUIP {selectedTeam?.toUpperCase()}</strong>
          </p>
          <div className="voted-message">
            Els resultats es mostraran quan acabi la votació
          </div>
        </div>
      </div>
    );
  }

  // PANTALLA: Votar
  return (
    <div className="app-container flex items-center justify-center">
      <div className="vote-container">
        <h1 className="vote-title">QUI HO HA FET MILLOR?</h1>
        <p className="vote-subtitle">Escull una opció</p>

        <div className="vote-buttons">
          <button
            onClick={() => handleVote('blau')}
            className="vote-button blau-button"
          >
            <div className="vote-button-content">
              <span className="vote-emoji">💙</span>
              <span className="vote-text">EQUIP BLAU</span>
            </div>
          </button>

          <div className="vote-vs">VS</div>

          <button
            onClick={() => handleVote('taronja')}
            className="vote-button taronja-button"
          >
            <div className="vote-button-content">
              <span className="vote-emoji">🧡</span>
              <span className="vote-text">EQUIP TARONJA</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
