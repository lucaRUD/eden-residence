# Incremental implementation plan

## Milestone 1 — approved local initialization

Scope: minimal Astro project, strict TypeScript, Tailwind CSS v4 using `@tailwindcss/vite`, npm lockfile, Git, permanent rules, documentation, reserved CMS boundary, provisional tokens, locally bundled Quicksand, and Romanian/English placeholders.

Verification: execute `npm.cmd run check`, `npm.cmd run build`, inspect generated locale pages and compiled Tailwind utilities, and serve representative pages locally. Record actual outcomes below. Do not infer a browser visual or accessibility audit from successful HTTP responses.

Exit: report files, dependency versions, command results, launch instructions, and open issues. Stop and wait for further instructions. No subsequent milestone is authorized by completing this one.

## Milestone 2 — content and design decisions, after approval

- Receive the concept board, logo, architectural renders, verified apartment data/floor plans, company/contact details, and approved copy.
- Confirm page priorities, localized slugs, missing-translation behavior, apartment type versus individual unit model, and content ownership.
- Establish the final digital palette and design tokens; review typography, mobile composition, and accessibility.
- Review inspiration only for general direction; create an original design.

Exit: owner-approved content inventory, route map, content model, and visual direction before building final page layouts.

## Milestone 3 — approved local frontend implementation

Build reusable layout/UI elements and approved page sections incrementally: home/project, apartments/details, passive-building/benefits, then contact/supporting pages. Use supplied data or explicitly labeled local fixtures as agreed; never fabricate public claims. Add accessible galleries, PDF links, and inquiry modal behavior only as required. Keep legal content owner-supplied and review translations.

Exit: reviewed Romanian/English pages with semantic HTML, responsive behavior, keyboard/focus checks, reduced motion, accurate content, and passing checks/builds. Decide whether animations/3D justify additional libraries separately.

## Milestone 4 — approved CMS implementation in a safe environment

Choose multilingual and editorial field tooling; define core-page/custom-post-type schemas and REST exposure in a local or staging WordPress environment. Introduce a typed build-time client under `src/lib/wordpress/`, with response validation, pagination, media normalization, locale mapping, and reliable build failures. Integrate content incrementally. Agree on authenticated draft previews if required. Do not install or alter production plugins without explicit approval.

Exit: editors can maintain agreed content; published builds generate correct localized pages with no leaked drafts/secrets; error and missing-translation paths are verified.

## Milestone 5 — approved forms and content publication workflow

Select a secure server-side form solution compatible with final hosting, confirm privacy/retention requirements, add validation/abuse handling and accessible feedback, then test success/failure paths. Plan a protected CMS publish-event rebuild trigger, manual fallback, failure visibility, and retention of the last good deployment.

Exit: end-to-end form delivery and CMS rebuild behavior verified in a safe environment; no personal data or credentials in static output.

## Milestone 6 — approved hosting and launch

Confirm Host.Age static serving/document roots, SSL, rollback, backups, CMS placement, and whether a separate `cms.edenresidence.ro` migration is needed. Prepare a reviewed deployment plan before changing production. Finish metadata/canonical/hreflang/sitemap setup, remove placeholder noindex only when launch-ready, verify approved company/legal information, and review any cookies/analytics choices.

Exit: approved launch plus browser/mobile/accessibility/performance checks, working forms, editor workflow, backup/rollback instructions, and successful production verification.

## Open decisions that do not block initialization

- Architectural imagery, logo, concept board, final colors, and final design.
- Actual project specifications, apartment type/unit inventory, price/availability policy, PDFs, approved company/contact/legal content.
- WordPress multilingual solution, field UI, SEO tooling, and draft preview needs.
- Final Host.Age hosting arrangement, CMS subdomain decision, secure form processor, and rebuild runner.
- Cookie/analytics choices and owner-approved legal/privacy wording.

## Phase 1 verification record

Completed locally on 2026-10-15 using system Node 22.18.0 / npm 10.9.3:

| Verification | Executed result |
| --- | --- |
| `npm.cmd run check` | Passed: 8 files, 0 errors, 0 warnings, 0 hints |
| `npm.cmd run build` | Passed: static output with 2 pages (`/`, `/en/`) |
| `npm.cmd run dev -- --host 127.0.0.1 --port 4321` | Started successfully; both locale routes returned HTTP 200; UTF-8 headings and HTML language verified |
| Compiled CSS inspection | Confirmed brand background/text utilities, named content width, responsive heading utility, font-display swap, and Latin Extended font reference |
| Generated HTML inspection | Confirmed localized headings/language and placeholder noindex metadata |
| `npm.cmd run preview -- --host 127.0.0.1 --port 4321` | Started successfully; both pages, linked CSS, and bundled font license returned HTTP 200 |
| Git / ignore configuration | Initialized branch `main`; verified generated output, dependencies, and real environment files are ignored while `.env.example` is included; no remote or commit created |

The final direct dependency versions are Astro 7.3.8, Tailwind CSS 4.3.3, `@tailwindcss/vite` 4.3.3, `@astrojs/check` 0.9.10, TypeScript 6.0.3, and `@fontsource-variable/quicksand` 5.3.0. Exact resolved dependencies are recorded in `package-lock.json`.

### Compatibility warning and verification limits

- Installation warned that indirect dependency `undici@8.12.1`, used by Astro through `unifont`, requires Node >=22.19.0. The machine has 22.18.0. Although the checks, build, and local servers succeeded, dependency support on this older runtime is not established. The project declares Node >=22.19.0; use a supported even-numbered release for future development/CI. System Node was not modified; no dependency override or version downgrade was applied.
- The sandbox initially prevented Astro from writing its user configuration under AppData. Checks/builds/servers were rerun successfully with the native permission approval. The initial sandboxed npm initialization stalled; the approved network-enabled retry completed.
- HTTP verification decoded response bytes explicitly as UTF-8; Windows PowerShell's default decoding for a response without an HTTP charset initially misread Romanian text. Generated HTML declares UTF-8, and the corrected checks passed.
- No browser visual, screen-reader, or full accessibility audit was available or performed. HTTP/CSS verification does not replace those checks. No automated unit-test suite was added for this minimal scaffold.
- The inspiration site could not be retrieved. It does not block local initialization or authorize a design implementation.
- Verification servers were stopped after use. Production WordPress, its database, hosting, and cPanel were not modified; the application contains no CMS integration or live CMS request.

Phase 1 stops here. Await the owner's next instructions before final design or CMS integration.

## Phase 3A — authorized homepage implementation

The owner subsequently authorized Phases 2, 2.1, 2.2 and 3A. The historical milestones above are retained as planning context. The current bilingual homepage now uses the existing shared design system, branded themes and supplied architectural renders. No other production page, CMS connection, form processing, dependency or deployment was introduced.

Verification on 2026-10-15: Astro check passed over 35 files with no errors, warnings or hints; production build passed with two HTML pages and 20 responsive WebP derivatives. Chrome checked both languages/themes at 320/375/768/1024/1440px, keyboard/touch navigation, theme persistence, all homepage anchors, image loading, semantic smoke checks and reduced motion. Sampled text contrast was at least 5.02:1. The design-system route returns 200 in development and 404 in production preview. See [the complete Phase 3A review record](HOMEPAGE.md) for files, assets, screenshots, actual checks and limitations.

Phase 3A stops at owner review. Factual apartment data, approved contact details, publication assets, final copy approval and technical substantiation remain pending; subsequent pages, CMS work and launch require a later task.
