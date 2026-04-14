/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

// Workaround for MediaPipe's attempt to overwrite window.fetch
try {
  if (typeof window !== 'undefined' && window.fetch) {
    const originalFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: originalFetch
    });
  }
} catch (e) {
  console.warn('Could not apply fetch workaround', e);
}

// Suppress specific TensorFlow Lite info messages
const originalConsoleInfo = console.info;
console.info = function (...args) {
  if (typeof args[0] === 'string' && args[0].includes('Created TensorFlow Lite XNNPACK delegate for CPU')) {
    return;
  }
  originalConsoleInfo.apply(console, args);
};

const originalConsoleLog = console.log;
console.log = function (...args) {
  if (typeof args[0] === 'string' && args[0].includes('Created TensorFlow Lite XNNPACK delegate for CPU')) {
    return;
  }
  originalConsoleLog.apply(console, args);
};

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
