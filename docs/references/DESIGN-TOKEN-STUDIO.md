# Design Token Studio

The studio is a standalone, original, zero-cost theme editor with a sample dashboard; it does not incorporate or run any third-party component source code.

## Using the editor

1. Build the static site with `npm run build`, serve `dist/site` via HTTP, and open `token-studio.html`.
2. Select **Forest**, **Ocean**, or **Night**, or edit the seven color slots, typography, spacing density and corner radius.
3. Preview the resulting theme on desktop, tablet or mobile. Viewport selectors resize an isolated example layout using CSS container queries, not an actual third-party application.
4. Review the WCAG AA normal-text contrast values for body text on the surface and accent text on accent. A ratio below **4.5:1** is flagged. These two ratios do not constitute a full WCAG audit.
5. Export a portable JSON theme or a CSS file with `--ui-*` properties. Use the CSS in a project after mapping it to that project's token convention.
6. Import a previously exported JSON theme (at most 16 KiB) to edit it further; failed imports leave the current theme unchanged.

## Data and security

- The theme is stored locally on a best-effort basis; no backend, authentication, telemetry, paid API or external font download is used.
- JSON is strictly reduced to `version`, `name`, `font`, `radius`, `density` and seven six-digit hex colors. Unrecognized properties are dropped; unknown fonts, invalid colors or out-of-range values are rejected.
- CSS generation uses only validated token values, not untrusted template strings. No `eval`, HTML injection, CSS imports or external code execution is involved.
- The preview is an original illustrative dashboard and does not present live data or application features.
- CSS `:root` output is a starting token set, not a ready-to-install app component library or guarantee of complete design/accessibility quality.
- Use a modern browser with CSS container query support. When browser storage is disabled, use Export JSON to retain the current theme.

## Validation

`npm ci`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, and Playwright browser tests apply. Inspect contrast and responsive behavior manually as an additional review.

The feature's implementation and delivery decisions are recorded in [design-token-studio.json](../contracts/features/design-token-studio.json).
