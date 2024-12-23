import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { VotingProvider } from './context/VotingContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <StrictMode>
    <VotingProvider>
      <App />
    </VotingProvider>
  </StrictMode>
);