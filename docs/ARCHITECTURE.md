# Architecture — implemented foundation and future plan

## Implemented foundation and current homepage

Astro emits static HTML/CSS into `dist/`. No server adapter, database, CMS client, API endpoint, form processing, hosting connector, or deployment configuration is installed. Local builds do not read `WORDPRESS_URL` or contact WordPress.

`astro.config.mjs` sets static output, trailing slashes, Romanian as the default locale, English as the secondary locale, and the official Tailwind Vite plugin. `tsconfig.json` extends `astro/tsconfigs/strict`. The separate `check` script uses `@astrojs/check`; `astro build` alone does not type-check.

`BaseLayout.astro` owns the HTML language, metadata, global CSS, locally bundled font, and skip link. `HomePage.astro` composes six presentation chapters for `src/pages/index.astro` and `src/pages/en/index.astro`: Hero, PassiveConcept, ProjectIntro, ApartmentTypes, GreenLiving and ContactCTA. ContactCTA also includes the existing honest contact-status region. The removed Vision section's reusable draft copy is archived in `docs/CONTENT_ARCHIVE.md`. `LanguageSwitcher.astro` links the two existing home routes; future page-level language switching must use translated page identities, not always return users to the homepage.

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

`RenderImage.astro` uses Astro `Image`/`getImage` to generate four responsive WebP widths per selected source, with dimensions and localized alt text. The hero is eager/high priority; other views use native lazy loading. Native `picture`/`source` selects the mobile hero below md. Nine selected sources generate 36 variants; eight image elements appear per page.

Originals live in `public/renders/`; exact optimization source copies and mappings live in `src/assets/home/`. Preserve originals, unused source copies and image watermarks. Astro also copies public originals into `dist/`; publication asset policy remains a separate decision. No generated review screenshot is a site asset.

Only `/` and `/en/` are production routes. The `src/dev/` integration registers `/design-system/` only during development. Homepage content is local and typed; apartment IDs are categories, not inventory. Links target existing homepage sections until real dedicated pages exist. The contact region explicitly explains that inquiries are not collected or sent. The national-first passive-building claim and its supporting copy remain client-supplied, provisional and unverified.

## Homepage motion

`HomePage.astro` imports `src/lib/motion/home.ts`, which dynamically loads `home-animations.ts` and GSAP/ScrollTrigger only when motion is allowed. Generation checks guard asynchronous imports; one mounted root prevents duplicate initialization. A WeakMap retains visited elements across disposal/remount of the same document. AbortController, GSAP context reversion and canceled refresh frames clean up on Astro swaps, pagehide and preference changes; pageshow remounts safely. Navigation uses regular static pages, not Astro ClientRouter.

Five chapter ScrollTriggers serve the existing passive, project, garden and closing treatments. Hero text has a short coordinated introduction. All explanations and photography start visible and remain opaque; there is no baseline hiding, pinning, parallax, smooth-scroll replacement or framework hydration. Reduced motion skips the runtime, and import failures leave the static presentation intact. Fonts, images and navigation layout changes request coalesced refreshes.

`EdenJourney.astro` adds an inert, assistive-technology-hidden SVG. `src/lib/motion/eden-journey.ts` integrates through the same homepage lifecycle and adds one scrubbed ScrollTrigger between the passive, apartment and garden eyebrow anchors. Geometry comes from live section/content bounds; desktop changes sides only through measured empty heading padding, tablet stays in the left gutter and mobile uses a straight margin path. One route is clipped into section-colored layers, preserving the existing semantic accent roles. Scroll-to-distance checkpoints keep milestones aligned with their chapters. ResizeObserver and ScrollTrigger refreshes recalculate layout; theme events update colors. The absolute layer adds no page height and hides if gutters are too narrow. Disposal removes observers, listeners, generated layers and the trigger. Reduced motion, no JavaScript or a failed runtime leave the decorative layer hidden and content intact.

Apartment hover/focus styling affects imagery only, never panel geometry, and requires no JavaScript. The Header's native menu entrance and shared theme controller are independent of GSAP; a failed motion chunk cannot disable navigation or theme selection. Current composition and semantic conventions live in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
