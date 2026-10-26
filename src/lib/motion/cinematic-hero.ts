import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** One native-scroll storyboard; the arrival scene is the complete static fallback. */
export function createCinematicHero(root: HTMLElement) {
  const hero = root.querySelector<HTMLElement>('.home-hero');
  const stage = hero?.querySelector<HTMLElement>('.home-hero__stage');
  const visual = hero?.querySelector<HTMLElement>('.home-hero__visual');
  const panel = hero?.querySelector<HTMLElement>('.home-hero__panel');
  const arrival = visual?.querySelector<HTMLImageElement>(':scope > .home-render img');
  const discovery = visual?.querySelector<HTMLElement>('.home-hero__discovery');
  const image = discovery?.querySelector('img');
  if (!hero || !stage || !visual || !panel || !arrival || !discovery || !image) return () => {};

  const media = gsap.matchMedia();
  let disposed = false;
  let refreshFrame = 0;
  // Hidden/lazy discovery imagery must decode before it can enter the storyboard.
  // Failure keeps the immediately visible arrival image and all links intact.
  image.loading = 'eager';
  void image.decode().then(() => {
    if (disposed || !hero.isConnected) return;
    const heroTop = hero.getBoundingClientRect().top + scrollY;
    // A slow image/network must not insert a new pin underneath a reader who
    // has already left the opening. Hash arrivals use the unpinned variant too.
    const canPin = !location.hash && scrollY < heroTop + stage.offsetHeight / 4;
    const breakpoint = getComputedStyle(root).getPropertyValue('--breakpoint-xl').trim();
    // Pin only when the complete full-width scene fits vertically. Wider,
    // shorter landscape viewports keep native scrolling to reach the panel.
    media.add({ desktop: `(min-width: ${breakpoint}) and (min-height: 45rem) and (max-aspect-ratio: 16/9)`, normal: '(prefers-reduced-motion: no-preference)' }, context => {
      if (!context.conditions?.normal || disposed) return;
      const pinned = !!context.conditions.desktop && canPin;
      gsap.set(discovery, pinned ? { clipPath: 'inset(0% 0% 0% 100%)' } : { opacity: 0 });
      hero.dataset.cinematic = pinned ? 'pinned' : 'simple';
      const timeline = gsap.timeline({ defaults: { ease: 'none' } });
      if (pinned) {
        timeline.fromTo(arrival, { scale: 1 }, { scale: 1.025, transformOrigin: 'right bottom', duration: 0.45, immediateRender: false }, 0.25)
          .fromTo(discovery, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, immediateRender: false }, 0.25)
          .fromTo(panel, { y: 0 }, { y: -10, duration: 0.45, immediateRender: false }, 0.25)
          .fromTo(panel, { y: -10 }, { y: 0, duration: 0.3, immediateRender: false }, 0.7);
      } else {
        // A short, unpinned mobile/tablet crossfade; text and image framing stay still.
        timeline.fromTo(discovery, { opacity: 0 }, { opacity: 1, duration: 0.45, immediateRender: false }, 0.25)
          .to({}, { duration: 0.3 }, 0.7);
      }
      ScrollTrigger.create({
        trigger: stage,
        start: pinned ? 'top top' : () => Math.max(0, hero.getBoundingClientRect().top + scrollY - innerHeight * 0.1),
        end: pinned ? () => `+=${Math.round(innerHeight * 0.9)}` : () => `+=${Math.max(180, visual.offsetHeight * 0.9)}`,
        animation: timeline, scrub: pinned ? 0.4 : 0.2, pin: pinned ? stage : false,
        invalidateOnRefresh: true, refreshPriority: pinned ? 10 : 0,
      });
      // Registering the pin changes downstream geometry. Refresh before the
      // journey measures its route, rather than leaving stale section positions.
      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = 0;
        if (!disposed) ScrollTrigger.refresh();
      });
      return () => {
        cancelAnimationFrame(refreshFrame);
        delete hero.dataset.cinematic;
      };
    });
  }).catch(() => {
    // Revert a partial setup too; a decorative sequence cannot block the page.
    if (!disposed) { media.revert(); delete hero.dataset.cinematic; }
  });

  return () => {
    disposed = true;
    cancelAnimationFrame(refreshFrame);
    media.revert();
  };
}
