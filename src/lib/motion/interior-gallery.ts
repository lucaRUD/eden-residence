import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createMobileInteriorGallery } from './interior-gallery-mobile';
import { scrollPacing } from './scroll-pacing';

interface FrameRect { x: number; y: number; width: number; height: number; borderRadius: number }
type Pose = 'small' | 'full' | 'split' | 'preview' | 'main' | 'thumbnail';
type Geometry = Record<Pose, FrameRect>;
let mounted: { root: HTMLElement; dispose: () => void } | undefined;

function createInteriorGallery(root: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger);
  const stage = root.querySelector<HTMLElement>('[data-gallery-stage]')!;
  const frames = [...root.querySelectorAll<HTMLElement>('[data-gallery-frame]')];
  const images = [...root.querySelectorAll<HTMLImageElement>('img')];
  const copies = [...root.querySelectorAll<HTMLElement>('[data-gallery-room-copy]')];
  const intro = root.querySelector<HTMLElement>('[data-gallery-intro]')!;
  const split = root.querySelector<HTMLElement>('[data-gallery-split]')!;
  const shade = root.querySelector<HTMLElement>('[data-gallery-shade]')!;
  if (frames.length !== 3 || copies.length !== 3) throw new Error('Interior gallery requires three rooms.');
  const inners = frames.map(frame => frame.querySelector<HTMLElement>('[data-gallery-image]')!);
  const originalStyles = new Map([stage, ...frames, ...inners, ...copies, intro, split, shade]
    .map(element => [element, element.getAttribute('style')] as const));
  const restore = () => {
    originalStyles.forEach((style, element) => {
      if (style === null) element.removeAttribute('style');
      else element.setAttribute('style', style);
    });
    delete root.dataset.galleryMode;
  };
  const controller = new AbortController();
  const media = gsap.matchMedia();
  const context = gsap.context(() => {}, root);
  let refreshFrame = 0;
  let stopped = false;
  const refresh = () => {
    if (stopped || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      if (!stopped) ScrollTrigger.refresh();
    });
  };
  const warmImages = () => images.forEach(image => { image.loading = 'eager'; });
  const preload = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    warmImages(); preload.disconnect();
  }, { rootMargin: '1800px 0px' });
  const dispose = () => {
    if (stopped) return;
    stopped = true;
    controller.abort(); preload.disconnect(); cancelAnimationFrame(refreshFrame);
    media.revert(); context.revert(); restore();
  };

  try {
    const fallback = () => {
      dispose(); root.dataset.galleryMode = 'fallback';
      if (root.isConnected) ScrollTrigger.refresh();
    };
    images.forEach(image => {
      image.addEventListener('load', refresh, { once: true, signal: controller.signal });
      image.addEventListener('error', fallback, { once: true, signal: controller.signal });
    });
    // A cached failure can precede module initialization and its error listener.
    if (images.some(image => image.complete && image.currentSrc && !image.naturalWidth)) {
      fallback(); return dispose;
    }
    preload.observe(root);
    context.add(() => {
      media.add({
        desktop: '(min-width: 64rem) and (min-height: 44rem)',
        motion: '(prefers-reduced-motion: no-preference)',
      }, current => {
        if (!current.conditions?.motion) { restore(); return; }
        if (!current.conditions.desktop) {
          const stopMobile = createMobileInteriorGallery(root, scrollPacing.interiorGallery);
          refresh();
          return () => { stopMobile(); restore(); refresh(); };
        }
        root.dataset.galleryMode = 'cinematic';
        let geometry: Geometry;
        const measure = () => {
          const width = root.clientWidth, height = innerHeight;
          // Read the resolved clamp() value, including scrollbar compensation.
          const safeGutter = parseFloat(getComputedStyle(intro).left);
          const smallWidth = Math.min(400, width * .235);
          const previewWidth = Math.min(220, width * .115);
          const thumbWidth = Math.min(190, width * .105);
          geometry = {
            small: { x: (width - smallWidth) / 2, y: height * .6, width: smallWidth, height: smallWidth / 1.5, borderRadius: 18 },
            full: { x: 0, y: 0, width, height, borderRadius: 0 },
            split: { x: safeGutter, y: height * .11, width: width * .47, height: height * .79, borderRadius: 22 },
            preview: { x: width * .67, y: height * .78, width: previewWidth, height: previewWidth / 1.45, borderRadius: 10 },
            main: { x: width * .22, y: height * .11, width: width * .4, height: height * .8, borderRadius: 22 },
            thumbnail: { x: safeGutter, y: height * .11, width: thumbWidth, height: thumbWidth / 1.5, borderRadius: 10 },
          };
        };
        measure();
        const rect = (pose: Pose) => ({
          x: () => geometry[pose].x, y: () => geometry[pose].y,
          width: () => geometry[pose].width, height: () => geometry[pose].height,
          borderRadius: () => geometry[pose].borderRadius,
        });
        const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        timeline.set(frames[0], { ...rect('small'), opacity: 1, zIndex: 2 }, 0)
          .set(frames[1], { ...rect('preview'), opacity: 0, zIndex: 3 }, 0)
          .set(frames[2], { ...rect('preview'), opacity: 0, zIndex: 4 }, 0)
          .set([copies[0], copies[1], copies[2], split], { opacity: 0, y: 20, pointerEvents: 'none' }, 0)
          .set(intro, { opacity: 1, y: 12, pointerEvents: 'auto' }, 0)
          .set(inners, { yPercent: 0 }, 0)
          .set(shade, { opacity: 0 }, 0)
          .to(intro, { y: 0, duration: .4, ease: 'power2.out' }, 0)
          .set(intro, { pointerEvents: 'none' }, .5)
          .to(intro, { opacity: 0, y: -24, duration: .45 }, .5)
          // A -> B: one living-room element changes its actual clipping geometry.
          .fromTo(frames[0], rect('small'), { ...rect('full'), duration: 1.2, immediateRender: false }, .45)
          .to(inners[0], { yPercent: -2.5, duration: 1.2, ease: 'none' }, .45)
          .to(shade, { opacity: 1, duration: .5 }, 1.15)
          .to(copies[0], { opacity: 1, y: 0, duration: .4 }, 1.4)
          .set(copies[0], { pointerEvents: 'auto' }, 1.4)
          // B -> C: the photograph becomes the editorial frame; the preview arrives.
          .to(copies[0], { opacity: 0, y: -18, duration: .3 }, 2.1)
          .set(copies[0], { pointerEvents: 'none' }, 2.1)
          .fromTo(frames[0], rect('full'), { ...rect('split'), duration: 1.05, immediateRender: false }, 2.15)
          .to(inners[0], { yPercent: 2.5, duration: 1.05, ease: 'none' }, 2.15)
          .to(shade, { opacity: 0, duration: .6 }, 2.15)
          .to(split, { opacity: 1, y: 0, duration: .4 }, 2.8)
          .set(split, { pointerEvents: 'auto' }, 2.8)
          .to(frames[1], { opacity: 1, duration: .4 }, 2.8)
          // C -> D: the preview grows into the main photograph, not a duplicate slide.
          .to(split, { opacity: 0, y: -18, duration: .3 }, 3.8)
          .set(split, { pointerEvents: 'none' }, 3.8)
          .fromTo(frames[0], rect('split'), { ...rect('thumbnail'), duration: 1.1, immediateRender: false }, 3.85)
          .to(inners[0], { yPercent: 0, duration: 1.1, ease: 'none' }, 3.85)
          .fromTo(frames[1], rect('preview'), { ...rect('main'), duration: 1.1, immediateRender: false }, 3.85)
          .to(inners[1], { yPercent: -2.5, duration: 1.1, ease: 'none' }, 3.85)
          .to(copies[1], { opacity: 1, y: 0, duration: .4 }, 4.5)
          .set(copies[1], { pointerEvents: 'auto' }, 4.5)
          .to(frames[2], { opacity: 1, duration: .4 }, 4.65)
          // D -> E: a shorter handoff, followed by a readable final composition.
          .to(copies[1], { opacity: 0, y: -18, duration: .3 }, 5.5)
          .set(copies[1], { pointerEvents: 'none' }, 5.5)
          .to(frames[0], { opacity: 0, duration: .35 }, 5.5)
          .fromTo(frames[1], rect('main'), { ...rect('thumbnail'), duration: .85, immediateRender: false }, 5.55)
          .to(inners[1], { yPercent: 0, duration: .85, ease: 'none' }, 5.55)
          .fromTo(frames[2], rect('preview'), { ...rect('main'), duration: .85, immediateRender: false }, 5.55)
          .to(inners[2], { yPercent: -2.5, duration: .85, ease: 'none' }, 5.55)
          .to(copies[2], { opacity: 1, y: 0, duration: .4 }, 6.05)
          .set(copies[2], { pointerEvents: 'auto' }, 6.05)
          .to(inners[2], { yPercent: 1.5, duration: .95, ease: 'none' }, 6.45);
        ScrollTrigger.create({
          id: 'eden-interior-gallery', trigger: root, pin: stage,
          start: 'top top', end: () => `+=${Math.round(innerHeight * 2.85 * scrollPacing.interiorGallery)}`,
          animation: timeline, scrub: true, pinSpacing: true,
          refreshPriority: 1, invalidateOnRefresh: true, onRefreshInit: measure,
        });
        refresh();
        return () => { restore(); refresh(); };
      });
    });
    void document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh, { once: true, signal: controller.signal });
    refresh();
    return dispose;
  } catch (error) { dispose(); throw error; }
}

export function unmountInteriorGallery() { mounted?.dispose(); mounted = undefined; }

export function mountInteriorGallery() {
  const root = document.querySelector<HTMLElement>('[data-interior-gallery]');
  if (mounted?.root === root) return;
  unmountInteriorGallery();
  if (!root) return;
  try { mounted = { root, dispose: createInteriorGallery(root) }; }
  catch (error) {
    root.dataset.galleryMode = 'fallback';
    console.warn('Eden interior gallery: using the static presentation.', error);
  }
}
