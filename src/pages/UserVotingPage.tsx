import React, { useEffect, useState } from 'react';
import { VoteOption } from '../components/VoteOption';
import { useVoting } from '../context/VotingContext';
import { Layout } from '../components/Layout';
import { getCurrentSessionId, hasUserVotedInSession, markUserAsVotedInSession } from '../utils/voteTracking';

export function UserVotingPage() {
  const { questions, handleVote } = useVoting();
  const [hasVoted, setHasVoted] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    if (questions && questions.length > 0) {
      const currentSessionId = getCurrentSessionId(questions[0].options);
      setSessionId(currentSessionId);
      setHasVoted(hasUserVotedInSession(currentSessionId));
    }
  }, [questions]);

  const handleVoteClick = (questionId: number, idx: number) => {
    if (!hasUserVotedInSession(sessionId)) {
      handleVote(questionId, idx);
      markUserAsVotedInSession(sessionId);
      setHasVoted(true);
    }
  };

  if (hasVoted) {
    return (
      <Layout>
        <div className="glass-panel text-center">
          <p className="text-2xl text-white mb-4">
            ¡Gracias por tu voto!
          </p>
          <p className="text-white/70">
            Ya has participado en esta votación.
          </p>
        </div>
      </Layout>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Layout>
        <div className="text-center text-white">
          <p className="text-2xl mb-4">
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
                  onVote={() => handleVoteClick(question.id, idx)}
                  disabled={hasVoted}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}