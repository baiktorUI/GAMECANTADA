import React from "react";
import { Bar } from "react-chartjs-2";

const ResultsChart = ({ votes }) => {
  const data = {
    labels: ["Opción 1", "Opción 2", "Opción 3"],
    datasets: [
      {
        label: "Votos",
        data: [votes.option1, votes.option2, votes.option3],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div>
      <h2>Resultados</h2>
      <Bar data={data} />
    </div>
  );
};

export default ResultsChart;
