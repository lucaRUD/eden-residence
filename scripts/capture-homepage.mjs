// Local browser QA only. Uses Node's built-in fetch/WebSocket; no app dependency.
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);
const pageURL = new URL(args.get('--url') ?? 'http://127.0.0.1:4322/');
const browserURL = new URL(args.get('--cdp') ?? 'http://127.0.0.1:9222/');
const output = resolve(args.get('--output') ?? 'docs/previews/phase-3c');
const proofDirectory = args.get('--proof-directory');
const loopback = new Set(['localhost', '127.0.0.1', '[::1]']);
if (!loopback.has(pageURL.hostname) || !loopback.has(browserURL.hostname)) {
  throw new Error('Capture only supports loopback preview/browser URLs.');
}

await mkdir(output, { recursive: true });
if (proofDirectory) await mkdir(proofDirectory, { recursive: true });
// Own a new tab; never navigate or close an existing browser tab.
const target = await fetch(new URL('json/new?about:blank', browserURL), { method: 'PUT' }).then(r => r.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
const pending = new Map();
const listeners = new Map();
const imageResponses = new Map();
const failures = [];
const exceptions = [];
const reports = [];
let id = 0;

socket.onmessage = event => {
  const message = JSON.parse(event.data);
  if (message.id) {
    const task = pending.get(message.id);
    if (task) {
      pending.delete(message.id);
      clearTimeout(task.timer);
      message.error ? task.reject(new Error(JSON.stringify(message.error))) : task.resolve(message.result);
    }
    return;
  }
  if (message.method === 'Network.responseReceived' && message.params.type === 'Image') {
    imageResponses.set(message.params.response.url, message.params.response.status);
  }
  if (message.method === 'Network.loadingFailed' && !message.params.canceled) failures.push(message.params);
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails);
  for (const callback of listeners.get(message.method) ?? []) callback(message.params);
  listeners.delete(message.method);
};

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`CDP timeout: ${method}`)); }, 30000);
    timer.unref();
    pending.set(requestId, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
}

function once(method) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Event timeout: ${method}`)), 30000);
    timer.unref();
    const callbacks = listeners.get(method) ?? [];
    callbacks.push(value => { clearTimeout(timer); resolve(value); });
    listeners.set(method, callbacks);
  });
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
const settle = () => evaluate('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
// Observe real completion; never force opacity or disable the site's motion for captures.
const settleMotion = () => evaluate(`new Promise((resolve, reject) => {
  const started = performance.now();
  function check() {
    const moving = [...document.querySelectorAll('[data-home-motion] [style]')]
      .some(el => el.style.opacity !== '' || el.style.transform !== '' || el.style.clipPath !== '');
    if (!moving) return resolve(true);
    if (performance.now() - started > 2500) return reject(new Error('Homepage motion did not settle'));
    requestAnimationFrame(check);
  }
  requestAnimationFrame(check);
})`);

function inspectImage(index) {
  const image = document.images[index];
  const rect = image.getBoundingClientRect();
  const ancestors = [];
  for (let el = image; el; el = el.parentElement) {
    const style = getComputedStyle(el);
    ancestors.push({ tag: el.tagName, className: el.className, display: style.display,
      opacity: style.opacity, visibility: style.visibility, overflow: style.overflow,
      clip: style.getPropertyValue('clip'), clipPath: style.clipPath, filter: style.filter, transform: style.transform,
      contentVisibility: style.contentVisibility });
  }
  const hits = [[.15, .15], [.5, .15], [.85, .15], [.15, .5], [.5, .5], [.85, .5], [.85, .85]]
    .map(([x, y]) => {
      const top = document.elementFromPoint(rect.x + rect.width * x, rect.y + rect.height * y);
      return { onImage: top === image, top: `${top?.tagName}.${top?.className}` };
    });
  const style = getComputedStyle(image);
  return { name: image.closest('[data-render]')?.dataset.render ?? `image-${index}`,
    url: image.currentSrc, complete: image.complete, naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight, loading: image.loading,
    rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, pageTop: rect.y + scrollY },
    fit: style.objectFit, position: style.objectPosition, ancestors, hits };
}

function assertPaintable(image) {
  if (!image.complete || !image.naturalWidth || image.rect.width <= 0 || image.rect.height <= 0
    || image.ancestors.some(a => a.display === 'none' || a.visibility !== 'visible' || Number(a.opacity) === 0)
    || !image.hits.some(hit => hit.onImage)) {
    throw new Error(`Image is not visibly paintable: ${JSON.stringify(image)}`);
  }
}

async function screenshot(path, fullPage = false, width) {
  const params = { format: 'jpeg', quality: 90, captureBeyondViewport: fullPage };
  if (fullPage) {
    const metrics = await send('Page.getLayoutMetrics');
    params.clip = { x: 0, y: 0, width, height: Math.ceil(metrics.cssContentSize.height), scale: 1 };
  }
  const result = await send('Page.captureScreenshot', params);
  await writeFile(path, Buffer.from(result.data, 'base64'));
}

try {
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  await send('Emulation.setScrollbarsHidden', { hidden: true });
  await send('Page.bringToFront');
  // Keep the pointer outside contained hover panels while scrolling for captures.
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
  for (const width of [1440, 375]) for (const theme of ['light', 'dark']) {
    const label = `${width === 1440 ? 'desktop' : 'mobile'}-${theme}`;
    const height = width === 1440 ? 1000 : 812;
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    const init = await send('Page.addScriptToEvaluateOnNewDocument', {
      source: `localStorage.setItem('eden-theme', ${JSON.stringify(theme)});`,
    });
    const loaded = once('Page.loadEventFired');
    await send('Page.navigate', { url: pageURL.href });
    await loaded;
    await evaluate('document.fonts.ready');
    await evaluate('document.images[0].decode()');
    await settle();
    assertPaintable(await evaluate(`(${inspectImage}) (0)`));
    const initialMotion = await evaluate(`({ time: performance.now(), status: document.querySelector('[data-home-motion]')?.dataset.motion,
      headingOpacity: getComputedStyle(document.querySelector('h1')).opacity })`);
    await screenshot(join(output, `initial-${label}.jpg`));
    await settleMotion();
    await screenshot(join(output, `hero-${label}.jpg`));
    const count = await evaluate('document.images.length');
    const initialBoxes = await evaluate(`[...document.images].map(image => {
      const rect = image.getBoundingClientRect();
      return { top: rect.top + scrollY, height: rect.height };
    })`);
    const images = [];
    for (let index = 0; index < count; index++) {
      await evaluate(`document.images[${index}].scrollIntoView({ block: 'center' })`);
      await evaluate(`document.images[${index}].decode()`);
      await settle();
      await settleMotion();
      const image = await evaluate(`(${inspectImage}) (${index})`);
      assertPaintable(image);
      image.status = imageResponses.get(image.url);
      if (image.status !== 200) throw new Error(`Unsuccessful image response: ${image.url}`);
      if (proofDirectory) await screenshot(join(proofDirectory, `${label}-${index}.jpg`));
      images.push(image);
    }
    // Leave native lazy loading untouched. Captures never force content visible.
    await evaluate('scrollTo(0, 0); document.activeElement?.blur()');
    await settle();
    await settleMotion();
    const finalBoxes = await evaluate(`[...document.images].map(image => {
      const rect = image.getBoundingClientRect();
      return { top: rect.top + scrollY, height: rect.height };
    })`);
    const maxImageBoxShift = Math.max(...finalBoxes.map((box, i) => Math.max(
      Math.abs(box.top - initialBoxes[i].top), Math.abs(box.height - initialBoxes[i].height),
    )));
    if (maxImageBoxShift > 1) throw new Error(`Image layout shifted by ${maxImageBoxShift}px.`);
    await screenshot(join(output, `${label}.jpg`), true, width);
    reports.push({ url: pageURL.href, width, theme, initialMotion, maxImageBoxShift, images });
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: init.identifier });
    console.log(`Captured ${label}: ${images.length} decoded images, visible geometry/ancestors/hit tests verified.`);
  }
  if (failures.length || exceptions.length) throw new Error('Browser network/runtime errors occurred; inspect report.json.');
} finally {
  await writeFile(join(output, 'report.json'), JSON.stringify({ reports, failures, exceptions }, null, 2));
  socket.close();
  await fetch(new URL(`json/close/${target.id}`, browserURL));
}
