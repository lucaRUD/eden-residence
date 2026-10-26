import { gsap } from 'gsap';

/** A reversible menu timeline, independent of the cinematic ScrollTrigger. */
class EdenFloatingNavigation extends HTMLElement {
  private dispose?: () => void;

  connectedCallback() {
    if (this.dispose) return;
    const trigger = this.querySelector<HTMLButtonElement>('[data-nav-trigger]')!;
    const bar = this.querySelector<HTMLElement>('[data-nav-bar]')!;
    const panel = this.querySelector<HTMLElement>('[data-nav-panel]')!;
    const content = this.querySelector<HTMLElement>('[data-nav-content]')!;
    const items = [...this.querySelectorAll<HTMLElement>('[data-nav-item]')];
    const strokes = [...this.querySelectorAll<HTMLElement>('[data-nav-stroke]')];
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const controller = new AbortController();
    const { signal } = controller;
    const styles = new Map([this, ...items, ...strokes].map(element => [element, element.getAttribute('style')]));
    const outside = new Map<HTMLElement, boolean>();
    const pageStyles: { element: HTMLElement; property: string; value: string; priority: string }[] = [];
    let open = false;
    let modal = false;
    let panelReady = false;
    let resizeFrame = 0;

    const unlock = () => {
      outside.forEach((inert, element) => { element.inert = inert; });
      outside.clear();
      pageStyles.forEach(({ element, property, value, priority }) => {
        if (value) element.style.setProperty(property, value, priority);
        else element.style.removeProperty(property);
      });
      pageStyles.length = 0;
      modal = false;
      this.removeAttribute('role');
      this.removeAttribute('aria-modal');
      this.removeAttribute('aria-label');
    };
    const lock = () => {
      if (modal) return;
      modal = true;
      this.setAttribute('role', 'dialog');
      this.setAttribute('aria-modal', 'true');
      this.setAttribute('aria-label', this.dataset.navigationLabel ?? '');
      for (const element of document.body.children) {
        if (!(element instanceof HTMLElement) || element.contains(this)) continue;
        outside.set(element, element.inert);
        element.inert = true;
      }
      const root = document.documentElement;
      const shell = this.parentElement!;
      for (const [element, property] of [[root, 'overflow'], [document.body, 'padding-right'], [shell, '--nav-scrollbar']] as const) {
        pageStyles.push({ element, property, value: element.style.getPropertyValue(property), priority: element.style.getPropertyPriority(property) });
      }
      // Compensate for the scrollbar without changing viewport-unit sizing.
      // Never fix/translate the body or refresh the cinematic ScrollTrigger.
      const scrollbar = innerWidth - root.clientWidth;
      const padding = parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.setProperty('padding-right', `${padding + scrollbar}px`);
      shell.style.setProperty('--nav-scrollbar', `${scrollbar}px`);
      root.style.setProperty('overflow', 'hidden');
    };
    const finishClose = () => {
      if (open) return;
      panel.hidden = true;
      panel.inert = true;
      panel.setAttribute('aria-hidden', 'true');
      panelReady = false;
      delete panel.dataset.scrollable;
      panel.scrollTop = 0;
      unlock();
    };
    const expandedHeight = () => {
      const top = parseFloat(getComputedStyle(this.parentElement!).top);
      const available = (visualViewport?.height ?? innerHeight) - top * 2;
      return Math.max(bar.offsetHeight, Math.min(bar.offsetHeight + content.scrollHeight, available));
    };
    const activatePanel = () => {
      if (!open || panelReady) return;
      panelReady = true;
      panel.inert = false;
      panel.removeAttribute('aria-hidden');
      if (document.activeElement === trigger || !this.contains(document.activeElement)) {
        panel.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
      }
    };
    const syncScrolling = () => {
      panel.dataset.scrollable = String(open && timeline.progress() === 1 && content.scrollHeight > panel.clientHeight + 1);
    };
    const timeline: gsap.core.Timeline = gsap.timeline({
      paused: true,
      onReverseComplete: finishClose,
      onComplete: () => { activatePanel(); syncScrolling(); },
      onUpdate: () => { if (timeline.time() >= .24) activatePanel(); },
    });
    timeline.fromTo(this, { height: () => bar.offsetHeight }, {
      height: expandedHeight, duration: .48, ease: 'power2.inOut',
    }, 0);
    strokes.forEach((stroke, index) => {
      timeline.fromTo(stroke, { y: index ? 3 : -3, rotation: 0 }, {
        y: 0, rotation: index ? -45 : 45, duration: .28, ease: 'power2.inOut',
      }, 0);
    });
    timeline.fromTo(items, { autoAlpha: 0, y: 6 }, {
      autoAlpha: 1, y: 0, duration: .24, stagger: .035, ease: 'power1.out',
    }, .14);

    const setOpen = (next: boolean, immediate = false) => {
      if (open === next && !immediate) return;
      open = next;
      this.dataset.open = String(open);
      panel.dataset.scrollable = 'false';
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute('aria-label', (open ? trigger.dataset.closeLabel : trigger.dataset.openLabel) ?? '');
      if (open) {
        const wasHidden = panel.hidden;
        panel.hidden = false;
        if (wasHidden) panel.scrollTop = 0;
        lock();
        if (wasHidden) timeline.invalidate();
        if (reduced.matches || immediate) { timeline.progress(1).pause(); activatePanel(); syncScrolling(); }
        else timeline.play();
      } else {
        if (panel.contains(document.activeElement)) trigger.focus({ preventScroll: true });
        panel.inert = true;
        panel.setAttribute('aria-hidden', 'true');
        panelReady = false;
        if (reduced.matches || immediate) { timeline.progress(0).pause(); finishClose(); }
        else timeline.reverse();
      }
      syncScrolling();
    };
    trigger.hidden = false;
    trigger.addEventListener('click', () => setOpen(!open), { signal });
    this.addEventListener('click', event => {
      if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
    }, { signal });
    document.addEventListener('pointerdown', event => {
      if (open && event.target instanceof Node && !this.contains(event.target)) setOpen(false);
    }, { signal, capture: true });
    document.addEventListener('keydown', event => {
      if (!modal) return;
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); trigger.focus({ preventScroll: true }); }
      if (event.key !== 'Tab') return;
      const focusable = [...this.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')].filter(element =>
        !element.closest('[inert], [hidden]') && element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
      const target = event.shiftKey ? focusable.at(-1) : focusable[0];
      if (!this.contains(document.activeElement) || document.activeElement === (event.shiftKey ? focusable[0] : focusable.at(-1))) {
        event.preventDefault(); target?.focus({ preventScroll: true });
      }
    }, { signal });
    document.addEventListener('focusin', event => {
      if (modal && event.target instanceof Node && !this.contains(event.target)) trigger.focus({ preventScroll: true });
    }, { signal });
    reduced.addEventListener('change', () => { if (reduced.matches) setOpen(open, true); }, { signal });
    const resize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        if (!open && timeline.progress() === 0) { gsap.set(this, { height: bar.offsetHeight }); timeline.invalidate(); }
        else { const progress = timeline.progress(); timeline.invalidate().progress(progress, true); }
        syncScrolling();
      });
    };
    window.addEventListener('resize', resize, { signal });
    visualViewport?.addEventListener('resize', resize, { signal });
    window.addEventListener('pagehide', () => setOpen(false, true), { signal });
    this.dispose = () => {
      controller.abort(); cancelAnimationFrame(resizeFrame); timeline.kill(); unlock();
      styles.forEach((style, element) => {
        if (style === null) element.removeAttribute('style'); else element.setAttribute('style', style);
      });
      panel.hidden = true; panel.inert = true; trigger.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      delete this.dataset.open;
      delete panel.dataset.scrollable;
    };
  }

  disconnectedCallback() { this.dispose?.(); this.dispose = undefined; }
}

if (!customElements.get('eden-floating-navigation')) customElements.define('eden-floating-navigation', EdenFloatingNavigation);
