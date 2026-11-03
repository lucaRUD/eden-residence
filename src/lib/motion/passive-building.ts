import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createScrollDepthImages } from './scroll-depth-images';
import { createSmoothScroll } from './smooth-scroll';

let mounted: { root: HTMLElement; dispose: () => void } | undefined;

function createStoryMotion(root: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {}, root);
  const controller = new AbortController();
  const media = gsap.matchMedia();
  let stopDepth: (() => void) | undefined;
  let stopScroll: (() => void) | undefined;
  let refreshFrame = 0;
  const refresh = () => {
    if (controller.signal.aborted || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => { refreshFrame = 0; if (!controller.signal.aborted) ScrollTrigger.refresh(); });
  };
  const dispose = () => {
    controller.abort(); cancelAnimationFrame(refreshFrame);
    stopScroll?.(); stopDepth?.(); media.revert(); context.revert();
    root.querySelectorAll('[data-active]').forEach(item => item.removeAttribute('data-active'));
    root.querySelector('[data-vent-figure]')?.removeAttribute('data-stage');
  };
  try {
    context.add(() => {
      if (!location.hash && scrollY < 8) {
        gsap.fromTo(root.querySelectorAll('[data-passive-hero-line]'), { yPercent: 12 }, {
          yPercent: 0, duration: .85, stagger: .075, ease: 'power3.out', clearProps: 'transform',
        });
      }
      root.querySelectorAll<HTMLElement>('[data-passive-type]').forEach(line => {
        if (line.getBoundingClientRect().top < innerHeight * .75) return;
        gsap.fromTo(line, { yPercent: 16 }, {
          yPercent: 0, ease: 'none', scrollTrigger: { trigger: line.closest('.passive-title-mask'), start: 'top 92%', end: 'top 62%', scrub: true },
        });
      });
      const principles = [...root.querySelectorAll<HTMLElement>('[data-passive-principle]')];
      const ticks = [...root.querySelectorAll<HTMLElement>('[data-principle-tick]')];
      principles.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item, start: 'top 58%', end: 'bottom 58%',
          onToggle: self => { item.toggleAttribute('data-active', self.isActive); ticks[index]?.toggleAttribute('data-active', self.isActive); },
        });
      });
      stopDepth = createScrollDepthImages(root);
    });

    const figure = root.querySelector<HTMLElement>('[data-vent-figure]')!;
    const steps = [...root.querySelectorAll<HTMLElement>('[data-vent-step]')];
    media.add({
      desktop: '(min-width: 64rem) and (min-height: 44rem)',
      compact: '(max-width: 63.999rem), (max-height: 43.999rem)',
      wideDiagram: '(min-width: 48rem)',
    }, current => {
      const svgs = [...figure.querySelectorAll<SVGSVGElement>('[data-vent-svg]')].filter(svg => svg.getBoundingClientRect().width > 0);
      const routes = svgs.flatMap(svg => [...svg.querySelectorAll<SVGPathElement>('[data-air-route], [data-heat-transfer]')]);
      const lengths = new Map(routes.map(path => [path, path.getTotalLength()]));
      routes.forEach(path => gsap.set(path, { strokeDasharray: lengths.get(path), strokeDashoffset: lengths.get(path) }));
      const incoming = routes.filter(path => ['intake', 'supply'].includes(path.dataset.airRoute ?? ''));
      const outgoing = routes.filter(path => ['extract', 'exhaust'].includes(path.dataset.airRoute ?? ''));
      const heat = routes.filter(path => path.hasAttribute('data-heat-transfer'));
      const timeline = gsap.timeline({ defaults: { ease: 'none' } });
      timeline.to(incoming, { strokeDashoffset: 0, duration: .36, stagger: .025 }, 0)
        .to(outgoing, { strokeDashoffset: 0, duration: .36, stagger: .025 }, .27)
        .to(heat, { strokeDashoffset: 0, duration: .28, stagger: .025 }, .64)
        .fromTo(svgs.flatMap(svg => [...svg.querySelectorAll('[data-heat-surface]')]), { opacity: .04 }, { opacity: .18, duration: .3 }, .64);
      const syncStep = (progress: number) => {
        const index = Math.min(2, Math.floor(progress * 3));
        figure.dataset.stage = String(index);
        steps.forEach((step, i) => step.toggleAttribute('data-active', i === index));
      };
      ScrollTrigger.create({
        id: 'passive-ventilation', trigger: current.conditions?.desktop ? root.querySelector('#ventilation') : figure,
        endTrigger: current.conditions?.desktop ? root.querySelector('[data-vent-story]') : figure,
        start: current.conditions?.desktop ? 'top top' : 'top 88%',
        end: current.conditions?.desktop ? 'bottom 55%' : 'top 8%',
        animation: timeline, scrub: true, invalidateOnRefresh: true,
        onUpdate: self => syncStep(self.progress), onRefresh: self => syncStep(self.progress),
      });
      return () => { figure.removeAttribute('data-stage'); steps.forEach(step => step.removeAttribute('data-active')); };
    });

    stopScroll = createSmoothScroll();
    root.querySelectorAll('img').forEach(image => {
      if (!image.complete) image.addEventListener('load', refresh, { once: true, signal: controller.signal });
    });
    void document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh, { once: true, signal: controller.signal });
    window.addEventListener('pageshow', refresh, { signal: controller.signal });
    refresh();
    return dispose;
  } catch (error) { dispose(); throw error; }
}

export function unmountPassiveStory() { mounted?.dispose(); mounted = undefined; }

export function mountPassiveStory() {
  const root = document.querySelector<HTMLElement>('[data-passive-story]');
  if (mounted?.root === root) return;
  unmountPassiveStory();
  if (!root) return;
  const controller = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let stop: (() => void) | undefined;
  const sync = () => {
    stop?.(); stop = undefined;
    if (reduced.matches) { root.dataset.motion = 'reduced'; return; }
    try { stop = createStoryMotion(root); root.dataset.motion = 'active'; }
    catch (error) { root.dataset.motion = 'fallback'; console.warn('Eden passive story: static fallback.', error); }
  };
  mounted = { root, dispose: () => { controller.abort(); stop?.(); delete root.dataset.motion; } };
  reduced.addEventListener('change', sync, { signal: controller.signal });
  sync();
}
