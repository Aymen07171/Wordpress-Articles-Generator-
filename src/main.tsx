import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Ensure browser extensions can set window.fetch without TypeError
if (typeof window !== 'undefined') {
  try {
    const origFetch = window.fetch;
    let currentFetch = typeof origFetch === 'function' ? origFetch.bind(window) : origFetch;
    const desc = {
      configurable: true,
      enumerable: true,
      get() {
        return currentFetch;
      },
      set(val: any) {
        currentFetch = typeof val === 'function' ? val.bind(window) : val;
      },
    };
    try { Object.defineProperty(window, 'fetch', desc); } catch {}
    if (typeof Window !== 'undefined' && Window.prototype) {
      try { Object.defineProperty(Window.prototype, 'fetch', desc); } catch {}
    }
  } catch {
    // Ignore if not redefinable
  }

  // Prevent browser extension crashes from surfacing as app runtime errors
  const isIgnored = (msg?: string, file?: string) => {
    const s = `${msg || ''} ${file || ''}`;
    return s.includes('chrome-extension://') ||
           s.includes('Cannot set property fetch') ||
           s.includes('which has only a getter');
  };

  window.addEventListener(
    'error',
    (event) => {
      if (isIgnored(event?.message, event?.filename)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const reason = event?.reason;
      const msg = reason?.message || String(reason || '');
      const stack = reason?.stack || '';
      if (isIgnored(msg, stack)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
