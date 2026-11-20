import type Lenis from 'lenis';
import type { VirtualScrollData } from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { passiveStepLabels } from './passive-checkpoints';
import { getPassiveArrivalPlayback, passivePrincipleChangeEvent, type PassiveArrivalPlayback } from './passive-arrival-playback';

type Phase = 'FREE_SCROLL' | 'ENTERING_CONTROLLED_REGION' | 'IDLE_AT_CHECKPOINT' | 'TRANSITIONING' | 'EXITING_CONTROLLED_REGION';
type Source = 'wheel' | 'touch' | 'key' | undefined;
interface Geometry { stops: number[]; times: number[]; entry: number; exit: number; entryTime: number; exitTime: number; start: number; end: number }
export interface PassiveStepNavigation {
  input: (data: VirtualScrollData) => boolean;
  onScroll: () => void;
  dispose: () => void;
}

const duration = .85;
const wheelQuiet = .34;
const ignored = 'a, button, input, textarea, select, [contenteditable], [data-nav-panel], '
  + 'dialog, [aria-modal="true"], [data-scroll-native], [data-lenis-prevent]';
const ease = (value: number) => .5 - .5 * Math.cos(Math.PI * value);

/** One gesture latch, one Lenis transition, and the unchanged scrubbed scene. */
export function createPassiveStepNavigation(lenis: Lenis): PassiveStepNavigation | undefined {
  const params = new URLSearchParams(location.search);
  const root = document.querySelector<HTMLElement>('[data-passive-editorial]');
  const stage = root?.querySelector<HTMLElement>('[data-ps-stage]');
  const principles = root?.querySelector<HTMLElement>('[data-ps-principles]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (params.get('passiveStep') !== '1' || !stage || reduced.matches) return;

  const controller = new AbortController(), html = document.documentElement;
  const { signal } = controller;
  const originalTouchAction = stage.style.getPropertyValue('touch-action');
  const originalTouchPriority = stage.style.getPropertyPriority('touch-action');
  let phase: Phase = 'FREE_SCROLL', current = -1, target = -1;
  let source: Source, gestureActive = false, consumed = false, amount = 0;
  let geometry: Geometry | undefined, refreshing = false, moving = false;
  let restoredPosition = false;
  let playback: PassiveArrivalPlayback | undefined, stopRendered: (() => void) | undefined;
  let scrollComplete = false, arrivalPending = false, travelStart = 0;
  let pendingTouchEntry: number | undefined;
  let failed = false, disposed = false, guarding = false, owns = false;
  let lastY = lenis.actualScroll, exitDirection = 0, userIntent = false;
  let transitionToken = 0, corrections = 0;
  const debug = params.get('scrollDebug') === '1' ? document.createElement('output') : undefined;
  if (debug) {
    debug.dataset.passiveStepDebug = '';
    debug.setAttribute('aria-hidden', 'true');
    debug.style.cssText = 'position:fixed;bottom:max(12px,env(safe-area-inset-bottom));left:12px;z-index:1000;'
      + 'pointer-events:none;padding:8px 10px;background:#234235ed;color:#e5e1d4;'
      + 'border:1px solid #e5e1d455;border-radius:5px;font:10px/1.5 monospace;white-space:pre;';
    document.body.append(debug);
  }
  let lastDebug = '';
  const slideName = (index: number) => index === 0 ? 'Photo' : index > 0 ? `P${index}` : '–';
  const paintDebug = () => {
    if (!debug) return;
    const visible = Number(principles?.dataset.ppVisible ?? -2) + 1;
    const text = `Settled ${restoredPosition ? '–' : slideName(current)} → Target ${slideName(target)}\nVisible text ${slideName(visible)}\n${phase}\n`
      + `House ${principles?.dataset.ppHouse ?? 'complete'}\nGesture ${gestureActive ? 'active' : 'idle'} · Observer ${observer.isEnabled ? 'enabled' : 'disabled'}${failed ? '\nNative fallback' : ''}`;
    if (text !== lastDebug) { debug.textContent = text; lastDebug = text; }
  };
  const blocked = () => document.hidden || reduced.matches || html.hasAttribute('data-home-loading')
    || ['hidden', 'clip'].includes(html.style.overflowY || html.style.overflow) || lenis.isStopped || lenis.isLocked;
  const exempt = (event: Event) => event.composedPath().some(node => node instanceof Element && node.matches(ignored));
  const swallow = (event: Event) => { if (event.cancelable) event.preventDefault(); return false; };
  const measure = () => {
    const trigger = ScrollTrigger.getById('eden-passive-editorial'), timeline = trigger?.animation;
    if (!trigger || !(timeline instanceof gsap.core.Timeline) || !passiveStepLabels.every(name => name in timeline.labels)) {
      geometry = undefined; return;
    }
    const at = (time: number) => trigger.start + (trigger.end - trigger.start) * time / timeline.duration();
    const entryTime = timeline.labels['photo-entry'] - .15, exitTime = timeline.labels['principles-end'] + .45;
    geometry = { stops: passiveStepLabels.map(name => at(timeline.labels[name])), times: passiveStepLabels.map(name => timeline.labels[name]), start: trigger.start, end: trigger.end,
      entryTime, exitTime, entry: at(entryTime), exit: at(exitTime) };
    const nextPlayback = principles ? getPassiveArrivalPlayback(principles) : undefined;
    if (playback !== nextPlayback) {
      stopRendered?.(); playback = nextPlayback; stopRendered = playback?.onRendered(rendered);
      if (owns && current >= 0) {
        playback?.restore(current - 1);
        if (moving && arrivalPending) playback?.beginTravel(target - 1);
      }
    }
  };
  const endWheel = gsap.delayedCall(wheelQuiet, () => {
    if (source !== 'wheel') return;
    gestureActive = false; paintDebug();
  }).pause();
  const watchdog = gsap.delayedCall(duration + 1.5, () => {
    if (moving) { failed = true; release(); }
  }).pause();
  const stopMotion = () => {
    transitionToken++; watchdog.pause();
    if (moving && !lenis.isStopped && !lenis.isLocked) {
      moving = false; lenis.scrollTo(lenis.actualScroll, { immediate: true });
    }
    moving = false; scrollComplete = false; arrivalPending = false;
  };
  const setOwnership = (value: boolean) => {
    if (owns === value) return;
    owns = value;
    if (value) {
      // Only this stage, only while it owns navigation. Pinch zoom remains available.
      stage.style.setProperty('touch-action', 'pan-x pinch-zoom');
      observer.enable();
    } else {
      observer.disable();
      if (originalTouchAction) stage.style.setProperty('touch-action', originalTouchAction, originalTouchPriority);
      else stage.style.removeProperty('touch-action');
    }
  };
  function release() {
    phase = 'FREE_SCROLL'; userIntent = false; exitDirection = 0; restoredPosition = false; pendingTouchEntry = undefined;
    setOwnership(false); stopMotion(); playback?.cancel(); lastY = lenis.actualScroll; paintDebug();
  }
  const observer = ScrollTrigger.observe({
    id: 'eden-passive-steps', target: stage, type: 'wheel,touch',
    // Controls are exempt and retain native clicks. Synthetic Observer clicks
    // would misclassify a native swipe captured midway through entry as a tap.
    preventDefault: true, allowClicks: false, capture: true, debounce: false,
    ignoreCheck: event => blocked() || exempt(event) || ('ctrlKey' in event && !!event.ctrlKey)
      || ('touches' in event && (event as TouchEvent).touches.length > 1),
    onRelease: self => {
      if (self.event.type.includes('cancel')) cancelForNavigation();
    },
    // Lenis's existing virtualScroll callback supplies normalized deltas. Observer
    // cancels browser input at capture; that callback also suppresses Lenis's raw target.
  });
  observer.disable();

  function animate(next: number, kind: Phase, seconds = duration, recovering = false) {
    if (!geometry || blocked()) { release(); return; }
    target = next; phase = kind; moving = true; if (!recovering) corrections = 0; setOwnership(true);
    scrollComplete = false;
    if (!recovering) {
      travelStart = ScrollTrigger.getById('eden-passive-editorial')?.animation?.time() ?? geometry.times[next];
      arrivalPending = kind !== 'EXITING_CONTROLLED_REGION'; playback?.beginTravel(next - 1);
    }
    const token = ++transitionToken;
    const destination = kind === 'EXITING_CONTROLLED_REGION'
      ? exitDirection > 0 ? geometry.exit : geometry.entry : geometry.stops[next];
    watchdog.delay(seconds + 1.5).restart(true); paintDebug();
    try {
      lenis.scrollTo(destination, { duration: seconds, easing: ease, userData: { passiveStep: true }, onComplete: () => {
        if (disposed || token !== transitionToken) return;
        scrollComplete = true; watchdog.delay(4).restart(true); rendered();
      } });
    } catch { failed = true; release(); }
  }
  const restoredSlide = (time: number) => {
    if (!geometry) return 0;
    // Before the house stage is fully in place, this remains the photo scene.
    const timeline = ScrollTrigger.getById('eden-passive-editorial')?.animation as gsap.core.Timeline | undefined;
    if (time < (timeline?.labels['principles-start'] ?? geometry.times[1])) return 0;
    return geometry.times.reduce((best, value, index) => Math.abs(value - time) < Math.abs(geometry!.times[best] - time) ? index : best, 0);
  };
  function rendered() {
    if (disposed || refreshing || !geometry) return;
    const trigger = ScrollTrigger.getById('eden-passive-editorial'), timeline = trigger?.animation;
    if (!trigger || !timeline) return;
    const time = timeline.time();
    if (!moving) {
      if (phase === 'FREE_SCROLL') playback?.restore(restoredSlide(time) - 1);
      return;
    }
    const destinationTime = phase === 'EXITING_CONTROLLED_REGION' ? exitDirection > 0 ? geometry.exitTime : geometry.entryTime : geometry.times[target];
    if (arrivalPending || phase === 'EXITING_CONTROLLED_REGION') {
      const span = destinationTime - travelStart;
      playback?.travelProgress(Math.abs(span) > .00001 ? (time - travelStart) / span : 1);
    }
    const tolerance = timeline.duration() / (trigger.end - trigger.start) * 1.5;
    if (!scrollComplete || Math.abs(time - destinationTime) > tolerance) return;
    moving = false; restoredPosition = false; watchdog.pause();
    if (phase === 'EXITING_CONTROLLED_REGION') {
      phase = 'FREE_SCROLL'; setOwnership(false); userIntent = false; playback?.finishExit();
    } else {
      current = target; phase = 'IDLE_AT_CHECKPOINT';
      if (arrivalPending) playback?.arrive(current - 1);
    }
    arrivalPending = false; lastY = lenis.actualScroll; paintDebug();
  }
  const beginGesture = (kind: Source) => {
    source = kind; gestureActive = true; amount = 0;
    // New gestures during a transition are discarded, never queued for completion.
    consumed = moving; paintDebug();
  };
  const enter = (index: number, previousY?: number) => {
    pendingTouchEntry = undefined;
    consumed = true; current = index; target = index; setOwnership(true);
    // Catch native entry momentum before ScrollTrigger paints an overshot state.
    if (previousY !== undefined) {
      guarding = true; lenis.scrollTo(previousY, { immediate: true }); guarding = false;
    }
    animate(index, 'ENTERING_CONTROLLED_REGION');
  };
  const command = (direction: number) => {
    if (consumed || moving || phase !== 'IDLE_AT_CHECKPOINT') return;
    consumed = true;
    const next = current + direction;
    if (next < 0 || next >= passiveStepLabels.length) {
      // A restored endpoint may be visible before its settled checkpoint. This
      // gesture finishes that endpoint; only a fresh outward gesture can leave.
      if (geometry && Math.abs(lenis.actualScroll - geometry.stops[current]) > 2) {
        animate(current, 'ENTERING_CONTROLLED_REGION'); return;
      }
      exitDirection = direction; animate(current, 'EXITING_CONTROLLED_REGION');
    }
    else animate(next, 'TRANSITIONING');
  };
  function guardNative() {
    if (!owns || !geometry || refreshing || guarding || blocked()) return;
    // At a restored mid-scene position the idle anchor is the existing Lenis
    // position, not a checkpoint that the visitor has never navigated to.
    const expected = moving ? lenis.animatedScroll : lenis.targetScroll;
    if (expected === undefined || Math.abs(lenis.actualScroll - expected) <= 1) return;
    // Programmatic Lenis scrolling cancels an already-running native entry fling.
    // This guard also handles engines that deliver a residual native scroll event.
    if (++corrections > 4) { failed = true; release(); return; }
    const next = target, kind = phase;
    guarding = true; lenis.scrollTo(expected, { immediate: true }); guarding = false;
    if (moving) animate(next, kind, .4, true);
  }
  const input = ({ deltaX, deltaY, event }: VirtualScrollData): boolean => {
    if (failed || disposed || refreshing || blocked()) return true;
    if (exempt(event) || event.ctrlKey || ('touches' in event && event.touches.length > 1)) { release(); return true; }
    if (!geometry) return true;
    const y = lenis.actualScroll, first = geometry.stops[0], last = geometry.stops[geometry.stops.length - 1];
    if (event.type === 'touchstart') beginGesture('touch');
    else if (event.type === 'wheel') {
      if (source !== 'wheel' || !gestureActive) beginGesture('wheel');
      endWheel.restart(true);
    }
    if (event.type === 'touchend') { gestureActive = false; paintDebug(); }
    if (event.type === 'touchend' && pendingTouchEntry !== undefined) { release(); return swallow(event); }
    const direction = Math.sign(deltaY);
    const vertical = Math.abs(deltaY) > Math.abs(deltaX);
    if (phase === 'FREE_SCROLL') {
      // The gesture that exits cannot immediately capture the boundary again.
      if (exitDirection && consumed && gestureActive) { if (event.cancelable) event.preventDefault(); return false; }
      if (y >= first - 1 && y <= last + 1) {
        // A restored/cancelled position is independent of ordinary boundary entry.
        // Adopt its displayed scene; the next gesture goes to an adjacent state,
        // rather than first snapping backwards to a nearby but different scene.
        const shown = Number(principles?.dataset.ppVisible ?? -1) + 1;
        const index = Number.isInteger(shown) && shown >= 0 && shown < passiveStepLabels.length ? shown
          : geometry.stops.reduce((best, stop, i) => Math.abs(stop - y) < Math.abs(geometry!.stops[best] - y) ? i : best, 0);
        restoredPosition = Math.abs(y - geometry.stops[index]) > 2;
        guarding = true; lenis.scrollTo(y, { immediate: true }); guarding = false;
        current = target = index; phase = 'IDLE_AT_CHECKPOINT'; setOwnership(true); paintDebug();
      } else if (vertical && event.type !== 'touchend') {
        userIntent = true;
        // Cancel the first deliberate inward touchmove before native panning
        // starts. Waiting until it crosses the checkpoint is too late to cancel
        // the rest of an already-running native drag on some mobile engines.
        if (event.type === 'touchmove' && event.cancelable &&
          (y >= geometry.start && y < first && direction > 0 || y > last && y <= geometry.end && direction < 0)) {
          pendingTouchEntry = direction > 0 ? 0 : passiveStepLabels.length - 1;
          target = pendingTouchEntry; phase = 'ENTERING_CONTROLLED_REGION';
          guarding = true; lenis.scrollTo(y, { immediate: true }); guarding = false;
          setOwnership(true); paintDebug();
        } else {
        // Clamp a wheel's intended destination before Lenis can accumulate a large
        // target beyond P1/P5. The existing introduction still plays via document scroll.
        const projected = lenis.targetScroll + deltaY;
        if (y >= geometry.start && y < first && direction > 0 && projected >= first) { enter(0); return swallow(event); }
        if (y > last && direction < 0 && projected <= last) { enter(passiveStepLabels.length - 1); return swallow(event); }
        return true;
        }
      } else return true;
    }
    if (pendingTouchEntry !== undefined && vertical && direction !== (pendingTouchEntry === 0 ? 1 : -1)) { release(); return true; }
    if (event.cancelable) event.preventDefault();
    if (event.type === 'wheel' || event.type === 'touchmove') {
      if (vertical && !consumed && !moving) {
        amount = Math.sign(amount) === direction ? amount + deltaY : deltaY;
        if (Math.abs(amount) >= (source === 'touch' ? 22 : 18)) {
          if (pendingTouchEntry !== undefined) enter(pendingTouchEntry);
          else command(direction);
        }
      }
    }
    return false;
  };
  const onScroll = () => {
    if (guarding || refreshing || disposed || failed || !geometry) return;
    const y = lenis.actualScroll;
    if (owns) guardNative();
    else if (userIntent && !blocked() && !lenis.userData.passiveStep) {
      if (lastY < geometry.stops[0] && y >= geometry.stops[0]) enter(0, lastY);
      else if (lastY > geometry.stops[geometry.stops.length - 1] && y <= geometry.stops[geometry.stops.length - 1]) enter(passiveStepLabels.length - 1, lastY);
    }
    lastY = lenis.actualScroll;
    if (!moving && !owns) rendered();
  };
  const cancelForNavigation = () => { consumed = true; gestureActive = false; endWheel.pause(); release(); };
  root!.addEventListener(passivePrincipleChangeEvent, paintDebug, { signal });
  // Catch native entry before document-level ScrollTrigger listeners can paint it.
  // This is a passive scroll guard, not another global wheel/touch observer.
  window.addEventListener('scroll', onScroll, { passive: true, capture: true, signal });
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.altKey || exempt(event)) { cancelForNavigation(); return; }
    const direction = ['ArrowDown', 'PageDown'].includes(event.key) || event.key === ' ' && !event.shiftKey ? 1
      : ['ArrowUp', 'PageUp'].includes(event.key) || event.key === ' ' && event.shiftKey ? -1 : 0;
    if (!direction || !owns) { cancelForNavigation(); return; }
    event.preventDefault();
    if (!event.repeat) { beginGesture('key'); command(direction); }
  }, { capture: true, signal });
  document.addEventListener('keyup', () => { if (source === 'key') { gestureActive = false; paintDebug(); } }, { signal });
  for (const type of ['focusin', 'click'] as const) document.addEventListener(type, cancelForNavigation, { capture: true, signal });
  // Scrollbar dragging and mouse text selection are explicit exits from gesture ownership.
  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') cancelForNavigation();
  }, { capture: true, signal });
  for (const type of ['popstate', 'hashchange', 'pagehide', 'blur'] as const) window.addEventListener(type, cancelForNavigation, { signal });
  document.addEventListener('visibilitychange', cancelForNavigation, { signal });
  reduced.addEventListener('change', cancelForNavigation, { signal });
  const lockObserver = new MutationObserver(() => { if (blocked()) cancelForNavigation(); });
  lockObserver.observe(html, { attributes: true, attributeFilter: ['style', 'data-home-loading'] });
  const beforeRefresh = () => {
    refreshing = true;
    if (moving) { transitionToken++; lenis.scrollTo(lenis.actualScroll, { immediate: true }); }
  };
  const afterRefresh = () => {
    measure(); refreshing = false; lastY = lenis.actualScroll;
    if (!geometry || blocked()) { release(); return; }
    if (owns) {
      if (moving) animate(target, phase, .4, true);
      else if (restoredPosition) {
        const shown = Number(principles?.dataset.ppVisible ?? -1) + 1;
        if (Number.isInteger(shown) && shown >= 0 && shown < passiveStepLabels.length) current = target = shown;
      }
      else if (Math.abs(lenis.actualScroll - geometry.stops[current]) > 1) animate(current, 'TRANSITIONING', .35, true);
    }
    rendered();
    paintDebug();
  };
  ScrollTrigger.addEventListener('refreshInit', beforeRefresh);
  ScrollTrigger.addEventListener('refresh', afterRefresh);
  measure(); rendered(); paintDebug();
  return { input, onScroll, dispose: () => {
    disposed = true; release(); stopRendered?.(); controller.abort(); lockObserver.disconnect();
    endWheel.kill(); watchdog.kill(); observer.kill(); debug?.remove();
    ScrollTrigger.removeEventListener('refreshInit', beforeRefresh);
    ScrollTrigger.removeEventListener('refresh', afterRefresh);
  } };
}
