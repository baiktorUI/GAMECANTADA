import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Question } from '../types';

interface ResultsPageProps {
  questions: Question[];
  onReset: () => void;
}

export function ResultsPage({ questions, onReset }: ResultsPageProps) {
  return (
    <div className="space-y-8 w-full max-w-2xl">
      {questions.map((question) => (
        <div key={question.id} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Resultados:</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={question.options.map((option, index) => ({
                  name: option,
                  votes: question.votes[index]
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="votes" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <p className="text-lg font-medium">
              Opción ganadora: {
                question.options[
                  question.votes.indexOf(Math.max(...question.votes))
                ]
              }
            </p>
          </div>
        </div>
      ))}
      
      <button
        onClick={onReset}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Crear nuevas opciones
      </button>
    </div>
  );
}