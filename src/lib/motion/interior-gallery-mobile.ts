import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Rect { x: number; y: number; width: number; height: number; radius: number }
type Pose = 'small' | 'full' | 'card' | 'previous' | 'next';
interface Raster { width: number; height: number; focusX: number; focusY: number }

/** One photograph moves between measured windows; no duplicate slides or timer. */
export function createMobileInteriorGallery(root: HTMLElement, scrollDistanceMultiplier: number): () => void {
  const stage = root.querySelector<HTMLElement>('[data-gallery-stage]')!;
  const viewport = root.querySelector<HTMLElement>('[data-gallery-viewport]')!;
  const intro = root.querySelector<HTMLElement>('[data-gallery-intro]')!;
  const frames = [...root.querySelectorAll<HTMLElement>('[data-gallery-frame]')];
  const inners = frames.map(frame => frame.querySelector<HTMLElement>('[data-gallery-image]')!);
  const images = frames.map(frame => frame.querySelector<HTMLImageElement>('img')!);
  const copies = [...root.querySelectorAll<HTMLElement>('[data-gallery-room-copy]')];
  const lines = copies.map(copy => [...copy.querySelectorAll<HTMLElement>('.interior-gallery__line')]);
  const details = copies.map(copy => [...copy.querySelectorAll<HTMLElement>('.interior-gallery__description, .interior-gallery__caption')]);
  const shade = root.querySelector<HTMLElement>('[data-gallery-shade]')!;
  const endShade = root.querySelector<HTMLElement>('[data-gallery-end-shade]')!;
  const extraStyles = new Map([...images, ...lines.flat(), ...details.flat(), endShade]
    .map(element => [element, element.getAttribute('style')] as const));
  root.dataset.galleryMode = 'mobile';
  let stableHeight = 0, measuredWidth = 0;
  let visibleHeight = innerHeight;
  let poses: Record<Pose, Rect>;
  let rasters: Raster[];
  let cardCopyTop = 0, fullCopyTop = 0;
  let trigger: ScrollTrigger | undefined;
  let resizeAnchor: { start: number; scroll: number; width: number } | undefined;
  const measure = () => {
    const width = root.clientWidth;
    const sameWidth = Math.abs(width - measuredWidth) <= 1;
    if (sameWidth && visibleHeight !== innerHeight && trigger?.isActive
      && matchMedia('(pointer: coarse)').matches && !document.querySelector('[aria-modal="true"]')) {
      resizeAnchor = { start: trigger.start, scroll: trigger.scroll(), width };
    }
    visibleHeight = innerHeight;
    // Keep browser chrome from rebuilding the stage. Read the unpinned probe
    // again only for a genuine width/orientation change.
    if (!stableHeight || !sameWidth) {
      stableHeight = viewport.getBoundingClientRect().height;
      measuredWidth = width;
    }
    const height = stableHeight;
    stage.style.setProperty('--gallery-mobile-height', String(height) + 'px');
    const gutter = parseFloat(getComputedStyle(intro).right);
    const portrait = height > width;
    const thumbWidth = Math.min(92, width * .22);
    const thumbHeight = thumbWidth / 1.45;
    const thumbY = height - thumbHeight - Math.max(20, height * .035);
    const card = portrait
      ? { x: gutter, y: Math.max(78, height * .115), width: width - gutter * 2, height: height * .43, radius: 18 }
      : { x: gutter, y: 84, width: width * .48, height: Math.max(150, height * .54), radius: 18 };
    const smallWidth = portrait ? width * .66 : width * .3;
    poses = {
      small: { x: portrait ? (width - smallWidth) / 2 : width * .12, y: height * (portrait ? .65 : .4), width: smallWidth, height: smallWidth / 1.45, radius: 18 },
      full: { x: 0, y: 0, width, height, radius: 0 },
      card,
      previous: { x: gutter, y: thumbY, width: thumbWidth, height: thumbHeight, radius: 10 },
      next: { x: portrait ? width - gutter - thumbWidth : card.x + card.width - thumbWidth, y: thumbY, width: thumbWidth, height: thumbHeight, radius: 10 },
    };
    cardCopyTop = height * (portrait ? .59 : .34);
    fullCopyTop = height * (portrait ? .71 : .5);
    rasters = images.map((image, index) => {
      const ratio = Number(image.getAttribute('width')) / Number(image.getAttribute('height'));
      const rasterWidth = Math.max(width, height * ratio);
      const rasterHeight = rasterWidth / ratio;
      frames[index].style.setProperty('--gallery-raster-width', String(rasterWidth) + 'px');
      frames[index].style.setProperty('--gallery-raster-height', String(rasterHeight) + 'px');
      const focus = getComputedStyle(frames[index]).getPropertyValue('--gallery-photo-position').trim().split(/\s+/).map(value => parseFloat(value) / 100);
      return { width: rasterWidth, height: rasterHeight, focusX: focus[0], focusY: focus[1] };
    });
  };
  const retainResizePosition = () => {
    const anchor = resizeAnchor;
    resizeAnchor = undefined;
    if (!anchor || !trigger || Math.abs(root.clientWidth - anchor.width) > 1) return;
    // Preserve the shot if the dynamic hero above changes this pin's document offset.
    const change = trigger.start - anchor.start;
    if (Math.abs(change) > .5) { trigger.scroll(anchor.scroll + change); ScrollTrigger.update(); }
  };
  measure();
  const clip = (pose: Pose) => () => {
    const rect = poses[pose];
    return 'inset(' + rect.y + 'px ' + (measuredWidth - rect.x - rect.width) + 'px '
      + (stableHeight - rect.y - rect.height) + 'px ' + rect.x + 'px round ' + rect.radius + 'px)';
  };
  const position = (pose: Pose, index: number) => {
    const value = () => {
      const rect = poses[pose], raster = rasters[index];
      const scale = Math.max(rect.width / raster.width, rect.height / raster.height) * 1.12;
      return {
        scale,
        x: rect.x + rect.width / 2 - measuredWidth / 2 + (raster.width * scale - rect.width) * (.5 - raster.focusX),
        y: rect.y + rect.height / 2 - stableHeight / 2 + (raster.height * scale - rect.height) * (.5 - raster.focusY),
      };
    };
    return { x: () => value().x, y: () => value().y, scale: () => value().scale };
  };
  const forest = getComputedStyle(root).getPropertyValue('--color-brand-green').trim();
  const cream = getComputedStyle(root).getPropertyValue('--color-brand-cream').trim();
  const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  const move = (index: number, from: Pose, to: Pose, at: number, duration: number) => {
    timeline.fromTo(frames[index], { clipPath: clip(from) }, { clipPath: clip(to), duration, immediateRender: false }, at)
      .fromTo(inners[index], position(from, index), { ...position(to, index), duration, immediateRender: false }, at);
  };
  timeline.set(intro, { opacity: 1, y: 0, pointerEvents: 'auto' }, 0)
    .set(frames[0], { opacity: 1, clipPath: clip('small'), zIndex: 2 }, 0)
    .set(inners[0], position('small', 0), 0)
    .set(frames[1], { opacity: 0, clipPath: clip('next'), zIndex: 3 }, 0)
    .set(inners[1], position('next', 1), 0)
    .set(frames[2], { opacity: 0, clipPath: clip('next'), zIndex: 4 }, 0)
    .set(inners[2], position('next', 2), 0)
    .set(images, { x: 0, y: 0, xPercent: -50, yPercent: -50 }, 0)
    .set([shade, endShade], { opacity: 0 }, 0)
    .set(copies, { top: () => cardCopyTop, opacity: 0, color: forest, clipPath: 'inset(0%)', pointerEvents: 'none' }, 0)
    .set(lines.flat(), { x: 0 }, 0)
    .set(details.flat(), { opacity: 1 }, 0)
    .to(intro, { opacity: 0, y: -16, duration: .5 }, .45)
    .set(intro, { pointerEvents: 'none' }, .45)
    .to(images[0], { yPercent: -52, duration: 1.2, ease: 'none' }, .45);
  move(0, 'small', 'full', .45, 1.2);
  timeline.to(shade, { opacity: 1, duration: .45 }, 1.1)
    .set(copies[0], { top: () => fullCopyTop, color: cream }, 1.25)
    .set(details[0], { opacity: 0 }, 1.25)
    .to(copies[0], { opacity: 1, duration: .35 }, 1.3)
    .set(copies[0], { pointerEvents: 'auto' }, 1.3)
    .to(copies[0], { opacity: 0, duration: .25 }, 2.15)
    .set(copies[0], { pointerEvents: 'none' }, 2.15);
  move(0, 'full', 'card', 2.25, 1.1);
  timeline.to(shade, { opacity: 0, duration: .45 }, 2.65)
    .to(images[0], { yPercent: -48, duration: 1.1, ease: 'none' }, 2.25)
    .set(copies[0], { top: () => cardCopyTop, color: forest }, 3.2)
    .set(details[0], { opacity: 1 }, 3.2)
    .to(copies[0], { opacity: 1, duration: .3 }, 3.25)
    .set(copies[0], { pointerEvents: 'auto' }, 3.25)
    .to(frames[1], { opacity: 1, duration: .3 }, 3.2);

  // Each preview is the next main photograph, never a disconnected duplicate.
  for (let next = 1; next < frames.length; next++) {
    const at = next === 1 ? 4.15 : 5.85;
    const previous = next - 1;
    move(previous, 'card', 'previous', at, .95);
    move(next, 'next', 'card', at, .95);
    // Clear the copy while the preview crosses its area, then reveal complete lines.
    timeline.to(copies[previous], { opacity: 0, duration: .2 }, at)
      .fromTo(copies[next], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .3, immediateRender: false }, at + .75)
      .to(lines[previous], { x: -8, duration: .2 }, at)
      .fromTo(lines[next], { x: 8 }, { x: 0, duration: .3, immediateRender: false }, at + .75)
      .to(images[next], { yPercent: -52, duration: 1.35, ease: 'none' }, at)
      .set(copies[previous], { pointerEvents: 'none' }, at)
      .set(copies[next], { pointerEvents: 'auto' }, at + .9);
    if (next === 1) timeline.to(frames[2], { opacity: 1, duration: .3 }, 5.05);
    else timeline.to(frames[0], { opacity: 0, duration: .25 }, at + .35);
  }
  timeline.to(copies[2], { opacity: 0, duration: .25 }, 7.4)
    .set(copies[2], { pointerEvents: 'none' }, 7.4)
    .to(frames[1], { opacity: 0, duration: .35 }, 7.4);
  move(2, 'card', 'full', 7.5, 1.1);
  timeline.to(endShade, { opacity: 1, duration: .5 }, 7.95)
    .set(copies[2], { top: () => fullCopyTop, color: cream }, 8.25)
    .set(details[2], { opacity: 0 }, 8.25)
    .to(copies[2], { opacity: 1, duration: .35 }, 8.3)
    .set(copies[2], { pointerEvents: 'auto' }, 8.3)
    .to(images[2], { yPercent: -48, duration: 1.7, ease: 'none' }, 7.5);
  trigger = ScrollTrigger.create({
    id: 'eden-interior-gallery', trigger: root, pin: stage, start: 'top top',
    end: () => '+=' + Math.round(stableHeight * 2.7 * scrollDistanceMultiplier),
    animation: timeline, scrub: true, pinSpacing: true, refreshPriority: 1,
    invalidateOnRefresh: true, onRefreshInit: measure,
  });
  ScrollTrigger.addEventListener('refresh', retainResizePosition);
  return () => {
    ScrollTrigger.removeEventListener('refresh', retainResizePosition);
    resizeAnchor = undefined;
    trigger?.kill(); trigger = undefined; timeline.kill();
    extraStyles.forEach((style, element) => {
      if (style === null) element.removeAttribute('style'); else element.setAttribute('style', style);
    });
  };
}
