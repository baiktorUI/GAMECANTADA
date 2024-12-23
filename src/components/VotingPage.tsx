import React from 'react';
import { VoteOption } from './VoteOption';
import { useVotingState } from '../hooks/useVotingState';
import type { Question } from '../types';

interface VotingPageProps {
  questions: Question[];
  onVote: (questionId: number, optionIndex: number) => void;
  onComplete: () => void;
}

export function VotingPage({ questions, onVote, onComplete }: VotingPageProps) {
  const { hasVoted, recordVote } = useVotingState();

  const handleVote = (questionId: number, optionIndex: number) => {
    if (!hasVoted(questionId)) {
      onVote(questionId, optionIndex);
      recordVote(questionId);
    }
  };

  const allQuestionsVoted = questions.every(q => hasVoted(q.id));

  return (
    <div className="space-y-8 w-full max-w-2xl">
      {questions.map((question) => (
        <div key={question.id} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Selecciona una opción:</h3>
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <VoteOption
                key={idx}
                option={option}
                onVote={() => handleVote(question.id, idx)}
                disabled={hasVoted(question.id)}
              />
            ))}
          </div>
          {hasVoted(question.id) && (
            <p className="mt-4 text-sm text-gray-500">
              Ya has votado en esta pregunta
            </p>
          )}
        </div>
      ))}
      
      <button
        onClick={onComplete}
        disabled={!allQuestionsVoted}
        className={`w-full py-2 px-4 rounded-md transition-colors ${
          allQuestionsVoted
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Ver resultados
      </button>
    </div>
  );
}