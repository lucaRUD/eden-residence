import type { gsap as GSAP } from 'gsap';

export const passiveCheckpointLabels = ['principle-1', 'principle-2', 'principle-3', 'principle-4', 'principle-5'];

/** Labels describe existing painted plateaus; they add no time or animation. */
export function labelPassiveCheckpoints(timeline: ReturnType<typeof GSAP.timeline>, state: { progress: number }, stamp: HTMLElement) {
  const tween = timeline.getTweensOf(state)[0];
  const start = tween.startTime(), duration = tween.duration();
  timeline.addLabel('principles-start', start).addLabel('principles-end', start + duration);
  // Diagram entry finishes at .29 of each principle; its headline wipes after .64.
  // The first composition also waits for the preceding architectural stamp to fade.
  const firstWipe = start + duration * .64 / 5;
  const stampGone = Math.max(start, ...timeline.getTweensOf(stamp)
    .filter(item => item.vars.opacity === 0 && item.endTime() <= firstWipe)
    .map(item => item.endTime()));
  passiveCheckpointLabels.forEach((label, index) => timeline.addLabel(label, index === 0
    ? (stampGone + firstWipe) / 2 : start + duration * (index + .46) / 5));
}

