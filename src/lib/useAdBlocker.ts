import { useEffect } from 'react';

/**
 * Custom hook to prevent iframe popups, new tab ad redirects, and unwanted window unloads
 * while keeping embedded video players working smoothly.
 */
export function useAdBlocker() {
  useEffect(() => {
    // 1. Override window.open to suppress popup tabs opened by third-party iframe ads
    const originalOpen = window.open;
    window.open = function (...args: Parameters<typeof window.open>) {
      console.warn('Blocked popup ad attempt:', args[0]);
      return null;
    };

    // 2. Prevent third-party iframe ads from navigating top window away
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return (e.returnValue = '');
    };

    // 3. Immediately refocus main window if focus is hijacked by an ad tab
    const handleBlur = () => {
      if (document.activeElement?.tagName === 'IFRAME') {
        setTimeout(() => {
          window.focus();
        }, 50);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.open = originalOpen;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
}
