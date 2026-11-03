import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface DepthMetrics { imageY: number }

/** One measured, native-scroll treatment for every opted-in photograph. */
export function createScrollDepthImages(root: HTMLElement): () => void {
  const images = [...root.querySelectorAll<HTMLElement>('[data-scroll-depth]')];
  if (!images.length) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const styles = new Map(images.map(image => [image, image.getAttribute('style')]));
  const media = gsap.matchMedia();
  let disposed = false;
  let refreshFrame = 0;
  const refresh = () => {
    if (disposed || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      if (!disposed) ScrollTrigger.refresh();
    });
  };

  const restore = () => {
    images.forEach(image => {
      delete image.dataset.depthReady; delete image.dataset.depthActive; delete image.dataset.depthMode;
      const style = styles.get(image);
      if (style == null) image.removeAttribute('style'); else image.setAttribute('style', style);
    });
  };
  const dispose = () => {
    disposed = true; cancelAnimationFrame(refreshFrame); media.revert(); restore();
  };

  try {
    media.add({
      desktop: '(min-width: 64rem)', tablet: '(min-width: 48rem)',
      normal: '(prefers-reduced-motion: no-preference)',
    }, context => {
      if (!context.conditions?.normal) return;
      const mode = context.conditions.desktop ? 'desktop' : context.conditions.tablet ? 'tablet' : 'mobile';
      // Fixed overscan and linear travel: page easing belongs to Lenis alone.
      const profile = mode === 'desktop'
        ? { imageY: 70, contentHeight: 130 }
        : mode === 'tablet'
          ? { imageY: 45, contentHeight: 125 }
          : { imageY: 18, contentHeight: 112 };
      const sizes = new WeakMap<Element, { width: number; height: number }>();
      const observer = new ResizeObserver(entries => {
        let changed = false;
        entries.forEach(({ target, contentRect }) => {
          const previous = sizes.get(target);
          if (previous && (Math.abs(previous.width - contentRect.width) > .5 || Math.abs(previous.height - contentRect.height) > .5)) changed = true;
          sizes.set(target, { width: contentRect.width, height: contentRect.height });
        });
        if (changed) refresh();
      });

      images.forEach(image => {
        const frame = image.querySelector<HTMLElement>('[data-depth-frame]')!;
        const inner = image.querySelector<HTMLElement>('[data-depth-inner]')!;
        const parallax = Number(image.dataset.depthParallax ?? 1);
        const metrics: DepthMetrics = { imageY: 0 };
        const measure = () => {
          image.style.setProperty('--depth-content-height', `${parallax ? profile.contentHeight : 100}%`);
          // Measure the actual raster box, retaining two pixels beyond either end.
          const available = (inner.clientHeight - frame.clientHeight) / 2 - 2;
          metrics.imageY = Math.max(0, Math.min(profile.imageY * parallax, available));
        };
        image.dataset.depthReady = '';
        image.dataset.depthMode = mode;
        measure();
        const timeline = gsap.timeline({ defaults: { duration: 1, ease: 'none' } });
        timeline.fromTo(inner, {
          y: () => -metrics.imageY,
        }, { y: () => metrics.imageY }, 0);
        ScrollTrigger.create({
          trigger: image, start: 'top bottom', end: 'bottom top',
          animation: timeline, scrub: true, invalidateOnRefresh: true,
          onRefreshInit: measure,
          onToggle: self => image.toggleAttribute('data-depth-active', self.isActive),
          onRefresh: self => image.toggleAttribute('data-depth-active', self.isActive),
        });
        observer.observe(image);
      });
      return () => { observer.disconnect(); restore(); };
    });
    return dispose;
  } catch (error) { dispose(); throw error; }
}
