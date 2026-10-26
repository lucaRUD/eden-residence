// Shot inspection: street view holds until ~2.7s, then dissolves to the garden.
const FADE_START = 2.05;
const FADE_END = 2.6;

/** One opening statement per page visit. Only the inner copy is affected;
 * the existing GSAP timeline continues to own the outer arrival container.
 */
export function createOpeningTitle(root: HTMLElement): () => void {
  const copy = root.querySelector<HTMLElement>('[data-cinema-title-sequence]')!;
  const video = root.querySelector<HTMLVideoElement>('[data-cinema-video]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const { signal } = controller;
  let complete = false;
  let frame = 0;

  const cancel = () => {
    if (frame) video.cancelVideoFrameCallback(frame);
    frame = 0;
  };
  const paint = (time: number) => {
    if (time >= FADE_END) complete = true;
    const progress = complete ? 1 : Math.min(1, Math.max(0, (time - FADE_START) / (FADE_END - FADE_START)));
    const eased = progress * progress * (3 - 2 * progress);
    copy.style.opacity = String(1 - eased);
    copy.dataset.titleState = complete ? 'complete' : 'opening';
    // Keep the sole semantic H1 available to assistive technology after the fade.
  };
  const sync = () => {
    cancel();
    if (signal.aborted) return;
    if (reduced.matches || !video.hasAttribute('data-ready') || !video.hasAttribute('src')) {
      copy.style.removeProperty('opacity'); delete copy.dataset.titleState;
      return;
    }
    paint(video.currentTime);
    if (!complete && !video.paused && !document.hidden && typeof video.requestVideoFrameCallback === 'function') {
      frame = video.requestVideoFrameCallback((_now, metadata) => {
        frame = 0;
        paint(metadata.mediaTime);
        sync();
      });
    }
  };
  const observer = new MutationObserver(sync);
  observer.observe(video, { attributes: true, attributeFilter: ['data-ready', 'src'] });
  for (const event of ['playing', 'pause', 'timeupdate', 'seeked', 'emptied', 'error']) {
    video.addEventListener(event, sync, { signal });
  }
  reduced.addEventListener('change', sync, { signal });
  document.addEventListener('visibilitychange', sync, { signal });
  sync();
  return () => {
    controller.abort(); observer.disconnect(); cancel();
    copy.style.removeProperty('opacity'); delete copy.dataset.titleState;
  };
}
