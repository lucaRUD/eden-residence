interface Point { x: number; y: number }
interface SpringNode extends Point { vx: number; vy: number }
interface Strand { response: number; damping: number; nodes: SpringNode[] }

const PHYSICS_STEP = 1 / 240;
const MIN_TRAIL_LENGTH = 100;
const MAX_TRAIL_LENGTH = 560;
const SPEED_FOR_MAX_LENGTH = 2200; // CSS pixels per second.
const SPEED_SMOOTHING_MS = 40;
const SPEED_RESET_MS = 160;
const DECAY_MS = 450;
const STRANDS = 10;
const NODES = 15;
// Continuous damped springs: no rigid link clamps or timed position corrections.
const BASE_RESPONSE = 95; // Angular response in radians per second.
const RESPONSE_VARIATION = .09;
const RESPONSE_TAPER = .995;
const DAMPING_RATIO = .66;
const DAMPING_VARIATION = .14;
// Fine decorative threads; a native custom circle supplies the precise hotspot.
const LINE_WIDTH = 1.15;
const LINE_OPACITY = .14;

/** Spring-chain / quadratic-curve technique inspired by Cursify Canvas Cursor:
 * https://cursify.ui-layouts.com/components/canvas-cursor
 * No framework, touch interception, scroll coupling, hue cycling or additive glow.
 */
export function createCanvasCursor(canvas: HTMLCanvasElement): () => void {
  const controller = new AbortController();
  const { signal } = controller;
  const root = document.documentElement;
  const eligible = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const target: Point = { x: 0, y: 0 };
  const simulatedTarget: Point = { x: 0, y: 0 };
  let context: CanvasRenderingContext2D | null = null;
  let strands: Strand[] = [];
  let raf = 0;
  let previous = 0;
  let lastMove = 0;
  let pointerSpeed = 0;
  let active = false;
  let dragging = false;
  let touching = false;
  let width = 0;
  let height = 0;
  let originX = 0;
  let originY = 0;
  let observer: ResizeObserver | undefined;
  let dpr = 1;
  let ink = '#e0c990';

  const allowed = () => eligible.matches && navigator.maxTouchPoints === 0 && !touching && !document.hidden && !signal.aborted;
  const clear = () => { context?.clearRect(0, 0, width, height); };
  const suspend = (restorePointer = true) => {
    active = false; cancelAnimationFrame(raf); raf = 0; previous = 0;
    pointerSpeed = 0;
    delete canvas.dataset.visible;
    if (restorePointer) delete root.dataset.edenCursor;
    // Failures and native interactions always restore the browser's own cursor.
    try { clear(); } catch { /* A lost context is already hidden. */ }
  };
  const dispose = () => { suspend(); observer?.disconnect(); controller.abort(); strands = []; context = null; };

  const resize = () => {
    suspend(!allowed());
    if (!allowed()) { width = height = canvas.width = canvas.height = 0; return; }
    try {
      context ??= canvas.getContext('2d');
      if (!context) { dispose(); return; }
      // A fixed 100%-wide canvas excludes the scrollbar; innerWidth does not.
      // Match its real CSS box so the raster and native cursor share coordinates.
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width; height = bounds.height;
      originX = bounds.left; originY = bounds.top;
      if (!width || !height) { suspend(); return; }
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      context.lineCap = 'round'; context.lineJoin = 'round';
      ink = getComputedStyle(canvas).getPropertyValue('--cursor-gold').trim() || '#e0c990';
    } catch { dispose(); }
  };
  const resetStrands = () => {
    simulatedTarget.x = target.x; simulatedTarget.y = target.y;
    // Independent springs retain elasticity without a wide fan of lagging strands.
    strands = Array.from({ length: STRANDS }, (_, index) => ({
      response: 1 + ((index * .61803398875) % 1) * RESPONSE_VARIATION,
      damping: DAMPING_RATIO + (((index * .38196601125) % 1) - .5) * DAMPING_VARIATION,
      nodes: Array.from({ length: NODES }, () => ({ ...target, vx: 0, vy: 0 })),
    }));
  };
  const step = (dt: number, response: number) => {
    for (const strand of strands) {
      let angularResponse = response * strand.response;
      for (let index = 0; index < strand.nodes.length; index++) {
        const node = strand.nodes[index];
        const leader = index === 0 ? simulatedTarget : strand.nodes[index - 1];
        const spring = angularResponse * angularResponse;
        const attenuation = 1 / (1 + 2 * strand.damping * angularResponse * dt + spring * dt * dt);
        // Implicit integration stays stable through fast turns and dropped frames.
        node.vx = (node.vx + (leader.x - node.x) * spring * dt) * attenuation;
        node.vy = (node.vy + (leader.y - node.y) * spring * dt) * attenuation;
        node.x += node.vx * dt; node.y += node.vy * dt;
        if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) throw new Error('Invalid cursor simulation');
        angularResponse *= RESPONSE_TAPER;
      }
    }
  };
  const draw = (age: number) => {
    const ctx = context!;
    clear();
    const fade = Math.min(1, Math.max(0, age - 80) / (DECAY_MS - 80));
    const opacity = 1 - fade * fade * (3 - 2 * fade);
    if (opacity > 0) {
      strands.forEach(strand => {
        const nodes = strand.nodes;
        ctx.beginPath(); ctx.moveTo(target.x, target.y);
        ctx.quadraticCurveTo(nodes[0].x, nodes[0].y, (nodes[0].x + nodes[1].x) / 2, (nodes[0].y + nodes[1].y) / 2);
        for (let i = 1; i < nodes.length - 2; i++) {
          const node = nodes[i], next = nodes[i + 1];
          ctx.quadraticCurveTo(node.x, node.y, (node.x + next.x) / 2, (node.y + next.y) / 2);
        }
        const penultimate = nodes[nodes.length - 2], end = nodes[nodes.length - 1];
        ctx.quadraticCurveTo(penultimate.x, penultimate.y, end.x, end.y);
        ctx.globalAlpha = opacity * LINE_OPACITY;
        ctx.strokeStyle = ink; ctx.lineWidth = LINE_WIDTH; ctx.stroke();
      });
    }
    ctx.globalAlpha = 1;
  };
  const render = (now: number) => {
    raf = 0;
    if (!active || !allowed()) { suspend(); return; }
    try {
      const elapsed = previous ? Math.min(now - previous, 32) / 1000 : 1 / 60;
      previous = now;
      const age = now - lastMove;
      const speed = pointerSpeed * Math.exp(-Math.max(0, age - 32) / 70);
      const ratio = Math.min(1, speed / SPEED_FOR_MAX_LENGTH);
      const length = MIN_TRAIL_LENGTH + (MAX_TRAIL_LENGTH - MIN_TRAIL_LENGTH) * ratio * ratio * (3 - 2 * ratio);
      // Speed changes the spring response smoothly, rather than clipping positions.
      const response = Math.max(BASE_RESPONSE, 2 * DAMPING_RATIO * speed * NODES / length);
      const substeps = Math.max(1, Math.ceil(elapsed / PHYSICS_STEP));
      const startX = simulatedTarget.x, startY = simulatedTarget.y;
      for (let index = 1; index <= substeps; index++) {
        simulatedTarget.x = startX + (target.x - startX) * index / substeps;
        simulatedTarget.y = startY + (target.y - startY) * index / substeps;
        step(elapsed / substeps, response);
      }
      // Paint every display frame; physics work is subdivided, never separately RAFed.
      draw(age);
      if (!canvas.hasAttribute('data-visible')) canvas.dataset.visible = '';
      root.dataset.edenCursor = 'ready';
      if (age < DECAY_MS) raf = requestAnimationFrame(render);
    } catch { dispose(); }
  };
  const wake = () => { if (active && !raf) { previous = 0; raf = requestAnimationFrame(render); } };
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') { touching ||= event.pointerType === 'touch'; suspend(); return; }
    if (!allowed() || dragging || event.buttons || event.clientX >= document.documentElement.clientWidth) { suspend(); return; }
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable], [data-native-cursor], :disabled, [aria-disabled="true"]')) { suspend(); return; }
    if (dpr !== Math.min(devicePixelRatio || 1, 2)) resize();
    if (!context || signal.aborted) return;
    const now = performance.now();
    const x = event.clientX - originX, y = event.clientY - originY;
    const elapsed = now - lastMove;
    if (active && elapsed > 0 && elapsed < SPEED_RESET_MS) {
      const measured = Math.min(SPEED_FOR_MAX_LENGTH * 4, Math.hypot(x - target.x, y - target.y) * 1000 / Math.max(.5, elapsed));
      pointerSpeed += (measured - pointerSpeed) * (1 - Math.exp(-elapsed / SPEED_SMOOTHING_MS));
    } else pointerSpeed = 0;
    target.x = x; target.y = y;
    if (!active || elapsed >= DECAY_MS) resetStrands();
    active = true; lastMove = now;
    wake();
  };
  document.addEventListener('pointermove', move, { signal, passive: true });
  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') touching ||= event.pointerType === 'touch';
    dragging = true; suspend(event.pointerType !== 'mouse');
  }, { signal, passive: true });
  document.addEventListener('pointerup', () => { dragging = false; }, { signal, passive: true });
  document.addEventListener('pointercancel', () => { dragging = false; suspend(); }, { signal, passive: true });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) suspend(); }, { signal, passive: true });
  document.addEventListener('keydown', () => suspend(), { signal });
  document.addEventListener('visibilitychange', () => { dragging = false; suspend(); }, { signal });
  document.addEventListener('astro:before-swap', dispose, { signal });
  window.addEventListener('resize', resize, { signal, passive: true });
  window.addEventListener('blur', () => { dragging = false; suspend(); }, { signal });
  window.addEventListener('pagehide', () => suspend(), { signal });
  canvas.addEventListener('contextlost', dispose, { signal });
  eligible.addEventListener('change', resize, { signal });
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => {
      const bounds = canvas.getBoundingClientRect();
      if (Math.abs(bounds.width - width) > .1 || Math.abs(bounds.height - height) > .1) resize();
    });
    observer.observe(canvas);
  }
  resize();
  return dispose;
}
