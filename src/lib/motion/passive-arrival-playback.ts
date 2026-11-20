import { gsap } from 'gsap';

export const passivePrincipleChangeEvent = 'eden:passive-principle-change';
export type HousePhase = 'photo' | 'travelling' | 'waiting' | 'playing' | 'complete';
export interface PassiveArrivalPlayback {
  beginTravel: (destination: number) => void;
  travelProgress: (progress: number, retractHighlight?: boolean) => void;
  arrive: (index: number, durationScale?: number) => void;
  restore: (index: number) => void;
  cancel: () => void;
  finishExit: () => void;
  rendered: () => void;
  onRendered: (callback: () => void) => () => void;
  dispose: () => void;
}
const sessions = new WeakMap<HTMLElement, PassiveArrivalPlayback>();
export const getPassiveArrivalPlayback = (root: HTMLElement) => sessions.get(root);
const revealSeconds = [1.15, 1.2, 1.15, 1.5, 1.15];
const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** One diagram painter, shared by mutually exclusive travel and arrival modes. */
export function createPassiveArrivalPlayback(root: HTMLElement,
  diagram: (index: number, progress: number, weight?: number) => void,
  text: (index: number) => void): PassiveArrivalPlayback {
  const listeners = new Set<() => void>();
  const playhead = { progress: 0 };
  let active = -1, visible = -1, phase: HousePhase = 'photo';
  let outgoing = -1, outgoingProgress = 0;
  let weight = 1, outgoingWeight = 1;
  let revealDurationScale = 1;
  let generation = 0, pendingGeneration = 0, playingGeneration = 0, disposed = false;
  const status = (next: HousePhase) => {
    phase = next;
    if (root.dataset.ppHouse !== next) {
      root.dataset.ppHouse = next;
      root.dispatchEvent(new CustomEvent(passivePrincipleChangeEvent, { bubbles: true }));
    }
  };
  const reveal = gsap.to(playhead, { progress: 1, duration: 1.2, ease: 'none', paused: true,
    onUpdate: () => {
      if (!disposed && playingGeneration === generation && phase === 'playing') diagram(active, playhead.progress);
    },
    onComplete: () => {
      if (!disposed && playingGeneration === generation && phase === 'playing') status('complete');
    },
  });
  const beat = gsap.delayedCall(.2, () => {
    if (disposed || pendingGeneration !== generation || phase !== 'waiting') return;
    // Rewind before changing duration, with old callbacks suppressed. Configuring
    // a completed tween while already marked playing can fire its old completion.
    reveal.pause(0, true); playhead.progress = 0;
    reveal.duration(revealSeconds[active] * revealDurationScale).invalidate();
    playingGeneration = generation; status('playing'); reveal.restart();
  }).pause();
  const stop = () => { generation++; beat.pause(); reveal.pause(); };
  const show = (index: number) => { visible = index; text(index); };
  const restore = (index: number) => {
    if (disposed) return;
    if (active === index && visible === index && (phase === 'complete' || phase === 'photo')) return;
    stop(); active = index; playhead.progress = 1; weight = 1;
    diagram(index, 1); show(index); status(index < 0 ? 'photo' : 'complete');
  };
  const session: PassiveArrivalPlayback = {
    beginTravel: destination => {
      if (disposed) return;
      outgoing = visible; outgoingProgress = playhead.progress; outgoingWeight = weight;
      stop(); active = destination; status('travelling');
    },
    travelProgress: (progress, retractHighlight = false) => {
      if (phase !== 'travelling' || disposed) return;
      const amount = clamp(progress);
      const remaining = 1 - amount * amount * (3 - 2 * amount);
      weight = outgoingWeight * remaining;
      // On mobile, the existing linework withdraws as it fades. The incoming
      // explanation still starts in its normal order after the arrival beat.
      diagram(outgoing, retractHighlight ? outgoingProgress * remaining : outgoingProgress, weight);
    },
    arrive: (index, durationScale = 1) => {
      if (disposed) return;
      stop(); active = index; playhead.progress = 0; weight = 1;
      revealDurationScale = durationScale;
      diagram(index, 0); show(index);
      if (index < 0) { status('photo'); return; }
      status('waiting'); pendingGeneration = generation; beat.restart(true);
    },
    restore,
    cancel: () => { if (disposed) return; stop(); active = visible; playhead.progress = 1; weight = 1; diagram(visible, 1); status(visible < 0 ? 'photo' : 'complete'); },
    finishExit: () => { if (disposed) return; stop(); active = visible; status(visible < 0 ? 'photo' : 'complete'); },
    rendered: () => { if (!disposed) listeners.forEach(callback => callback()); },
    onRendered: callback => { listeners.add(callback); return () => { listeners.delete(callback); }; },
    dispose: () => {
      disposed = true; stop(); beat.kill(); reveal.kill(); listeners.clear();
      if (sessions.get(root) === session) sessions.delete(root);
    },
  };
  sessions.set(root, session);
  // Initial and history positions are readable without starting a reveal.
  diagram(-1, 1); show(-1); root.dataset.ppHouse = 'photo';
  return session;
}
