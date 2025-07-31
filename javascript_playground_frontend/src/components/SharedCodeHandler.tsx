'use client';

import { useEffect } from 'react';

// PUBLIC_INTERFACE
export const SharedCodeHandler: React.FC = () => {
  useEffect(() => {
    // Handle shared code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const sharedCode = urlParams.get('code');
    if (sharedCode) {
      try {
        const decodedCode = decodeURIComponent(atob(sharedCode));
        localStorage.setItem('playground-code', decodedCode);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        // Trigger a page reload to load the shared code
        window.location.reload();
      } catch (error) {
        console.error('Failed to decode shared code:', error);
      }
    }
  }, []);

  return null;
};
