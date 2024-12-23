import React from 'react';

interface VoteOptionProps {
  option: string;
  onVote: () => void;
  disabled: boolean;
}

export function VoteOption({ option, onVote, disabled }: VoteOptionProps) {
  return (
    <button
      onClick={onVote}
      disabled={disabled}
      className={`btn-primary w-full justify-start
        ${disabled ? 'opacity-50' : 'hover:scale-[1.02]'}`}
    >
      {option}
    </button>
  );
}