import React from 'react';
import { AdminPanel } from './components/AdminPanel';
import { UserPanel } from './components/UserPanel';
import { useVoting } from './context/VotingContext';

export default function App() {
  const { isAdmin, setIsAdmin } = useVoting();

  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, #e03c0a, #0e487e, #020234)' }}>
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => setIsAdmin(!isAdmin)} 
          className="btn-primary mb-8"
        >
          Cambiar a {isAdmin ? 'Usuario' : 'Admin'}
        </button>
        
        {isAdmin ? <AdminPanel /> : <UserPanel />}
      </div>
    </div>
  );
}