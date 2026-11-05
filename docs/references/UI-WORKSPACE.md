# UI discovery workspace

The [source explorer](../../site/ui-explorer.js) is a zero-cost, static reference browser, not a marketplace, component renderer or licensed code redistributor.

## What the controls do

1. Search the 9,403 indexed references by name, source, tags or declared dependency keywords.
2. Filter by library and component type. Check **Group style variants** to collapse known React Bits JS/TS/CSS/Tailwind permutations and HyperUI light/dark file variants; every original record remains in the JSON index.
3. Click **Save** for useful references. The saved list is maintained in browser-local storage (up to 200 IDs). Check **Show saved only** to focus your shortlist.
4. Click **Compare** on up to three references to inspect name, source, type, tags, dependencies and upstream links. Comparing is metadata-only: no third-party code is fetched or executed.
5. Click **Export saved** to download a portable JSON list. Use **Import saved JSON** to restore on a different browser; import replaces, rather than merges with, the current saved list. Unknown source IDs are ignored; malformed or oversized files are rejected without replacing the existing list.

## Privacy and security

- No accounts, server APIs, tracking pixels, third-party scripts, paid requests or external runtime CSS are introduced.
- Browser storage is optional and may be unavailable in private browsing. Export before clearing storage, changing browser/device, or relying on an important shortlist.
- Import accepts only version 1 JSON containing a bounded `favorites` array of IDs known to the local index. A file larger than 64 KiB is refused; no imported code, HTML or network links are rendered.
- Source names and metadata are rendered with DOM `textContent`. Upstream links must use HTTPS with no embedded credentials.
- Metadata is not proof of component safety, accessibility, source licensing, package compatibility or production quality. Review the linked publisher's actual component before adoption.

## Test and build

Run `npm ci`, `npm test`, `npm run lint`, `npm run typecheck`, `npm run build`, then `npx playwright test` after installing Chromium. The static site must be served over HTTP, not opened directly using `file://`, because it loads its own JSON index.

See the [feature contract](../contracts/features/ui-discovery-workspace.json) for decisions, accepted behavior and remaining follow-up work.
