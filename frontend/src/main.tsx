// File Path: frontend/src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// This is the correct structure
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);