/** Muted looping ambience with a static baseline; independent of ScrollTrigger. */
export function createHeroVideo(root: HTMLElement) {
  const video = root.querySelector<HTMLVideoElement>('[data-cinema-video]')!;
  const toggle = root.querySelector<HTMLButtonElement>('[data-video-toggle]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const { signal } = controller;
  let generation = 0;
  let userPaused = false;
  let failed = false;
  let frame = 0;
  let paint = 0;
  let watchdog = 0;

  const label = () => { toggle.textContent = (video.paused ? toggle.dataset.playLabel : toggle.dataset.pauseLabel) ?? ''; };
  const cancelReveal = () => {
    if (frame) video.cancelVideoFrameCallback(frame);
    cancelAnimationFrame(paint); clearTimeout(watchdog);
    frame = paint = watchdog = 0;
  };
  const reset = () => {
    ++generation; cancelReveal();
    delete video.dataset.ready; toggle.hidden = true;
    video.autoplay = false; video.pause(); video.removeAttribute('src'); video.load();
  };
  const fallback = () => { failed = true; reset(); };
  const play = async () => {
    const current = generation;
    if (reduced.matches || document.hidden || userPaused || failed || signal.aborted) return;
    if (!video.hasAttribute('data-ready') && !watchdog) watchdog = window.setTimeout(fallback, 12000);
    try { await video.play(); }
    catch (error) {
      if (current !== generation || signal.aborted) return;
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        // A native user click can still start playback if browser policy blocked autoplay.
        cancelReveal(); userPaused = true; video.autoplay = false; toggle.hidden = false; label();
      } else if (!(error instanceof DOMException && error.name === 'AbortError')) fallback();
    }
  };
  const sync = () => {
    if (reduced.matches) { reset(); return; }
    if (document.hidden) { cancelReveal(); video.pause(); return; }
    if (failed) return;
    if (!video.hasAttribute('src')) {
      video.muted = true; video.defaultMuted = true;
      video.autoplay = !userPaused;
      video.preload = 'auto'; video.src = video.dataset.src!; video.load();
    }
    if (userPaused) { toggle.hidden = false; label(); } else void play();
  };
  video.addEventListener('playing', () => {
    if (reduced.matches || document.hidden || userPaused || signal.aborted) { video.pause(); return; }
    cancelReveal();
    const current = generation;
    const reveal = () => {
      if (current !== generation || signal.aborted || reduced.matches || video.paused || video.readyState < 2) return;
      video.dataset.ready = ''; toggle.hidden = false; label();
    };
    // Keep the architectural render visible until an actual frame reaches the compositor.
    if ('requestVideoFrameCallback' in video) frame = video.requestVideoFrameCallback(reveal);
    else paint = requestAnimationFrame(() => { paint = requestAnimationFrame(reveal); });
  }, { signal });
  video.addEventListener('pause', label, { signal });
  video.addEventListener('error', fallback, { signal });
  toggle.addEventListener('click', () => {
    userPaused = !video.paused;
    video.autoplay = !userPaused;
    if (userPaused) video.pause(); else void play();
    label();
  }, { signal });
  reduced.addEventListener('change', sync, { signal });
  document.addEventListener('visibilitychange', sync, { signal });
  window.addEventListener('pageshow', sync, { signal });
  sync();
  return () => { controller.abort(); reset(); };
}
