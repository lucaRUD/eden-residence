# Phase 3D.1 - homepage refinement and apartment showcase

Implemented locally for owner review on 2026-10-15. Phase 3D was not visually approved. This phase preserves the existing architecture, sections, semantic themes, Quicksand, bilingual content, hero composition, passive chapter and closing direction. No dependency, additional page, WordPress operation, commit or deployment was introduced.

## Review and root causes

Read the project rules, current design/homepage/motion records, section components, asset mappings and runtime before editing. Both supplied annotated full-page screenshots were reviewed. The supplied WebM was inspected through a read-only loopback media server and sampled frames: it shows the Eden page, including an image-visible frame followed by a frame with blank garden imagery. The old runtime explicitly faded image-containing groups from zero opacity. This could create blank intermediate frames; the recording does not prove every missing frame's cause. New motion never changes photography opacity.

The apartment/project-tile screenshot supplied the reference for immersive imagery and active-panel emphasis. The live Nord One site returned HTTP 403, so no live hover interaction was claimed as inspected. Its branding, rotated typography and three-project composition were not reproduced.

The main weaknesses were:

- Seventeen groups shared the same 16-24px rise/fade, giving chapters the same entrance and sometimes hiding images already seen while scrolling.
- Chapter padding of roughly 100-112px on desktop was combined with large internal gaps, a tall oversized supporting statement, spacious numbered rows and offset apartment panels.
- Apartment numerals dominated mostly empty paper/forest cards, without architectural imagery or a meaningful pointer interaction.
- The garden supporting copy was vertically centered against its companion image, creating a large empty area above the text.

## Layout and spacing

Homepage-only tokens now use 44-72px chapter padding, a 24-40px composition gap, a display scale capped at 88px, and a supporting-statement scale capped at 40px. Global design tokens, font weights and 16px body text remain unchanged.

Project opening space is 36-56px. The supporting statement occupies fewer lines; benefits use tighter row padding; garden afterword text aligns at the image top. Apartment panels align instead of offsetting the second card. Passive-heading/body/note gaps and the closing display scale were tightened, while their composition and content remain intact. The shared Section and Footer components were not changed.

Matched local RO measurements with standard scrollbars:

| Viewport width | Before page height | After page height | Reduction |
| --- | --- | --- | --- |
| 1440px | 9744px | 8880px | 864px / 8.9% |
| 375px | 7784px | 7463px | 321px / 4.1% |
| 1920px | 10948px | 10007px | 941px / 8.6% |

At 1440px, the project section is about 241px shorter, benefits 293px shorter, gardens 140px shorter, passive chapter 138px shorter and closing CTA 99px shorter. The apartment section is about 47px taller because it now contains substantial imagery; on mobile that tradeoff is about 144px. The overall page is shorter despite the richer showcase. Hero dimensions were unchanged. These measurements describe the local browser configuration, not a fixed production page-height guarantee.

## Motion rework

The existing progressive loader, reduced-motion handling, lifecycle cleanup and focus/anchor completion are retained. Eight once-only chapter triggers at `top 92%` replace seventeen identical rises. Already-visible content stays static on initialization, and pending targets are not pre-hidden.

| Chapter | Treatment |
| --- | --- |
| Hero | Short 0.6s timeline: heading settles 12px, description 6px, actions get opacity emphasis only. All start at 85% opacity or above; architecture stays still and opaque. |
| Project heading | H2 opacity 0.85 to 1 over 0.5s; no translation. |
| Project aerial | A 3% leading-left-edge clip clears over 0.8s, with no fade, zoom or movement. The bottom-right credit stays visible. |
| Benefits | Number/title sequence, 0.4s with 0.045s stagger; rows and supporting paragraphs remain still. |
| Garden | Primary image uses the small edge reveal; the supporting lead gets a 0.6s opacity emphasis. Secondary image and body copy remain static. |
| Apartments | Identities settle 6px over 0.5s, staggered by 0.1s. Image frames, descriptions and actions remain still and visible. |
| Passive concept | Technical labels sequence over 0.45s with 0.1s stagger. Diagram, heading composition and explanatory paragraphs stay static. |
| Closing CTA | Heading settles 8px over 0.6s. Inquiry action and closing image stay visible and still. |

Only high-contrast headings/identity text receive opacity emphasis. Body paragraphs are not faded. Temporary opacity/transform/clip-path styles clear on completion and revert during cleanup. No parallax, pinning, scroll replacement or aggressive scale was added. The existing native mobile menu and theme mechanism are unchanged.

## Apartment panels and interactions

Two image-led, near-vertical panels use the existing optimized RenderImage pipeline:

- Two-room category: `eden-residence-pedestrian-access.jpeg`.
- Three-room category: `eden-residence-private-garden-terrace.jpeg`.

These are development-wide views, not illustrations of the linked apartment categories. A visible RO/EN note above the panels makes that distinction explicit. No area, plan, availability or unit-specific amenity was invented. Existing category descriptions and pending-data note remain visible.

Each article contains one native full-panel anchor named by its H3. It includes a substantial architectural image, room count, category heading, description and permanent action row. Destinations remain the existing honest `#contact-information` section; apartment-detail pages are not implemented.

Desktop panels align equally and retain paper/forest footer contexts. On a fine hover pointer without reduced motion, the active image scales to 1.025 over 480ms, anchored bottom right. Neighbor imagery desaturates to 0.65; text is never blurred or softened. Titles underline and the arrow gains an action fill. Keyboard focus receives equivalent emphasis plus the existing visible focus outline. Panel size and position do not change.

Mobile stacks the panels, uses broader 4:3 image frames and smaller counts, with large native tap areas and all text/actions exposed. Desktop uses 6:5 frames from md. Right/bottom framing and the bottom-right scale origin keep the source credits inside the visible image. Touch and reduced-motion modes have no zoom or desaturation effect. No CSS blur or hover-only information was introduced.

Two byte-identical JPEG source copies were added. All eleven source copies still match their public originals by SHA-256. Nine selected sources produce 36 WebP derivatives, with eight architectural image elements per page. Existing widths, quality, dimensions, priority and native lazy loading are retained.

## Brand integration

The supplied light/dark logo PNGs were already integrated in Phase 3D. They were retained and verified on both language routes, in both themes, on mobile/desktop and in the no-JavaScript dark fallback. The proportional SVG viewport, light-background integration and accessible full brand name are unchanged. No temporary replacement wordmark, new logo artwork, palette change or header-height expansion was introduced.

## Files changed in this phase

- `src/styles/home.css` - scoped typography/spacing, panel layout and CSS interactions
- `src/lib/motion/home-animations.ts` - chapter-specific treatments; existing loader remains unchanged
- `src/components/home/ApartmentTypes.astro` - image-led native-link panels
- `src/components/home/HomePage.astro` - pass locale to ApartmentTypes
- `src/i18n/home.ts` - typed and localized general-imagery note only
- `src/assets/home/renders.ts` - two real render mappings and localized alt text
- `src/assets/home/eden-residence-pedestrian-access.jpeg` - exact source copy
- `src/assets/home/eden-residence-private-garden-terrace.jpeg` - exact source copy
- `scripts/capture-homepage.mjs` - wait for clip-path completion and park pointer outside hover panels
- `README.md`, `docs/HOMEPAGE.md`, `docs/DESIGN_SYSTEM.md`, `docs/ARCHITECTURE.md`, `docs/IMPLEMENTATION_PLAN.md`
- This report and `docs/previews/phase-3d1/`

Existing uncommitted work was preserved. Header, Footer, shared primitives, global tokens, dependency manifests, configuration, CMS boundary and original render/logo files were not edited in this phase.

## Actual verification

- `npm.cmd run check`: 38 files; 0 errors, warnings or hints.
- `npm.cmd run build`: passed; RO/EN static routes and 36 optimized image variants.
- Chrome production matrix: RO/EN x light/dark x 320/375/768/1024/1440px (20 combinations). No horizontal overflow, including expanded mobile navigation; header targets remained at least 44px. Each route retains one H1, working anchors, correct themes and eight decoded image URLs returning HTTP 200. Sampled settled text contrast remains at least 5.02:1.
- Desktop card tests in both languages/themes: active image zoom, neighbor desaturation, crisp/unfaded body text, one link per panel, unchanged panel geometry/page height, keyboard-equivalent emphasis, visible focus and Enter navigation passed. Mobile touch activated the whole panel directly with hover/fine-pointer media disabled. Reduced motion kept hovered imagery static.
- Desktop/mobile scroll sampling observed all eight treatments. Image/ancestor opacity stayed 1 throughout; animated text never fell below 0.85. Target layout offsets and heights changed by 0px. No motion style remained after completion.
- Full captures verified eight decoded images, visible ancestors/hit points, no normal network/runtime failures and at most 0.063px image-box variation through loading/scrolling. Captures observe completion, without forcing content visible or disabling the animations.
- Existing keyboard Enter/Space/Tab, Escape/focus return, collapsed navigation tab order, touch menu, RO-to-EN-to-RO switching, manual persistence and OS/manual precedence passed. All homepage fragment links were activated in both languages.
- Reduced-motion initial visit skipped the GSAP runtime download. Live preference changes reverted active styles including clip-path, with no menu entrance. A deliberately blocked motion chunk left static content and working menu/theme controls; its expected failure warning was confined to that test.
- No-JavaScript mobile EN/dark mode retained visible content/navigation, correct logo and no overflow. Pagehide disposal and pageshow remount passed. No uncaught runtime exception in normal or fallback tests.
- Source-image SHA-256 equality and `git diff --check` passed. No dependency change occurred.

## Screenshots and evidence

Production captures were reviewed for image visibility, section rhythm, mobile composition, panel reading order and credits:

- [Desktop light](previews/phase-3d1/desktop-light.jpg)
- [Desktop dark](previews/phase-3d1/desktop-dark.jpg)
- [Mobile light](previews/phase-3d1/mobile-light.jpg)
- [Mobile dark](previews/phase-3d1/mobile-dark.jpg)
- [Apartment section, active left panel, light](previews/phase-3d1/apartments-desktop-hover.jpg)
- [Apartment section, active left panel, dark](previews/phase-3d1/apartments-desktop-hover-dark.jpg)
- [Stacked apartment panels, mobile](previews/phase-3d1/apartments-mobile.jpg)

Initial and settled hero captures are in the same folder. JSON evidence includes responsive, apartment-interaction, motion and fallback reports, plus matched before/after layout measurements. The short motion and hover behavior are described above because still images cannot demonstrate pacing.

Local review: <http://localhost:4321/> and <http://localhost:4321/en/>. The existing dev server is retained; owned production-preview, media-reference server and isolated browser are stopped after verification.

## Limitations and review

This remains a visual proposal requiring owner review, including card imagery/cropping, hover strength, spacing and motion pacing. The selected images are explicitly general development imagery. Contact processing, approved apartment data and future category pages remain pending.

Live benchmark interaction inspection was blocked by HTTP 403; the supplied reference and requested behavior guided the adaptation. Safari, Firefox, physical-device and screen-reader testing were unavailable. Local measurements are not formal accessibility, frame-rate or Core Web Vitals certification. The exact cause of every blank frame in the reference recording was not proven; the new implementation removes photo opacity animation and passed continuous opacity checks.

Stop after Phase 3D.1 for review. No WordPress, deployment or commit action was taken.
