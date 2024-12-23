import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { VotingProvider } from './context/VotingContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <VotingProvider>
      <App />
    </VotingProvider>
  </StrictMode>
);