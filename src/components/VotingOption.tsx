import React from 'react';
import { EditableText } from './EditableText';

interface VotingOptionProps {
  option: {
    id: string;
    name: string;
    votes: number;
  };
  onVote: () => void;
  onNameChange: (name: string) => void;
  isVotingActive: boolean;
  canVote: boolean;
}

export const VotingOption: React.FC<VotingOptionProps> = ({
  option,
  onVote,
  onNameChange,
  isVotingActive,
  canVote,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <EditableText
        value={option.name}
        onSave={onNameChange}
        isEditable={!isVotingActive}
      />
      <p className="text-gray-600 my-4">Votes: {option.votes}</p>
      <button
        onClick={onVote}
        disabled={!isVotingActive || !canVote}
        className={`w-full py-2 px-4 rounded-md transition-colors ${
          isVotingActive && canVote
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-300 cursor-not-allowed text-gray-600'
        }`}
      >
        {!canVote ? 'Already Voted' : 'Vote'}
      </button>
    </div>
  );
};