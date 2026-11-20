import { gsap } from 'gsap';
import { createPassiveArrivalPlayback, passivePrincipleChangeEvent } from './passive-arrival-playback';
export { passivePrincipleChangeEvent } from './passive-arrival-playback';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
const blendStart = .64;
// The existing illustration changes dominant principle halfway through each blend.
export const passivePrincipleSwitches = Array.from({ length: 4 }, (_, index) => (index + blendStart + (1 - blendStart) / 2) / 5);

/** Painted by the existing section's scrubbed timeline; no ticker or extra trigger. */
export function createPassivePrinciples(root: HTMLElement, wholeText = false, scrollDrivenIndicator = false) {
  const panels = [...root.querySelectorAll<HTMLElement>('[data-ps-principle]')];
  const chapter = root.closest('[data-passive-editorial]');
  const photoHeadline = chapter?.querySelector<HTMLElement>('[data-ps-architecture-heading]');
  const technicalHeadline = chapter?.querySelector<HTMLElement>('[data-ps-principles-heading]');
  const copyOwners = [root, ...panels, ...[photoHeadline, technicalHeadline].filter((element): element is HTMLElement => !!element)];
  const tracks = panels.map(panel => [...panel.querySelectorAll<HTMLElement>('[data-pp-track]')]);
  const steps = [...root.querySelectorAll<HTMLElement>('[data-pp-step]')];
  const bars = [...root.querySelectorAll<HTMLElement>('[data-pp-progress]')];
  const opacity = panels.map(panel => gsap.quickSetter(panel, 'opacity'));
  const masks = panels.map(panel => gsap.quickSetter(panel, 'clipPath'));
  const offsets = tracks.map(lines => lines.map(line => gsap.quickSetter(line, 'x', 'px')));
  const stepOpacity = steps.map(step => gsap.quickSetter(step, 'opacity'));
  const barScale = bars.map(bar => gsap.quickSetter(bar, 'scaleX'));
  gsap.set(bars, { transformOrigin: '0 50%' });
  const attributes = new Map(copyOwners.map(element => [element, new Map(
    (element === root ? ['data-pp-text', 'data-pp-visible', 'data-pp-house'] : ['aria-hidden', 'inert']).map(name => [name, element.getAttribute(name)]),
  )]));
  let visible = Number.NaN, disposed = false;
  if (wholeText) {
    root.dataset.ppText = 'whole';
    gsap.set(panels, { opacity: 1, clipPath: 'none' });
    gsap.set(tracks.flat(), { clearProps: 'transform' });
  }

  const layer = (selector: string) => gsap.quickSetter(root.querySelector<SVGElement>(selector)!, 'opacity');
  const envelope = layer('[data-pp-envelope]');
  const windows = layer('[data-pp-windows]');
  const sun = layer('[data-pp-sun]');
  const airtight = layer('[data-pp-airtight]');
  const seals = layer('[data-pp-seals]');
  const supply = layer('[data-pp-supply]');
  const extract = layer('[data-pp-extract]');
  const exchange = layer('[data-pp-exchange]');
  const junctions = layer('[data-pp-junctions]');
  const draw = (selector: string) => [...root.querySelectorAll<SVGGeometryElement>(selector)].map(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    const set = gsap.quickSetter(path, 'strokeDashoffset');
    return (amount: number) => set(length * (1 - clamp(amount)));
  });
  const envelopeDraw = draw('[data-pp-envelope]');
  const airtightDraw = draw('[data-pp-airtight]');
  const sunDraw = draw('[data-pp-sun-ray]');
  const freshDraw = draw('[data-pp-supply] [data-pp-flow]');
  const usedDraw = draw('[data-pp-extract] [data-pp-flow]');
  const heatDraw = draw('[data-pp-heat]');
  const state = { progress: 0 };
  let paintedProgress = Number.NaN;
  let paintedIndicator = Number.NaN;
  const paintIndicator = (position: number) => {
    if (disposed || position === paintedIndicator) return;
    paintedIndicator = position;
    const activePosition = Math.min(position, steps.length - 1);
    steps.forEach((_, index) => {
      const emphasis = clamp(1 - Math.abs(activePosition - index));
      stepOpacity[index](.38 + .62 * emphasis);
      const relative = position - index;
      // Match the original fill at each checkpoint and interpolate between them.
      barScale[index](relative < 0 ? .46 * clamp(relative + 1) : .46 + .54 * clamp(relative));
    });
  };
  const showText = (index: number) => {
    if (index === visible) return;
    visible = index;
    for (const [element, active] of [[photoHeadline, index < 0], [technicalHeadline, index >= 0]] as const) {
      if (!element) continue;
      element.style.visibility = active ? 'visible' : 'hidden';
      element.setAttribute('aria-hidden', String(!active)); element.inert = !active;
    }
    panels.forEach((panel, item) => {
      const active = item === index;
      panel.style.visibility = active ? 'visible' : 'hidden';
      panel.style.pointerEvents = active ? 'auto' : 'none';
      panel.setAttribute('aria-hidden', String(!active)); panel.inert = !active;
      if (!scrollDrivenIndicator) {
        stepOpacity[item](active ? 1 : .38);
        barScale[item](item < index ? 1 : active ? .46 : 0);
      }
    });
    root.dataset.ppVisible = String(index);
    root.dispatchEvent(new CustomEvent(passivePrincipleChangeEvent, { bubbles: true }));
  };
  const explanation = (index: number, progress: number, weight = 1) => {
    const p = clamp(progress), fade = ease(p * 4) * weight;
    envelope(index === 0 ? fade : index === 4 ? .24 * ease(p * 2) * weight : 0);
    envelopeDraw.forEach(set => set(index === 0 ? ease(p) : index === 4 ? 1 : 0));
    windows(index === 1 ? ease(p * 1.8) * weight : 0); sun(index === 1 ? ease(p) * weight : 0);
    sunDraw.forEach((set, item) => set(index === 1 ? p * 1.4 - item * .18 : 0));
    airtight(index === 2 ? fade : 0); seals(index === 2 ? ease((p - .3) / .7) * weight : 0);
    airtightDraw.forEach(set => set(index === 2 ? ease(p) : 0));
    supply(index === 3 ? fade : 0); extract(index === 3 ? ease(p * 1.8 - .35) * weight : 0);
    freshDraw.forEach((set, item) => set(index === 3 ? p * 2.1 - item * .22 : 0));
    usedDraw.forEach((set, item) => set(index === 3 ? p * 2.1 - .35 - item * .15 : 0));
    exchange(index === 3 ? ease((p - .35) / .5) * weight : 0);
    heatDraw.forEach(set => set(index === 3 ? (p - .6) / .4 : 0));
    junctions(index === 4 ? ease(p) * weight : 0);
  };
  // The flag gives SVG properties exclusively to this painter. Scroll only drives
  // the travel fade; the same painter receives the independent arrival playhead.
  const arrival = wholeText ? createPassiveArrivalPlayback(root, explanation, showText) : undefined;

  const paint = () => {
    if (disposed || wholeText || paintedProgress === state.progress) return;
    paintedProgress = state.progress;
    const position = clamp(state.progress) * 5;
    const current = Math.min(4, Math.floor(position));
    const fraction = current === 4 ? clamp(position - 4) : position - current;
    const transition = current === 4 ? 0 : ease((fraction - blendStart) / (1 - blendStart));
    const weights = panels.map((_, index) => index === current ? 1 - transition : index === current + 1 ? transition : 0);
    const entry = (index: number) => ease((position - index + .36) / .65);
    panels.forEach((panel, index) => {
      // Complementary masks share the same width: an editorial wipe, with no
      // overlapping letters and no point at which both headlines disappear.
      const leaving = index === current;
      const arriving = index === current + 1 && transition > 0;
      if (!wholeText) {
        opacity[index](leaving || arriving ? 1 : 0);
        masks[index](leaving ? `inset(0 ${transition * 100}% 0 0)` : `inset(0 0 0 ${(1 - (arriving ? transition : 0)) * 100}%)`);
        panel.style.pointerEvents = leaving && transition < .5 || arriving && transition >= .5 ? 'auto' : 'none';
        offsets[index].forEach((set, line) => {
          set((leaving ? -transition : 1 - transition) * (10 + line * 2));
        });
      }
      stepOpacity[index](index === current || index === current + 1 && transition > .5 ? 1 : .38);
      barScale[index](clamp(position - index));
    });
    // All layers belong to the same section drawing. Color encodes thermal/air behavior.
    envelope(weights[0] + weights[4] * .24);
    envelopeDraw.forEach(set => set(Math.max(entry(0), entry(4))));
    windows(weights[1]); sun(weights[1]);
    sunDraw.forEach((set, index) => set(entry(1) * 1.4 - index * .18));
    airtight(weights[2]); seals(weights[2] * ease((entry(2) - .3) / .7));
    airtightDraw.forEach(set => set(entry(2)));
    supply(weights[3]); extract(weights[3] * ease(entry(3) * 1.8 - .35));
    freshDraw.forEach((set, index) => set(entry(3) * 2.1 - index * .22));
    usedDraw.forEach((set, index) => set(entry(3) * 2.1 - .35 - index * .15));
    exchange(weights[3] * ease((entry(3) - .35) / .5));
    heatDraw.forEach(set => set((entry(3) - .6) / .4));
    junctions(weights[4] * entry(4));
  };
  paint();
  return { state, paint, paintIndicator, rendered: () => arrival?.rendered(), dispose: () => {
    disposed = true;
    arrival?.dispose();
    if (!wholeText) return;
    attributes.forEach((values, element) => values.forEach((value, name) => {
      if (value === null) element.removeAttribute(name); else element.setAttribute(name, value);
    }));
  } };
}
