import React, { useState, useEffect } from "react";
import Voting from "./components/Voting";
import ResultsChart from "./components/ResultsChart";

const App = () => {
  const [votingActive, setVotingActive] = useState(false);
  const [votes, setVotes] = useState(
    JSON.parse(localStorage.getItem("votes")) || { option1: 0, option2: 0, option3: 0 }
  );
  const [userVoted, setUserVoted] = useState(
    JSON.parse(localStorage.getItem("userVoted")) || false
  );

  useEffect(() => {
    // Guardar estado en localStorage
    localStorage.setItem("votes", JSON.stringify(votes));
    localStorage.setItem("userVoted", JSON.stringify(userVoted));
  }, [votes, userVoted]);

  const toggleVoting = () => {
    setVotingActive((prev) => !prev);
    if (!votingActive) {
      setVotes({ option1: 0, option2: 0, option3: 0 });
      setUserVoted(false);
    }
  };

  return (
    <div>
      <h1>Sistema de Votación</h1>
      <button onClick={toggleVoting}>
        {votingActive ? "Detener Votación" : "Iniciar Votación"}
      </button>
      <Voting
        votingActive={votingActive}
        votes={votes}
        setVotes={setVotes}
        userVoted={userVoted}
        setUserVoted={setUserVoted}
      />
      <ResultsChart votes={votes} />
    </div>
  );
};

export default App;
