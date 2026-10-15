import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Treatment = 'heading' | 'image' | 'benefits' | 'garden-copy' | 'apartments' | 'principles' | 'closing';
// A chapter has its own treatment. Most text, images and controls remain still.
const chapters: { selector: string; treatment: Treatment }[] = [
  { selector: '.home-project__heading', treatment: 'heading' },
  { selector: '.home-project__image .home-render', treatment: 'image' },
  { selector: '.home-benefits', treatment: 'benefits' },
  { selector: '.home-gardens__primary .home-render', treatment: 'image' },
  { selector: '.home-gardens__copy', treatment: 'garden-copy' },
  { selector: '.home-apartments', treatment: 'apartments' },
  { selector: '.home-principles', treatment: 'principles' },
  { selector: '.home-contact__heading', treatment: 'closing' },
];

export function createHomeAnimations(root: HTMLElement, seen: WeakSet<HTMLElement>) {
  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {}, root);
  const controller = new AbortController();
  const active = new Map<HTMLElement, gsap.core.Animation>();
  const pending = new Map<HTMLElement, ScrollTrigger>();
  let refreshFrame = 0;

  const finishWithin = (target: Element) => {
    for (const [element, animation] of active) {
      if (element.contains(target) || target.contains(element)) animation.progress(1);
    }
    for (const [element, trigger] of pending) {
      if (element.contains(target) || target.contains(element)) {
        seen.add(element);
        trigger.kill();
        pending.delete(element);
      }
    }
  };

  const refresh = () => {
    if (refreshFrame || controller.signal.aborted) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      if (!controller.signal.aborted) ScrollTrigger.refresh();
    });
  };

  const dispose = () => {
    controller.abort();
    cancelAnimationFrame(refreshFrame);
    context.revert();
    active.clear();
    pending.clear();
  };

  try {
    context.add(() => {
      const hero = root.querySelector<HTMLElement>('.home-hero__panel');
      // Do not replay on restored scroll positions, hash arrivals or slow JS loading.
      if (hero && !seen.has(hero) && !hero.contains(document.activeElement) && document.activeElement !== root && !location.hash && window.scrollY < 24 && performance.now() < 1800) {
        seen.add(hero);
        const heading = hero.querySelector<HTMLElement>('h1');
        const description = hero.querySelector<HTMLElement>('.home-hero__description');
        const actions = hero.querySelector<HTMLElement>('.home-hero__actions');
        if (heading && description && actions) {
          // Keep text readable even during the entrance; no blank headline or controls.
          gsap.set([heading, description, actions], { opacity: 0.85 });
          gsap.set(heading, { y: 12 });
          gsap.set(description, { y: 6 });
          const timeline = gsap.timeline({ defaults: { ease: 'power2.out', clearProps: 'opacity,transform' }, onComplete: () => active.delete(hero) });
          active.set(hero, timeline);
          timeline.to(heading, { opacity: 1, y: 0, duration: 0.55 }, 0)
            .to(description, { opacity: 1, y: 0, duration: 0.5 }, 0.1)
            .to(actions, { opacity: 1, duration: 0.4 }, 0.18);
        }
      }

      chapters.forEach(({ selector, treatment }) => {
        const element = root.querySelector<HTMLElement>(selector);
        if (!element) return;
        if (seen.has(element)) return;
        // Anything already in view stays readable; restored/hash scroll never hides it.
        if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
          seen.add(element);
          return;
        }
        const trigger = ScrollTrigger.create({
          trigger: element, start: 'top 92%', once: true,
          onEnter: () => {
            pending.delete(element);
            if (seen.has(element)) return;
            seen.add(element);
            if (element.getBoundingClientRect().bottom <= 0 || element.contains(document.activeElement)) return;
            // Only alter styles when the reveal actually begins. No dormant hidden content.
            context.add(() => {
              const timeline = gsap.timeline({
                defaults: { ease: 'power2.out' },
                onComplete: () => active.delete(element),
              });
              active.set(element, timeline);
              switch (treatment) {
                case 'image':
                  // A small leading-edge reveal leaves 97% of the image and its
                  // bottom-right credit visible throughout. Never fade photography.
                  timeline.fromTo(element, { clipPath: 'inset(0% 0% 0% 3%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power2.inOut', clearProps: 'clipPath' });
                  break;
                case 'benefits':
                  timeline.fromTo(element.querySelectorAll('.home-benefit__number, h3'), { opacity: 0.85 }, { opacity: 1, duration: 0.4, stagger: 0.045, clearProps: 'opacity' });
                  break;
                case 'garden-copy':
                  timeline.fromTo(element.querySelector('.text-lead'), { opacity: 0.85 }, { opacity: 1, duration: 0.6, clearProps: 'opacity' });
                  break;
                case 'apartments':
                  timeline.fromTo(element.querySelectorAll('.home-apartment__identity'), { opacity: 0.85, y: 6 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, clearProps: 'opacity,transform' });
                  break;
                case 'principles':
                  timeline.fromTo(element.querySelectorAll('dt'), { opacity: 0.85 }, { opacity: 1, duration: 0.45, stagger: 0.1, clearProps: 'opacity' });
                  break;
                case 'closing':
                  timeline.fromTo(element, { opacity: 0.85, y: 8 }, { opacity: 1, y: 0, duration: 0.6, clearProps: 'opacity,transform' });
                  break;
                default:
                  timeline.fromTo(element.querySelector('h2'), { opacity: 0.85 }, { opacity: 1, duration: 0.5, clearProps: 'opacity' });
              }
            });
          },
        });
        pending.set(element, trigger);
      });
    });

    root.addEventListener('focusin', (event) => {
      if (event.target instanceof Element) finishWithin(event.target);
    }, { signal: controller.signal });
    window.addEventListener('hashchange', () => {
      const target = document.getElementById(location.hash.slice(1));
      if (target) finishWithin(target);
    }, { signal: controller.signal });
    document.addEventListener('eden:navigation-change', refresh, { signal: controller.signal });
    root.querySelectorAll('img').forEach((image) => {
      if (!image.complete) image.addEventListener('load', refresh, { once: true, signal: controller.signal });
    });
    void document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh, { once: true, signal: controller.signal });
    return dispose;
  } catch (error) {
    dispose();
    throw error;
  }
}
