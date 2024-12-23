import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Question } from '../types';

interface LiveResultsProps {
  question: Question;
}

export function LiveResults({ question }: LiveResultsProps) {
  const data = question.options.map((option, index) => ({
    name: option,
    votes: question.votes[index]
  }));

  const totalVotes = question.votes.reduce((sum, count) => sum + count, 0);
  const maxVotes = Math.max(...question.votes);
  const winningOption = question.options[question.votes.indexOf(maxVotes)];

  return (
    <div className="glass-panel">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} stroke="white" />
            <XAxis dataKey="name" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Bar dataKey="votes" fill="rgba(255, 255, 255, 0.8)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-white/70">
          Total votos: <span className="font-semibold text-white">{totalVotes}</span>
        </p>
        {totalVotes > 0 && (
          <p className="text-white/70">
            Opción más votada: <span className="font-semibold text-white">{winningOption}</span>
          </p>
        )}
      </div>
    </div>
  );
}