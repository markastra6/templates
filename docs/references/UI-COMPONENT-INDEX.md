# UI component sources and public metadata index

**Snapshot:** 2026-11-05  
**Repository:** markastra6/templates  
**Scope:** 31 public design directories; source-code-free metadata index from seven official public GitHub registries or trees.

## Inventory

| Source | Upstream discovery route | Indexed records | Notes |
| --- | --- | ---: | --- |
| React Bits | DavidHDev/react-bits, public/r/registry.json | 1,274 | Variants are separate records; do not interpret as unique designs |
| Magic UI | magicuidesign/magicui, registry.json | 260 | May include registry styles and auxiliary records |
| Shadcn Space | shadcnspace/shadcnspace, registry.json | 590 | Public registry entries, not premium downloads |
| Kokonut UI | kokonut-labs/kokonutui, registry.json | 107 | Public registry metadata |
| ReUI | keenthemes/reui, registry-reui/bases/base/components/**/*.tsx | 1,264 | One base's public implementation paths; not every product variant |
| shadcn/ui | shadcn-ui/ui, apps/v4/registry/bases/radix/{ui,blocks}/**/*.tsx | 248 | Radix base only; counts individual files, including block internals |
| Motion Primitives | ibelick/motion-primitives, components/core/*.tsx | 33 | Public source paths |

**Total: 3,776 records.** This is not 3,776 distinct production-ready designs. Snapshot counts were validated against retrieved upstream registry entries and tree paths at collection time. The full 31-source listing is [ui-component-sources.json](ui-component-sources.json). Source pages and licensing can change.

## Collection boundaries

- Index only data published openly by the respective projects as registry metadata or source paths; retain the upstream repository name, manifest path or Git tree SHA, plus each source URL.
- Do not bulk scrape Dribbble, Mobbin, or other third-party portfolio/inspiration sites. The other 24 sources remain curated navigational links until their official terms and interfaces can be reviewed individually.
- Do not download, rehost or redistribute images, thumbnails, private content, gated templates, community submissions, or product source. A visible preview or linked file is **not** evidence of permission to redistribute it.
- Do not treat a repository's license as blanket permission for every file, asset, component, trademark or example. Inspect its license and notices, and check the source's upstream dependencies, framework compatibility, security, accessibility and attribution *before* adoption.
- Existing repository rules require zero spending. Do not use paid libraries, bypass a paywall, access private registries, run credentialed scrapes, or rely on a commercial API.
- All items are **discovery metadata only**. No executable source code is included in the index. Source URLs are HTTPS links back to the publisher.
- Respect upstream access terms, robots policies, API limits, takedown requests and attribution. This snapshot does not authorize automated crawling of the publishers' websites.

## Reproducing and refreshing

1. Read [AGENTS.md](../../AGENTS.md) and [RIGHTS.md](../../RIGHTS.md).
2. Inspect each project's official public GitHub registry or Git tree and current license/terms. Use cached HTTP responses, modest concurrency, and rate limits. Never infer approval solely from a working URL.
3. Capture the precise upstream Git blob SHA (registry) or Git tree SHA (path-only index). Preserve existing record structure: `id`, `name`, `slug`, `kind`, `tags`, `dependencies`, `url`.
4. Normalize links, deduplicate by source ID plus upstream slug, validate expected records, and update the corresponding `ui-index/*.json` with the new snapshot date and count.
5. Run `npm test`, `npm run build`, `npm run lint`, `npm run typecheck` and, when a browser is available, `npx playwright test`. Compare counts and review the diff rather than blindly committing upstream changes.
6. Open a pull request and check the repository's CI. Don't merge if applicable checks fail.

The snapshot is **not a scheduled scraper**. No network calls run in the deployed website, and the browser's search is local. This avoids fragile dependencies on external endpoints and unintentionally changing the user's website.

## Usage

Run `npm run build`; browse `dist/site/ui-explorer.html`. Filter by source and search names, tags, or dependency names. Search results display metadata and take you to original source pages for actual preview, licensing and implementation review. For project implementation, use the existing unified web engineering skill and component provenance records in feature handoffs.
