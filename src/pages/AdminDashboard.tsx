import React from 'react';
import { LiveResults } from '../components/LiveResults';
import { ShareLink } from '../components/ShareLink';
import { useVoting } from '../context/VotingContext';
import { Layout } from '../components/Layout';

export function AdminDashboard() {
  const { questions } = useVoting();

  if (!questions.length) {
    return (
      <Layout>
        <div className="text-center text-white">
          <p className="text-2xl mb-4">No hay opciones configuradas.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <ShareLink />
        <div>
          <h2 className="text-2xl font-bold text-white mb-8">
            Resultados en Tiempo Real
          </h2>
          <div className="space-y-8">
            {questions.map((question) => (
              <LiveResults key={question.id} question={question} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}