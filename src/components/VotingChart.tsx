import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface VotingChartProps {
  data: Array<{
    name: string;
    votes: number;
  }>;
}

export const VotingChart: React.FC<VotingChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px] bg-white p-4 rounded-lg shadow-md">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="votes" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};