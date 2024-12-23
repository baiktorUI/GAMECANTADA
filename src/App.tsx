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
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/votacio/guanyador" element={<UserVotingPage />} />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl">Página no encontrada</p>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </VotingProvider>
  );
}