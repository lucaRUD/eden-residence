import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

/** Shared opt-in window scrolling. No transformed page wrapper or second RAF. */
export function createSmoothScroll(): () => void {
  const controller = new AbortController();
  const { signal } = controller;
  const root = document.documentElement;
  const focusTargets = new Set<HTMLElement>();
  const lenis = new Lenis({
    duration: 1.40, lerp: 0, smoothWheel: true, syncTouch: false, autoRaf: false,
    // Handle anchors below so history, focus and the menu's closing lock agree.
    anchors: false, stopInertiaOnNavigate: true,
    prevent: node => node.matches('[data-nav-panel], dialog, [aria-modal="true"], [data-scroll-native], textarea, select'),
  });
  let pending: { url: URL; target: HTMLElement } | undefined;
  let historyFrame = 0;
  let ticking = false;
  let changingHash = false;
  const locked = () => ['hidden', 'clip'].includes(root.style.overflowY || root.style.overflow);
  const tick = (seconds: number) => lenis.raf(seconds * 1000);
  const interrupt = () => {
    if (!lenis.isStopped) { lenis.stop(); lenis.start(); }
  };
  const navigate = () => {
    if (!pending || locked() || document.hidden) return;
    const { url, target } = pending;
    pending = undefined;
    const previous = location.href;
    if (url.href !== previous) {
      history.pushState(history.state, '', url);
      changingHash = true;
      window.dispatchEvent(new HashChangeEvent('hashchange', { oldURL: previous, newURL: url.href }));
      changingHash = false;
    }
    lenis.resize();
    lenis.scrollTo(target, {
      onComplete: () => {
        if (!target.isConnected) return;
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
          focusTargets.add(target);
          target.addEventListener('blur', () => {
            if (target.getAttribute('tabindex') === '-1') target.removeAttribute('tabindex');
            focusTargets.delete(target);
          }, { once: true, signal });
        }
        target.focus({ preventScroll: true });
      },
    });
  };
  const sync = () => {
    if (document.hidden || locked()) lenis.stop();
    else { lenis.start(); navigate(); }
    if (document.hidden && ticking) { gsap.ticker.remove(tick); ticking = false; }
    else if (!document.hidden && !ticking) { gsap.ticker.add(tick); ticking = true; }
  };
  // The existing modal owns overflow and scrollbar compensation. Stop inertia
  // as soon as it locks, and defer menu anchors until its reverse animation ends.
  const observer = new MutationObserver(sync);
  const restoreHistory = () => {
    if (changingHash) return;
    pending = undefined;
    cancelAnimationFrame(historyFrame);
    interrupt();
    historyFrame = requestAnimationFrame(() => {
      historyFrame = 0;
      if (!lenis.isStopped) lenis.scrollTo(window.scrollY, { immediate: true });
    });
  };
  const dispose = () => {
    controller.abort(); observer.disconnect(); cancelAnimationFrame(historyFrame);
    pending = undefined; gsap.ticker.remove(tick);
    focusTargets.forEach(target => { if (target.getAttribute('tabindex') === '-1') target.removeAttribute('tabindex'); });
    lenis.off('scroll', ScrollTrigger.update); lenis.destroy();
    gsap.ticker.lagSmoothing(500, 33);
  };
  try {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);
    observer.observe(root, { attributes: true, attributeFilter: ['style'] });
    document.addEventListener('visibilitychange', sync, { signal });
    document.addEventListener('click', event => {
      if (event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      let id: string;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      pending = { url, target };
      navigate();
    }, { signal });
    document.addEventListener('keydown', event => {
      if (['Tab', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) interrupt();
    }, { signal });
    document.addEventListener('focusin', interrupt, { signal });
    window.addEventListener('popstate', restoreHistory, { signal });
    window.addEventListener('hashchange', restoreHistory, { signal });
    window.addEventListener('pagehide', () => { interrupt(); }, { signal });
    sync();
    return dispose;
  } catch (error) { dispose(); throw error; }
}
