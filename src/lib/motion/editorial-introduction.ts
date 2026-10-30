import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Reversible line masks continue the hero's exit without pinning the reader. */
export function createEditorialIntroduction(root: HTMLElement): () => void {
  const section = root.querySelector<HTMLElement>('[data-editorial-introduction]');
  if (!section || section.getBoundingClientRect().top < innerHeight * .55) return () => {};
  const controller = new AbortController();
  const context = gsap.context(() => {
    const lines = section.querySelectorAll('[data-editorial-line]');
    const image = section.querySelector('.home-render');
    const timeline = gsap.timeline();
    timeline.fromTo(lines, { yPercent: 110 }, {
      yPercent: 0, duration: .75, stagger: .14, ease: 'power3.out', immediateRender: false,
    }, 0);
    timeline.fromTo(image, { clipPath: 'inset(0% 0% 22% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: .9, ease: 'power2.inOut', immediateRender: false,
    }, .12);
    const trigger = ScrollTrigger.create({
      trigger: section, start: 'top 88%', end: 'top 22%',
      animation: timeline, scrub: .3, invalidateOnRefresh: true,
    });
    // Anchor and keyboard arrivals should expose the complete statement immediately.
    section.addEventListener('focusin', () => {
      trigger.getTween()?.kill(); trigger.kill(); timeline.progress(1).pause();
    }, { signal: controller.signal });
  }, section);
  return () => { controller.abort(); context.revert(); };
}
