import React from "react";

const Voting = ({ votingActive, votes, setVotes, userVoted, setUserVoted }) => {
  const handleVote = (option) => {
    if (!votingActive || userVoted) return;

    setVotes((prevVotes) => ({
      ...prevVotes,
      [option]: prevVotes[option] + 1,
    }));
    setUserVoted(true);
  };

  return (
    <div>
      <h2>Votación</h2>
      <button
        disabled={!votingActive || userVoted}
        onClick={() => handleVote("option1")}
      >
        Opción 1
      </button>
      <button
        disabled={!votingActive || userVoted}
        onClick={() => handleVote("option2")}
      >
        Opción 2
      </button>
      <button
        disabled={!votingActive || userVoted}
        onClick={() => handleVote("option3")}
      >
        Opción 3
      </button>
    </div>
  );
};

export default Voting;
