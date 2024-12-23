import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { VotingPage } from './pages/VotingPage';
import { ResultsPage } from './pages/ResultsPage';
import { VotingProvider } from './context/VotingContext';

export default function App() {
  return (
    <VotingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/votacio" element={<VotingPage />} />
          <Route path="/resultats" element={<ResultsPage />} />
        </Routes>
      </BrowserRouter>
    </VotingProvider>
  );
}