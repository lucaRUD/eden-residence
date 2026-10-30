import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createEdenJourney } from './eden-journey';
import { createEditorialIntroduction } from './editorial-introduction';

/** Existing chapter treatments plus the independently scrubbed Eden Journey. */
export function createHomeAnimations(root: HTMLElement, seen: WeakSet<HTMLElement>) {
  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {}, root);
  const controller = new AbortController();
  const active = new Map<HTMLElement, gsap.core.Animation>();
  const pending = new Map<HTMLElement, ScrollTrigger>();
  let refreshFrame = 0;
  let stopJourney: (() => void) | undefined;
  let stopIntroduction: (() => void) | undefined;

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
    stopJourney?.();
    stopIntroduction?.();
    context.revert();
    root.querySelectorAll('[data-current]').forEach(element => element.removeAttribute('data-current'));
    active.clear();
    pending.clear();
  };

  // Set a treatment only as it enters view. Restored/hash scrolls never conceal content.
  const enterOnce = (selector: string, compose: (timeline: gsap.core.Timeline, element: HTMLElement) => void) => {
    const element = root.querySelector<HTMLElement>(selector);
    if (!element || seen.has(element)) return;
    if (element.getBoundingClientRect().top < innerHeight * 0.92) {
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
        context.add(() => {
          const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onComplete: () => active.delete(element) });
          active.set(element, timeline);
          compose(timeline, element);
        });
      },
    });
    pending.set(element, trigger);
  };

  try {
    context.add(() => {
      stopIntroduction = createEditorialIntroduction(root);

      const passive = root.querySelector<HTMLElement>('.home-passive');
      const principles = passive?.querySelectorAll<HTMLElement>('.home-principle');
      if (passive && principles?.length) {
        ScrollTrigger.create({
          trigger: passive.querySelector('.home-passive__body'), start: 'top 85%', once: true,
          onEnter: () => {
            if (seen.has(passive)) return;
            seen.add(passive);
            if (passive.contains(document.activeElement)) return;
            context.add(() => {
              const image = passive.querySelector('.home-render');
              const heading = passive.querySelector('h2');
              const timeline = gsap.timeline({ onComplete: () => active.delete(passive) });
              active.set(passive, timeline);
              // Leading-edge mask retains the architecture and bottom-right credit.
              timeline.fromTo(image, { clipPath: 'inset(0% 0% 0% 4%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.95, ease: 'power2.inOut', clearProps: 'clipPath' }, 0)
                .fromTo(heading, { x: -6 }, { x: 0, duration: 0.7, ease: 'power2.out', clearProps: 'transform' }, 0);
            });
          },
        });
        let current = -1;
        ScrollTrigger.create({
          trigger: passive.querySelector('.home-principles'), start: 'top 70%', end: 'bottom 40%',
          onUpdate: (self) => {
            const next = Math.min(principles.length - 1, Math.floor(self.progress * principles.length));
            if (next === current) return;
            current = next;
            // A reading accent, never a tab: all three explanations stay visible.
            principles.forEach((element, index) => element.toggleAttribute('data-current', index === current));
          },
        });
      }

      enterOnce('.home-project__image .home-render', (timeline, image) => {
        timeline.fromTo(image, { clipPath: 'inset(0% 0% 0% 4%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, clearProps: 'clipPath' });
      });
      enterOnce('.home-gardens__composition', (timeline, composition) => {
        const primary = composition.querySelector('.home-gardens__primary .home-render');
        const secondary = composition.querySelector('.home-gardens__secondary .home-render');
        timeline.fromTo(primary, { clipPath: 'inset(0% 0% 0% 3%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, clearProps: 'clipPath' }, 0)
          .fromTo(secondary, { clipPath: 'inset(0% 0% 0% 5%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, clearProps: 'clipPath' }, 0.18);
      });
      // The final architectural rule closes the page; its heading stays still.
      enterOnce('.home-contact', (timeline, section) => {
        timeline.fromTo(section.querySelector('.home-contact__rule'), { scaleX: 0.35 }, { scaleX: 1, duration: 0.85, clearProps: 'transform' });
      });
      stopJourney = createEdenJourney(root);
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
