import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createPassivePrinciples } from './passive-principles';
import { scrollPacing } from './scroll-pacing';

interface Rect { x: number; y: number; width: number; height: number; radius: number }
interface Point { x: number; y: number }
type Pose = 'peek' | 'architecture' | 'stamp' | 'rise' | 'full';
interface Layout { width: number; height: number; gutter: number; poses: Record<Pose, Rect>; rasters: { width: number; height: number; focus: Point }[] }
let mounted: { root: HTMLElement; dispose: () => void } | undefined;

function createPassiveEditorial(root: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger);
  const stage = root.querySelector<HTMLElement>('[data-ps-stage]')!;
  const probe = root.querySelector<HTMLElement>('[data-ps-viewport]')!;
  const eyebrow = root.querySelector<HTMLElement>('.passive-editorial__eyebrow')!;
  const opening = root.querySelector<HTMLElement>('[data-ps-opening]')!;
  const openingTracks = [...root.querySelectorAll<HTMLElement>('[data-ps-opening-track]')];
  const openingPhoto = root.querySelector<HTMLElement>('[data-ps-opening-photo]')!;
  const openingImage = root.querySelector<HTMLElement>('[data-ps-opening-image]')!;
  const intro = root.querySelector<HTMLElement>('[data-ps-intro]')!;
  const architectureHeading = root.querySelector<HTMLElement>('[data-ps-architecture-heading]')!;
  const architectureTracks = [...root.querySelectorAll<HTMLElement>('[data-ps-architecture-track]')];
  const principlesHeading = root.querySelector<HTMLElement>('[data-ps-principles-heading]')!;
  const principles = root.querySelector<HTMLElement>('[data-ps-principles]')!;
  const principleLayers = [...principles.querySelectorAll<HTMLElement | SVGElement>('*')];
  const photos = [...root.querySelectorAll<HTMLElement>('[data-ps-photo]')];
  const positions = photos.map(photo => photo.querySelector<HTMLElement>('[data-ps-photo-position]')!);
  const inners = photos.map(photo => photo.querySelector<HTMLElement>('[data-ps-photo-inner]')!);
  const images = photos.map(photo => photo.querySelector<HTMLImageElement>('img')!);
  const mediaImages = [openingImage.querySelector<HTMLImageElement>('img')!, ...images];
  const closing = root.querySelector<HTMLElement>('[data-ps-closing]')!;
  const closingTracks = [...root.querySelectorAll<HTMLElement>('[data-ps-closing-track]')];
  const action = closing.querySelector<HTMLAnchorElement>('a')!;
  const targets = [root, stage, eyebrow, opening, ...openingTracks, intro, architectureHeading, ...architectureTracks,
    principlesHeading, principles, ...principleLayers,
    ...photos, ...positions, ...inners, openingPhoto, openingImage, closing, ...closingTracks, action];
  const originalStyles = new Map(targets.map(element => [element, element.getAttribute('style')] as const));
  const restore = () => {
    originalStyles.forEach((style, element) => {
      if (style === null) element.removeAttribute('style'); else element.setAttribute('style', style);
    });
    delete root.dataset.psMode;
  };
  const controller = new AbortController();
  const media = gsap.matchMedia();
  const context = gsap.context(() => {}, root);
  let stopped = false;
  let refreshFrame = 0;
  let trigger: ScrollTrigger | undefined;
  const refresh = () => {
    if (stopped || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => { refreshFrame = 0; if (!stopped) ScrollTrigger.refresh(); });
  };
  const warm = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    mediaImages.forEach(image => { image.loading = 'eager'; }); warm.disconnect();
  }, { rootMargin: '1400px 0px' });
  const dispose = () => {
    if (stopped) return;
    stopped = true; controller.abort(); warm.disconnect(); cancelAnimationFrame(refreshFrame);
    media.revert(); context.revert(); restore(); trigger = undefined;
  };
  const reading = () => { dispose(); root.dataset.psMode = 'reading'; if (root.isConnected) ScrollTrigger.refresh(); };

  try {
    mediaImages.forEach(image => {
      image.addEventListener('load', refresh, { once: true, signal: controller.signal });
      image.addEventListener('error', reading, { once: true, signal: controller.signal });
    });
    if (mediaImages.some(image => image.complete && image.currentSrc && !image.naturalWidth)) { reading(); return dispose; }
    warm.observe(root);
    context.add(() => {
      media.add({ compact: '(max-width: 47.999rem), (orientation: portrait)', motion: '(prefers-reduced-motion: no-preference)', all: '(min-width: 0px)' }, current => {
        if (!current.conditions?.motion) { restore(); return; }
        const compact = !!current.conditions.compact;
        root.dataset.psMode = 'cinematic';
        let layout: Layout;
        let cachedWidth = 0, stableHeight = 0;
        const principleAnimation = createPassivePrinciples(principles);
        const measure = () => {
          const width = root.clientWidth;
          // Mobile browser chrome may change innerHeight. Only genuine width changes
          // replace the measured small-viewport height and the sequence's scroll span.
          if (!stableHeight || !compact || Math.abs(width - cachedWidth) > 1) {
            stableHeight = probe.getBoundingClientRect().height; cachedWidth = width;
          }
          const height = stableHeight;
          root.style.setProperty('--ps-stage-height', `${height}px`);
          const gutter = parseFloat(getComputedStyle(eyebrow).left);
          layout = { width, height, gutter, rasters: photos.map((photo, index) => {
            const ratio = Number(images[index].getAttribute('width')) / Number(images[index].getAttribute('height'));
            const rasterWidth = Math.max(width, height * ratio), rasterHeight = rasterWidth / ratio;
            photo.style.setProperty('--ps-raster-width', `${rasterWidth}px`);
            photo.style.setProperty('--ps-raster-height', `${rasterHeight}px`);
            const focus = getComputedStyle(photo).getPropertyValue(compact ? '--ps-portrait-position' : '--ps-position').trim().split(/\s+/).map(value => parseFloat(value) / 100);
            return { width: rasterWidth, height: rasterHeight, focus: { x: focus[0], y: focus[1] } };
          }), poses: compact ? {
            peek: { x: gutter, y: height * .65, width: width * .68, height: height * .25, radius: 12 },
            architecture: { x: gutter, y: height * .41, width: width - gutter * 2, height: height * .48, radius: 14 },
            stamp: { x: width * .75, y: height * .22, width: width * .17, height: height * .095, radius: 8 },
            rise: { x: gutter, y: height * .94, width: width - gutter * 2, height: height * .65, radius: 18 },
            full: { x: 0, y: 0, width, height, radius: 0 },
          } : {
            peek: { x: width * .68, y: height * .67, width: width * .26, height: height * .25, radius: 14 },
            architecture: { x: width * .07, y: height * .16, width: width * .38, height: height * .72, radius: 18 },
            stamp: { x: width * .78, y: height * .15, width: width * .14, height: height * .14, radius: 10 },
            rise: { x: width * .12, y: height * .94, width: width * .76, height: height * .75, radius: 24 },
            full: { x: 0, y: 0, width, height, radius: 0 },
          } };
          principleAnimation.paint();
        };
        measure();
        const clip = (pose: Pose) => () => {
          const rect = layout.poses[pose];
          return `inset(${rect.y}px ${layout.width - rect.x - rect.width}px ${layout.height - rect.y - rect.height}px ${rect.x}px round ${rect.radius}px)`;
        };
        const position = (pose: Pose, index: number) => {
          const value = () => {
            const rect = layout.poses[pose], raster = layout.rasters[index];
            const scale = Math.max(rect.width / raster.width, rect.height / raster.height) * 1.12;
            return { x: rect.x + rect.width / 2 - layout.width / 2 + (raster.width * scale - rect.width) * (.5 - raster.focus.x),
              y: rect.y + rect.height / 2 - layout.height / 2 + (raster.height * scale - rect.height) * (.5 - raster.focus.y), scale };
          };
          return { x: () => value().x, y: () => value().y, scale: () => value().scale };
        };
        const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        timeline.set(eyebrow, { opacity: 1 }, 0)
          .set(opening, { opacity: 1, pointerEvents: 'auto' }, 0)
          .set(openingTracks, { x: index => index ? -18 : 18, y: 0, opacity: 1 }, 0)
          .set([architectureHeading, principlesHeading, principles, closing], { opacity: 0, pointerEvents: 'none' }, 0)
          .set(architectureTracks, { x: () => layout.width }, 0)
          .set(closingTracks, { yPercent: 100 }, 0)
          .set(photos[0], { opacity: 0, clipPath: clip('peek') }, 0)
          .set(positions[0], position('peek', 0), 0)
          .set(photos[1], { opacity: 0, clipPath: clip('rise') }, 0)
          .set(positions[1], position('rise', 1), 0)
          .set(inners, { yPercent: 0 }, 0)
          .set(openingPhoto, { opacity: 1, yPercent: 0, pointerEvents: 'auto' }, 0)
          .set(openingImage, { yPercent: 2 }, 0)
          .to(openingTracks, { x: 0, duration: .55, stagger: .09, ease: 'power3.out' }, 0)
          .to(openingImage, { yPercent: -2, duration: 1.7, ease: 'none' }, 0)
          .to(openingTracks, { x: () => -layout.width * .85, duration: 1.3, stagger: .07 }, .95)
          .set(opening, { pointerEvents: 'none' }, .95)
          .to(intro, { opacity: 0, duration: .45 }, 1)
          .to(openingPhoto, { opacity: 0, yPercent: 8, duration: .75 }, .95)
          .set(openingPhoto, { pointerEvents: 'none' }, 1.7)
          .to(photos[0], { opacity: 1, duration: .25 }, 1.05)
          .to(architectureHeading, { opacity: 1, duration: .2 }, 1.15)
          .set(architectureHeading, { pointerEvents: 'auto' }, 1.15)
          .to(architectureTracks, { x: () => compact ? 0 : layout.width * .48, duration: 1.2, stagger: .07 }, 1.15)
          .fromTo(photos[0], { clipPath: clip('peek') }, { clipPath: clip('architecture'), duration: 1.4, immediateRender: false }, 1.05)
          .fromTo(positions[0], position('peek', 0), { ...position('architecture', 0), duration: 1.4, immediateRender: false }, 1.05)
          .to(inners[0], { yPercent: -2.8, duration: 1.4, ease: 'none' }, 1.05)
          .to(opening, { opacity: 0, duration: .3 }, 2.1)
          .to(architectureTracks, { x: () => -layout.width * .7, duration: .8, stagger: .05 }, 2.9)
          .set(architectureHeading, { pointerEvents: 'none' }, 2.9)
          .to(architectureHeading, { opacity: 0, duration: .4 }, 3.25)
          .fromTo(photos[0], { clipPath: clip('architecture') }, { clipPath: clip('stamp'), duration: .85, immediateRender: false }, 2.95)
          .fromTo(positions[0], position('architecture', 0), { ...position('stamp', 0), duration: .85, immediateRender: false }, 2.95)
          .to(inners[0], { yPercent: 0, duration: .85, ease: 'none' }, 2.95)
          .to(principlesHeading, { opacity: 1, duration: .25 }, 3.1)
          .set(principlesHeading, { pointerEvents: 'auto' }, 3.1)
          .to(principles, { opacity: 1, duration: .3 }, 3.35)
          .to(photos[0], { opacity: 0, duration: .2 }, 3.8)
          .fromTo(principleAnimation.state, { progress: 0 }, { progress: 1, duration: 2.55, ease: 'none', onUpdate: principleAnimation.paint, immediateRender: false }, 3.7)
          .to(photos[1], { opacity: 1, duration: .25 }, 6.65)
          .fromTo(photos[1], { clipPath: clip('rise') }, { clipPath: clip('full'), duration: 1.4, immediateRender: false }, 6.7)
          .fromTo(positions[1], position('rise', 1), { ...position('full', 1), duration: 1.4, immediateRender: false }, 6.7)
          .to([principlesHeading, principles, photos[0]], { opacity: 0, duration: .55 }, 6.85)
          .set(principlesHeading, { pointerEvents: 'none' }, 6.85)
          .to(inners[1], { yPercent: -2, duration: 1.4, ease: 'none' }, 6.7)
          .to(eyebrow, { opacity: 0, duration: .35 }, 7.1)
          .to(closing, { opacity: 1, duration: .3 }, 7.45)
          .to(closingTracks, { yPercent: 0, duration: .6, stagger: .08, ease: 'power3.out' }, 7.45)
          .set(closing, { pointerEvents: 'auto' }, 7.9)
          .to(inners[1], { yPercent: 1.5, duration: 1.05, ease: 'none' }, 8.15);
        trigger = ScrollTrigger.create({
          id: 'eden-passive-editorial', trigger: root, pin: stage, start: 'top top',
          end: () => `+=${Math.round(layout.height * (compact ? 2.65 : 3) * scrollPacing.passiveBuilding)}`,
          animation: timeline, scrub: true, pinSpacing: true, refreshPriority: 2,
          invalidateOnRefresh: true, onRefreshInit: measure,
          onUpdate: principleAnimation.paint, onRefresh: principleAnimation.paint,
        });
        refresh();
        return () => { restore(); trigger = undefined; refresh(); };
      });
    });
    // A keyboard/screen-reader arrival at the CTA gets a complete readable layout,
    // rather than focus on an opacity-hidden link during an earlier visual moment.
    root.addEventListener('focusin', event => {
      if (event.target !== action || !trigger || trigger.progress >= .85) return;
      reading();
      if (action.isConnected) {
        action.focus({ preventScroll: true });
        action.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }, { signal: controller.signal });
    void document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh, { once: true, signal: controller.signal });
    refresh(); return dispose;
  } catch (error) { dispose(); throw error; }
}

export function unmountPassiveEditorial() { mounted?.dispose(); mounted = undefined; }
export function mountPassiveEditorial() {
  const root = document.querySelector<HTMLElement>('[data-passive-editorial]');
  if (mounted?.root === root) return;
  unmountPassiveEditorial(); if (!root) return;
  try { mounted = { root, dispose: createPassiveEditorial(root) }; }
  catch (error) { root.dataset.psMode = 'reading'; console.warn('Eden passive editorial: using the readable layout.', error); }
}
