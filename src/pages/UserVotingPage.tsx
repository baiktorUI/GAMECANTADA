import React from 'react';
import { VoteOption } from '../components/VoteOption';
import { useVoting } from '../context/VotingContext';
import { Layout } from '../components/Layout';

export function UserVotingPage() {
  const { questions, handleVote, hasUserVoted } = useVoting();

  if (!questions || questions.length === 0) {
    return (
      <Layout>
        <div className="glass-panel text-center">
          <p className="text-2xl text-white mb-4">
            No hay opciones disponibles para votar.
          </p>
          <p className="text-white/70">
            Por favor, espera a que el administrador configure las opciones.
          </p>
        </div>
      </Layout>
    );
  }

  if (hasUserVoted()) {
    return (
      <Layout>
        <div className="glass-panel text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¡Gracias por tu voto!
          </h2>
          <p className="text-white/70">
            Tu voto ha sido registrado correctamente.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {questions.map((question) => (
          <div key={question.id} className="glass-panel">
            <h2 className="text-2xl font-bold text-white mb-6">
              Selecciona tu opción
            </h2>
            <div className="space-y-4">
              {question.options.map((option, idx) => (
                <VoteOption
                  key={`${question.id}-${idx}`}
                  option={option}
                  onVote={() => handleVote(question.id, idx)}
                  disabled={hasUserVoted()}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}