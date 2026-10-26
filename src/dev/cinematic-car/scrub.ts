import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Tune the additional pinned scroll here; no wheel/touch interception or easing.
const EXTRA_VIEWPORTS = 1.25;
const FRAME_DURATION = 1 / 24;
const SEEK_INTERVAL = 1000 / 30;

export function createCarScrub(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const stage = root.querySelector<HTMLElement>('[data-car-stage]')!;
  const video = root.querySelector<HTMLVideoElement>('[data-car-video]')!;
  const instruction = root.querySelector<HTMLElement>('[data-car-instruction]')!;
  const controller = new AbortController();
  const { signal } = controller;
  let trigger: ScrollTrigger | undefined;
  let timer = 0;
  let watchdog = 0;
  let target = 0;
  let lastSeek = 0;
  let seekStarted = 0;
  let slowSeeks = 0;
  let disposed = false;

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    controller.abort(); clearTimeout(timer); clearTimeout(watchdog);
    root.dataset.carMode = 'static';
    instruction.hidden = true;
    stage.removeAttribute('aria-describedby');
    trigger?.kill(true);
    video.pause(); video.removeAttribute('src'); video.load();
  };
  const schedule = () => {
    if (disposed || timer) return;
    // One seek in flight; each completion uses the latest scroll position.
    timer = window.setTimeout(() => { timer = 0; seek(); }, Math.max(0, SEEK_INTERVAL - (performance.now() - lastSeek)));
  };
  const seek = () => {
    if (disposed || video.seeking || video.readyState < 2) return;
    if (Math.abs(video.currentTime - target) < FRAME_DURATION / 2) return;
    try {
      lastSeek = seekStarted = performance.now();
      video.currentTime = target;
      clearTimeout(watchdog);
      watchdog = window.setTimeout(dispose, 1500);
    } catch { dispose(); }
  };
  video.addEventListener('seeked', () => {
    clearTimeout(watchdog);
    if (seekStarted) {
      slowSeeks = performance.now() - seekStarted > 350 ? slowSeeks + 1 : 0;
      seekStarted = 0;
      if (slowSeeks >= 3) { dispose(); return; }
    }
    schedule();
  }, { signal });
  // A paused video should never advance independently, even after browser restore.
  video.addEventListener('play', () => video.pause(), { signal });
  video.addEventListener('canplay', schedule, { signal });
  video.addEventListener('error', dispose, { signal });
  video.addEventListener('loadeddata', () => {
    if (!Number.isFinite(video.duration) || video.duration <= FRAME_DURATION || video.seekable.length === 0) { dispose(); return; }
    // Avoid adding a pin beneath someone who followed an anchor or scrolled while loading.
    if (location.hash || scrollY > stage.offsetHeight / 4) { dispose(); return; }
    clearTimeout(watchdog);
    const lastFrame = video.duration - FRAME_DURATION;
    try {
      trigger = ScrollTrigger.create({
        trigger: stage, start: 'top top',
        end: () => `+=${Math.round(innerHeight * EXTRA_VIEWPORTS)}`,
        pin: stage, invalidateOnRefresh: true,
        onUpdate: self => { target = self.progress * lastFrame; schedule(); },
        onRefresh: self => { target = self.progress * lastFrame; schedule(); },
      });
      root.dataset.carMode = 'scrub';
      instruction.id = 'car-instruction'; instruction.hidden = false;
      stage.setAttribute('aria-describedby', instruction.id);
      ScrollTrigger.refresh();
    } catch { dispose(); }
  }, { signal, once: true });
  // No source/download for mobile, reduced motion or no-JS visitors.
  watchdog = window.setTimeout(dispose, 12000);
  video.muted = true; video.preload = 'auto'; video.src = video.dataset.src!; video.load();
  return dispose;
}
