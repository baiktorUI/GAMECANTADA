import React, { useState, useEffect } from 'react';
import type { VotingState } from '../types/voting';

interface VotingScreenProps {
  votingState: VotingState;
  onVote: (team: 'blau' | 'taronja') => void;
}

export const VotingScreen: React.FC<VotingScreenProps> = ({ votingState, onVote }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<'blau' | 'taronja' | null>(null);

  // Comprobar si ya ha votado al cargar
  useEffect(() => {
    const voted = localStorage.getItem('hasVoted');
    const team = localStorage.getItem('votedTeam') as 'blau' | 'taronja' | null;
    
    if (voted === 'true' && team) {
      setHasVoted(true);
      setSelectedTeam(team);
    }
  }, []);

  // Resetear voto cuando se resetea la votación
  useEffect(() => {
    if (!votingState.isActive && !votingState.hasEnded) {
      localStorage.removeItem('hasVoted');
      localStorage.removeItem('votedTeam');
      setHasVoted(false);
      setSelectedTeam(null);
    }
  }, [votingState.isActive, votingState.hasEnded]);

  const handleVote = (team: 'blau' | 'taronja') => {
    if (hasVoted) return;
    
    setSelectedTeam(team);
    setHasVoted(true);
    
    // Guardar en localStorage para evitar votos repetidos
    localStorage.setItem('hasVoted', 'true');
    localStorage.setItem('votedTeam', team);
    
    onVote(team);
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
        <h1 className="vote-title">VOTA EL TEU EQUIP</h1>
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
