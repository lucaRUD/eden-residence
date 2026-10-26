let mounted: { root: HTMLElement; dispose: () => void } | undefined;

function unmount() { mounted?.dispose(); mounted = undefined; }

function mount() {
  const root = document.querySelector<HTMLElement>('[data-car-root]');
  if (mounted?.root === root) return;
  unmount();
  if (!root) return;
  const controller = new AbortController();
  const eligible = matchMedia('(min-width: 64rem) and (min-height: 38rem) and (min-aspect-ratio: 4/3) and (prefers-reduced-motion: no-preference)');
  let stop: (() => void) | undefined;
  let generation = 0;

  async function sync() {
    const current = ++generation;
    stop?.(); stop = undefined;
    root!.dataset.carMode = 'static';
    if (!eligible.matches) return;
    try {
      await document.fonts.ready;
      const { createCarScrub } = await import('./scrub');
      if (current !== generation || controller.signal.aborted || !root!.isConnected) return;
      stop = createCarScrub(root!);
    } catch { if (current === generation) root!.dataset.carMode = 'static'; }
  }
  eligible.addEventListener('change', sync, { signal: controller.signal });
  mounted = { root, dispose: () => {
    ++generation; controller.abort(); stop?.(); delete root.dataset.carMode;
  } };
  void sync();
}

mount();
document.addEventListener('astro:page-load', mount);
document.addEventListener('astro:before-swap', unmount);
window.addEventListener('pagehide', event => { if (!event.persisted) unmount(); });
window.addEventListener('pageshow', mount);
