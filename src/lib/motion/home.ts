import { createHomePreloader } from './home-preloader';
import { createHomeScrollRestoration } from './home-scroll-restoration';

/** One homepage startup owner. Baseline HTML/CSS never depends on GSAP. */
let mounted: { root: HTMLElement; dispose: () => void } | undefined;
const visits = new WeakMap<HTMLElement, WeakSet<HTMLElement>>();

export function unmountHomeMotion() {
  mounted?.dispose();
  mounted = undefined;
}

export function mountHomeMotion() {
  const candidate = document.querySelector<HTMLElement>('[data-home-motion]');
  if (mounted?.root === candidate) return;
  unmountHomeMotion();
  if (!candidate) return;
  const root = candidate;
  const preloader = createHomePreloader(root);

  const controller = new AbortController();
  const restoreScroll = createHomeScrollRestoration(controller.signal);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const seen = visits.get(root) ?? new WeakSet<HTMLElement>();
  visits.set(root, seen);
  let stop: (() => void) | undefined;
  let stopHero: (() => void) | undefined;
  let generation = 0;
  let first = true;
  const settledFrame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));

  async function sync() {
    const current = ++generation;
    const initial = first; first = false;
    stopHero?.(); stopHero = undefined;
    stop?.();
    stop = undefined;
    if (reduced.matches) {
      root.dataset.motion = 'reduced';
      await preloader.critical;
      if (current === generation && !controller.signal.aborted) { restoreScroll(); await preloader.reveal(false); }
      return;
    }
    root.dataset.motion = 'loading';
    try {
      // Reduced motion skips the decorative chapter and journey runtime.
      const [runtime, media] = await Promise.all([import('./home-animations'), preloader.critical]);
      if (current !== generation || controller.signal.aborted || !root.isConnected) return;
      stop = runtime.createHomeAnimations(root, seen);
      await settledFrame(); await settledFrame();
      if (current !== generation || controller.signal.aborted) return;
      runtime.measureHomeAnimations(restoreScroll);
      const canAnimate = initial && preloader.canAnimate();
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
      const entrance = canAnimate && media.background && media.mask && !location.hash && scrollY <= 4 && navigation?.type !== 'back_forward';
      let beginEntrance = () => {};
      const revealed = new Promise<void>(resolve => { beginEntrance = resolve; });
      stopHero = runtime.createArchitecturalHero(root, { assetsReady: media.background && media.mask, reveal: entrance ? revealed : undefined });
      root.dataset.motion = 'active';
      await preloader.reveal(canAnimate);
      beginEntrance();
    } catch (error) {
      // No content is hidden by this loader; runtime setup reverts on failure.
      if (current === generation && !controller.signal.aborted) {
        stopHero?.(); stopHero = undefined;
        stop?.(); stop = undefined;
        root.dataset.motion = 'fallback';
        console.warn('Eden motion unavailable; using the static presentation.', error);
        await preloader.reveal(false);
      }
    }
  }

  reduced.addEventListener('change', sync, { signal: controller.signal });
  mounted = { root, dispose: () => {
    ++generation;
    controller.abort();
    preloader.dispose(); stopHero?.();
    stop?.();
    delete root.dataset.motion;
  } };
  void sync();
}
