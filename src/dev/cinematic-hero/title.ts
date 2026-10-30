// Source montage: the first street-corner dissolve starts around 2.7s.
const FADE_START = 2.05;
const FADE_END = 2.6;
const FONT_BUDGET_MS = 120;
const LINE_DELAY_MS = 60;
const LINE_STAGGER_MS = 90;
const LINE_DURATION_MS = 760;
const READ_HOLD_MS = 1200;
const ENTRANCE_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

/** The poster carries the entrance and reading hold while video preloads.
 * Only inner copy is animated: GSAP retains ownership of the outer scroll exit.
 */
export function createOpeningTitle(root: HTMLElement): { playbackReady: Promise<void>; dispose: () => void } {
  const copy = root.querySelector<HTMLElement>('[data-cinema-title-sequence]')!;
  const video = root.querySelector<HTMLVideoElement>('[data-cinema-video]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const { signal } = controller;
  const animations = new Set<Animation>();
  let releasePlayback!: () => void;
  const playbackReady = new Promise<void>(resolve => { releasePlayback = resolve; });
  let frame = 0;
  let fontTimer = 0;
  let releaseTimer = 0;
  let entranceStarted = false;
  let entranceFinished = false;
  let complete = false;

  const schedulePlayback = (delay: number) => {
    if (!releaseTimer) releaseTimer = window.setTimeout(releasePlayback, delay);
  };
  const finishEntrance = () => {
    entranceFinished = true;
    clearTimeout(fontTimer);
    delete root.dataset.titleEntrance;
    animations.forEach(animation => animation.cancel());
    animations.clear();
    if (reduced.matches) releasePlayback(); else schedulePlayback(READ_HOLD_MS);
  };
  const startEntrance = () => {
    if (signal.aborted || entranceStarted || entranceFinished) return;
    entranceStarted = true;
    clearTimeout(fontTimer);
    if (reduced.matches || root.dataset.titleEntrance !== 'primed' || location.hash || scrollY > innerHeight / 4 || typeof copy.animate !== 'function') {
      finishEntrance(); return;
    }
    const travel = matchMedia('(max-width: 40.624rem)').matches ? .8 : 1;
    const animate = (element: Element | null, keyframes: Keyframe[], delay: number, duration: number) => {
      if (!element) return;
      const animation = element.animate(keyframes, { delay, duration, easing: ENTRANCE_EASE, fill: 'backwards' });
      animations.add(animation);
      void animation.finished.then(() => { animations.delete(animation); animation.cancel(); }, () => {});
    };
    const lift = (element: Element | null, distance: number, delay: number, duration: number) => animate(element, [
      { opacity: 0, translate: `0 ${Math.round(distance * travel)}px` },
      { opacity: 1, translate: '0 0' },
    ], delay, duration);
    try {
      const lines = copy.querySelectorAll('.cinema-line');
      lift(copy.querySelector('.cinema-kicker'), 6, 0, 360);
      lines.forEach((line, index) => animate(line, [
        { transform: 'translateY(115%)' }, { transform: 'translateY(0)' },
      ], LINE_DELAY_MS + index * LINE_STAGGER_MS, LINE_DURATION_MS));
      lift(copy.querySelector('.cinema-introduction'), 8, 320, 500);
      lift(root.querySelector('.cinema-scroll'), -4, 540, 420);
      root.dataset.titleEntrance = 'running';
      const headlineEnd = LINE_DELAY_MS + Math.max(0, lines.length - 1) * LINE_STAGGER_MS + LINE_DURATION_MS;
      schedulePlayback(headlineEnd + READ_HOLD_MS);
      void Promise.allSettled([...animations].map(animation => animation.finished)).then(finishEntrance);
    } catch { finishEntrance(); }
  };
  const cancelFrame = () => { if (frame) video.cancelVideoFrameCallback(frame); frame = 0; };
  const paint = (time: number) => {
    if (time >= FADE_END) { complete = true; if (!entranceFinished) finishEntrance(); }
    const progress = complete ? 1 : Math.min(1, Math.max(0, (time - FADE_START) / (FADE_END - FADE_START)));
    copy.style.opacity = String(1 - progress * progress * (3 - 2 * progress));
    copy.dataset.titleState = complete ? 'complete' : 'opening';
    // The single semantic H1 stays accessible even after its visual exit.
  };
  const sync = () => {
    cancelFrame();
    if (signal.aborted) return;
    if (reduced.matches && !entranceFinished) finishEntrance();
    if (reduced.matches || !video.hasAttribute('data-ready') || !video.hasAttribute('src')) {
      copy.style.removeProperty('opacity'); delete copy.dataset.titleState; return;
    }
    paint(video.currentTime);
    if (!complete && !video.paused && !document.hidden && typeof video.requestVideoFrameCallback === 'function') {
      frame = video.requestVideoFrameCallback((_now, metadata) => { frame = 0; paint(metadata.mediaTime); sync(); });
    }
  };
  const observer = new MutationObserver(sync);
  observer.observe(video, { attributes: true, attributeFilter: ['data-ready', 'src'] });
  for (const event of ['playing', 'pause', 'timeupdate', 'seeked', 'emptied', 'error']) video.addEventListener(event, sync, { signal });
  reduced.addEventListener('change', sync, { signal });
  document.addEventListener('visibilitychange', sync, { signal });
  video.addEventListener('error', finishEntrance, { signal });
  root.addEventListener('focusin', finishEntrance, { signal });

  // Font and media failures cannot leave the copy waiting. Slow JS skips the mask.
  fontTimer = window.setTimeout(startEntrance, FONT_BUDGET_MS);
  void document.fonts.ready.then(startEntrance, startEntrance);
  if (reduced.matches) finishEntrance();
  sync();
  return { playbackReady, dispose: () => {
    controller.abort(); observer.disconnect(); cancelFrame(); finishEntrance();
    clearTimeout(fontTimer); clearTimeout(releaseTimer); releasePlayback();
    copy.style.removeProperty('opacity'); delete copy.dataset.titleState;
  } };
}
