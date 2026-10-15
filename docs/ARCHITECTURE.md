# Architecture — implemented foundation and future plan

## Implemented in Phase 1

Astro emits static HTML/CSS into `dist/`. No server adapter, database, CMS client, API endpoint, form processing, hosting connector, or deployment configuration is installed. Local builds do not read `WORDPRESS_URL` or contact WordPress.

`astro.config.mjs` sets static output, trailing slashes, Romanian as the default locale, English as the secondary locale, and the official Tailwind Vite plugin. `tsconfig.json` extends `astro/tsconfigs/strict`. The separate `check` script uses `@astrojs/check`; `astro build` alone does not type-check.

`BaseLayout.astro` owns the HTML language, metadata, global CSS, locally bundled font, and skip link. `PlaceholderHome.astro` shares the small temporary page between `src/pages/index.astro` and `src/pages/en/index.astro`. `LanguageSwitcher.astro` links these two existing home routes; future page-level language switching must use translated page identities, not always return users to the homepage.

`src/i18n/ui.ts` provides typed UI strings and home paths. Empty component/asset directories are retained with `.gitkeep`. `src/lib/wordpress/` is a documented boundary with no executable integration.

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

These are planning examples, not generated routes or approved editorial slugs. Romanian lives at the root; English uses `/en/`. Use stable page identities to map translated slugs, and keep UI translations separate from CMS copy. Both placeholder home routes exist now; every other route below is future work.

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

Select a WordPress multilingual approach before CMS integration. Core REST alone does not define translated-record relationships or language filters. Verify the selected solution's REST support; do not assume a `lang` query works. Avoid silently generating untranslated English pages. Later generate canonical URLs, reciprocal `hreflang`, `x-default`, sitemap entries, and missing-translation behavior from validated records. The local placeholder is intentionally `noindex, nofollow` and has no production canonical or sitemap.

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

The static frontend will require an approved server endpoint or form service. Server-side validation, request-size limits, spam/rate controls, safe mail handling, secret storage, failure/retry feedback, and approved privacy/retention terms belong there. Do not send email credentials to the browser or store personal inquiries in the public WordPress API. A modal must handle accessible naming, focus entry/return, keyboard dismissal, and background focus correctly. No form or modal is implemented in Phase 1.

## Performance and accessibility boundaries

Prefer generated HTML and minimal vanilla scripts, responsive optimized images with dimensions/alt text, and lazy loading below the fold. Review future media hosting and image optimization separately. Fontsource bundles Quicksand assets locally, including Latin Extended for Romanian diacritics, with font-display swap. No external font service is requested by the page.

Future animation modules should be page-scoped, progressively enhanced, and respect reduced motion; future 3D should load only when needed with a static alternative. Neither GSAP nor Three.js is installed. Full keyboard, responsive, contrast, and screen-reader review belongs to the actual design phase; initialization checks do not establish accessibility compliance.

## References

- [Astro WordPress guide](https://docs.astro.build/en/guides/cms/wordpress/)
- [Astro i18n routing](https://docs.astro.build/en/guides/internationalization/)
- [Custom content types in REST](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-rest-api-support-for-custom-content-types/)
- [REST fields and registered meta](https://developer.wordpress.org/rest-api/extending-the-rest-api/modifying-responses/)
