import { gsap } from 'gsap';

const LETTER_STAGGER = .075;

/** Camera and scroll own different CSS variables on the shared photographic world. */
export function createArchitecturalHero(root: HTMLElement): () => void {
  const hero = root.querySelector<HTMLElement>('[data-story-hero]')!;
  const image = root.querySelector<HTMLImageElement>('.story-base')!;
  const letters = [...root.querySelectorAll<HTMLElement>('[data-story-letter]')];
  const eyebrow = root.querySelector<HTMLElement>('.story-eyebrow')!;
  const cue = root.querySelector<HTMLElement>('.story-scroll')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const controller = new AbortController();
  const { signal } = controller;
  const startScroll = scrollY;
  const unified = root.hasAttribute('data-home-motion');
  let intro: gsap.core.Timeline | undefined;
  let introFinished = false;
  let frame = 0;
  let readyTimer = 0;
  let viewportWidth = innerWidth;

  const finishIntro = () => {
    if (introFinished) return;
    introFinished = true;
    clearTimeout(readyTimer);
    intro?.kill(); intro = undefined;
    gsap.set([...letters, eyebrow, cue], { clearProps: 'transform,opacity,filter' });
    root.style.removeProperty('--story-camera-y');
    delete root.dataset.storyEntrance;
    delete root.dataset.storyCamera;
  };
  const start = async () => {
    if (reduced.matches || document.hidden || root.dataset.storyCamera !== 'primed' || location.hash || scrollY > 4) {
      finishIntro(); return;
    }
    root.dataset.storyCamera = 'loading';
    // The sky hold starts when the photograph is decoded, never on a blank stage.
    // Failed/slow media returns to the accessible final composition.
    readyTimer = window.setTimeout(finishIntro, 2500);
    const mask = new Image();
    mask.src = root.querySelector<HTMLElement>('[data-story-world]')!.dataset.maskSrc!;
    try {
      await Promise.all([image.decode(), mask.decode()]);
      if (signal.aborted || introFinished) return;
      clearTimeout(readyTimer);
      if (reduced.matches || document.hidden || Math.abs(scrollY - startScroll) > 4) {
        finishIntro(); return;
      }
      const mobile = matchMedia('(max-width: 63.999rem)').matches;
      const hold = mobile ? .35 : .8;
      const descent = mobile ? 1.35 : 2.1;
      const settle = mobile ? .2 : .3;
      const titleAt = hold + descent + settle;
      intro = gsap.timeline({ paused: true, onComplete: finishIntro });
      intro.to(root, {
        '--story-camera-y': root.style.getPropertyValue('--story-camera-y').trim().endsWith('%') ? '0%' : '0px',
        duration: descent, ease: 'power2.inOut',
      }, hold);
      intro.fromTo(letters, {
        opacity: 0, yPercent: 22, filter: 'blur(3px)',
      }, {
        opacity: 1, yPercent: 0, filter: 'blur(0px)',
        duration: mobile ? .8 : .95, stagger: LETTER_STAGGER,
        ease: 'power3.out', immediateRender: true,
      }, titleAt);
      intro.fromTo(eyebrow, { opacity: 0, y: -5 }, {
        opacity: 1, y: 0, duration: .55, ease: 'power3.out', immediateRender: true,
      }, titleAt);
      intro.fromTo(cue, { opacity: 0, y: 8 }, {
        opacity: 1, y: 0, duration: .55, ease: 'power3.out', immediateRender: true,
      }, titleAt + .35);
      root.dataset.storyEntrance = 'running';
      root.dataset.storyCamera = 'running';
      intro.play();
    } catch { finishIntro(); }
  };
  const resetScroll = () => {
    for (const property of ['--story-drift', '--story-melt', '--story-cue', '--story-title-opacity', '--story-title-lift']) root.style.removeProperty(property);
    cue.removeAttribute('data-scroll-hidden');
  };
  const paint = () => {
    frame = 0;
    if (signal.aborted || document.hidden) return;
    if (reduced.matches) { resetScroll(); return; }
    // The homepage handoff owns the exit; the registered sky entrance stays independent.
    if (root.dataset.openingMode === 'cinematic') return;
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, -rect.top / (rect.height * .8)));
    const eased = progress * progress * (3 - 2 * progress);
    root.style.setProperty('--story-drift', `${(progress * (innerWidth < 1024 ? 8 : 18)).toFixed(2)}px`);
    root.style.setProperty('--story-melt', eased.toFixed(4));
    root.style.setProperty('--story-cue', String(Math.max(0, 1 - progress * 4)));
    cue.toggleAttribute('data-scroll-hidden', progress >= .25 && !cue.matches(':focus'));
    if (unified) {
      const exit = Math.min(1, Math.max(0, (progress - .08) / .5));
      root.style.setProperty('--story-title-opacity', String(1 - exit * exit * (3 - 2 * exit)));
      root.style.setProperty('--story-title-lift', `${(-progress * 24).toFixed(2)}px`);
    }
  };
  const schedule = () => {
    if (!frame && !signal.aborted && !document.hidden) frame = requestAnimationFrame(paint);
  };
  const scroll = () => {
    if (!introFinished && Math.abs(scrollY - startScroll) > 4) finishIntro();
    schedule();
  };
  const resize = () => {
    // The fluid mobile world follows browser chrome in CSS. Keep its camera
    // running on height-only changes; a new width still settles the composition.
    if (!unified || innerWidth >= 1024 || Math.abs(innerWidth - viewportWidth) > 1) finishIntro();
    viewportWidth = innerWidth;
    schedule();
  };
  const preference = () => { if (reduced.matches) finishIntro(); schedule(); };
  const visibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame); frame = 0;
      intro?.pause();
    } else {
      intro?.resume();
      schedule();
    }
  };

  window.addEventListener('scroll', scroll, { passive: true, signal });
  window.addEventListener('resize', resize, { passive: true, signal });
  document.addEventListener('visibilitychange', visibility, { signal });
  reduced.addEventListener('change', preference, { signal });
  root.addEventListener('focusin', finishIntro, { signal });
  void start();
  schedule();
  return () => {
    controller.abort(); cancelAnimationFrame(frame); finishIntro(); resetScroll();
  };
}
