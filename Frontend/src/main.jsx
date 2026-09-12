import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Automatic reload recovery when a new version is deployed and old chunks 404
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const lastReload = sessionStorage.getItem('last_chunk_reload');
  const now = Date.now();
  if (!lastReload || now - Number(lastReload) > 8000) {
    sessionStorage.setItem('last_chunk_reload', String(now));
    window.location.reload();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const errMsg = String(event?.reason?.message || event?.reason || '');
  if (
    errMsg.includes('Failed to fetch dynamically imported module') ||
    errMsg.includes('Importing a module script failed') ||
    errMsg.includes('Expected a JavaScript-or-Wasm module script')
  ) {
    const lastReload = sessionStorage.getItem('last_chunk_reload');
    const now = Date.now();
    if (!lastReload || now - Number(lastReload) > 8000) {
      sessionStorage.setItem('last_chunk_reload', String(now));
      window.location.reload();
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
