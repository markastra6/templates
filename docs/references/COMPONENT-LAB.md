# Original Component Lab

The workbench's [Component Lab](../../site/component-lab.html) previews six original, dependency-free interactive components: toggle button, keyboard tabs, native details accordion, non-network email validation form, dismissible status notification and a static demonstration metric.

## Use

1. Run `npm ci && npm run build`, then serve `dist/site` over HTTP, for example with `python -m http.server 8080 --bind 127.0.0.1 --directory dist/site`.
2. Open `http://127.0.0.1:8080/component-lab.html`, choose a component and edit the bounded heading, description and optional action label.
3. Choose Forest, Ocean or Night, or click **Use saved Token Studio theme** to load the validated `ui-token-studio-v1` theme stored by this browser on the same site origin.
4. Preview desktop, tablet and mobile layouts. Interact with the example inside its sandboxed frame.
5. Export standalone HTML or editable JSON; import JSON under 16 KiB to restore the component and theme. The code view is read-only, and generated HTML can be copied when the browser permits clipboard access.

## Provenance and security boundaries

Every example is authored in this repository, in `site/component-lab-core.js`. The 9,403 third-party catalogue records are search metadata and **never executed or automatically imported**. The preview is generated from validated, whitelisted content and themes only.

The `iframe` uses `sandbox="allow-scripts"` without `allow-same-origin`, giving it a separate opaque origin. The generated document sets a restrictive Content Security Policy: no remote resources, no network connections, no external images, no external frames, and no form submissions. The inline behavior script is repository-owned and has no user-provided script content. Dynamic text is HTML-escaped. A standalone export includes only original HTML, CSS, JavaScript and validated theme values.

The form checks validity in the browser, cancels submission, and does not send or store user-entered data. The metric is sample data only. Editing fields rebuilds the preview iframe and resets interactive state; configuration is best-effort persisted in this browser under `ui-component-lab-v1`. Export a backup before clearing browser storage. Local storage is not encrypted and should not contain sensitive data.

Interactive examples use semantic HTML, ARIA states, keyboard navigation and focus styling. Reduced-motion preferences disable nonessential transitions. Run manual screen-reader/keyboard review before adopting for production. The Component Lab is not a general-purpose runtime for arbitrary downloaded components or scripts.

## Validation

Use `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, then `npx playwright test`. The CI includes mobile and desktop Chromium checks for component interactions, isolation, JSON validation and HTML export. The generated page and import/export formats are versioned as schema version 1.
