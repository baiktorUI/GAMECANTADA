import React, { useState, useEffect } from 'react';
import { QuestionForm } from '../components/QuestionForm';
import { AdminDashboard } from './AdminDashboard';
import { useVoting } from '../context/VotingContext';
import { Layout } from '../components/Layout';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/localStorage';
import type { Question } from '../types';

export function AdminPage() {
  const { questions, setQuestions } = useVoting();
  const [isAdmin] = useState(() => getStoredData(STORAGE_KEYS.ADMIN, false));
  const [showDashboard, setShowDashboard] = useState(questions.length > 0);

  useEffect(() => {
    setStoredData(STORAGE_KEYS.ADMIN, true);
  }, []);

  const handleSubmit = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    setShowDashboard(true);
  };

  if (!isAdmin) {
    return (
      <Layout>
        <div className="glass-panel text-center">
          <p className="text-2xl text-white">Acceso no autorizado</p>
        </div>
      </Layout>
    );
  }

  if (showDashboard) {
    return <AdminDashboard />;
  }

  return (
    <Layout>
      <QuestionForm onSubmit={handleSubmit} />
    </Layout>
  );
}