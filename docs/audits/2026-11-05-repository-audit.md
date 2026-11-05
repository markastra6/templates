# Repository-wide technical and product audit

**Repository:** [markastra6/templates](https://github.com/markastra6/templates)  
**Audit date:** 2026-11-05  
**Audited branch/commit:** `main` at `885b82c0669889ed0c55b06f6654e966f043338d`  
**Method:** GitHub repository tree, tracked source and configuration, all 15 index manifests, workflow definitions, and most recent default-branch GitHub Actions logs. Reviewed GitHub Pages official setup/action documentation. No local Node.js run, penetration test, live upstream link crawl, manual screen reader test, or Lighthouse/Pa11y scan was performed for this audit.

## Executive decision

**Keep the zero-cost static workbench and improve reliability, discovery quality, and reuse before installing more UI frameworks or importing third-party code.** This repository is already useful as a source directory, token editor, starter page composer and first-party component lab. It is not yet a unified full-app builder, live integration hub or a catalogue of 9,403 independently verified usable components. Treat entries as discovery metadata until reviewed.

### What is demonstrably working

- **118 tracked files**, eight GitHub Actions workflow definitions, versioned docs and feature contracts.
- **31 public design source listings**, of which **15 have indexed metadata snapshots** and 16 remain navigation-only because of source/rights or availability boundaries.
- **9,403 index records**, of which **8,509 are estimated variant families under the current limited grouping heuristic**. Family count is not a verified unique design count.
- **112 tool directory records:** 15 original/core descriptions and 97 additional reviewed candidates. The 97 are **not installed/integrated** (92 flagged uninstalled; five not configured); several core services are likewise client-unverified.
- Five default-branch code workflows on audited commit **passed**: repository validation, Node/Markdown quality, CodeQL, Gitleaks and Chromium browser tests. [Workflow runs](https://github.com/markastra6/templates/actions). Latest verified runs reported **25 Node unit tests passed** and **23 Chromium browser tests passed**.
- The [Component Lab](../../site/component-lab.html) has six first-party interactive examples with a strict schema, sandboxed preview, original code export and reduced-motion-aware CSS. The [Page Composer](../../site/page-composer.html) has five original section types, and the [Token Studio](../../site/token-studio.html) shares its validated seven-color theme contract.
- External catalogue source code and images are not bundled into browser previews by default; that is a useful copyright and supply-chain boundary.

## Findings by severity and evidence

`P0` denotes immediate reliability/governance risk; `P1` high user impact; `P2` quality/scale work; `P3` optional capability.

| ID | Priority | Verified finding | Evidence and consequence |
| --- | --- | --- | --- |
| A01 | **P0** | `main` is not branch protected. | GitHub branch API reports `protected:false`. Checks can pass without preventing accidental direct pushes, forced rewrites or bypassing review. [Governance guidance](../REPOSITORY-GOVERNANCE.md) itself notes the gap. |
| A02 | **P0 if hosted access is intended** | GitHub Pages auto-deployment is configured but not operational. | [Latest Pages run](https://github.com/markastra6/templates/actions/runs/42033127413) failed in `Configure GitHub Pages` with `Get Pages site failed: Not Found`. [Pages workflow](../../.github/workflows/pages.yml) now triggers on main. GitHub Pages must be enabled/configured, or hosting intentionally disabled until needed. |
| A03 | **P1** | React Bits navigation is too generic. | **All 1,274** entries point to the **same `public/r/registry.json` URL**; clicking a named result does not open the corresponding specific example. This is source metadata rather than functional deep linking. [React Bits snapshot](../references/ui-index/react-bits.json). |
| A04 | **P1** | Catalogue count conflates distinct resource types. | 9,403 records include component code paths, 3,802 community archive HTML file paths, examples, blocks, 128 documentation links, CSS files, hooks, utilities and implementation variants. Only **8,509 family IDs** after the existing narrow de-duplication rule; even these are not verified distinct installable components. |
| A05 | **P1** | Discovery metadata is sparse and inconsistent. | **1,519** entries have no tags; **897** contain repeated tags (mostly ReUI and shadcn/ui); only **1,076/9,403 (11.4%)** have any dependency declaration. An empty dependency array frequently means *not supplied*, not zero dependencies. No indexed entries include individually verified license, live preview, accessibility or last-link-checked fields. |
| A06 | **P1** | Explorer facets can report a misleading zero-source count. | Query `accordion` returns **45 component records** but **0 matching source cards** under current [browser filtering](../../site/ui-explorer.js), because source cards are matched only against source name/focus/group, not the component results. Fix the count/source-facet relationship. |
| A07 | **P2** | Grouped variants are discarded **before** relevance sorting. | [searchComponents](../../site/ui-tools.js) filters out later family members inside `filter()`, then sorts. A better-matching variant can be dropped because a weaker first variant occurred earlier. Select best representative *after scoring* or group family results explicitly. |
| A08 | **P1** | Workbench capabilities remain isolated. | Six first-party component examples cannot be inserted as interactive blocks in the five-section Page Composer. Both use the same theme schema, but there is no unified versioned screen/project model with reusable component instances, undo/redo, and whole-screen export. |
| A09 | **P1** | Distribution is poorly matched to constrained Windows machines. | The full index requires a generated `dist/site/ui-index.json` from a Node-based build. The checked-in `site/` folder lacks this generated index. There is no verified, downloadable, complete offline website ZIP or one-click Python launcher for users without Node/npm. GitHub Pages is optional rather than the sole solution. |
| A10 | **P1** | Accessibility/performance releases lack routine end-to-end gates. | [Pa11y](../../.github/workflows/accessibility-audit.yml) and [Lighthouse](../../.github/workflows/lighthouse.yml) are **manual-dispatch only**, and assume a configured public HTTPS host. Chromium tests cover functional paths at 375/1280 px but no automated axe audits, baseline screenshot regression or multi-engine browser suite is configured. |
| A11 | **P2** | The semantic token system is deliberately limited. | [ui-tokens.js](../../site/ui-tokens.js) defines seven colors, radius, spacing density and font stack; Token Studio checks only two color pairs. No defined semantic warning/success/error tokens, shadow/elevation, focus/control states, type scale or comprehensive component-state contrast verification. The surrounding workbench still has hardcoded CSS colors. |
| A12 | **P1** | Snapshot maintenance is not operationalized. | Index files were captured 2026-11-05. No scheduled, allowlisted source metadata refresh, source-change diff, upstream link-health result or per-record verification pipeline. [Build script](../../scripts/build-site.mjs) assumes exactly 31 sources and [tests](../../browser-tests/ui-index.unit.mjs) pin 9,403 records, so intentional source updates require code/test changes. |
| A13 | **P2** | Reuse and attribution policy is incomplete for export consumers. | [RIGHTS.md](../../RIGHTS.md) reserves original rights but there is no root `LICENSE` file. Source-level warnings are responsible, but each indexed entry lacks verified reuse/attribution data. Choose and document a license for code the owner controls only; do not relicence source material authored by third parties. |
| A14 | **P2** | Stale project guidance may mislead future agents. | [AI handoff](../AI-HANDOFF.md) still describes an older upstream repository and a manual/incomplete Pages state; [Development Toolkit](../DEVELOPMENT-TOOLKIT.md) describes Pages as manual despite the new push-triggered workflow. Some docs refer to pre-workbench application state. |
| A15 | **P2** | Build and browser delivery need measurable budgets. | 15 checked-in index snapshots total approximately **2.61 MB** before building the combined search JSON. The Explorer loads all entries and makes searchable strings on initial load. No payload/compression/parse-time budget or lazy per-source loading is tested. |
| A16 | **P2** | Editing protections are inconsistent. | Page Composer asks confirmation before replacing a project; Component Lab `Reset example` does not and immediately persists the replacement. Neither offers a general undo/redo history. This is a UX/data-loss risk, not a proven security issue. |
| A17 | **P2** | Documentation and tool selection may imply deeper integrations than exist. | The [112-entry registry](../contracts/toolchain.registry.json) documents many candidates; most are not operational. The website needs clear `working here / configured in a client / documentation-only / unavailable / license unverified` distinctions. |

### Dataset measurements

| Metric | Audited value |
| --- | ---: |
| Source listings | 31 |
| Sources with indexed data | 15 |
| Link-only sources | 16 |
| Total raw index records | 9,403 |
| Algorithmic variant families | 8,509 |
| Distinct URL strings | 8,089 |
| Entries without tags | 1,519 |
| Entries with duplicate tags | 897 |
| Entries with at least one declared dependency | 1,076 |
| Per-entry verified license or component preview URL fields | 0 |
| Checked-in source index JSON size | 2,614,349 bytes |
| Main branch protected | No |
| Latest GitHub Pages deployment | Failed, Pages not enabled |
| Latest audited Chromium run | 23 passed |
| Latest audited Node unit run | 25 passed, 0 failed |

**Scope limitations:** URL uniqueness does not imply URL validity, and variant-family grouping is intentionally partial. The audit counted and validated local metadata schema but **did not** perform 9,403 HTTP requests, inspect 9,403 licenses, check all actual source components, run a local production build, perform manual assistive-technology QA, or execute a network penetration test. Successful existing CI is evidence only for its configured checks.

## Prioritized implementation plan

### Release and access — do first

**I01 — Protect main:** Create a GitHub branch ruleset requiring pull requests and passing checks. Block force pushes and deletion. Verify it with an intentionally failing test PR; do not assume a ruleset is active merely because the workflow is green. Owner action in GitHub Settings is required.

**I02 — Choose one supported distribution contract:** Offer both (a) optional GitHub Pages deployment once the owner enables it and (b) a **prebuilt, integrity-checked offline ZIP** generated by GitHub Actions. Bundle all `dist/site` output and a ready-to-run Windows `.bat` launcher using the already-available Python interpreter; launch it in the correct folder and print the URL. Never require the end user to run `npm ci`. Do not auto-enable public hosting when the owner prefers local use.

**I03 — Treat Pages failure as a separate deployment gate:** If hosting is intentionally disabled, avoid a perpetually red deploy workflow. When enabled, require a successful build, publish and HTTP smoke check before announcing a live URL. Do not embed tokens or use paid hosting.

### Make the catalogue trustworthy — next

**I04 — Canonical metadata schema:** Store record identity, source repository, kind (component, example, docs, path, code template), logical family, implementation framework, exact deep link, source SHA/date, rights state (verified free/open/unknown/restricted), declared-dependencies-known flag, previews only when authorized, and verification timestamp. Preserve every raw source record; layer normalized fields on top.

**I05 — Fix source-navigation precision:** For React Bits use the publisher's actual component route or exact file when verified; otherwise visibly label a manifest-only link. Resolve repetitive Cult UI fallback manifest links and inspect repeated Shadcn Space paths. Do not invent URLs. Add a link format/existence regression with bounded sampling and clear rate limits.

**I06 — Fix search and grouping behavior:** Source facets should reflect the component matches. Apply relevance ranking before choosing representative variants, allow inspection of all family variants, add category aliases/synonyms and clear empty/loading/error states. Extend [ui-tools tests](../../browser-tests/ui-tools.unit.mjs) with the `accordion` case and ranking-before-grouping regression.

**I07 — Metadata hygiene and refresh:** Normalize tags without removing source fidelity, distinguish unknown dependencies from none, and create a low-frequency GitHub-only approved-source update job that opens a **PR with count/changed-link diff**. Keep bulk website scraping, paid media, restricted sources and automatic code importing out of scope. Replace hardcoded inventory totals with a reviewed, versioned snapshot baseline.

### Make the studio genuinely integrated

**I08 — First-class project schema:** A versioned local JSON document should contain theme version, pages, component instances, layout, interaction settings, asset references and provenance. Support import/export, validation, migration, local persistence, keyboard-accessible movement and undo/redo.

**I09 — Connect the six original components to the composer:** Add component cards to pages, set their properties, preview actual interactions, export a cohesive single-page HTML document. Keep unreviewed external code in isolated references, not executed in the canvas.

**I10 — Grow a small *high-quality* original library first:** Add verified navigation/sidebar, data table, dialog, form states, search/filter panel, chart with table alternative, dashboard KPI, empty/loading/error states and responsive cards. Each approved component needs examples, semantic states, keyboard tests, focus states, reduced-motion behavior, documented provenance and export checks. Prefer 20 tested originals to thousands of shallow thumbnails.

**I11 — Semantic design tokens v2:** Add semantic color roles and states, type scale, spacing/elevation scale, dark/light modes, motion tokens and validated backward migration from theme version 1. Provide visible WCAG contrast results for relevant text, controls and focus indicators; do not promise full WCAG conformity from palette maths alone.

### Engineering quality and governance

**I12 — Local automated accessibility gates:** Add axe-core to existing Playwright page/interaction tests and test keyboard focus, modal trapping, tabs, forms, alerts and reduced motion. Keep manual screen-reader testing as a separate release requirement.

**I13 — Visual and performance regression:** Add stabilized screenshots for key viewports, 320/375/768/1280 widths, mobile touch scenarios, runtime console/network errors, and a measured payload/performance budget. Keep first-party browser tests independent of GitHub Pages publication.

**I14 — Supply-chain and publishing hygiene:** Keep CodeQL/Gitleaks/npm audit/Dependabot. Consider SBOM and provenance for distributed code, immutable pinned action SHAs where practical, and a documented release process. Add explicit root/original-component licensing only after ownership and user choice. Restrict the Pages deployment environment to `main` if Pages is enabled.

**I15 — Refresh documentation and operating instructions:** One current README, canonical architectural diagram, page map, source status, honest availability flags, exact local/hosted/offline steps, durable feature contracts and a changelog or release note process. Archive or clearly label the older-fork AI handoff. No Windows-specific install instructions should assume Node is available.

### Later, only when needed

**I16 — Project-ready templates:** Original dashboard, admin panel, landing page, app settings, reporting and form flows built from the same component schema. Prefer purposeful, maintainable examples over a large uncurated template count.

**I17 — Export targets:** Keep static HTML as baseline; add a separate framework adapter (React/Vite, for example) only after a testable export contract and verified license/dependency resolution exist. Do not install multiple UI frameworks into the current static app.

**I18 — Optional offline AI:** Search/rank the existing metadata with deterministic rules first. Consider a user-managed local model later if it provides verified value without paid calls, network dependencies or copying restricted component code. AI output must pass the same validation as human edits.

## Acceptance gates for the first release-quality milestone

- `main` enforces reviewed PRs and required CI checks (verified by an actual blocked merge).
- A user without Node.js can open a complete prebuilt workbench from a downloaded ZIP through a Windows launcher; the component explorer loads all its metadata, not a partial `site/` folder.
- A query with matching components reports sensible source facets; all family variants remain accessible and ranking picks an appropriate representative.
- React Bits records no longer misrepresent the shared manifest as a specific component URL; links are verified or labelled as manifest-only.
- Every catalogue record has a normalized resource kind and explicit license/compatibility *verification status*, without falsely claiming that unknown data has been checked.
- Unit tests, browser tests, accessibility checks, export tests and deployment smoke tests pass under their documented scopes.
- A reusable project JSON can combine multiple original components and a shared design theme, then round-trip into an editable project and exported HTML.
- Public hosting is not enabled without the owner's decision. If enabled, only the accepted `main` branch can publish.

## Decision record and recommended order

**Preferred next changes:** `I01 → I02 → I06 → I05 → I04/I07 → I08/I09 → I11/I12/I13`. This order minimizes user friction and improves correctness before adding thousands of items or complex frameworks.

**Strong existing decisions to preserve:** zero-cost policy, original-only executable previews, offline-first/browser-local privacy, explicit licensing boundaries, immutable-source provenance, strict input validation, reduced-motion awareness, and PR + CI review.

**Do not interpret this report as a security certification or a mandate to install every reviewed library.** Every additional capability should enter as an individually justified, compatible, tested part of one system.
