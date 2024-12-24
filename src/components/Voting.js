import React, { useState, useEffect } from "react";
import { database, ref, update, onValue } from "../firebase";

const Voting = ({ votingActive, userVoted, setUserVoted }) => {
  const [votes, setVotes] = useState({ option1: 0, option2: 0, option3: 0 });

  useEffect(() => {
    const votesRef = ref(database, "votes/");
    onValue(votesRef, (snapshot) => {
      if (snapshot.exists()) {
        setVotes(snapshot.val());
      }
    });
  }, []);

  const handleVote = (option) => {
    if (!votingActive || userVoted) return;

    const optionRef = ref(database, `votes/${option}`);
    update(optionRef, { ".value": votes[option] + 1 });
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
