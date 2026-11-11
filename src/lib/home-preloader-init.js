// Runs in the head: no module, font, image or animation dependency can trap the page.
(() => {
  const html = document.documentElement;
  if (html.hasAttribute('data-home-loading')) return;
  const previousOverflow = html.style.overflow;
  const events = new AbortController();
  const locked = new Set();
  let finished = false;
  html.dataset.homePreloaderPage = '';
  html.dataset.homeLoading = 'pending';
  html.dataset.homeLoadingDeadline = String(performance.now() + 10000);
  html.style.overflow = 'hidden';
  const lockContent = () => {
    if (!document.body || finished) return;
    for (const element of document.body.children) {
      if (!(element instanceof HTMLElement) || element.matches('[data-home-preloader], script, style, link') || element.inert) continue;
      element.inert = true;
      locked.add(element);
    }
  };
  const observer = new MutationObserver(lockContent);
  observer.observe(html, { childList: true, subtree: true });
  const release = reason => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    observer.disconnect(); events.abort();
    locked.forEach(element => { element.inert = false; });
    html.style.overflow = previousOverflow;
    delete html.dataset.homeLoading;
    delete html.dataset.homeLoadingDeadline;
    html.dataset.homeLoadResult = reason;
    document.querySelector('[data-home-preloader]')?.remove();
    if (reason !== 'ready') {
      const root = document.querySelector('[data-home-motion]');
      root?.style.removeProperty('--story-camera-y');
      root?.removeAttribute('data-story-camera');
      root?.removeAttribute('data-story-entrance');
    }
    document.dispatchEvent(new CustomEvent('eden:home-released', { detail: reason }));
  };
  const timer = setTimeout(() => release('timeout'), 10000);
  document.addEventListener('eden:home-release', event => release(event.detail || 'ready'), { signal: events.signal });
  document.addEventListener('astro:before-swap', () => release('navigation'), { signal: events.signal });
  window.addEventListener('pagehide', () => release('navigation'), { signal: events.signal });
  lockContent();
})();
