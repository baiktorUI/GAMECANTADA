import React from 'react';
import { Play, Pause } from 'lucide-react';
import { VotingOption } from './components/VotingOption';
import { VotingChart } from './components/VotingChart';
import { useVoting } from './context/VotingContext';

function App() {
  const {
    isVotingActive,
    options,
    hasVoted,
    toggleVoting,
    handleVote,
    handleNameChange,
  } = useVoting();

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Live Voting</h1>
          <button
            onClick={toggleVoting}
            className={`flex items-center gap-2 py-2 px-4 rounded-md ${
              isVotingActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-500 hover:bg-green-600'
            } text-white transition-colors`}
          >
            {isVotingActive ? (
              <>
                <Pause size={20} /> Stop Voting
              </>
            ) : (
              <>
                <Play size={20} /> Start Voting
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {options.map((option) => (
            <VotingOption
              key={option.id}
              option={option}
              onVote={() => handleVote(option.id)}
              onNameChange={(newName) => handleNameChange(option.id, newName)}
              isVotingActive={isVotingActive}
              canVote={!hasVoted}
            />
          ))}
        </div>

        <VotingChart data={options} />
      </div>
    </div>
  );
}

export default App;