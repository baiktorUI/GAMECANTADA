import React from 'react';
import { VoteOption } from '../components/VoteOption';
import { useVoting } from '../context/VotingContext';
import { Layout } from '../components/Layout';

export function VotingDashboard() {
  const { questions, hasVoted, handleVote } = useVoting();

  if (!questions || questions.length === 0) {
    return (
      <Layout>
        <div className="glass-panel text-center">
          <p className="text-2xl text-white mb-4">
            No hay opciones disponibles para votar.
          </p>
          <p className="text-white/70">
            Por favor, contacta con el administrador.
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
            <div className="space-y-4">
              {question.options.map((option, idx) => (
                <VoteOption
                  key={`${question.id}-${idx}`}
                  option={option}
                  onVote={() => handleVote(question.id, idx)}
                  disabled={hasVoted(question.id)}
                />
              ))}
            </div>
            {hasVoted(question.id) && (
              <p className="mt-4 text-white/70 text-center">
                Gracias por tu voto
              </p>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
}