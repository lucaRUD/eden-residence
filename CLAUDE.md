# Eden Residence project rules

## Development priorities

- Prioritize implementation quality and actual website improvements over documentation.
- Reuse existing project context; read relevant files and essential docs before editing.
- Keep tasks focused. Avoid unrelated refactoring, redundant reports and artifacts.
- Maintain the existing docs when architecture, design conventions or plans change; do not create a separate Markdown report for every development phase.
- Do not automatically generate screenshots or screen recordings.

## Completion responses

After normal implementation tasks, report only:

1. What changed.
2. Tests passed or failed.
3. Important unresolved issues.

Aim for a concise response under 150 words.

## Testing

- Run `npm.cmd run check` and `npm.cmd run build` after meaningful implementation changes.
- Perform targeted browser tests for modified interactive features.
- Do not automatically run a comprehensive browser/theme/device matrix for every minor CSS change.
- Preserve necessary accessibility, functionality and security checks.
- Perform broader verification before deployment or when explicitly requested.

## Screenshots and recordings

- Generate screenshots only when explicitly requested or genuinely needed to diagnose a problem.
- Do not save generated screenshots, recordings or temporary QA outputs inside the tracked project. Use a temporary directory outside the repository when possible.
- Do not generate Markdown reports containing screenshot collections unless requested.
- Generated output directories in `.gitignore` are a fallback, not the default place to store artifacts.
- Preserve genuine owner-supplied references, logos and architectural renders.

## Code and content changes

- Inspect relevant files before editing and preserve unrelated uncommitted work.
- Preserve existing architecture, functionality, localization, themes and accessibility.
- Do not reinstall existing dependencies unnecessarily or add unnecessary dependencies.
- Keep WordPress integration within its existing boundary. Do not modify production WordPress without approval.
- Do not invent apartment data, contact details, technical specifications or legal claims. Keep the client-supplied passive-building claim explicitly provisional until verified.
- Do not automatically commit changes.
