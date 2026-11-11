interface SavedScroll { url: string; x: number; y: number }

/** Keep the browser's history policy; repair only restoration clamped by the temporary unpinned layout. */
export function createHomeScrollRestoration(signal: AbortSignal): () => void {
  const url = location.pathname + location.search + location.hash;
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const saved = history.state?.edenHomeScroll as SavedScroll | undefined;
  const shouldRestore = (navigation?.type === 'reload' || navigation?.type === 'back_forward')
    && saved?.url === url && Number.isFinite(saved.x) && Number.isFinite(saved.y);
  let restored = false;
  let saveTimer = 0;
  const save = () => {
    if (document.documentElement.hasAttribute('data-home-loading')) return;
    const state: unknown = history.state;
    if (state !== null && (typeof state !== 'object' || Array.isArray(state))) return;
    try {
      history.replaceState({ ...state, edenHomeScroll: {
        url: location.pathname + location.search + location.hash, x: scrollX, y: scrollY,
      } satisfies SavedScroll }, '');
    } catch { /* Restricted history leaves native restoration available. */ }
  };
  // Save before navigation starts: a reload may copy its history entry before pagehide.
  window.addEventListener('scrollend', save, { passive: true, signal });
  window.addEventListener('scroll', () => {
    clearTimeout(saveTimer); saveTimer = window.setTimeout(save, 180);
  }, { passive: true, signal });
  document.addEventListener('click', save, { capture: true, signal });
  window.addEventListener('pagehide', save, { signal });
  signal.addEventListener('abort', () => clearTimeout(saveTimer), { once: true });
  return () => {
    if (restored || !shouldRestore || !saved) return;
    restored = true;
    window.scrollTo({ left: saved.x, top: saved.y, behavior: 'instant' });
  };
}
