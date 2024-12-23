import React from 'react';
import { useVoting } from '../context/VotingContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function AdminPanel() {
  const { 
    options, 
    votes, 
    votingEnabled, 
    setOptions, 
    toggleVoting 
  } = useVoting();

  const handleOptionChange = (index: number, value: string) => {
    setOptions(options.map((opt, idx) => idx === index ? value : opt));
  };

  const chartData = options.map((option, index) => ({
    name: option || `Opción ${index + 1}`,
    votos: votes[index]
  }));

  return (
    <div className="space-y-8">
      <div className="glass-panel">
        <h2 className="text-2xl font-bold text-white mb-6">Panel de Administrador</h2>
        <div className="space-y-4">
          {options.map((option, index) => (
            <input
              key={index}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder={`Opción ${index + 1}`}
              className="input-field"
            />
          ))}
          <button 
            onClick={toggleVoting}
            className={`btn-primary w-full ${votingEnabled ? 'bg-red-500' : 'bg-green-500'}`}
          >
            {votingEnabled ? 'Detener Votación' : 'Iniciar Votación'}
          </button>
        </div>
      </div>

      <div className="glass-panel">
        <h2 className="text-2xl font-bold text-white mb-6">Resultados en Tiempo Real</h2>
        <div className="bg-white/10 p-4 rounded-xl">
          <BarChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Bar dataKey="votos" fill="rgba(255,255,255,0.8)" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}