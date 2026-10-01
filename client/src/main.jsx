import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { SolanaWalletProvider } from './context/SolanaWalletProvider.jsx';

// Suppress Lit dev mode warning in development
if (typeof window !== 'undefined') {
  window.litDisableDevMode = true;
}

// Polyfill Buffer in browser window
import { Buffer } from 'buffer';
window.Buffer = window.Buffer || Buffer;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SolanaWalletProvider>
      <App />
    </SolanaWalletProvider>
  </React.StrictMode>,
);
