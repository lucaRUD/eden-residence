import type { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { passiveStepLabels } from './passive-checkpoints';

export const homeSlidesMedia = '(max-width: 47.999rem)';

type Timeline = ReturnType<typeof gsap.timeline>;

export interface HomeSlide {
  id: string;
  start: number;
  end: number;
  passive?: number;
}

export interface HomeSlideLayout {
  slides: HomeSlide[];
  pins: ScrollTrigger[];
  freeScroll: { start: number; end: number; before: HomeSlide; after?: HomeSlide }[];
}

/** Resolve labels against refreshed pins and reading ranges against document layout. */
export function measureHomeSlides(root: HTMLElement, limit: number): HomeSlideLayout {
  const slides: HomeSlide[] = [];
  const pins: ScrollTrigger[] = [];
  const scroll = window.scrollY;
  const nav = document.querySelector('[data-nav-bar]')?.getBoundingClientRect();
  const top = Math.max(0, nav?.bottom ?? 66) + 12;
  const footer = document.querySelector<HTMLElement>('.site-footer');
  const bottom = (window.visualViewport?.height ?? window.innerHeight)
    - (footer ? parseFloat(getComputedStyle(footer).paddingBottom) || 12 : 12);
  const clamp = (y: number) => Math.max(0, Math.min(y, limit));

  function flow(id: string, first: Element | null, last = first) {
    if (!first || !last) return;
    const start = clamp(scroll + first.getBoundingClientRect().top - top);
    const end = clamp(scroll + last.getBoundingClientRect().bottom - bottom);
    slides.push({ id, start, end: Math.max(start, end) });
  }

  function pinned(id: string, labels: readonly string[], passive = false) {
    const pin = ScrollTrigger.getById(id);
    const timeline = pin?.animation as Timeline | undefined;
    if (!pin || !timeline?.labels || pin.end <= pin.start || !timeline.duration()
      || !labels.every(label => Number.isFinite(timeline.labels[label]))) return false;

    pins.push(pin);
    for (const label of labels) {
      const start = clamp(pin.start + (pin.end - pin.start) * timeline.labels[label] / timeline.duration());
      const principle = passive ? passiveStepLabels.indexOf(label) : -1;
      slides.push({ id: label, start, end: start, passive: principle >= 0 ? principle - 1 : undefined });
    }
    return true;
  }

  if (!pinned('eden-opening-story', ['hero', 'editorial-statement', 'editorial-residence', 'editorial-comfort'])) {
    slides.push({ id: 'hero', start: 0, end: 0 });
    flow('editorial', root.querySelector('[data-editorial-introduction]'));
  }
  if (!pinned('eden-passive-editorial', ['passive-lead-in', ...passiveStepLabels, 'passive-aerial'], true)) {
    flow('passive', root.querySelector('[data-passive-editorial]'));
  }

  const query = (selector: string) => root.querySelector(selector);
  if (!pinned('eden-interior-gallery', ['interiors-intro', 'living-full', 'living-editorial', 'navy-bedroom', 'neutral-bedroom', 'interiors-exit'])) {
    flow('interiors', query('[data-interior-gallery]'));
  }
  flow('gardens', query('.home-gardens__heading'), query('.home-gardens__primary'));

  // A fallback layout or a very short section can share the same scroll coordinate.
  // Coalesce those frames and keep reading ranges from swallowing the next stop.
  const ordered: HomeSlide[] = [];
  for (const slide of slides.sort((a, b) => a.start - b.start)) {
    const previous = ordered.at(-1);
    if (previous && slide.start - previous.start <= 1) {
      previous.end = Math.max(previous.end, slide.end);
      continue;
    }
    if (previous) previous.end = Math.max(previous.start, Math.min(previous.end, slide.start - 2));
    ordered.push(slide);
  }

  const freeScroll: HomeSlideLayout['freeScroll'] = [];
  const passiveExit = ordered.find(slide => slide.id === 'passive-aerial' || slide.id === 'passive');
  const galleryEntry = ordered.find(slide => slide.id === 'interiors-intro' || slide.id === 'interiors');
  if (passiveExit && galleryEntry && passiveExit.end < galleryEntry.start) {
    freeScroll.push({ start: passiveExit.end, end: galleryEntry.start, before: passiveExit, after: galleryEntry });
  }
  const gardens = ordered.find(slide => slide.id === 'gardens');
  if (gardens && gardens.end < limit) freeScroll.push({ start: gardens.end, end: limit, before: gardens });
  return { slides: ordered, pins, freeScroll };
}
