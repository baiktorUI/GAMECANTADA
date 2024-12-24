import React, { useState, useEffect } from "react";
import Voting from "./components/Voting";
import ResultsChart from "./components/ResultsChart";
import { database, ref, set, update, onValue } from "./firebase";

const App = () => {
  const [votingActive, setVotingActive] = useState(false);
  const [userVoted, setUserVoted] = useState(false);
  const [votes, setVotes] = useState({ option1: 0, option2: 0, option3: 0 });

  useEffect(() => {
    const votesRef = ref(database, "votes/");
    onValue(votesRef, (snapshot) => {
      if (snapshot.exists()) {
        setVotes(snapshot.val());
      }
    });
  }, []);

  const toggleVoting = () => {
    setVotingActive((prev) => !prev);
    if (!votingActive) {
      // Reiniciar los votos
      set(ref(database, "votes/"), { option1: 0, option2: 0, option3: 0 });
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
        userVoted={userVoted}
        setUserVoted={setUserVoted}
      />
      <ResultsChart votes={votes} />
    </div>
  );
};

export default App;
