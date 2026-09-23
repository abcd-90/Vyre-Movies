import { useEffect } from 'react';

/**
 * Advanced Ad Block & Pop-up Blocker Hook for VYRE
 * Suppresses external window.open popups, target="_blank" redirects,
 * new tab spawns, and top-level navigation hijacks from free embedded players.
 */
export function useAdBlocker() {
  useEffect(() => {
    // 1. Override window.open across top/parent frames
    const noopOpen = function (url?: string | URL, _target?: string, _features?: string) {
      console.warn('[VYRE AD-SHIELD] Suppressed popup tab:', url);
      return null;
    };

    const originalOpen = window.open;
    window.open = noopOpen;
    if (window.top && window.top !== window) {
      try {
        window.top.open = noopOpen;
      } catch (e) {
        // Cross-origin top frame block
      }
    }

    // 2. Intercept dynamically created <a> elements with target="_blank"
    const originalCreateElement = document.createElement.bind(document);
    document.createElement = function (tagName: string, options?: ElementCreationOptions) {
      const element = originalCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'a') {
        const anchor = element as HTMLAnchorElement;
        const originalClick = anchor.click.bind(anchor);
        anchor.click = function () {
          if (anchor.target === '_blank' || anchor.getAttribute('target') === '_blank') {
            console.warn('[VYRE AD-SHIELD] Blocked programmatic <a> popup click');
            return;
          }
          return originalClick();
        };
      }
      return element;
    };

    // 3. Capture-phase global click listener to prevent opening untrusted popup windows
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a');
      if (anchor) {
        const isBlank = anchor.target === '_blank' || anchor.getAttribute('target') === '_blank';
        const href = anchor.href || '';
        const isSelfDomain = href.startsWith(window.location.origin) || href.startsWith('/') || href.startsWith('#');

        if (isBlank || !isSelfDomain) {
          console.warn('[VYRE AD-SHIELD] Intercepted external popup link click:', href);
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }
    };

    // 4. Prevent window blur / ad tab focus stealing when clicking inside player iframe
    const handleWindowBlur = () => {
      if (document.activeElement?.tagName === 'IFRAME') {
        setTimeout(() => {
          window.focus();
        }, 0);
      }
    };

    window.addEventListener('click', handleGlobalClick, true);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.open = originalOpen;
      document.createElement = originalCreateElement;
      window.removeEventListener('click', handleGlobalClick, true);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, []);
}
