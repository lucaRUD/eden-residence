# Phase 3D - GSAP homepage animation system

Implemented locally on 2026-10-15, pending owner review. The existing Astro, TypeScript, Tailwind, translations, semantic themes and Phase 3C.2 composition are retained. No WordPress request/change, additional page, commit or deployment was made.

## Dependency and files

Installed `gsap@3.15.0` through npm, including its bundled ScrollTrigger plugin and TypeScript declarations. npm reported zero vulnerabilities. No other application dependency was added; the lockfile change is limited to GSAP.

Created:

- `src/lib/motion/home.ts` - homepage-only loader, preferences, lifecycle and duplicate-init protection
- `src/lib/motion/home-animations.ts` - coordinated hero timeline, selective scroll reveals, focus/anchor handling and cleanup
- `docs/PHASE_3D.md`
- `docs/previews/phase-3d/` - initial, settled and full-page captures; browser measurement reports

Modified:

- `package.json`, `package-lock.json`
- `src/components/home/HomePage.astro` - motion hook and processed Astro client script
- `src/components/layout/Header.astro` - supplied logos, native menu entrance, layout-change event
- `src/styles/home.css` - theme-specific logo display and restrained pointer interactions
- `scripts/capture-homepage.mjs` - initial frames plus observed motion completion before settled captures
- `README.md`, `docs/HOMEPAGE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ARCHITECTURE.md`, `docs/IMPLEMENTATION_PLAN.md`

The two logo PNGs were already supplied in `public/brand/`; their pixels/files were not edited. Other homepage section components, copy, Footer, global tokens, architectural image assets and configuration were not modified in this phase. Earlier uncommitted work remains intact.

## Motion by section

| Composition | Movement / timing | Trigger |
| --- | --- | --- |
| Hero architecture | No GSAP opacity, scale or translation; eager image remains visible | Normal native image loading |
| Hero heading | 16px mobile / 24px desktop upward reveal, 0.70s | Timeline at 0.00s |
| Hero description | 16px upward reveal, 0.60s | Timeline at 0.14s |
| Hero actions together | 16px upward reveal, 0.55s | Timeline at 0.28s; total sequence 0.83s |
| Project heading and aerial image | Separate 0.65s reveals | Each at top 86% of viewport |
| Vision heading and three numbered benefits | Whole heading / whole numbered rows, 0.65s each | Individual entrances; no paragraph-by-paragraph animation |
| Gardens | Heading, primary image, supporting-copy group, secondary image; 0.65s each | Individual entrances |
| Apartments | Section heading 0.65s; each category panel 0.75s | Individual entrances, including tall mobile panels |
| Passive-building chapter | Heading and grouped image/principles body, 0.65s each | Individual entrances |
| Final contact | Heading/action composition and closing image, 0.65s each | Individual entrances |

Scroll reveals use 16px on smaller screens and 24px from md, opacity and `power2.out`. Distance is selected when the motion session starts; ScrollTrigger recalculates geometry on resize. There are at most 17 section triggers, used once. No scroll pinning, scrubbed effects, scroll hijacking, scale distortion or image parallax was added. Parallax was considered and omitted to preserve complete architecture/credits and avoid mobile cost.

The hero runs only on a fresh top-of-page visit, with no hash/focus inside the panel and JS ready within 1.8s. Otherwise content stays static. Initialization sets all three hero steps together after GSAP loads; future steps wait for their slot. The building and eyebrow remain visible. The baseline can paint before the optional animation chunk is available; no initial CSS hiding is used.

Simple pointer states remain CSS: existing button color transitions, a 2px arrow movement over the shared fast duration, and the existing raised shadow on apartment hover/focus-within. Arrow/shadow effects require a fine hover pointer and no reduced motion. They do not compete with reveal transforms. Mobile panel opening uses native Web Animations: 180ms opacity and an 8px upward-to-rest movement. Closing/Escape remains immediate for focus and hidden-state correctness. Theme switching has no new animation.

## Logo integration

The supplied light/dark PNGs are opaque square exports with large outer margins. A small inline SVG viewport displays the complete mark at its original aspect ratio, framing only empty margins. The source files are untouched. The light version's white backdrop blends into cream using `darken`; the dark asset directly matches the forest background. CSS selects the version, including the no-JavaScript OS-dark fallback. The home link keeps its full accessible brand name; the image is decorative within that named link. There is no new logo approximation or font.

## Accessibility and resilience

- All content is visible in server-rendered HTML. There is no global hidden/reveal class, opacity-zero stylesheet or delayed image preloader.
- GSAP loads only for the homepage and only without reduced motion. A blocked/failed dynamic import leaves the static page intact. Partial setup errors revert the GSAP context.
- Pending scroll targets remain visible until their reveal begins. Already-visible content and restored scroll positions are not hidden on initialization. Past/offscreen targets are skipped when appropriate.
- Focus entering an animated composition finishes it immediately. Hash arrivals finish/skip affected reveals. Links and controls retain native semantics and focus indicators; animations never disable pointer interaction or alter tab order.
- Live reduced-motion changes revert active styles, stop triggers and cancel a menu entrance. CSS hover motion is also disabled. Re-enabling motion preserves seen elements for that document.
- Context reversion, aborted listeners, canceled refresh frames and asynchronous generation checks handle cleanup. Repeated page-load initialization is a no-op for the same mounted root; seen elements survive pagehide/pageshow remount through a WeakMap.
- Existing automatic theme choice, localStorage persistence, localized toggle labels, RO/EN routing, Escape behavior and touch targets remain unchanged.

The implementation follows GSAP's documented [context cleanup](https://gsap.com/docs/v3/GSAP/gsap.context()/) and [ScrollTrigger lifecycle](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) APIs. Completed reveals clear their temporary transform/opacity styles.

## Performance and actual verification

- `npm.cmd run check`: 38 files, zero errors/warnings/hints.
- `npm.cmd run build`: passed; two static HTML routes and 28 existing WebP derivatives. No production design-system page.
- Production homepage entry script: about 2.7KB raw / 1.3KB gzip. Lazy GSAP + ScrollTrigger + motion chunk: about 115KB raw / 44.9KB gzip. These are local file/gzip measurements, not HTTP-transfer or Core Web Vitals results.
- The development design-system page was checked in Chrome: no homepage-motion runtime request, and its default shared menu still works.
- RO/EN x light/dark x 320/375/768/1024/1440px: 20 normal-motion browser combinations passed for overflow, mobile initial/expanded state, 44px header targets, centered desktop navigation, image loading, real anchor targets and settled contrast. Sampled settled text contrast remained at least 5.02:1; fades are transient and screenshots/contrast checks wait for completion.
- All six architectural image elements decoded and returned HTTP 200 in each matrix case. Full capture tests checked paintable ancestors/hit points and native lazy loading. Max image-box variation across capture loading/scrolling was 0.063px.
- Desktop 1440px and mobile 375px scroll runs observed all 17 selective reveals. All cleared their styles afterward; target layout offsets and heights changed by 0px. The initial instrumented desktop load recorded a small 0.00181 layout-shift entry involving header controls/navigation during initialization; transform/opacity section reveals did not change layout geometry. This is local evidence, not a claim of zero whole-page CLS on every device.
- Frame sampling confirmed heading before description, description before actions, hero image opacity always 1, and the final settled state. Project entry animated, reentry did not replay, repeated initialization did not replay the hero, and apartment keyboard focus settled the panel.
- Reduced-motion initial visit did not request the GSAP chunk and had no motion styles. Live preference changes restored static content and skipped/canceled the menu entrance.
- A deliberately blocked motion chunk produced the static fallback; menu/theme controls still worked, with no uncaught exception. Expected blocked-request warning is confined to that failure test.
- No-JavaScript EN/mobile dark mode retained visible content/navigation and the correct logo; no overflow. Existing keyboard Enter/Space/Tab, focus outline, Escape/focus return, collapsed tab order, touch menu, theme persistence/system fallback/manual precedence and RO-to-EN-to-RO behavior passed. All homepage anchors were activated in both languages.
- Pagehide cleanup restored styles; pageshow resumed safely. No uncaught runtime exceptions in normal motion, interaction or fallback tests.

## Captures and review

All captures are from the local production build. The helper saves a real early frame after the hero image/fonts decode, then observes cleared motion styles before the settled viewport and full-page captures. It does not force visibility, disable motion or alter lazy loading. Initial captures are naturally partway through the short sequence, not guaranteed time-zero frames.

| View | Initial viewport | Settled viewport | Full page |
| --- | --- | --- | --- |
| Desktop light | [Initial](previews/phase-3d/initial-desktop-light.jpg) | [Settled](previews/phase-3d/hero-desktop-light.jpg) | [Full](previews/phase-3d/desktop-light.jpg) |
| Desktop dark | [Initial](previews/phase-3d/initial-desktop-dark.jpg) | [Settled](previews/phase-3d/hero-desktop-dark.jpg) | [Full](previews/phase-3d/desktop-dark.jpg) |
| Mobile light | [Initial](previews/phase-3d/initial-mobile-light.jpg) | [Settled](previews/phase-3d/hero-mobile-light.jpg) | [Full](previews/phase-3d/mobile-light.jpg) |
| Mobile dark | [Initial](previews/phase-3d/initial-mobile-dark.jpg) | [Settled](previews/phase-3d/hero-mobile-dark.jpg) | [Full](previews/phase-3d/mobile-dark.jpg) |

Browser evidence is in `report.json`, `responsive-report.json`, `motion-report.json`, `scroll-report.json` and `fallback-report.json` alongside the captures. Screenshots demonstrate appearance and settled states; frame sampling and real scrolling verify the implemented movement and sequencing. The final screenshots were visually inspected.

Local review: <http://localhost:4321/> and <http://localhost:4321/en/>. Existing owner dev server stays running; temporary QA preview/browser are stopped after verification.

## Limitations and pending approval

Motion pacing and the supplied logo's navbar presentation require visual review. SVG/transparent logo exports would provide a cleaner future source than opaque, padded PNGs. Safari, Firefox, physical devices and screen-reader testing were unavailable. No formal frame-rate, low-end-device, accessibility or Core Web Vitals audit was performed. Browser lifecycle events were exercised; a full physical-device back/forward-cache matrix was not.

Existing unverified project specifications, provisional digital palette and pending contact functionality remain unchanged. No claims or working inquiry channel were invented. Stop after Phase 3D for owner review.
