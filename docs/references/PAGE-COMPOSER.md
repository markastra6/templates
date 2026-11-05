# Starter Page Composer

This feature creates original, static HTML pages in the browser. It does not embed code from the 31 third-party design sites or generate a production backend.

## Working with sections

1. Open `page-composer.html` from the built and HTTP-served site.
2. Choose an existing section to edit its heading, description or section-navigation link label. The example types are **Hero, Features, Highlights, Call to action** and **Footer**.
3. Add a new section using the selector and **Add section** button; at most 16 sections are permitted.
4. Reorder sections using **Move up** and **Move down** buttons. They work with keyboard and pointer input; drag-and-drop is not implemented.
5. Select **Desktop**, **Tablet** or **Mobile** to adjust the preview width. Responsive container queries keep the example layout readable inside a narrow preview frame.
6. Use **Use saved token-studio theme** to apply a theme saved by the Design Token Studio in the same browser origin. Themes are validated using the shared token schema.
7. Export a full single-file HTML document with inline CSS and semantic sections, or an editable versioned JSON project. Import JSON files up to 64 KiB; malformed files leave the current project unchanged.

## Local persistence and data safety

- Each section contains only `id`, `type`, `title`, `body` and `action` fields. Types and IDs are strictly checked, duplicate IDs rejected and text lengths bounded.
- All user-authored text is HTML-escaped. Exports only use trusted original HTML templates, CSS styles and validated design tokens; they do not execute imported HTML or JavaScript.
- Action links navigate to an actual next section, or back to the top of the generated page. No uncontrolled external URL or tracking script is introduced.
- The browser stores projects locally when permitted. Export JSON before clearing storage or switching devices. Resetting the example requires a confirmation.
- Imported projects are not shared with servers. No cloud service, paid API, runtime framework, external font or third-party asset is required.
- The exported page is a **starter**, not a completed product. Rewrite sample text and review navigation, semantics, contrast, accessibility, mobile layout and business content before deploying.

## Tests

Run `npm ci`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` and Playwright browser tests. Unit tests cover schema bounds, source escaping, internal navigation and ordering. Browser tests cover editing, ordering, persistence, theme reuse, viewport resizing, exports and invalid imports.

Feature decisions and review state are recorded in [starter-page-composer.json](../contracts/features/starter-page-composer.json).
