import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { VotingPage } from './pages/VotingPage';
import { ResultsPage } from './pages/ResultsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminPage />} />
        <Route path="/votacio" element={<VotingPage />} />
        <Route path="/resultats" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}