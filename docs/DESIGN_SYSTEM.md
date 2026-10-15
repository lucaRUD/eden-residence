# Design system — provisional foundation

## Approved brand inputs

Brand: Eden Residence. Primary font: Quicksand. Desired direction: modern, elegant, natural, minimal, premium architectural presentation, generous space, large renders, subtle interactions, and an excellent mobile experience.

The concept board, actual architectural imagery, approved logo, and final digital palette are pending. The Phase 1 placeholder is a setup scaffold, not the proposed final design.

## Color references and temporary tokens

The following RAL references come from the project brief. The HEX values are deliberately temporary working approximations, not official RAL conversions or approved brand colors. Metallic/pearlescent material appearance cannot be defined by a single screen color. Final values must be agreed with the owner using the concept board and digital contrast checks.

| Supplied reference | Supplied label | Tailwind token | Temporary HEX |
| --- | --- | --- | --- |
| RAL 9001 | Cream | `brand-cream` | `#f7f3e8` |
| RAL 6005 | Dark green | `brand-green` | `#173f35` |
| RAL 5026 | Blue | `brand-blue` | `#24394e` |
| RAL 7016 | Anthracite | `brand-anthracite` | `#30363b` |
| RAL 2013 | Copper | `brand-copper` | `#975d43` |
| RAL 1032 | Yellow | `brand-yellow` | `#c6a13b` |

All tokens live in the Tailwind v4 `@theme` block in `src/styles/global.css`, generating utilities such as `bg-brand-cream` and `text-brand-green`. Use anthracite on cream for default text; green/cream for the placeholder language control. The accent colors are reserved, not proof of accessible text combinations. Verify actual combinations before use; avoid conveying information with color alone.

## Typography

Quicksand Variable is bundled locally via `@fontsource-variable/quicksand`. The CSS font stack is `'Quicksand Variable', 'Quicksand', system-ui, sans-serif`. The package includes Latin Extended support and uses `font-display: swap`; no runtime Google Fonts request is needed. Keep the package's font license with distributed assets.

The initial placeholder uses Tailwind's default type scale (small labels, base/large body copy, 3xl/5xl heading) and regular/semibold weights. These are practical initial defaults, not final art direction. Review heading hierarchy, line lengths, Romanian diacritics, font weights, and responsive sizing with actual content later.

## Spacing and responsive tokens

- Base spacing: `--spacing: 0.25rem` (Tailwind's shared spacing scale).
- Shared content width: `--container-content: 72rem`, used as `max-w-content`.
- Named breakpoints: `sm` 40rem, `md` 48rem, `lg` 64rem, `xl` 80rem. Additional Tailwind defaults remain available.
- Mobile-first styles, flexible line wrapping, readable line lengths, consistent spacing, and appropriately sized controls.
- Prefer semantic tokens and utilities over many one-off arbitrary values. Use custom/scoped CSS for effects or repeated patterns that would be clearer there.

## Reusable UI direction

The only initial shared UI is a document layout, skip link, and language navigation with a current-page state and visible focus. Real buttons, apartment cards, galleries, inquiry actions, headers, footers, and modals will be introduced only when their content and interactions are approved. Empty component folders mark intended responsibilities without speculative abstractions.

Use semantic elements, accessible names, meaningful link text, keyboard operation, focus styles, and reduced-motion alternatives when animation is added. Do not add autoplay, heavy scroll effects, or decorative 3D as part of initialization.

## Pending decisions

1. Owner-approved logo, concept board, architectural renders, and asset usage rights.
2. Final digital palette and permitted contrast combinations.
3. Final typography scale/weights, component geometry, and page compositions.
4. Motion direction and any justified future GSAP/Three.js requirements.
5. Approved Romanian/English editorial copy, verified property data, and legal content.

## References

- [Tailwind theme variables](https://tailwindcss.com/docs/theme)
- [Tailwind v4 Astro setup](https://tailwindcss.com/docs/installation/framework-guides/astro)
- [Quicksand on Fontsource](https://fontsource.org/fonts/quicksand)
