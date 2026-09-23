import { useEffect } from 'react';

/**
 * Advanced Ad Block & Pop-up Blocker Hook for VYRE
 * Suppresses external window.open popups, target="_blank" redirects,
 * and top-level navigation hijacks from free embedded players.
 */
export function useAdBlocker() {
  useEffect(() => {
    // 1. Override window.open on top window
    const originalOpen = window.open;
    window.open = function (url?: string | URL, _target?: string, _features?: string) {
      console.warn('[VYRE AD-SHIELD] Suppressed popup tab:', url);
      return null;
    };

    // 2. Intercept dynamically created <a> elements with target="_blank"
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = function (tagName: string, options?: ElementCreationOptions) {
      const element = originalCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'a') {
        const anchor = element as HTMLAnchorElement;
        const originalClick = anchor.click.bind(anchor);
        anchor.click = function () {
          if (anchor.target === '_blank' || anchor.getAttribute('target') === '_blank') {
            console.warn('[VYRE AD-SHIELD] Blocked <a> tag popup click');
            return;
          }
          return originalClick();
        };
      }
      return element;
    };

    // 3. Prevent top-level page unload / location hijacking
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return (e.returnValue = '');
    };

    // 4. Instantly refocus top window if an ad attempts to steal focus
    const handleBlur = () => {
      if (document.activeElement?.tagName === 'IFRAME') {
        setTimeout(() => {
          window.focus();
        }, 10);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.open = originalOpen;
      document.createElement = originalCreateElement;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
}
