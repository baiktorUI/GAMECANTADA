import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminPanel } from './components/AdminPanel';
import { UserPanel } from './components/UserPanel';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/votacio" replace />} />
        <Route 
          path="/admin" 
          element={
            <Layout>
              <AdminPanel />
            </Layout>
          } 
        />
        <Route 
          path="/votacio" 
          element={
            <Layout>
              <UserPanel />
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