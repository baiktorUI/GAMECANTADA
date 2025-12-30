import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import VotingApp from './VotingApp.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VotingApp />
  </StrictMode>
);
