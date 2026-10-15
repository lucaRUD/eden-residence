/** Small homepage-only loader. Baseline HTML/CSS never depends on GSAP. */
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

  const controller = new AbortController();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const seen = visits.get(root) ?? new WeakSet<HTMLElement>();
  visits.set(root, seen);
  let stop: (() => void) | undefined;
  let generation = 0;

  async function sync() {
    const current = ++generation;
    stop?.();
    stop = undefined;
    if (reduced.matches) {
      root.dataset.motion = 'reduced';
      return;
    }
    root.dataset.motion = 'loading';
    try {
      // Reduced-motion visitors and unrelated pages do not download GSAP.
      const { createHomeAnimations } = await import('./home-animations');
      if (current !== generation || controller.signal.aborted || !root.isConnected) return;
      stop = createHomeAnimations(root, seen);
      root.dataset.motion = 'active';
    } catch (error) {
      // No content is hidden by this loader; runtime setup reverts on failure.
      if (current === generation && !controller.signal.aborted) {
        root.dataset.motion = 'fallback';
        console.warn('Eden motion unavailable; using the static presentation.', error);
      }
    }
  }

  reduced.addEventListener('change', sync, { signal: controller.signal });
  mounted = { root, dispose: () => {
    ++generation;
    controller.abort();
    stop?.();
    delete root.dataset.motion;
  } };
  void sync();
}
