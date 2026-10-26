interface Point { x: number; y: number }
interface SpringNode extends Point { vx: number; vy: number }
interface Strand { spring: number; friction: number; nodes: SpringNode[] }

const STEP = 1000 / 60;
const DECAY_MS = 750;
const STRANDS = 10;
const NODES = 15;
// Fine decorative threads; the operating-system pointer always remains visible.
const LINE_WIDTH = .8;
const LINE_OPACITY = .2;

/** Spring-chain / quadratic-curve technique inspired by Cursify Canvas Cursor:
 * https://cursify.ui-layouts.com/components/canvas-cursor
 * No framework, touch interception, scroll coupling, hue cycling or additive glow.
 */
export function createCanvasCursor(canvas: HTMLCanvasElement): () => void {
  const controller = new AbortController();
  const { signal } = controller;
  const eligible = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const target: Point = { x: 0, y: 0 };
  let context: CanvasRenderingContext2D | null = null;
  let strands: Strand[] = [];
  let raf = 0;
  let previous = 0;
  let painted = 0;
  let accumulator = 0;
  let lastMove = 0;
  let active = false;
  let dragging = false;
  let touching = false;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let ink = '#e0c990';

  const allowed = () => eligible.matches && navigator.maxTouchPoints === 0 && !touching && !document.hidden && !signal.aborted;
  const clear = () => { context?.clearRect(0, 0, width, height); };
  const suspend = () => {
    active = false; cancelAnimationFrame(raf); raf = 0; previous = painted = accumulator = 0;
    delete canvas.dataset.visible;
    // The native cursor is never replaced, including when drawing fails.
    try { clear(); } catch { /* A lost context is already hidden. */ }
  };
  const dispose = () => { suspend(); controller.abort(); strands = []; context = null; };

  const resize = () => {
    suspend();
    if (!allowed()) { canvas.width = canvas.height = 0; return; }
    try {
      context ??= canvas.getContext('2d');
      if (!context) { dispose(); return; }
      width = innerWidth; height = innerHeight;
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.lineCap = 'round'; context.lineJoin = 'round';
      ink = getComputedStyle(canvas).getPropertyValue('--cursor-gold').trim() || '#e0c990';
    } catch { dispose(); }
  };
  const resetStrands = () => {
    // Preserve independent spring motion, with fewer strands to avoid an opaque bundle.
    strands = Array.from({ length: STRANDS }, (_, index) => ({
      spring: .4 + index / STRANDS * .025 + ((index * .61803398875) % 1) * .1 - .02,
      friction: .498 + ((index * .38196601125) % 1) * .01,
      nodes: Array.from({ length: NODES }, () => ({ ...target, vx: 0, vy: 0 })),
    }));
  };
  const step = () => {
    for (const strand of strands) {
      let spring = strand.spring;
      for (let index = 0; index < strand.nodes.length; index++) {
        const node = strand.nodes[index];
        const leader = index === 0 ? target : strand.nodes[index - 1];
        node.vx += (leader.x - node.x) * spring;
        node.vy += (leader.y - node.y) * spring;
        if (index > 0) {
          const ahead = strand.nodes[index - 1];
          node.vx += ahead.vx * .25; node.vy += ahead.vy * .25;
        }
        node.vx *= strand.friction; node.vy *= strand.friction;
        node.x += node.vx; node.y += node.vy;
        if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) throw new Error('Invalid cursor simulation');
        spring *= .98;
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
        ctx.beginPath(); ctx.moveTo(nodes[0].x, nodes[0].y);
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
    // Fixed physics steps and at most 60 paints/s, including on high refresh displays.
    if (painted && now - painted < STEP - 1) { raf = requestAnimationFrame(render); return; }
    try {
      accumulator += previous ? Math.min(now - previous, 50) : STEP;
      previous = now;
      const elapsed = now - painted;
      painted = now - (elapsed % STEP);
      while (accumulator >= STEP) { step(); accumulator -= STEP; }
      const age = now - lastMove;
      draw(age);
      if (!canvas.hasAttribute('data-visible')) canvas.dataset.visible = '';
      if (age < DECAY_MS) raf = requestAnimationFrame(render);
    } catch { dispose(); }
  };
  const wake = () => { if (active && !raf) { previous = painted = 0; raf = requestAnimationFrame(render); } };
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') { touching ||= event.pointerType === 'touch'; suspend(); return; }
    if (!allowed() || dragging || event.buttons || event.clientX >= document.documentElement.clientWidth) { suspend(); return; }
    target.x = event.clientX; target.y = event.clientY;
    if (dpr !== Math.min(devicePixelRatio || 1, 2)) resize();
    if (!context || signal.aborted) return;
    if (!active) resetStrands();
    active = true; lastMove = performance.now();
    wake();
  };
  document.addEventListener('pointermove', move, { signal, passive: true });
  document.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse') touching ||= event.pointerType === 'touch';
    dragging = true; suspend();
  }, { signal, passive: true });
  document.addEventListener('pointerup', () => { dragging = false; }, { signal, passive: true });
  document.addEventListener('pointercancel', () => { dragging = false; suspend(); }, { signal, passive: true });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) suspend(); }, { signal, passive: true });
  document.addEventListener('keydown', () => suspend(), { signal });
  document.addEventListener('visibilitychange', () => { dragging = false; suspend(); }, { signal });
  document.addEventListener('astro:before-swap', dispose, { signal });
  window.addEventListener('resize', resize, { signal, passive: true });
  window.addEventListener('blur', () => { dragging = false; suspend(); }, { signal });
  window.addEventListener('pagehide', suspend, { signal });
  canvas.addEventListener('contextlost', dispose, { signal });
  eligible.addEventListener('change', resize, { signal });
  resize();
  return dispose;
}
