interface CriticalMedia { background: boolean; mask: boolean }

/** Coordinates the first screen only. The independent head watchdog also covers module failures. */
export function createHomePreloader(root: HTMLElement) {
  const html = document.documentElement;
  const overlay = document.querySelector<HTMLElement>('[data-home-preloader]');
  const controller = new AbortController();
  let tween: { kill(): void } | undefined;
  let revealFrame = 0;
  let completeReveal: (() => void) | undefined;
  let stopped = false;
  const active = () => !!overlay?.isConnected && html.hasAttribute('data-home-loading');
  const released = new Promise<void>(resolve => {
    if (!active()) { resolve(); return; }
    document.addEventListener('eden:home-released', () => {
      cancelAnimationFrame(revealFrame); tween?.kill(); completeReveal?.(); resolve();
    }, { once: true, signal: controller.signal });
  });
  const background = root.querySelector<HTMLImageElement>('.story-base')!;
  const mask = root.querySelector<HTMLImageElement>('[data-story-mask-resource]')!;
  const decode = (image: HTMLImageElement, kind: 'background' | 'mask') => image.decode().then(() => true, () => {
    root.setAttribute(kind === 'mask' ? 'data-story-mask-failed' : 'data-story-image-failed', '');
    return false;
  });
  let fontTimer = 0;
  const fonts = Promise.race([
    document.fonts.load('600 1em "Quicksand Variable"', 'EDEN ' + (root.querySelector('.story-eyebrow')?.textContent ?? '')).catch(() => []),
    new Promise<never[]>(resolve => { fontTimer = window.setTimeout(() => resolve([]), 1500); }),
  ]).finally(() => clearTimeout(fontTimer));
  const critical = Promise.race([
    Promise.all([decode(background, 'background'), decode(mask, 'mask'), fonts]).then(([background, mask]): CriticalMedia => ({ background, mask })),
    released.then((): CriticalMedia => ({ background: false, mask: false })),
  ]);
  return {
    critical,
    active,
    canAnimate: () => active() && Number(html.dataset.homeLoadingDeadline) - performance.now() > 1200,
    async reveal(animate: boolean) {
      if (!active() || stopped) return;
      if (animate && overlay && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const { gsap } = await import('gsap');
        if (!active() || stopped) return;
        await new Promise<void>(resolve => {
          completeReveal = resolve;
          revealFrame = requestAnimationFrame(() => {
            revealFrame = 0;
            if (!active() || stopped) { resolve(); return; }
            html.dataset.homeLoading = 'revealing';
            tween = gsap.to(overlay, { clipPath: 'inset(0% 0% 100% 0%)', duration: .85, ease: 'power3.inOut', onComplete: resolve });
          });
        });
      }
      if (active()) document.dispatchEvent(new CustomEvent('eden:home-release', { detail: 'ready' }));
    },
    dispose() {
      stopped = true;
      cancelAnimationFrame(revealFrame); tween?.kill(); completeReveal?.();
      if (active()) document.dispatchEvent(new CustomEvent('eden:home-release', { detail: 'navigation' }));
      controller.abort(); clearTimeout(fontTimer);
    },
  };
}
