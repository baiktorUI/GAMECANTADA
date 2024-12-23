import React from 'react';
import { useVoting } from '../context/VotingContext';
import { Lock } from 'lucide-react';

export function VotingPage() {
  const { options, votingEnabled, hasVoted, handleVote } = useVoting();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-blue-800 to-blue-950 p-4">
      <div className="max-w-md mx-auto">
        {!votingEnabled ? (
          <div className="glass-panel text-center">
            <Lock className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">La votación no está activa</p>
          </div>
        ) : hasVoted ? (
          <div className="glass-panel text-center">
            <h2 className="text-2xl font-bold text-white mb-4">¡Gracias por tu voto!</h2>
            <p className="text-white/70">Tu voto ha sido registrado</p>
          </div>
        ) : (
          <div className="glass-panel">
            <h2 className="text-2xl font-bold text-white mb-6">Elige una opción</h2>
            <div className="space-y-4">
              {options.map((option, index) => (
                option && (
                  <button
                    key={index}
                    onClick={() => handleVote(index)}
                    className="btn-primary w-full text-left"
                  >
                    {option}
                  </button>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}