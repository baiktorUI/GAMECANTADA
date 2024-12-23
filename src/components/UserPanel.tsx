import React from 'react';
import { Lock } from 'lucide-react';
import { useVoting } from '../context/VotingContext';

export function UserPanel() {
  const { options, votingEnabled, hasVoted, handleVote } = useVoting();

  if (!votingEnabled) {
    return (
      <div className="glass-panel text-center">
        <Lock className="w-12 h-12 text-white/50 mx-auto mb-4" />
        <p className="text-white/70">La votación no está activa en este momento</p>
      </div>
    );
  }

  if (hasVoted) {
    return (
      <div className="glass-panel text-center">
        <h2 className="text-2xl font-bold text-white mb-4">¡Gracias por tu voto!</h2>
        <p className="text-white/70">Tu voto ha sido registrado correctamente.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel">
      <h2 className="text-2xl font-bold text-white mb-6">Votación</h2>
      <div className="space-y-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleVote(index)}
            className="btn-primary w-full"
            disabled={!option}
          >
            {option || `Opción ${index + 1}`}
          </button>
        ))}
      </div>
    </div>
  );
}