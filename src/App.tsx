import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { UserVotingPage } from './pages/UserVotingPage';
import { VotingProvider } from './context/VotingContext';

export default function App() {
  return (
    <VotingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/votacio/guanyador" element={<UserVotingPage />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </VotingProvider>
  );
}