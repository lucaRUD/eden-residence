import type Lenis from 'lenis';
import type { VirtualScrollData } from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { measureHomeSlides, type HomeSlide } from './home-slide-destinations';
import { getPassiveArrivalPlayback, type PassiveArrivalPlayback } from './passive-arrival-playback';
import { passiveCheckpointLabels } from './passive-checkpoints';

type Gesture = {
  source: 'touch' | 'wheel';
  mode: 'pending' | 'reading' | 'consumed' | 'native';
  distance: number;
};

interface Travel {
  id: string;
  edge: 'start' | 'end';
  y: number;
  deadline: number;
  scrollComplete: boolean;
  passiveTime?: number;
  changesPassiveScene: boolean;
}

const edgeTolerance = 2;
const slideDuration = 1.25;
const passiveSlideDuration = 1.7;
const passiveRevealDurationScale = 1.25;
const ignored = '[data-nav-bar], [data-nav-panel], dialog, [aria-modal="true"], '
  + 'form, input, select, textarea, [contenteditable], [data-scroll-native], '
  + '[data-lenis-prevent], [data-lenis-prevent-vertical]';

/** Drive the existing scroll position. The pinned scenes keep their own renderers. */
export function createHomeSlideNavigation(root: HTMLElement, lenis: Lenis) {
  const controller = new AbortController();
  const { signal } = controller;
  const html = document.documentElement;
  const principles = root.querySelector<HTMLElement>('[data-ps-principles]');
  let layout: ReturnType<typeof measureHomeSlides>;
  let activeId: string | undefined;
  let travel: Travel | undefined;
  let gesture: Gesture | undefined;
  let freeScrollFrom: string | undefined;
  let boundary: { id: string; edge: 'start' | 'end'; corrections: number } | undefined;
  let correctingBoundary = false;
  let refreshing = false;
  let savedPosition: { id: string; offset: number; atEnd: boolean } | undefined;
  let playback: PassiveArrivalPlayback | undefined;
  let unsubscribePlayback: (() => void) | undefined;

  html.dataset.homeSlides = '';
  const wheelEnd = gsap.delayedCall(.34, () => { if (gesture?.source === 'wheel') gesture = undefined; }).pause();
  const blocked = () => document.hidden || html.hasAttribute('data-home-loading') || lenis.isStopped || lenis.isLocked
    || ['hidden', 'clip'].includes(html.style.overflowY || html.style.overflow);
  const slideById = (id?: string) => layout.slides.find(slide => slide.id === id);
  const contains = (slide: HomeSlide, y: number) => y >= slide.start - edgeTolerance && y <= slide.end + edgeTolerance;
  const currentSlide = (y: number) => {
    const active = slideById(activeId);
    return active && contains(active, y) ? active : layout.slides.find(slide => contains(slide, y));
  };

  function restorePassive() {
    if (refreshing || travel || slideById(activeId)?.passive !== undefined) return;
    const timeline = ScrollTrigger.getById('eden-passive-editorial')?.animation as gsap.core.Timeline | undefined;
    if (!timeline?.labels) return;
    const time = timeline.time();

    let principle = -1;
    if (time >= timeline.labels['principles-start']) {
      principle = 0;
      for (let index = 1; index < passiveCheckpointLabels.length; index++) {
        if (time >= timeline.labels[`principle-${index}-to-${index + 1}`]) principle = index;
      }
    }
    playback?.restore(principle);
  }

  function measure() {
    lenis.dimensions.resize();
    layout = measureHomeSlides(root, lenis.limit);
    const nextPlayback = principles ? getPassiveArrivalPlayback(principles) : undefined;
    if (nextPlayback === playback) return;
    unsubscribePlayback?.();
    playback = nextPlayback;
    unsubscribePlayback = playback?.onRendered(restorePassive);
    const active = slideById(activeId);
    if (active?.passive !== undefined) playback?.restore(active.passive);
    if (travel?.changesPassiveScene) playback?.beginTravel(slideById(travel.id)?.passive ?? -1);
  }

  function stopTravel() {
    if (!travel) return;
    travel = undefined;
    gsap.ticker.remove(settle);
    if (!lenis.isStopped && !lenis.isLocked && lenis.isScrolling === 'smooth') {
      lenis.stop(); lenis.start();
    }
  }

  function release() {
    const wasControlled = activeId !== undefined || travel !== undefined;
    activeId = undefined;
    freeScrollFrom = undefined;
    boundary = undefined;
    if (gesture) gesture.mode = 'native';
    stopTravel();
    if (wasControlled) playback?.cancel();
    restorePassive();
  }

  function settle() {
    const move = travel;
    if (!move || refreshing) return;
    if (blocked() || performance.now() > move.deadline) { release(); return; }

    const y = lenis.actualScroll;
    const destination = slideById(move.id);
    if (!destination) { release(); return; }
    if (move.passiveTime !== undefined) {
      const pin = ScrollTrigger.getById('eden-passive-editorial');
      const timeline = pin?.animation;
      if (pin && timeline) {
        const progress = gsap.utils.clamp(0, 1, (move.y - pin.start) / (pin.end - pin.start));
        const span = progress * timeline.duration() - move.passiveTime;
        playback?.travelProgress(Math.abs(span) < .00001 ? 1 : (timeline.time() - move.passiveTime) / span, true);
      }
    }
    if (!move.scrollComplete || Math.abs(y - move.y) > edgeTolerance) return;
    // Also check pins crossed on the way to an ordinary section. A scrub tween can
    // still be catching up even after Lenis reports that the document has arrived.
    for (const pin of layout.pins) {
      const span = pin.end - pin.start;
      const progress = gsap.utils.clamp(0, 1, (y - pin.start) / span);
      if (pin.animation && Math.abs(pin.animation.totalProgress() - progress) * span > edgeTolerance) return;
    }

    travel = undefined;
    gsap.ticker.remove(settle);
    activeId = destination.id;
    if (move.changesPassiveScene) {
      if (destination.passive !== undefined) playback?.arrive(destination.passive, passiveRevealDurationScale);
      else playback?.finishExit();
    }
    restorePassive();
  }

  function scrollToSlide(move: Travel, seconds: number) {
    move.scrollComplete = false;
    move.deadline = performance.now() + 6000;
    lenis.scrollTo(move.y, {
      duration: seconds,
      easing: progress => .5 - .5 * Math.cos(Math.PI * progress),
      onComplete: () => {
        if (travel !== move) return;
        move.scrollComplete = true;
        settle();
      },
    });
  }

  function go(destination: HomeSlide, direction: number, source?: HomeSlide) {
    const changesPassiveScene = source?.passive !== undefined || destination.passive !== undefined;
    const edge = direction > 0 ? 'start' : 'end';
    const move: Travel = {
      id: destination.id, edge, y: destination[edge],
      deadline: 0, scrollComplete: false, changesPassiveScene,
      passiveTime: changesPassiveScene ? ScrollTrigger.getById('eden-passive-editorial')?.animation?.time() : undefined,
    };
    travel = move;
    if (changesPassiveScene) playback?.beginTravel(destination.passive ?? -1);
    gsap.ticker.add(settle);
    scrollToSlide(move, changesPassiveScene ? passiveSlideDuration : slideDuration);
  }

  function input(data: VirtualScrollData): boolean {
    const { event, deltaX, deltaY } = data;
    if (event.type === 'touchend') {
      const native = !gesture || gesture.mode === 'native' || gesture.mode === 'pending';
      gesture = undefined;
      // Let Lenis clear its touch state without treating the final delta as input.
      if (!native) { data.deltaX = 0; data.deltaY = 0; }
      return true;
    }
    const source = event.type === 'wheel' ? 'wheel' : 'touch';
    if (event.type === 'touchstart' || gesture?.source !== source) {
      freeScrollFrom = undefined;
      boundary = undefined;
      gesture = { source, mode: travel ? 'consumed' : 'pending', distance: 0 };
    }
    if (source === 'wheel') wheelEnd.restart(true);
    if (!gesture || blocked() || layout.slides.length < 2) return true;
    const exempt = event.ctrlKey || (window.visualViewport?.scale ?? 1) > 1.01
      || ('touches' in event && event.touches.length > 1)
      || event.composedPath().some(node => node instanceof Element && node.matches(
        `${ignored}, [data-lenis-prevent-${source}]`,
      ));
    if (exempt || window.getSelection()?.isCollapsed === false) {
      release();
      return true;
    }
    if (event.type === 'touchstart' || gesture.mode === 'native') return true;
    if (!deltaY || (gesture.mode === 'pending' && Math.abs(deltaX) >= Math.abs(deltaY))) {
      if (deltaX && gesture.mode === 'pending') gesture.mode = 'native';
      return true;
    }
    const y = lenis.actualScroll;
    const direction = Math.sign(deltaY);
    if (!refreshing && !travel && gesture.mode === 'pending') {
      const range = layout.freeScroll.find(({ start, end, after }) => direction > 0
        ? y >= start - edgeTolerance && (!after || y < end - edgeTolerance)
        : y > start + edgeTolerance && y <= end + edgeTolerance);
      if (range) {
        activeId = undefined;
        freeScrollFrom = range.before.id;
        gesture.mode = 'native';
        return true;
      }
    }
    if (!event.cancelable && !event.defaultPrevented) {
      if (boundary && gesture.mode === 'consumed') return false;
      release();
      return true;
    }
    // Lenis's own nonpassive listener prevents native panning from the first move.
    // The rest of that contact, including its release, cannot generate momentum.
    event.preventDefault();
    if (refreshing || travel || gesture.mode === 'consumed') { gesture.mode = 'consumed'; return false; }

    const current = currentSlide(y);
    const roomToRead = current && current.end - current.start > edgeTolerance
      && (direction > 0 ? y < current.end - edgeTolerance : y > current.start + edgeTolerance);
    if (gesture.mode === 'reading' || (gesture.mode === 'pending' && roomToRead)) {
      gesture.mode = 'reading';
      if (current) {
        activeId = current.id;
        lenis.scrollTo(gsap.utils.clamp(current.start, current.end, y + deltaY), { immediate: true });
      }
      return false;
    }

    gesture.distance = Math.sign(gesture.distance) === direction ? gesture.distance + deltaY : deltaY;
    if (Math.abs(gesture.distance) < (source === 'touch' ? 22 : 18)) return false;
    gesture.mode = 'consumed';
    const next = current ? layout.slides[layout.slides.indexOf(current) + direction]
      : direction > 0 ? layout.slides.find(slide => slide.start > y)
        : layout.slides.findLast(slide => slide.end < y);
    if (next) go(next, direction, current);
    return false;
  }

  function catchBoundary(y: number) {
    if (blocked()) return;
    const range = layout.freeScroll.find(item => item.before.id === freeScrollFrom);
    if (range) {
      const crossedStart = y < range.start - edgeTolerance;
      const crossed = crossedStart ? range.before : y > range.end + edgeTolerance ? range.after : undefined;
      if (crossed) {
        activeId = crossed.id;
        boundary = { id: crossed.id, edge: crossedStart ? 'end' : 'start', corrections: 0 };
        freeScrollFrom = undefined;
        if (gesture) gesture.mode = 'consumed';
      }
    }
    if (!boundary) return;
    const slide = slideById(boundary.id);
    if (!slide) { boundary = undefined; return; }
    const stop = slide[boundary.edge];
    if (Math.abs(y - stop) <= edgeTolerance) return;
    // Bound any leftover native momentum at the first controlled frame. A fresh
    // gesture clears the hold, and an engine that resists correction stays usable.
    if (++boundary.corrections > 4) { boundary = undefined; return; }
    correctingBoundary = true;
    lenis.scrollTo(stop, { immediate: true });
    correctingBoundary = false;
  }

  function onScroll() {
    if (refreshing || travel || correctingBoundary) return;
    if (freeScrollFrom || boundary) catchBoundary(lenis.actualScroll);
    const active = slideById(activeId);
    if (active && !contains(active, lenis.actualScroll)) activeId = undefined;
    restorePassive();
  }

  function beforeRefresh() {
    refreshing = true;
    savedPosition = undefined;
    if (travel || blocked()) return;
    const y = lenis.actualScroll;
    const active = currentSlide(y);
    if (active) {
      savedPosition = { id: active.id, offset: y - active.start,
        atEnd: active.end > active.start + edgeTolerance && y >= active.end - edgeTolerance };
    }
  }

  function afterRefresh() {
    measure();
    const saved = savedPosition;
    savedPosition = undefined;
    if (!blocked()) {
      if (travel) {
        const destination = slideById(travel.id);
        if (!destination) release();
        else {
          const updated = destination[travel.edge];
          if (Math.abs(updated - travel.y) > .5) {
            travel.y = updated;
            scrollToSlide(travel, travel.changesPassiveScene ? .85 : .65);
          }
        }
      } else if (saved) {
        const next = slideById(saved.id);
        if (next) {
          const y = saved.atEnd ? next.end : gsap.utils.clamp(next.start, next.end, next.start + saved.offset);
          if (Math.abs(lenis.actualScroll - y) > edgeTolerance) lenis.scrollTo(y, { immediate: true });
        }
      }
    }
    refreshing = false;
    restorePassive();
  }

  measure();
  restorePassive();
  const locks = new MutationObserver(() => { if (blocked()) release(); });
  locks.observe(html, { attributes: true, attributeFilter: ['style', 'data-home-loading'] });
  ScrollTrigger.addEventListener('refreshInit', beforeRefresh);
  ScrollTrigger.addEventListener('refresh', afterRefresh);
  window.addEventListener('scroll', () => {
    if (freeScrollFrom || boundary) onScroll();
  }, { capture: true, passive: true, signal });
  for (const event of ['popstate', 'hashchange', 'pagehide', 'touchcancel'] as const) {
    window.addEventListener(event, release, { passive: true, signal });
  }
  document.addEventListener('visibilitychange', release, { signal });
  document.addEventListener('focusin', release, { capture: true, signal });
  document.addEventListener('keydown', event => {
    if (['Tab', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) release();
  }, { capture: true, signal });
  document.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('a[href]')) release();
  }, { capture: true, signal });

  return { input, onScroll, dispose: () => {
    controller.abort(); locks.disconnect(); wheelEnd.kill();
    ScrollTrigger.removeEventListener('refreshInit', beforeRefresh);
    ScrollTrigger.removeEventListener('refresh', afterRefresh);
    unsubscribePlayback?.();
    release();
    delete html.dataset.homeSlides;
  } };
}
