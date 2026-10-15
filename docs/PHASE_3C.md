# Phase 3C: image investigation and visual polish

Implemented locally on 2026-10-15. Phase 3B remains unapproved; Phase 3C also awaits visual review. Its existing uncommitted changes were preserved. No commit, deployment, WordPress change, new page or dependency was introduced.

## Image diagnosis

Before styling changes, every major image was scrolled into the actual Chrome viewport and captured independently in light and dark themes. Inspection covered final URL/status, complete/natural dimensions/currentSrc, decoding, bounding rectangle, object fit/position, opacity, visibility, display, overflow, clipping, filters, transforms, content visibility, all ancestors and overlap hit tests.

All six images visibly painted architectural content in both themes. All seven sampled points per image hit the image itself in the baseline checks. Captured image regions had substantial pixel variation rather than uniform backgrounds. No hidden ancestor, zero-size frame, theme-specific hiding, blocking overlay, IntersectionObserver dependency, failed request or console exception was found.

**The cause of the earlier reported blank screenshots is not established.** No production visibility defect reproduced. Native lazy loading defers later images until scrolling; an early full-page screenshot can be incomplete, but this does not prove the cause of a different artifact. No eager-loading workaround, opacity override, removed image or replacement placeholder was added.

The final evidence checks actual rendered pixels. Every image region in the four RO full-page captures was compared with a separate actual-viewport screenshot: all 24 regions contained the same architectural scenes. Mean RGB differences were below 4/255, consistent with JPEG encoding and subpixel positioning. Image-proof sheets are linked below.

## Capture repair and tooling

Added `scripts/capture-homepage.mjs`, using Node's built-in fetch/WebSocket and an installed Chrome debugging endpoint. It is local QA tooling, not application code. It opens/closes its own tab and accepts only loopback preview/debugging URLs.

For light/dark at 1440px and 375px it disables cache, waits for fonts and hero decode, records the first viewport, scrolls to every image, awaits decode and two frames, checks geometry/ancestors/hit tests/network status, then returns to the top for full-page capture. Lazy loading and visibility styles are never altered. Image-box stability and detailed diagnostic data are recorded. Failed visibility/response checks or browser errors fail the run.

Optional per-image viewport captures provide separate visual/pixel evidence. DOM checks alone are not screenshot-pixel verification; the separate comparison above was performed during this review. JPEG quality 90 keeps review files smaller without changing original renders or website assets.

With the production preview at port 4322 and an isolated Chrome debugging instance at port 9222:

```powershell
node scripts/capture-homepage.mjs --url http://127.0.0.1:4322/ --output docs/previews/phase-3c
```

Add `--proof-directory <temporary-directory>` to retain per-image viewports. Use `--url http://127.0.0.1:4322/en/` and another output directory for English. `--cdp` selects another loopback debugging endpoint. The helper does not launch servers, install Chrome or close the browser process. Use a separate temporary Chrome profile and close that isolated instance after QA.

## Visual and composition refinements

- Mobile hero framing is now 3:2 instead of 4:3. The same source loses about 16% of its width instead of 25%, retaining more garden while preserving the building and bottom-right credit. Desktop/tablet retain full 16:9.
- Hero aspect, fit and position are centralized CSS variables. Explicit positioning inside the aspect frame avoids percentage-height/intrinsic sizing ambiguity; this is a sizing clarification, not a claimed fix for a reproduced zero-size image.
- Shared radii: controls 8px, cards/panels 12px, selected images fluid from 8px on mobile to 16px on desktop. Smaller narrow-screen corners retain embedded credits.
- Hero, project, garden and closing photographs have restrained rounded corners. The landscape study, navy chapter boundaries and internal editorial rules retain square geometry.
- Project/closing images have balanced side spacing; the main garden has a smaller inset. The supporting garden no longer bleeds to the mobile edge.
- The benefits surface has an inset and softer corners. The annotation border and outer benefit rules were removed; internal separators and meaningful action/caveat rules remain.
- Oversized, offset apartment panels retain paper/forest contexts with subtle rounding and no new shadow.

Asset names/mappings, original JPEGs, source limits, quality, Quicksand, translations, theme scripts and the seven-section editorial structure remain unchanged. No derivative exceeds its source dimensions. The hero stays eager/high priority; all five later images stay lazy.

## Motion and dependencies

The brief explicitly limits Phase 3C to image visibility, composition and visual/layout refinement, deferring new scroll animation, parallax and GSAP until Phase 3D. No entrance/reveal/scroll animation or dependency was added. Existing color/border hover transitions and focus behavior remain. Reduced motion shows final visible content with zero transition duration and no active animations. Navigation and images also work without JavaScript.

No dependencies were added, removed or upgraded. The helper uses Node built-ins. Contact-sheet/pixel inspection used existing local tools, not an application dependency.

## Phase 3C files

Modified application files:

- `src/styles/global.css`: shared radii only.
- `src/styles/home.css`: centralized framing, selected softer surfaces/spacing and fewer outer borders.
- `src/components/home/RenderImage.astro`: stable `data-render` diagnostic label; loading/source behavior unchanged.

Added `scripts/capture-homepage.mjs`, this record and `docs/previews/phase-3c/` (four full-page captures, four first viewports, two proof sheets, diagnostic JSON). Updated README, homepage/design-system documentation and the implementation plan. Other Phase 3B files already shown as modified in Git predate Phase 3C and were left intact.

## Actual verification

- Astro check: 35 files, zero errors/warnings/hints. Production build: exactly two static HTML pages and 28 WebP derivatives.
- `node --check scripts/capture-homepage.mjs` passed. The helper completed RO/EN x light/dark x desktop/mobile: 48 decoded image observations, visible geometry/ancestors/hit tests and zero network/runtime errors.
- Chrome RO/EN x light/dark x 320/375/768/1024/1440px: no horizontal overflow, visible-element overflow, missing fragment targets or undersized tested header/button controls. Body text remains 16px.
- Image-box position/height moved at most 0.0625px during loading and scrolling after fonts settled. This is subpixel rounding, not a field Core Web Vitals result.
- Sampled desktop text contrast: 67 samples per language/theme, minimum 5.02:1.
- Keyboard Enter/Space, Tab, Escape/focus return, collapsed menu tab order, touch opening and mobile theme selection passed. Mobile navigation starts closed with JavaScript.
- RO/EN switching, manual theme persistence, OS defaults and manual precedence passed. Visible 2px focus outlines checked on hero, apartment and closing actions; skip link focuses main.
- Every homepage fragment link was activated in both languages. Contact/category links still reach an honest information placeholder, with no fake submission.
- With JavaScript disabled, navigation remained usable and all six images decoded and remained visible after scrolling.
- Reduced motion: zero running animations and zero button transition duration. No scroll/entrance effect can hide content.
- Development RO/EN/design-system URLs returned 200. Production RO/EN returned 200; both design-system variants returned 404.
- The capture helper also passed all four theme/viewport cases against the existing development server, with all six images decoded and visible in each case.
- All 28 generated image URLs returned 200 with nonempty WebP content. All nine JPEG source copies match their unchanged originals; generated dimensions remain within source limits. Normal functional transitions remain 160ms; reduced motion sets them to zero.
- Full-page, viewport and proof screenshots were visually inspected for imagery, credits, framing, typography and both themes. `git diff --check` passed.

## Updated screenshots

| View | Full page | First viewport |
| --- | --- | --- |
| Desktop light | [Full page](previews/phase-3c/desktop-light.jpg) | [Hero](previews/phase-3c/hero-desktop-light.jpg) |
| Desktop dark | [Full page](previews/phase-3c/desktop-dark.jpg) | [Hero](previews/phase-3c/hero-desktop-dark.jpg) |
| Mobile light | [Full page](previews/phase-3c/mobile-light.jpg) | [Hero](previews/phase-3c/hero-mobile-light.jpg) |
| Mobile dark | [Full page](previews/phase-3c/mobile-dark.jpg) | [Hero](previews/phase-3c/hero-mobile-dark.jpg) |

- [Light image-proof sheet](previews/phase-3c/image-proof-light.jpg)
- [Dark image-proof sheet](previews/phase-3c/image-proof-dark.jpg)
- [RO capture diagnostics](previews/phase-3c/report.json)

English captures and baseline viewport diagnostics were also inspected locally. The existing owner dev server remains available at <http://localhost:4321/> and <http://localhost:4321/en/>. Temporary production QA preview and isolated browser are closed after verification.

## Remaining limitations

The origin of the earlier reported blank areas remains unconfirmed; the new evidence demonstrates visible images in the tested browser/captures. Safari, Firefox, screen readers and physical devices were not tested; no full accessibility or field performance audit is claimed. Resolution and credit legibility remain limited by supplied assets. Visual approval, publication rights, verified property data and actual contact information remain pending.

Stop after Phase 3C. Phase 3D motion requires separate authorization after visual approval.

