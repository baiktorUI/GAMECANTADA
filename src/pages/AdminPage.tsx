import React, { useState } from 'react';
import { QuestionForm } from '../components/QuestionForm';
import { AdminDashboard } from './AdminDashboard';
import { useVoting } from '../context/VotingContext';
import { Layout } from '../components/Layout';
import type { Question } from '../types';

export function AdminPage() {
  const [showDashboard, setShowDashboard] = useState(false);
  const { setQuestions } = useVoting();

  const handleSubmit = (questions: Question[]) => {
    setQuestions(questions);
    setShowDashboard(true);
  };

  if (showDashboard) {
    return <AdminDashboard />;
  }

  return (
    <Layout>
      <QuestionForm onSubmit={handleSubmit} />
    </Layout>
  );
}