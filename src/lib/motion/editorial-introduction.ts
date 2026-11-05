import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface WindowRect { x: number; y: number; width: number; height: number; radius: number }
const EDITORIAL_EXTENSION = 1.8;
const STORY_DURATION = 6.8 + EDITORIAL_EXTENSION;
const ACTIONS_TIME = 4.6;

/** One reversible camera handoff. The existing passive timeline remains its own scene. */
export function createEditorialIntroduction(root: HTMLElement): () => void {
  const story = root.querySelector<HTMLElement>('[data-opening-story]');
  const stage = story?.querySelector<HTMLElement>('[data-opening-stage]');
  const intro = story?.querySelector<HTMLElement>('[data-editorial-introduction]');
  const passive = root.querySelector<HTMLElement>('[data-passive-editorial]');
  if (!story || !stage || !intro || !passive) return () => {};
  const probe = story.querySelector<HTMLElement>('[data-opening-viewport]')!;
  const anchor = story.querySelector<HTMLElement>('[data-opening-anchor]')!;
  const hero = story.querySelector<HTMLElement>('[data-story-hero]')!;
  const title = hero.querySelector<HTMLElement>('[data-story-title]')!;
  const cue = hero.querySelector<HTMLElement>('.story-scroll')!;
  const copy = intro.querySelector<HTMLElement>('[data-opening-copy]')!;
  const actions = intro.querySelector<HTMLElement>('.home-introduction__actions')!;
  const passages = [...intro.querySelectorAll<HTMLElement>('[data-opening-passage]')];
  const photos = [...intro.querySelectorAll<HTMLElement>('[data-opening-photo]')];
  const styles = new Map([stage, hero, title, cue, copy, anchor, ...passages, ...photos].map(e => [e, e.getAttribute('style')]));
  const oldId = intro.id;
  const context = gsap.context(() => {}, story);
  const controller = new AbortController();
  let started = false, stopped = false, refreshFrame = 0;
  let replica: HTMLElement | undefined;
  let trigger: ScrollTrigger | undefined;
  let width = 0, height = 0, measuredWidth = 0;
  let compact = false;
  let native: WindowRect;
  let bridge: WindowRect;
  let positions: WindowRect[];
  let heroCorner: { x: number; y: number; scale: number };
  // Keep the contraction and handoff at their approved speed; give the extra copy time to read.
  const distance = () => Math.round(height * (compact ? 2.8 : 3.2) * STORY_DURATION / 6.8);
  const initialHash = location.hash;
  let hashRestored = false;
  const refresh = () => {
    if (stopped || refreshFrame) return;
    refreshFrame = requestAnimationFrame(() => {
      refreshFrame = 0;
      if (stopped) return;
      ScrollTrigger.refresh();
      if (!hashRestored) {
        hashRestored = true;
        if (initialHash) {
          let target: HTMLElement | null = null;
          try { target = document.getElementById(decodeURIComponent(initialHash.slice(1))); } catch { /* Malformed fragments leave native scrolling intact. */ }
          target?.scrollIntoView({ block: 'start', behavior: 'instant' });
          ScrollTrigger.update();
        }
      }
    });
  };
  const dispose = () => {
    if (stopped) return;
    stopped = true; observer.disconnect(); controller.abort(); cancelAnimationFrame(refreshFrame);
    context.revert(); replica?.remove();
    styles.forEach((value, element) => {
      if (value === null) element.removeAttribute('style'); else element.setAttribute('style', value);
    });
    // The sky entrance may have finished since this snapshot was captured.
    cue.style.removeProperty('opacity'); cue.style.removeProperty('visibility'); cue.style.removeProperty('pointer-events');
    intro.id = oldId; anchor.removeAttribute('id'); actions.inert = false;
    root.style.removeProperty('--opening-height'); delete root.dataset.openingMode;
    for (const property of ['--story-drift', '--story-melt', '--story-cue', '--story-title-opacity', '--story-title-lift']) root.style.removeProperty(property);
  };
  const start = () => {
    if (stopped || started || passive.dataset.psMode !== 'cinematic') return;
    const sourceTimeline = ScrollTrigger.getById('eden-passive-editorial')?.animation;
    if (!sourceTimeline) return;
    started = true;
    try {
      // Snapshot only the real opening elements at their actual first-frame state.
      // The source is restored synchronously before the browser can paint.
      const time = sourceTimeline.totalTime();
      sourceTimeline.totalTime(0, true);
      replica = document.createElement('div');
      replica.className = 'passive-editorial opening-passive';
      replica.dataset.psMode = 'cinematic';
      replica.setAttribute('aria-hidden', 'true'); replica.inert = true;
      const replicaStage = document.createElement('div');
      replicaStage.className = 'passive-editorial__stage';
      for (const selector of ['.passive-editorial__opening-photo', '.passive-editorial__eyebrow', '.passive-editorial__opening']) {
        replicaStage.append(passive.querySelector(selector)!.cloneNode(true));
      }
      sourceTimeline.totalTime(time, true);
      replica.append(replicaStage);
      replica.querySelectorAll('*').forEach(element => {
        element.removeAttribute('id');
        for (const attribute of [...element.attributes]) {
          if (attribute.name.startsWith('data-ps-')) element.removeAttribute(attribute.name);
        }
      });
      intro.append(replica);
      const photograph = replica.querySelector<HTMLElement>('.passive-editorial__opening-photo')!;
      const heading = replica.querySelector<HTMLElement>('.passive-editorial__opening')!;
      const label = replica.querySelector<HTMLElement>('.passive-editorial__eyebrow')!;
      root.dataset.openingMode = 'cinematic';
      intro.id = 'introduction-scene'; anchor.id = oldId;
      for (const property of ['--story-drift', '--story-melt', '--story-cue', '--story-title-opacity', '--story-title-lift']) root.style.removeProperty(property);
      const measure = () => {
        width = story.clientWidth;
        const retainHeight = !!height && Math.abs(width - measuredWidth) <= 1 && matchMedia('(pointer: coarse)').matches;
        if (!retainHeight) height = probe.getBoundingClientRect().height;
        measuredWidth = width; compact = width < 1024 || height > width;
        root.style.setProperty('--opening-height', height + 'px');
        // The hero uses the initial visible viewport. The passive scene retains
        // its own approved small-viewport framing, including browser-chrome changes.
        const passiveHeight = retainHeight
          ? parseFloat(passive.style.getPropertyValue('--ps-stage-height')) || height
          : passive.querySelector<HTMLElement>('[data-ps-viewport]')!.getBoundingClientRect().height;
        replica!.style.setProperty('--ps-stage-height', passiveHeight + 'px');
        replica!.style.setProperty('--opening-height', passiveHeight + 'px');
        replicaStage.style.width = width + 'px';
        anchor.style.top = distance() * 2.5 / STORY_DURATION + 'px';
        copy.style.setProperty('--opening-copy-height', Math.max(...passages.map(passage => passage.scrollHeight)) + 'px');
        const properties = ['left', 'top', 'width', 'height', 'border-radius', 'transform', 'transform-origin', 'translate', 'rotate', 'scale'];
        const saved = properties.map(property => photograph.style.getPropertyValue(property));
        properties.forEach(property => photograph.style.removeProperty(property));
        const box = photograph.getBoundingClientRect(), parent = replicaStage.getBoundingClientRect();
        native = { x: box.left - parent.left, y: box.top - parent.top, width: box.width, height: box.height, radius: parseFloat(getComputedStyle(photograph).borderRadius) || 0 };
        properties.forEach((property, index) => { if (saved[index]) photograph.style.setProperty(property, saved[index]); });
        heroCorner = { x: width * .07, y: height * (compact ? .13 : .14), scale: .22 };
        bridge = compact
          ? { x: width * .13, y: height * .77, width: width * .74, height: height * .18, radius: 14 }
          : { x: width * .57, y: height * .74, width: width * .19, height: height * .22, radius: 18 };
        positions = compact ? [
          { x: width * .7, y: height * .13, width: width * .2, height: height * .2, radius: 14 },
          { x: width * .56, y: height * .13, width: width * .37, height: height * .2, radius: 14 },
          { x: width * .75, y: height * .6, width: width * .2, height: height * .2, radius: 14 },
        ] : [
          { x: width * .77, y: height * .12, width: width * .18, height: height * .22, radius: 18 },
          { x: width * .05, y: height * .73, width: width * .23, height: height * .24, radius: 18 },
          { x: width * .82, y: height * .53, width: width * .15, height: height * .29, radius: 18 },
        ];
        if (width > height && height < 560) {
          heroCorner = { x: width * .06, y: height * .22, scale: .2 };
          bridge = { x: width * .78, y: height * .67, width: width * .18, height: height * .26, radius: 14 };
          positions[1] = { x: width * .04, y: height * .62, width: width * .19, height: height * .3, radius: 14 };
        }
      };
      const rect = (get: () => WindowRect) => ({
        left: () => get().x, top: () => get().y, width: () => get().width,
        height: () => get().height, borderRadius: () => get().radius,
      });
      const full = () => ({ x: 0, y: 0, width, height, radius: 0 });
      measure();
      context.add(() => {
        const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut', autoRound: false } });
        timeline.set(hero, { x: 0, y: 0, scale: 1, borderRadius: 0, transformOrigin: '50% 50%', rotationY: 0, rotationZ: 0 }, 0)
          .set(title, { opacity: 1, y: 0 }, 0)
          .set(root, { '--story-cue': 1 }, 0)
          .set(copy, { opacity: 0, y: 16 }, 0)
          .set(passages.slice(1), { opacity: 0, y: 10, pointerEvents: 'none' }, 0)
          .set(passages[0], { opacity: 1, y: 0, pointerEvents: 'auto' }, 0)
          .set([heading, label], { opacity: 0 }, 0)
          .set(photograph, { ...rect(() => bridge), opacity: 0, transformPerspective: 900, rotationY: 0, rotationZ: 0 }, 0)
          .to(root, { '--story-cue': 0, duration: .2 }, 0)
          .set(cue, { visibility: 'hidden', pointerEvents: 'none' }, .2)
          .to(title, { opacity: 0, y: -16, duration: .6 }, 0)
          .to(hero, {
            scale: .3, x: 0, y: 0,
            borderRadius: 60, duration: 1.2,
          }, 0);
        timeline.to(hero, {
          x: () => heroCorner.x - (1 - heroCorner.scale) * width / 2,
          y: () => heroCorner.y - (1 - heroCorner.scale) * height / 2, scale: () => heroCorner.scale,
          borderRadius: () => 16 / heroCorner.scale, duration: .85,
        }, 1.15)
          .to(copy, { opacity: 1, y: 0, duration: .6 }, 1.6)
          .to(photograph, { opacity: 1, duration: .45 }, 1.45);
        // Complete passages follow one another, with no simultaneous text crossfade.
        timeline.to(passages[0], { opacity: 0, y: -10, duration: .22 }, 2.65)
          .set(passages[0], { pointerEvents: 'none' }, 2.65)
          .fromTo(passages[1], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .3, immediateRender: false }, 2.95)
          .set(passages[1], { pointerEvents: 'auto' }, 3.1)
          .to(passages[1], { opacity: 0, y: -10, duration: .22 }, 3.85)
          .set(passages[1], { pointerEvents: 'none' }, 3.85)
          .fromTo(passages[2], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .3, immediateRender: false }, 4.15)
          .set(passages[2], { pointerEvents: 'auto' }, 4.3)
          .set(hero, { transformPerspective: () => Math.max(900, width * 1.6) }, 1.2)
          .to(hero, { rotationY: -16, rotationZ: -5, duration: .75 }, 1.3)
          .to(hero, { rotationY: 16, rotationZ: 7, duration: 3.15, ease: 'none' }, 2.05)
          .to(photograph, { rotationY: -16, rotationZ: -4, duration: .8 }, 1.3)
          .to(photograph, { rotationY: 16, rotationZ: 7, duration: 2.8, ease: 'none' }, 2.1)
          .to(photograph, { rotationY: 0, rotationZ: 0, duration: .45 }, 4.9)
          .set(photograph, { transformPerspective: 0 }, 5.36);
        photos.forEach((photo, index) => {
          timeline.set(photo, { ...rect(() => positions[index]), opacity: 0, y: 18, scale: .94,
            transformPerspective: () => Math.max(700, width * .85), rotationY: 0, rotationZ: [-6, 5, -4][index] }, 0)
            .to(photo, { opacity: 1, y: 0, scale: 1, duration: .75 }, 1.3 + index * .1)
            .to(photo, { y: index % 2 ? -18 : 22, duration: 3.3, ease: 'none' }, 2.05)
            .to(photo, { rotationY: index % 2 ? -360 : 360, rotationZ: [7, -7, 6][index], duration: 2.9 - index * .1, ease: 'none' }, 1.95 + index * .18)
            .to(photo.querySelectorAll('img'), { yPercent: index % 2 ? -3 : 3, duration: 3.6, ease: 'none' }, 1.8)
            .to(photo, { y: () => -height * .65, opacity: 0, duration: .65 }, 3.65 + EDITORIAL_EXTENSION + index * .05);
        });
        timeline.to(copy, { opacity: 0, y: -20, duration: .4 }, 3.65 + EDITORIAL_EXTENSION)
          .to(intro.querySelector('.opening-story__grain'), { opacity: 0, duration: .5 }, 3.65 + EDITORIAL_EXTENSION)
          .to(hero, { y: () => -height * (.6 + (1 - heroCorner.scale) / 2), opacity: 0, duration: .7 }, 3.65 + EDITORIAL_EXTENSION);
        const center = () => ({ x: width * (compact ? .175 : .35), y: height * .32,
          width: width * (compact ? .65 : .3), height: height * .3, radius: 18 });
        timeline.fromTo(photograph, rect(() => bridge), { ...rect(center), duration: .65, immediateRender: false }, 3.95 + EDITORIAL_EXTENSION)
          .fromTo(photograph, rect(center), { ...rect(full), duration: .9, immediateRender: false }, 4.6 + EDITORIAL_EXTENSION)
          .fromTo(photograph, rect(full), { ...rect(() => native), duration: .6, immediateRender: false }, 5.65 + EDITORIAL_EXTENSION)
          .fromTo(heading, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .4, immediateRender: false }, 6.2 + EDITORIAL_EXTENSION)
          .to(label, { opacity: 1, duration: .3 }, 6.2 + EDITORIAL_EXTENSION)
          // A matched still frame makes release into the original scene invisible.
          .to(label, { opacity: 1, duration: .2 }, 6.6 + EDITORIAL_EXTENSION);
        trigger = ScrollTrigger.create({
          id: 'eden-opening-story', trigger: story, pin: stage, start: 'top top',
          end: () => '+=' + distance(),
          animation: timeline, scrub: true, pinSpacing: true, refreshPriority: 3,
          invalidateOnRefresh: true, onRefreshInit: measure,
          onUpdate: self => {
            stage.style.visibility = self.progress >= 1 ? 'hidden' : 'visible';
            const time = self.animation!.time();
            actions.inert = (time < 4.15 || time > 5.85) && document.activeElement !== intro && !actions.contains(document.activeElement);
          },
        });
      });
      intro.querySelectorAll<HTMLImageElement>('img').forEach(image => { image.loading = 'eager'; });
      intro.querySelectorAll<HTMLImageElement>('img').forEach(image => {
        image.addEventListener('error', () => { dispose(); ScrollTrigger.refresh(); }, { once: true, signal: controller.signal });
      });
      anchor.addEventListener('focus', () => {
        if (!trigger) return;
        // The existing Lenis anchor handler already placed this document marker.
        actions.inert = false;
        intro.focus({ preventScroll: true });
      }, { signal: controller.signal });
      actions.addEventListener('focusin', () => {
        if (!trigger || (trigger.animation!.time() >= 4.15 && trigger.animation!.time() <= 5.85)) return;
        trigger.scroll(trigger.start + (trigger.end - trigger.start) * ACTIONS_TIME / STORY_DURATION);
        ScrollTrigger.update();
      }, { signal: controller.signal });
      void document.fonts.ready.then(refresh);
      refresh();
    } catch (error) { dispose(); console.warn('Eden opening story: using the readable presentation.', error); }
  };
  const observer = new MutationObserver(() => {
    if (started && passive.dataset.psMode !== 'cinematic') { dispose(); return; }
    start();
  });
  observer.observe(passive, { attributes: true, attributeFilter: ['data-ps-mode'] });
  start();
  return dispose;
}
