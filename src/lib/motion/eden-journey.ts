import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const namespace = 'http://www.w3.org/2000/svg';
const contentSelector = 'h1, h2, h3, p, figure, picture, a, button, dl';

/** An absolute decorative route measured from the existing chapter layout. */
export function createEdenJourney(root: HTMLElement) {
  const svg = root.querySelector<SVGSVGElement>('.home-journey');
  const route = svg?.querySelector<SVGPathElement>('[data-journey-route]');
  const defs = svg?.querySelector('[data-journey-defs]');
  const layers = svg?.querySelector('[data-journey-sections]');
  if (!svg || !route || !defs || !layers) return () => {};

  const milestones = [...svg.querySelectorAll<SVGCircleElement>('[data-journey-node]')].map(node => ({
    node, section: root.querySelector<HTMLElement>(`#${node.dataset.journeyNode}`), distance: 0,
  }));
  const anchors = milestones.map(({ section }) => section?.querySelector<HTMLElement>('[data-journey-anchor]'));
  if (milestones.length !== 3 || anchors.some(anchor => !anchor)) return () => {};
  const [first, , last] = anchors as [HTMLElement, HTMLElement, HTMLElement];
  const chapters = [...root.querySelectorAll<HTMLElement>(':scope > section')];
  const sections = chapters.slice(chapters.indexOf(milestones[0].section!), chapters.indexOf(milestones[2].section!) + 1);
  const zones = sections.map((section, index) => {
    const clip = document.createElementNS(namespace, 'clipPath');
    clip.id = `${svg.id}-zone-${index}`;
    clip.setAttribute('clipPathUnits', 'userSpaceOnUse');
    const rect = document.createElementNS(namespace, 'rect');
    clip.append(rect);
    defs.append(clip);
    const group = document.createElementNS(namespace, 'g');
    group.setAttribute('clip-path', `url(#${clip.id})`);
    for (const className of ['home-journey__track', 'home-journey__line']) {
      const use = document.createElementNS(namespace, 'use');
      use.setAttribute('href', `#${route.id}`);
      use.setAttribute('class', className);
      group.append(use);
    }
    layers.append(group);
    return { section, clip, rect, group };
  });

  const position = { distance: 0 };
  let length = 0;
  let frame = 0;
  let disposed = false;
  let trigger: ScrollTrigger | undefined;
  const paint = (progress = trigger?.progress ?? 0) => {
    svg.style.setProperty('--journey-offset', String(Math.max(0, length - position.distance)));
    milestones.forEach(({ node, distance }) => node.toggleAttribute('data-reached', progress > 0 && position.distance >= distance - 0.5));
  };
  const timeline = gsap.timeline({ paused: true, onUpdate: () => paint() });
  // Nonempty before its ScrollTrigger exists; measure() replaces this placeholder.
  timeline.to(position, { distance: 1, duration: 1, ease: 'none' });

  const updateColors = () => {
    const background = getComputedStyle(document.documentElement).backgroundColor;
    zones.forEach(({ section, group }) => {
      group.style.setProperty('--journey-ink', getComputedStyle(section).getPropertyValue('--context-accent'));
    });
    milestones.forEach(({ node, section }) => {
      const style = getComputedStyle(section!);
      node.style.setProperty('--journey-ink', style.getPropertyValue('--context-accent'));
      node.style.setProperty('--journey-surface', style.backgroundColor === 'rgba(0, 0, 0, 0)' ? background : style.backgroundColor);
    });
  };

  const measure = () => {
    if (disposed) return;
    const rootRect = root.getBoundingClientRect();
    const points = anchors.map(anchor => {
      const rect = anchor!.getBoundingClientRect();
      return rect.top - rootRect.top + rect.height / 2;
    });
    const top = points[0] - 12;
    const height = points[2] - top + 12;
    const protectedRects = [...root.querySelectorAll<HTMLElement>(contentSelector)].map(element => element.getBoundingClientRect())
      .filter(rect => rect.width > 0 && rect.height > 0 && rect.bottom >= rootRect.top + points[0] && rect.top <= rootRect.top + points[2]);
    const leftSpace = Math.min(...protectedRects.map(rect => rect.left - rootRect.left));
    const rightSpace = Math.min(...protectedRects.map(rect => rootRect.right - rect.right));
    // Hide rather than squeeze decoration into content or focus-ring space.
    if (height <= 0 || Math.min(leftSpace, rightSpace) < 18) {
      svg.removeAttribute('data-ready');
      return;
    }
    const style = getComputedStyle(root);
    const desktop = matchMedia(`(min-width: ${style.getPropertyValue('--breakpoint-xl').trim()})`).matches;
    const tablet = matchMedia(`(min-width: ${style.getPropertyValue('--breakpoint-md').trim()})`).matches;
    const left = leftSpace * 0.48;
    const right = rootRect.width - rightSpace * 0.48;
    const bend = desktop ? Math.min(12, leftSpace * 0.2, rightSpace * 0.2) : tablet ? 4 : 0;
    const checkpoints: { y: number; distance: number }[] = [{ y: points[0] - top, distance: 0 }];
    const nodeXs = [left];
    let x = left;
    let y = checkpoints[0].y;
    let d = `M ${x} ${y}`;
    route.setAttribute('d', d);
    const append = (command: string, nextX: number, nextY: number) => {
      d += command;
      route.setAttribute('d', d);
      x = nextX;
      y = nextY;
      checkpoints.push({ y, distance: route.getTotalLength() });
    };
    const descend = (nextY: number) => {
      const delta = nextY - y;
      append(` C ${x + bend} ${y + delta / 3} ${x - bend} ${y + delta * 2 / 3} ${x} ${nextY}`, x, nextY);
    };

    milestones[0].distance = 0;
    for (let index = 1; index < points.length; index++) {
      // Desktop changes sides only inside measured empty heading padding.
      const bridgeSection = (index === 1 ? root.querySelector<HTMLElement>('#project') : undefined) ?? milestones[index].section;
      const sectionTop = bridgeSection!.getBoundingClientRect().top - rootRect.top;
      const firstContentTop = Math.min(...[...bridgeSection!.querySelectorAll<HTMLElement>(contentSelector)]
        .map(element => element.getBoundingClientRect()).filter(rect => rect.width && rect.height).map(rect => rect.top - rootRect.top));
      const gap = firstContentTop - sectionTop;
      if (desktop && gap >= 40) {
        const middle = sectionTop - top + gap / 2;
        const turn = Math.min(18, gap / 4);
        descend(middle - turn);
        const nextX = index === 1 ? right : left;
        append(` C ${x} ${middle + turn} ${nextX} ${middle - turn} ${nextX} ${middle + turn}`, nextX, middle + turn);
      }
      descend(points[index] - top);
      nodeXs.push(x);
      milestones[index].distance = checkpoints[checkpoints.length - 1].distance;
    }
    length = route.getTotalLength();
    svg.setAttribute('viewBox', `0 0 ${rootRect.width} ${height}`);
    svg.style.top = `${top}px`;
    svg.style.height = `${height}px`;
    svg.style.setProperty('--journey-length', String(length));
    svg.dataset.mode = desktop ? 'desktop' : tablet ? 'tablet' : 'mobile';
    zones.forEach(({ section, rect }) => {
      const bounds = section.getBoundingClientRect();
      rect.setAttribute('x', '0');
      rect.setAttribute('y', String(bounds.top - rootRect.top - top));
      rect.setAttribute('width', String(rootRect.width));
      rect.setAttribute('height', String(bounds.height));
    });
    milestones.forEach(({ node }, index) => {
      node.setAttribute('cx', String(nodeXs[index]));
      node.setAttribute('cy', String(points[index] - top));
      node.setAttribute('r', tablet ? '4' : '2.5');
    });
    // Mapping each geometry checkpoint to scroll distance keeps nodes aligned to
    // their chapters, including the longer horizontal portions of the route.
    const progress = timeline.totalProgress();
    timeline.clear();
    checkpoints.slice(1).forEach((point, index) => {
      const previous = checkpoints[index];
      timeline.fromTo(position, { distance: previous.distance }, {
        distance: point.distance, duration: (point.y - previous.y) / (points[2] - points[0]), ease: 'none', immediateRender: false,
      });
    });
    timeline.totalProgress(progress);
    updateColors();
    paint();
    svg.setAttribute('data-ready', '');
  };

  const refresh = () => {
    if (disposed || frame) return;
    frame = requestAnimationFrame(() => { frame = 0; if (!disposed) ScrollTrigger.refresh(); });
  };
  const observer = new ResizeObserver(refresh);
  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    ScrollTrigger.removeEventListener('refreshInit', measure);
    document.removeEventListener('eden:theme-change', updateColors);
    trigger?.kill();
    timeline.kill();
    svg.removeAttribute('data-ready');
    svg.removeAttribute('style');
    zones.forEach(({ clip, group }) => { clip.remove(); group.remove(); });
    milestones.forEach(({ node }) => { node.removeAttribute('data-reached'); node.removeAttribute('style'); });
  };
  try {
    measure();
    trigger = ScrollTrigger.create({
      trigger: first, start: 'center 65%', endTrigger: last, end: 'center 65%', animation: timeline, scrub: 0.35,
      onRefresh: self => { timeline.totalProgress(self.progress); paint(self.progress); },
    });
    ScrollTrigger.addEventListener('refreshInit', measure);
    sections.forEach(section => observer.observe(section));
    observer.observe(root);
    document.addEventListener('eden:theme-change', updateColors);
    return dispose;
  } catch (error) {
    dispose();
    throw error;
  }
}
