import { gsap } from 'gsap';

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };

/** Painted by the existing section's scrubbed timeline; no ticker or extra trigger. */
export function createPassivePrinciples(root: HTMLElement) {
  const panels = [...root.querySelectorAll<HTMLElement>('[data-ps-principle]')];
  const tracks = panels.map(panel => [...panel.querySelectorAll<HTMLElement>('[data-pp-track]')]);
  const steps = [...root.querySelectorAll<HTMLElement>('[data-pp-step]')];
  const bars = [...root.querySelectorAll<HTMLElement>('[data-pp-progress]')];
  const opacity = panels.map(panel => gsap.quickSetter(panel, 'opacity'));
  const masks = panels.map(panel => gsap.quickSetter(panel, 'clipPath'));
  const offsets = tracks.map(lines => lines.map(line => gsap.quickSetter(line, 'x', 'px')));
  const stepOpacity = steps.map(step => gsap.quickSetter(step, 'opacity'));
  const barScale = bars.map(bar => gsap.quickSetter(bar, 'scaleX'));
  gsap.set(bars, { transformOrigin: '0 50%' });

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

  const paint = () => {
    if (paintedProgress === state.progress) return;
    paintedProgress = state.progress;
    const position = clamp(state.progress) * 5;
    const current = Math.min(4, Math.floor(position));
    const fraction = current === 4 ? clamp(position - 4) : position - current;
    const transition = current === 4 ? 0 : ease((fraction - .64) / .36);
    const weights = panels.map((_, index) => index === current ? 1 - transition : index === current + 1 ? transition : 0);
    const entry = (index: number) => ease((position - index + .36) / .65);
    panels.forEach((panel, index) => {
      // Complementary masks share the same width: an editorial wipe, with no
      // overlapping letters and no point at which both headlines disappear.
      const leaving = index === current;
      const arriving = index === current + 1 && transition > 0;
      opacity[index](leaving || arriving ? 1 : 0);
      masks[index](leaving ? `inset(0 ${transition * 100}% 0 0)` : `inset(0 0 0 ${(1 - (arriving ? transition : 0)) * 100}%)`);
      panel.style.pointerEvents = leaving && transition < .5 || arriving && transition >= .5 ? 'auto' : 'none';
      offsets[index].forEach((set, line) => {
        set((leaving ? -transition : 1 - transition) * (10 + line * 2));
      });
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
  return { state, paint };
}
