import type { gsap as GSAP } from 'gsap';
import { passivePrincipleSwitches } from './passive-principles';

export const passiveCheckpointLabels = ['principle-1', 'principle-2', 'principle-3', 'principle-4', 'principle-5'];
export const passiveStepLabels = ['photo-introduction', ...passiveCheckpointLabels];

/** Fractional principle index from the rendered timeline. Endpoints -1 and 5
 *  let the first segment start empty and the last finish filling on the way out. */
export function createPassiveIndicatorPosition(labels: Record<string, number>) {
  const stops = [labels['principles-start'], ...passiveCheckpointLabels.map(label => labels[label]), labels['principles-end']];
  return (time: number) => {
    const next = stops.findIndex(stop => time < stop);
    if (next === 0) return -1;
    if (next < 0) return passiveCheckpointLabels.length;
    const previous = stops[next - 1];
    return next - 2 + (time - previous) / (stops[next] - previous);
  };
}

/** Labels describe existing painted plateaus; they add no time or animation. */
export function labelPassiveCheckpoints(timeline: ReturnType<typeof GSAP.timeline>, state: { progress: number }, stamp: HTMLElement,
  photograph: HTMLElement, headline: HTMLElement[]) {
  const tween = timeline.getTweensOf(state)[0];
  const start = tween.startTime(), duration = tween.duration();
  const photoTravel = timeline.getTweensOf(photograph).filter(item => item.duration() > 0).sort((a, b) => a.startTime() - b.startTime())[0];
  const headlineTravel = timeline.getTweensOf(headline).filter(item => item.duration() > 0).sort((a, b) => a.startTime() - b.startTime());
  const photoReady = Math.max(photoTravel.endTime(), headlineTravel[0].endTime());
  timeline.addLabel('photo-entry', photoTravel.startTime());
  timeline.addLabel('photo-introduction', (photoReady + headlineTravel[1].startTime()) / 2);
  timeline.addLabel('principles-start', start).addLabel('principles-end', start + duration);
  passivePrincipleSwitches.forEach((progress, index) => timeline.addLabel(`principle-${index + 1}-to-${index + 2}`, start + duration * progress));
  // Diagram entry finishes at .29 of each principle; its headline wipes after .64.
  // The first composition also waits for the preceding architectural stamp to fade.
  const firstWipe = start + duration * .64 / 5;
  const stampGone = Math.max(start, ...timeline.getTweensOf(stamp)
    .filter(item => item.vars.opacity === 0 && item.endTime() <= firstWipe)
    .map(item => item.endTime()));
  passiveCheckpointLabels.forEach((label, index) => timeline.addLabel(label, index === 0
    ? (stampGone + firstWipe) / 2 : start + duration * (index + .46) / 5));
}

