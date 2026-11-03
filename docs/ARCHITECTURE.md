# Architecture — implemented foundation and future plan

## Implemented foundation and current homepage

Astro emits static HTML/CSS into `dist/`. No server adapter, database, CMS client, API endpoint, form processing, hosting connector, or deployment configuration is installed. Local builds do not read `WORDPRESS_URL` or contact WordPress.

`astro.config.mjs` sets static output, trailing slashes, Romanian as the default locale, English as the secondary locale, and the official Tailwind Vite plugin. `tsconfig.json` extends `astro/tsconfigs/strict`. The separate `check` script uses `@astrojs/check`; `astro build` alone does not type-check.

`BaseLayout.astro` owns the HTML language, metadata, global CSS, locally bundled font, and skip link. `HomePage.astro` composes ArchitecturalHero, EditorialIntroduction, PassiveConcept, ProjectIntro, ApartmentTypes, GreenLiving and ContactCTA for `src/pages/index.astro` and `src/pages/en/index.astro`, with the shared floating navigation, one CanvasCursor and the existing footer. ContactCTA retains its honest contact-status region. The removed Vision section's reusable draft copy is archived in `docs/CONTENT_ARCHIVE.md`. `LanguageSwitcher.astro` accepts translated page identities; the passive-building story switches between its own RO/EN routes rather than returning to the homepage.

`src/i18n/ui.ts` provides shared control strings and home paths; `src/i18n/home.ts` owns typed bilingual homepage copy and anchor navigation. The passive claim, supporting wording, visible qualification and informational CTA live there together; both claim translations carry `TODO: Client verification before public launch`. Its CTA targets existing principles until a dedicated page is approved. `src/assets/home/renders.ts` maps render metadata and localized alt text. `src/components/home/` owns presentation. The homepage-only motion loader progressively imports GSAP/ScrollTrigger and reverts effects for reduced motion or disposal. No CMS abstraction is connected; `src/lib/wordpress/` remains an unimplemented boundary.

## Future data flow — not implemented

```text
Editor -> WordPress (content + media + translations)
                     |
             REST API at build time
                     |
            src/lib/wordpress/
       validate and normalize published content
                     |
          Astro routes and components
                     |
             static dist/ output
                     |
          approved future hosting workflow
```

WordPress owns its PHP runtime and MySQL/MariaDB database. Astro needs only HTTP REST access and must not use database credentials. Published public content normally needs no authentication. Future preview/draft access must remain server-side and separate from published static output.

## Proposed localized route map

These are planning examples, not generated routes or approved editorial slugs. Romanian lives at the root; English uses `/en/`. Use stable page identities to map translated slugs, and keep UI translations separate from CMS copy. Both home routes exist now; every other route below is future work.

| Page identity | Romanian | English |
| --- | --- | --- |
| Home | `/` | `/en/` |
| Project | `/despre-proiect/` | `/en/about-the-project/` |
| Apartments | `/apartamente/` | `/en/apartments/` |
| Apartment detail | `/apartamente/[slug]/` | `/en/apartments/[slug]/` |
| Passive building | `/cladire-pasiva/` | `/en/passive-building/` |
| Benefits | `/beneficii/` | `/en/benefits/` |
| Contact | `/contact/` | `/en/contact/` |
| FAQ | `/intrebari-frecvente/` | `/en/faq/` |
| Partners | `/parteneri/` | `/en/partners/` |
| Terms | `/termeni-si-conditii/` | `/en/terms-and-conditions/` |
| Privacy | `/confidentialitate/` | `/en/privacy-policy/` |
| Cookies | `/politica-cookies/` | `/en/cookie-policy/` |

Select a WordPress multilingual approach before CMS integration. Core REST alone does not define translated-record relationships or language filters. Verify the selected solution's REST support; do not assume a `lang` query works. Avoid silently generating untranslated English pages. Later generate canonical URLs, reciprocal `hreflang`, `x-default`, sitemap entries, and missing-translation behavior from validated records. The local review homepage is intentionally `noindex, nofollow` and has no production canonical or sitemap.

## Proposed WordPress content model

All schema and plugin work is deferred. Prefer core posts/pages/media and native REST-supported custom fields. Keep domain schema in a small site-specific plugin independent of the WordPress theme. Choose the editorial field UI later; no field or multilingual plugin is selected or installed.

| Content | Proposed storage | Candidate fields / relationships |
| --- | --- | --- |
| Presentation and legal pages | Core pages | Stable page identity, locale/translation relationship, title, intro, approved section text, hero media ID, SEO fields |
| Apartments | `apartment` custom post type | Apartment type/unit identity (to be decided), room category, verified areas and units, specifications, optional verified availability/price, gallery media IDs, PDF attachment IDs, locale, SEO |
| Benefits | `benefit` custom post type | Title, body, display order, optional icon/media, page relationships, locale |
| FAQs | `faq` custom post type | Question, answer, order, applicable page/apartment, locale |
| Partners | `partner` custom post type | Approved name, logo attachment ID/alt text, external URL, order, locale where relevant |
| Contact / company information | A dedicated core page with structured fields initially | Approved company name/IDs, address, phone, email, coordinates, hours, translated labels |
| Renders, galleries, floor plans | Core media attachments | Image alt text, dimensions, captions, gallery order via parent fields, PDF file metadata |
| SEO | REST-exposed fields on relevant records | Approved title, description, social image, indexing preference; select compatible SEO tooling later |

Distinguish apartment floor-plan types from individual sale units before freezing the schema. Do not treat two-room/three-room headings as evidence of actual inventory. Reuse media by ID and keep shared facts consistent across translations.

Expose custom post types/taxonomies with `show_in_rest: true`; use `register_post_meta` with explicit schemas, sanitization, and appropriate permissions. Custom types need `custom-fields` support for REST meta. Arrays/objects need a declared schema. Keep private administrative fields out of public responses. Custom endpoints are justified only after demonstrating native REST cannot satisfy a requirement.

The future client should handle pagination, response status, timeouts, validated shapes, missing media and translations, and normalization into frontend types. Failed required content must fail a build rather than publish invented defaults. Render untrusted rich HTML only through a reviewed sanitization/allowlist strategy. Keep credentials out of browser bundles and logs.

## Publishing and rebuilds — future

SSG publishes a snapshot: editing WordPress does not update the static frontend until a successful rebuild is published. After hosting and CMS changes are approved, plan an authenticated publish/update/delete event hook to a protected CI/build endpoint, debounced to avoid duplicate builds. Keep the trigger secret server-side, validate its signature, restrict who can trigger builds, and rebuild only on relevant published changes. Draft edits should not publish content. Provide a manual rebuild fallback, visible failures, and retain the last known good deployment after a failed build.

For Host.Age/cPanel, confirm static hosting/document-root behavior and a safe WordPress separation strategy before any rollout. Do not upload `dist/` over the current WordPress installation. A move to `cms.edenresidence.ro` would be a separate backed-up, approved migration with media URL, redirect, SSL, and access testing. No migration or build hook is configured now.

## Contact forms and inquiry modal — future

The static frontend will require an approved server endpoint or form service. Server-side validation, request-size limits, spam/rate controls, safe mail handling, secret storage, failure/retry feedback, and approved privacy/retention terms belong there. Do not send email credentials to the browser or store personal inquiries in the public WordPress API. A modal must handle accessible naming, focus entry/return, keyboard dismissal, and background focus correctly. No form or inquiry modal is implemented.

## Performance and accessibility boundaries

Prefer generated HTML and minimal vanilla scripts, responsive optimized images with dimensions/alt text, and lazy loading below the fold. Review future media hosting and image optimization separately. Fontsource bundles Quicksand assets locally, including Latin Extended for Romanian diacritics, with font-display swap. No external font service is requested by the page.

Homepage animation uses page-scoped, progressively enhanced GSAP/ScrollTrigger with a static baseline and reduced-motion handling. Three.js is not installed; any future 3D must load only when needed with a static alternative. Full keyboard, responsive, contrast, and screen-reader review belongs to the actual design phase; initialization checks do not establish accessibility compliance.

## References

- [Astro WordPress guide](https://docs.astro.build/en/guides/cms/wordpress/)
- [Astro i18n routing](https://docs.astro.build/en/guides/internationalization/)
- [Custom content types in REST](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-rest-api-support-for-custom-content-types/)
- [REST fields and registered meta](https://developer.wordpress.org/rest-api/extending-the-rest-api/modifying-responses/)

## Image and content boundaries

`RenderImage.astro` uses Astro `Image`/`getImage` for responsive WebP widths, dimensions and localized alt text in legacy compositions; the homepage's eight section photographs use matching optimization in `ScrollDepthImage.astro`. These images use native lazy loading. `src/assets/home/architectural-scene.ts` separately centralizes the temporary hero photograph, matching alpha mask, canvas validation, localized alt text and normalized framing coordinates. The image pair lives under `src/assets/home/architectural/`; both photographic layers use the same source and transform, with alpha applied only to the front layer. Replacing the pair and registration values requires no timeline changes. The native-resolution hero loads eagerly without a low-resolution preview or image regeneration.

Originals live in `public/renders/`; exact optimization source copies and mappings live in `src/assets/home/`. Preserve originals, unused source copies and image watermarks. Astro also copies public originals into `dist/`; publication asset policy remains a separate decision. No generated review screenshot is a site asset.

Production routes are `/`, `/en/`, `/bloc-pasiv/` and `/en/passive-building/`. The development integration retains `/design-system/`, `/dev/cinematic-hero/`, `/dev/cinematic-car/` and `/dev/architectural-story/`. The architectural and navigation previews now consume shared production components through small compatibility wrappers; the homepage does not import prototype implementations. The separate video and car timelines remain isolated. Homepage content is local and typed; apartment IDs are categories, not inventory. The homepage navigation includes the localized passive-building route; the story's apartment CTA points to the existing localized apartment section. The contact region explicitly explains that inquiries are not collected or sent. The national-first passive-building claim and its supporting copy remain client-supplied, provisional and unverified.

## Passive-building story

`PassiveBuildingPage.astro` serves `/bloc-pasiv/` and `/en/passive-building/` with five connected chapters: editorial introduction, Passive House principles, conceptual ventilation, seasonal comfort, and technical partners with an apartment CTA. Typed bilingual copy lives in `src/i18n/passive-building.ts`; `src/assets/passive-building.ts` selects existing Eden renders. No homepage, hero, cursor, navigation design or Eden Journey behavior is changed.

`src/content/passive-building-sources.ts` is the internal evidence/pending-confirmation file. PHI/Passipedia support general principles; indexed Alpha Home communications support the attributed Sistema, underfloor-cooling and Ortosil mentions. Alpha Home's website was unavailable at review. Certification, national-first positioning, equipment/models, performance figures and the final installation design are not asserted. Only original project images and original SVG artwork are rendered; third-party materials are linked.

Reusable `passive/ChapterHeading.astro`, `PrincipleList.astro`, `SeasonPanel.astro` and `VentilationDiagram.astro` compose the story. The SVG diagram has uniquely prefixed IDs, four labeled directed air routes and separate winter heat-transfer arrows. It is explicitly conceptual. `passive-building.ts` reuses Lenis and image parallax and scrubs fresh-air, outgoing-air and heat-exchange stages reversibly with no GSAP pinning. Desktop uses a CSS-sticky figure; small/short viewports use a compact scroll interval. Width changes rebuild the visible diagram geometry. Reduced motion, no JavaScript or initialization failure show the complete readable diagram and static images. Page teardown removes media contexts, triggers, observers, listeners and the shared ticker callback.

## Homepage motion

`HomePage.astro` imports `src/lib/motion/home.ts`, which dynamically loads the decorative chapter and journey animations when motion is allowed. Generation checks guard asynchronous imports; one mounted root prevents duplicate initialization. A WeakMap retains visited elements across disposal/remount of the same document. AbortController, GSAP context reversion and canceled refresh frames clean up on Astro swaps, noncached pagehide and preference changes; pageshow remounts safely. Navigation uses regular static pages, not Astro ClientRouter.

`ArchitecturalHero.astro` and `src/lib/motion/architectural-hero.ts` share the approved sky descent and title-behind-building composition with the architectural preview. One camera offset moves all registered layers; a separate coalesced scroll offset moves the same world. The camera waits for decoded photography and mask, reveals letters once, and completes safely on early scroll, focus, resize or reduced motion. A bounded inline bootstrap provides the initial sky crop while no JavaScript uses the final CSS composition. Responsive framing reserves clearance below the compact navbar. There is no hero pin or wheel interception. The old image-discovery controller remains available in its module but is no longer mounted on the homepage.

The homepage photo dissolves into a cream edge while its type exits; `editorial-introduction.ts` scrubs masked statement lines and a restrained image crop into the cream introduction. Reverse scrolling restores the composition. Anchor/keyboard arrivals complete the statement, and already-visible/mobile content keeps its static baseline. Existing passive, project, garden and closing treatments remain mounted. Reduced motion skips decorative chapter motion; import failures leave readable HTML. Fonts, images and navigation changes request coalesced ScrollTrigger refreshes before Eden Journey remeasures its milestones.

`ScrollDepthImage.astro` opts all eight homepage section photographs (introduction, passive building, project, both apartment categories, both gardens and closing) into `scroll-depth-images.ts`, mounted through the same homepage lifecycle. It accepts image metadata/alt text, aspect ratio, radius and parallax intensity, retaining responsive WebP generation and lazy loading. The rectangular frame stays still; the existing chapter clip keeps its reveal, and a separate inner layer translates without rotation or animated scaling. Desktop content is 130% of frame height with up to 140px total travel (before per-image intensity), measured to retain two pixels of edge coverage. Tablet uses 125%/90px; mobile uses 112%/36px, reducing travel for shallow frames. Linear `scrub: true` timelines are neutral at viewport center, reverse directly, and add no pins or idle animation. Apartment hover stays on the image itself. Reduced motion, no JavaScript and teardown restore static accessible images.

`smooth-scroll.ts` adds one homepage-only Lenis instance through that lifecycle, driven by GSAP's ticker in milliseconds with `autoRaf: false`, configurable wheel easing and native touch. Lenis updates ScrollTrigger directly; image scrub adds no second smoothing delay. The official Lenis CSS is bundled locally. A small anchor adapter preserves URL history, existing scroll margins and keyboard focus, deferring menu links until the existing overflow lock releases. Nested menus, dialogs and `data-scroll-native` regions scroll natively. Keyboard/history navigation interrupts stale inertia. Hidden pages pause the ticker; reduced motion and teardown destroy the instance, listeners and observer. Experimental routes do not mount it.

`EdenJourney.astro` adds an inert, assistive-technology-hidden SVG. `src/lib/motion/eden-journey.ts` integrates through the same homepage lifecycle and adds one scrubbed ScrollTrigger between the passive, apartment and garden eyebrow anchors. Geometry comes from live section/content bounds; desktop changes sides only through measured empty heading padding, tablet stays in the left gutter and mobile uses a straight margin path. One route is clipped into section-colored layers, preserving the existing semantic accent roles. Scroll-to-distance checkpoints keep milestones aligned with their chapters. ResizeObserver and ScrollTrigger refreshes recalculate layout; theme events update colors. The absolute layer adds no page height and hides if gutters are too narrow. Disposal removes observers, listeners, generated layers and the trigger. Reduced motion, no JavaScript or a failed runtime leave the decorative layer hidden and content intact.

`FloatingNavigation.astro`, `floating-navigation.ts` and its stylesheet retain the approved 512×46px bar, logo and reversible menu, including focus trapping, Escape and anchor links. Theme and language controls are shared. `CanvasCursor.astro` mounts one existing spring-strand Canvas 2D runtime per page; it switches to a small grey native SVG circle only after a successful canvas frame, anchors each trail at the exact cursor hotspot, measures the actual CSS canvas bounds (including scrollbar changes) and uses the matching raster scale at each device pixel ratio. It avoids event interception and pauses after inactivity. Text controls, dragging, keyboard input, touch, reduced motion, context failure and teardown restore the normal browser cursor. Ten strands use independently damped implicit springs and a speed-dependent 100?560px target length. Length changes spring response instead of clipping node positions; there is no timed pull-in. The single RAF paints every display frame, subdividing elapsed time into steps no greater than 1/240s and interpolating pointer input across those steps. The ribbons settle naturally and fade within 450ms, then stop rendering. Its custom element disposes on teardown. Apartment hover/focus styling affects imagery only and requires no JavaScript. Current composition and semantic conventions live in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
