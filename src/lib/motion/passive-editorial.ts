import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Rect { x: number; y: number; width: number; height: number; radius: number }
interface Point { x: number; y: number }
type Pose = 'peek' | 'architecture' | 'stamp' | 'rise' | 'full';
interface Layout { width: number; height: number; gutter: number; poses: Record<Pose, Rect>; rasters: { width: number; height: number; focus: Point }[] }
let mounted: { root: HTMLElement; dispose: () => void } | undefined;
const smooth = (value: number) => { const t = Math.min(1, Math.max(0, value)); return t * t * (3 - 2 * t); };

function createPassiveEditorial(root: HTMLElement): () => void {
  gsap.registerPlugin(ScrollTrigger);
  const stage = root.querySelector<HTMLElement>('[data-ps-stage]')!;
  const probe = root.querySelector<HTMLElement>('[data-ps-viewport]')!;
  const eyebrow = root.querySelector<HTMLElement>('.passive-editorial__eyebrow')!;
  const opening = root.querySelector<HTMLElement>('[data-ps-opening]')!;
  const openingTracks = [...root.querySelectorAll<HTMLElement>('[data-ps-opening-track]')];
  const intro = root.querySelector<HTMLElement>('[data-ps-intro]')!;
  const architectureHeading = root.querySelector<HTMLElement>('[data-ps-architecture-heading]')!;
  const architectureTracks = [...root.querySelectorAll<HTMLElement>('[data-ps-architecture-track]')];
  const principlesHeading = root.querySelector<HTMLElement>('[data-ps-principles-heading]')!;
  const principlesTracks = [...root.querySelectorAll<HTMLElement>('[data-ps-principles-track]')];
  const principles = root.querySelector<HTMLElement>('[data-ps-principles]')!;
  const labels = [...root.querySelectorAll<HTMLElement>('[data-ps-principle]')];
  const notes = [...root.querySelectorAll<HTMLElement>('[data-ps-note]')];
  const svg = root.querySelector<SVGSVGElement>('[data-ps-svg]')!;
  const route = root.querySelector<SVGPathElement>('[data-ps-route]')!;
  const base = root.querySelector<SVGPathElement>('[data-ps-route-base]')!;
  const circles = [...root.querySelectorAll<SVGCircleElement>('[data-ps-route-node]')];
  const photos = [...root.querySelectorAll<HTMLElement>('[data-ps-photo]')];
  const positions = photos.map(photo => photo.querySelector<HTMLElement>('[data-ps-photo-position]')!);
  const inners = photos.map(photo => photo.querySelector<HTMLElement>('[data-ps-photo-inner]')!);
  const images = photos.map(photo => photo.querySelector<HTMLImageElement>('img')!);
  const canopy = root.querySelector<HTMLElement>('[data-ps-canopy]')!;
  const closing = root.querySelector<HTMLElement>('[data-ps-closing]')!;
  const closingTracks = [...root.querySelectorAll<HTMLElement>('[data-ps-closing-track]')];
  const action = closing.querySelector<HTMLAnchorElement>('a')!;
  const targets = [root, stage, eyebrow, opening, ...openingTracks, intro, architectureHeading, ...architectureTracks,
    principlesHeading, ...principlesTracks, principles, ...labels, ...notes, ...circles, route, base, svg,
    ...photos, ...positions, ...inners, canopy, closing, ...closingTracks, action];
  const originalStyles = new Map(targets.map(element => [element, element.getAttribute('style')] as const));
  const originalGeometry = new Map([svg, route, base, ...circles].map(element => [element,
    new Map(['viewBox', 'd', 'cx', 'cy'].map(name => [name, element.getAttribute(name)]))] as const));
  const restore = () => {
    originalStyles.forEach((style, element) => {
      if (style === null) element.removeAttribute('style'); else element.setAttribute('style', style);
    });
    originalGeometry.forEach((attributes, element) => attributes.forEach((value, name) => {
      if (value === null) element.removeAttribute(name); else element.setAttribute(name, value);
    }));
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
    images.forEach(image => { image.loading = 'eager'; }); warm.disconnect();
  }, { rootMargin: '1400px 0px' });
  const dispose = () => {
    if (stopped) return;
    stopped = true; controller.abort(); warm.disconnect(); cancelAnimationFrame(refreshFrame);
    media.revert(); context.revert(); restore(); trigger = undefined;
  };
  const reading = () => { dispose(); root.dataset.psMode = 'reading'; if (root.isConnected) ScrollTrigger.refresh(); };

  try {
    images.forEach(image => {
      image.addEventListener('load', refresh, { once: true, signal: controller.signal });
      image.addEventListener('error', reading, { once: true, signal: controller.signal });
    });
    if (images.some(image => image.complete && image.currentSrc && !image.naturalWidth)) { reading(); return dispose; }
    warm.observe(root);
    context.add(() => {
      media.add({ compact: '(max-width: 47.999rem), (orientation: portrait)', motion: '(prefers-reduced-motion: no-preference)', all: '(min-width: 0px)' }, current => {
        if (!current.conditions?.motion) { restore(); return; }
        const compact = !!current.conditions.compact;
        root.dataset.psMode = 'cinematic';
        let layout: Layout;
        let cachedWidth = 0, stableHeight = 0, routeLength = 1;
        let fractions: number[] = [], labelPositions: Point[] = [];
        const line = { progress: 0 };
        const labelOpacity = labels.map(label => gsap.quickSetter(label, 'opacity'));
        const labelY = labels.map(label => gsap.quickSetter(label, 'y', 'px'));
        const circleOpacity = circles.map(circle => gsap.quickSetter(circle, 'opacity'));
        const noteOpacity = notes.map(note => gsap.quickSetter(note, 'opacity'));
        const paintRoute = () => {
          route.style.strokeDashoffset = String(routeLength * (1 - line.progress));
          fractions.forEach((fraction, index) => {
            const reveal = smooth((line.progress - fraction + .035) / .07);
            labelOpacity[index](reveal); labelY[index](labelPositions[index].y + 9 * (1 - reveal));
            labels[index].style.pointerEvents = reveal > .5 ? 'auto' : 'none';
            circleOpacity[index](reveal);
            const leave = index === fractions.length - 1 ? 1 : 1 - smooth((line.progress - fractions[index + 1] + .02) / .05);
            noteOpacity[index](reveal * leave);
            notes[index].style.pointerEvents = reveal * leave > .5 ? 'auto' : 'none';
          });
        };
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
          // Tuck the crop's lower edge behind the opening photograph, leaving only
          // the source mask's natural leaf silhouette above it.
          canopy.style.setProperty('--ps-canopy-width', `${layout.poses.peek.width * .8}px`);
          canopy.style.setProperty('--ps-canopy-left', `${layout.poses.peek.x + layout.poses.peek.width * .12}px`);
          canopy.style.setProperty('--ps-canopy-top', `${layout.poses.peek.y - layout.poses.peek.width * .44}px`);
          const points: Point[] = compact
            ? [.35, .47, .59, .71, .83].map((y, index) => ({ x: width * (index % 2 ? .82 : .18), y: height * y }))
            : [.12, .30, .48, .66, .84].map((x, index) => ({ x: width * x, y: height * [.58, .67, .55, .65, .54][index] }));
          const headingBottom = parseFloat(getComputedStyle(principlesHeading).top) + principlesHeading.offsetHeight;
          const start = compact ? { x: width * .18, y: Math.max(height * .29, headingBottom + 12) } : { x: gutter, y: height * .62 };
          let d = `M${start.x} ${start.y}`, previous = start;
          const distances: number[] = [];
          points.forEach(point => {
            d += compact
              ? ` C${previous.x} ${previous.y + (point.y - previous.y) * .6} ${point.x} ${point.y - (point.y - previous.y) * .6} ${point.x} ${point.y}`
              : ` C${previous.x + (point.x - previous.x) * .5} ${previous.y} ${point.x - (point.x - previous.x) * .5} ${point.y} ${point.x} ${point.y}`;
            route.setAttribute('d', d); distances.push(route.getTotalLength()); previous = point;
          });
          base.setAttribute('d', d); svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
          routeLength = route.getTotalLength(); fractions = distances.map(distance => distance / routeLength * .94);
          route.style.strokeDasharray = String(routeLength);
          const labelWidth = compact ? width * .56 : width * .17;
          labelPositions = points.map((point, index) => compact
            ? { x: index % 2 ? gutter : width * .36, y: point.y - 25 }
            : { x: point.x - labelWidth / 2, y: point.y + (index % 2 ? 30 : -125) });
          labels.forEach((label, index) => gsap.set(label, { x: labelPositions[index].x, y: labelPositions[index].y, width: labelWidth }));
          circles.forEach((circle, index) => { circle.setAttribute('cx', String(points[index].x)); circle.setAttribute('cy', String(points[index].y)); });
          paintRoute();
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
          .set(openingTracks, { x: 0, yPercent: 35 }, 0)
          .set([architectureHeading, principlesHeading, principles, closing], { opacity: 0, pointerEvents: 'none' }, 0)
          .set(architectureTracks, { x: () => layout.width }, 0)
          .set(principlesTracks, { x: () => layout.width * .65 }, 0)
          .set(closingTracks, { yPercent: 100 }, 0)
          .set(photos[0], { opacity: 1, clipPath: clip('peek') }, 0)
          .set(positions[0], position('peek', 0), 0)
          .set(photos[1], { opacity: 0, clipPath: clip('rise') }, 0)
          .set(positions[1], position('rise', 1), 0)
          .set(inners, { yPercent: 0 }, 0)
          .set(canopy, { opacity: 1, x: 0, y: 0, scale: 1 }, 0)
          .to(openingTracks, { yPercent: 0, duration: .55, stagger: .09, ease: 'power3.out' }, 0)
          .to(openingTracks, { x: () => -layout.width * .85, duration: 1.3, stagger: .07 }, .95)
          .set(opening, { pointerEvents: 'none' }, .95)
          .to(intro, { opacity: 0, duration: .45 }, 1)
          .to(canopy, { y: () => -layout.height * .025, opacity: 0, duration: .45 }, .75)
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
          .to(principlesTracks, { x: 0, duration: .7, stagger: .05 }, 3.1)
          .to(principles, { opacity: 1, duration: .3 }, 3.35)
          .fromTo(line, { progress: 0 }, { progress: 1, duration: 2.55, ease: 'none', onUpdate: paintRoute, immediateRender: false }, 3.7)
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
          end: () => `+=${Math.round(layout.height * (compact ? 2.65 : 3))}`,
          animation: timeline, scrub: true, pinSpacing: true, refreshPriority: 2,
          invalidateOnRefresh: true, onRefreshInit: measure,
          onUpdate: paintRoute, onRefresh: paintRoute,
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
