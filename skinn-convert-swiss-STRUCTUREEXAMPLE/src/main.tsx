import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure DOM is ready before rendering
const renderApp = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Root element not found!");
    return;
  }

  // Create GTM noscript for tracking when JavaScript is disabled
  const gtmNoScript = document.createElement('noscript');
  gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  document.body.prepend(gtmNoScript);

  createRoot(rootElement).render(<App />);
};

// Ensure DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
