import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { framing } from './framing';

/** Chapter transition only: video playback never follows this scroll timeline. */
export function createPrototypeMotion(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const stage = root.querySelector<HTMLElement>('[data-cinema-stage]')!;
  const frame = root.querySelector<HTMLElement>('[data-cinema-window]')!;
  const arrival = root.querySelector<HTMLElement>('[data-cinema-arrival]')!;
  const reveal = root.querySelector<HTMLElement>('[data-cinema-reveal]')!;
  const wipe = root.querySelector<HTMLElement>('[data-cinema-wipe]')!;
  const styles = new Map([stage, arrival, reveal, wipe].map(element => [element, element.getAttribute('style')]));
  const restoreStyles = () => {
    styles.forEach((style, element) => {
      if (style === null) element.removeAttribute('style'); else element.setAttribute('style', style);
    });
  };
  const media = gsap.matchMedia();
  const controller = new AbortController();
  let refreshFrame = 0;
  const refresh = () => {
    if (refreshFrame || controller.signal.aborted) return;
    refreshFrame = requestAnimationFrame(() => { refreshFrame = 0; if (!controller.signal.aborted) ScrollTrigger.refresh(); });
  };
  const dispose = () => { controller.abort(); cancelAnimationFrame(refreshFrame); media.revert(); restoreStyles(); delete root.dataset.cinemaMode; };
  try {
    media.add({
      desktop: '(min-width: 80rem) and (min-height: 42rem)',
      tablet: '(min-width: 48rem)',
      normal: '(prefers-reduced-motion: no-preference)',
    }, context => {
      if (!context.conditions?.normal) return;
      const { desktop, tablet } = context.conditions;
      const canPin = !location.hash && scrollY < stage.getBoundingClientRect().top + scrollY + stage.offsetHeight / 4;
      const pinned = desktop && canPin;
      root.dataset.cinemaMode = pinned ? 'pinned' : tablet ? 'tablet' : 'mobile';
      // Smaller viewports retain normal document flow. Moving footage needs no zoom.
      if (!pinned) return () => { delete root.dataset.cinemaMode; };
      const timeline = gsap.timeline({ defaults: { ease: 'none' } });
      if (pinned) {
        gsap.set(wipe, { clipPath: 'inset(100% 0% 0% 0%)' });
        gsap.set(reveal, { opacity: 0, y: 24 });
        // One reversible timeline owns the whole copy block. No line masks,
        // nested text transforms or competing load-time tweens.
        timeline.fromTo(arrival, { y: 0, opacity: 1 }, {
          y: -16, opacity: 0, duration: .37, immediateRender: false,
        }, .28);
        timeline.fromTo(wipe, { clipPath: 'inset(100% 0% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: .32, ease: 'power1.inOut', immediateRender: false,
        }, .68);
        // The surface reaches the reading area before the intact chapter title
        // enters. Reverse scrolling restores precisely the same composition.
        timeline.fromTo(reveal, { opacity: 0, y: 24 }, {
          opacity: 1, y: 0, duration: .16, immediateRender: false,
        }, .82);
      }
      // Preserve the original one-unit storyboard duration after removing
      // the visual progress indicator, including the final chapter hold.
      timeline.to({}, { duration: 1 }, 0);
      ScrollTrigger.create({
        trigger: stage, animation: timeline,
        start: 'top top',
        end: () => `+=${pinned ? Math.round(innerHeight * framing.extraScroll) : Math.min(Math.round(frame.offsetHeight * .75), ScrollTrigger.maxScroll(window))}`,
        pin: pinned ? stage : false, scrub: pinned ? .45 : .25, invalidateOnRefresh: true,
      });
      refresh();
      return () => { cancelAnimationFrame(refreshFrame); restoreStyles(); delete root.dataset.cinemaMode; };
    });
    document.addEventListener('eden:navigation-change', refresh, { signal: controller.signal });
    root.addEventListener('transitionend', event => {
      if (event.target instanceof Element && event.target.matches('[data-navigation-panel]')) refresh();
    }, { signal: controller.signal });
    return dispose;
  } catch (error) { dispose(); throw error; }
}
