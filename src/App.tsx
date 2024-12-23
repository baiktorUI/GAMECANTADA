import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminPage } from './pages/AdminPage';
import { UserVotingPage } from './pages/UserVotingPage';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/votacio/guanyador" replace />} />
        <Route 
          path="/admin" 
          element={
            <Layout>
              <AdminPage />
            </Layout>
          } 
        />
        <Route 
          path="/votacio/guanyador" 
          element={
            <Layout>
              <UserVotingPage />
            </Layout>
          } 
        />
        <Route 
          path="*" 
          element={
            <Layout>
              <div className="glass-panel text-center">
                <h2 className="text-2xl font-bold text-white mb-4">404</h2>
                <p className="text-white/70">Página no encontrada</p>
              </div>
            </Layout>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}