# Implementation plan

## Current state

The Astro/TypeScript/Tailwind foundation, reusable design system, branded light/dark themes, RO/EN homepages, supplied logos/renders and progressive GSAP motion are implemented for review. The homepage, interior gallery and dedicated RO/EN passive-building pages are available. A static Vercel review deployment through a private GitHub repository is prepared; the owner must commit, push and deploy manually using the README steps. WordPress, inquiry processing and the final domain launch remain unimplemented.

`/design-system/` remains useful in development and excluded from production. Existing local-review pages retain `noindex, nofollow`. Visual approval, final copy and factual substantiation remain pending. See [Architecture](ARCHITECTURE.md), [Design system](DESIGN_SYSTEM.md) and [Project brief](PROJECT_BRIEF.md) for maintained context.

## Next frontend and content work

- Review the current design and approve the provisional digital palette and bilingual copy.
- Verify the client-supplied national-first passive-building claim, exact category and supporting wording before public launch.
- Obtain approved building specifications, apartment type/unit data, plans, PDFs, availability policy, contact/company details and legal content.
- Confirm page priorities, localized slugs, missing-translation behavior, content ownership and apartment type versus individual-unit modeling.
- Build further approved pages incrementally, preserving localization, themes, keyboard navigation and reduced motion. Do not fabricate project facts or imply working inquiry functionality.

Completion of one task does not authorize the next milestone.

## CMS integration — after approval

Choose multilingual and editorial field tooling; define core-page/custom-post-type schemas and REST exposure in a local or staging WordPress environment. Add a typed build-time client under `src/lib/wordpress/` with response validation, pagination, media normalization, locale mapping and reliable failure handling. Integrate approved content incrementally and agree on authenticated draft previews if required. Do not alter production plugins without approval.

Exit: editors can maintain agreed content; localized builds contain no leaked drafts/secrets; error and missing-translation behavior is verified. Detailed data and content-model plans remain in [Architecture](ARCHITECTURE.md).

## Forms and publication workflow — after approval

Select a secure server-side form solution compatible with final hosting. Confirm privacy/retention requirements, validation, abuse handling and accessible feedback, then test success/failure paths. Plan a protected CMS publish-event rebuild trigger, manual fallback, failure visibility and retention of the last good deployment.

Exit: form delivery and CMS rebuild behavior work in a safe environment; personal data and credentials stay out of static output.

## Hosting and launch — after approval

Confirm Host.Age static serving/document roots, SSL, backups, rollback, CMS placement and whether a separately approved CMS-subdomain migration is needed. Review the deployment plan before changing production. Complete canonical/hreflang/sitemap metadata, approved company/legal content and cookie/analytics decisions. Remove local-review noindex only when launch-ready.

Exit: approved deployment with broader browser, physical-device, accessibility, performance, content, form and editor-workflow verification.

## Routine development

Follow [AGENTS.md](../AGENTS.md): inspect relevant files, make focused changes, run checks/builds after meaningful implementation work and target browser testing to changed interactions. Update essential docs when needed. Do not create routine phase reports, recordings or screenshot collections; requested diagnostic artifacts belong outside the repository.
