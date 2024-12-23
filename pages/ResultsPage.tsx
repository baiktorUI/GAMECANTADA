import React from 'react';
import { useVoting } from '../context/VotingContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ResultsPage() {
  const { options, votes } = useVoting();

  const chartData = options.map((option, index) => ({
    name: option || `Opción ${index + 1}`,
    votos: votes[index]
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-blue-800 to-blue-950">
      <div className="container mx-auto px-4 py-8">
        <div className="glass-panel">
          <h2 className="text-2xl font-bold text-white mb-6">Resultados en Tiempo Real</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer>
              <BarChart data={chartData}>
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
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}