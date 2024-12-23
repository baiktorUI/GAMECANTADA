import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { VotingProvider } from './context/VotingContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VotingProvider>
      <App />
    </VotingProvider>
  </StrictMode>
);