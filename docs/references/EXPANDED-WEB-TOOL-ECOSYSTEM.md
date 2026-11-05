# Expanded open-source web tool ecosystem

**Research date:** 2026-11-03
**Repository base:** `e2d03a540f0ea86e7cd19531c7b0ae93b8f0a83e`
**Coverage:** Curated public-GitHub research across the repository's full tracked tree and adjacent frontend/design-engineering ecosystems. This is not a literal enumeration of every GitHub repository.

## How to read this catalogue

- **Current core** means already documented or configured in this repository.
- **Reviewed candidate** means an additional public project worth considering, but not automatically installed, connected or approved for every use.
- **Client/runtime required** means a compatible coding agent, Node.js/browser runtime, desktop environment, backend or other host is needed. A GitHub entry alone does not activate a tool.
- **Zero-cost boundary** refers to the software/project, not necessarily hosting, compute, commercial assets, usage overages or third-party services.

The machine-readable source of truth is [toolchain.registry.json](../contracts/toolchain.registry.json). It now contains 108 tool records: the original 15 plus 93 reviewed candidates. Candidate state is recorded separately from active configuration.

## 1. Agent skills and design judgment

| Candidate | Capability added | When to invoke | Important boundary |
|---|---|---|---|
| [Emil Kowalski skills](https://github.com/emilkowalski/skills) | Animation construction, review, codebase-wide motion audits, design-engineering judgment | Motion-heavy UI, motion critique or animation cleanup | Install selected skills only; they complement, not replace, GSAP/Motion runtime tools |
| [UX Skills](https://github.com/Tranz007/ux-skills) | Intent, evidence, user context, UX challenge and engineering handoff | Product discovery, user journey or requirements review | Complement UI/UX Pro Max; do not let two skill packs create competing decisions |
| [Frontend AI Skills](https://github.com/JustineBijuPaul/frontend-ai-skills) | Broad catalogue of focused React, animation, 3D, accessibility, performance and design-to-code skills | Discover a specialist capability missing from the current system | 70+ skills is a discovery pool, not a bundle to install wholesale |

**Integration:** these skills feed proposals and critiques into the existing unified feature contract. UI/UX Pro Max remains the design intelligence entry point; Taste remains the art-direction/visual-review specialist. The orchestrator reconciles outputs rather than allowing separate skill packs to define separate design systems.

## 2. Browser control, component intelligence and visual inspection

| Candidate | Capability added | When to invoke | Important boundary |
|---|---|---|---|
| [Microsoft Playwright MCP](https://github.com/microsoft/playwright-mcp) | Agent browser control using structured accessibility snapshots, forms, navigation, network mocking, traces and screenshots | Agent needs to inspect and interact with a running preview | Separate from the existing Playwright test runner; MCP exploration is not the repeatable test suite |
| [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) | Chrome console, network, DOM and performance-trace diagnostics | Diagnose browser-specific defects and performance regressions | Desktop Chrome and a compatible MCP client required; browser contents are exposed to the client, so isolate profiles |
| [Storybook + MCP addon](https://github.com/storybookjs/storybook) | Component workbench, isolated stories, variants, component documentation and agent-readable component knowledge | A component library has enough reusable parts to warrant a visual catalogue | The previous standalone Storybook MCP repository moved into the main Storybook monorepo in Storybook 10.6; follow current docs |

**Integration:** Alibaba Page Agent and Playwright MCP are exploratory browser agents; use only one for a given inspection pass unless they answer different questions. Playwright's test runner remains the deterministic regression layer. Chrome DevTools MCP is a diagnostics specialist, not another general browser agent. Storybook is a component-level design/behavior reference, not the authoritative product design file.

## 3. Component primitives and complete UI systems

| Candidate | Capability added | When to invoke | Selection rule |
|---|---|---|---|
| [Base UI](https://github.com/mui/base-ui) | Unstyled accessible React primitives | Accessible, source-owned controls and overlays | Compare with the primitive base used by shadcn; don't mix foundations in one component |
| [Radix UI Primitives](https://github.com/radix-ui/primitives) | Accessible behavior primitives for dialogs, tabs, menus, popovers and more | A component or shadcn setup needs Radix behavior | Treat as an alternative/underlying primitive family, not a second design system |
| [Adobe React Aria Components](https://github.com/adobe/react-spectrum) | High-rigor keyboard, focus, internationalization and accessible widget behavior | Complex controls or stringent accessibility needs | Use instead of an equivalent primitive, not layered on top of one |
| [Mantine](https://github.com/mantinedev/mantine) | A complete React component system, hooks, forms, notifications and charts | Only if the project deliberately chooses a full UI kit | Alternative to the shadcn-first approach; never run two global component themes in parallel |

The project default remains shadcn/ui as the source-owned primitive foundation. The candidates above expand the options for particular requirements; they do not all get installed.

## 4. Data, forms and application behavior

| Candidate | Capability added | When to invoke | Boundary |
|---|---|---|---|
| [TanStack Query](https://github.com/TanStack/query) | Remote data caching, retries, background refresh, mutations and pagination | Real API/server state exists | It is not a database or backend |
| [TanStack Table](https://github.com/TanStack/table) | Headless sorting, filtering, grouping, selection, pagination and virtualizable data grids | Dense, interactive data tables | Use semantic HTML tables for simple tabular data |
| [React Hook Form](https://github.com/react-hook-form/react-hook-form) | Complex form state and validation lifecycle | Multi-step, dynamic or larger validated forms | Native forms and React state remain enough for small forms |
| [Zod](https://github.com/colinhacks/zod) | Runtime validation and inferred TypeScript types | API boundaries, forms, configuration and shared data contracts | Define schemas at boundaries; avoid duplicated incompatible schemas |
| [Mock Service Worker](https://github.com/mswjs/msw) | Network-level API mocking for realistic loading, empty, success and error states | Component/integration tests without a live backend | Mock data must never be represented as production persistence |
| [Zustand](https://github.com/pmndrs/zustand) | Small shared client-state stores | Cross-component state becomes awkward with local React state/context | Start with React state; add only when state boundaries justify it |

## 5. Testing, component QA and accessibility

| Candidate | Capability added | When to invoke | Boundary |
|---|---|---|---|
| [Vitest](https://github.com/vitest-dev/vitest) | Unit/integration tests, mocks, coverage and browser mode | A Vite-based app needs a fast test runner | Select one primary runner; don't duplicate Jest and Vitest without a compatibility reason |
| [React Testing Library](https://github.com/testing-library/react-testing-library) | Tests components through roles, labels and user-visible behavior | React component interaction tests | Test behavior, not implementation internals |
| [axe-core](https://github.com/dequelabs/axe-core) | Automated WCAG/ARIA checks inside browser/component tests | Continuous accessibility regression coverage | Automated scans detect only part of accessibility issues; manual keyboard/screen-reader review remains |
| [Storybook](https://github.com/storybookjs/storybook) | Isolated component stories and state/variant review | Reusable components and design-system documentation | Add once component count and reuse justify the maintenance |

## 6. Data visualization, icons and visual assets

| Candidate | Capability added | When to invoke | Boundary |
|---|---|---|---|
| [Recharts](https://github.com/recharts/recharts) | Composable React charts built around chart primitives | Dashboard/data-visualization requirements | Avoid decorative charts; provide accessible text/table alternatives |
| [Lucide](https://github.com/lucide-icons/lucide) | Consistent outline SVG/icon components | Default icon family for new interfaces | ISC-licensed; does not provide brand logos |
| [Tabler Icons](https://github.com/tabler/tabler-icons) | Large MIT-licensed outline and filled icon family | Alternative when its visual language or coverage fits better | Choose Lucide or Tabler as the main family; do not load both by default |
| [SVGO](https://github.com/svg/svgo) | Remove redundant SVG metadata and optimize vectors | Exported illustrations, icons and backgrounds | Compare optimized output visually before replacing source |
| [Sharp](https://github.com/lovell/sharp) | Raster resize, conversion and responsive image generation | Build-time image processing is required | Avoid server-side image pipelines for simple static sites |
| [dotLottie Web](https://github.com/LottieFiles/dotlottie-web) | WebAssembly-based Lottie/dotLottie playback for React and other frameworks | An authored, licensed vector animation is required | Player licence does not grant rights to third-party animation files |

## 7. Motion and 3D extensions

| Candidate | Capability added | When to invoke | Boundary |
|---|---|---|---|
| [Lenis](https://github.com/darkroomengineering/lenis) | Smooth-scroll controller and scroll synchronization | A deliberate scroll-led experience or WebGL scroll coupling needs it | Not a global default; retain native scroll, reduced-motion support and explicit GSAP synchronization |
| [Three.js](https://github.com/mrdoob/three.js) | WebGL/WebGPU 3D scenes, materials, cameras, shaders and rendering | 3D materially serves the product | Requires GPU/performance budget and mobile fallback |
| [React Three Fiber](https://github.com/pmndrs/react-three-fiber) | Declarative React renderer for Three.js | A React project needs reusable 3D scene components | Match its major version to the selected React major |
| [Drei](https://github.com/pmndrs/drei) | Helpers and controls for React Three Fiber | Avoid reimplementing common scene helpers | Add only helpers actually needed |

The existing motion ownership contract still applies. CSS, Motion, GSAP and authored Lottie playback have different jobs. Do not let two engines control the same target. 3D rendering is an optional specialist path, not a baseline dependency.

## 8. Framework and documentation candidates

| Candidate | Best fit | Boundary |
|---|---|---|
| [Vite](https://github.com/vitejs/vite) | React/client-side app tooling, local dev server and optimized production build | Candidate only; requires a framework decision |
| [Astro](https://github.com/withastro/astro) | Content-led static websites with optional interactive islands | Prefer for content-heavy sites; choose based on rendering needs |
| [Starlight](https://github.com/withastro/starlight) | A dedicated documentation site built on Astro | Only if the project needs a separate docs portal |

No framework is selected by this research. The repository still has no application manifest. Do not add Vite/Astro/React/Next.js until the actual product and rendering requirements justify the choice.

## 9. Code quality, dependency and security tools

| Candidate | Capability added | When to invoke | Boundary |
|---|---|---|---|
| [Biome](https://github.com/biomejs/biome) | One formatter/linter toolchain for supported web files | JS/TS project wants simpler consistent code hygiene | Choose Biome OR ESLint + Prettier for the same file types |
| [Knip](https://github.com/webpro-nl/knip) | Finds unused files, exports, dependencies and binaries | Package manifest and source graph exist | Review dynamic-import/plugin false positives before removal |
| [OSV-Scanner](https://github.com/google/osv-scanner) | Scans resolved dependencies against the open OSV vulnerability database; can report licences | A lockfile/SBOM exists and dependency evidence is needed | Complement, not duplicate, the existing npm audit/Dependabot workflow |
| [Trivy](https://github.com/aquasecurity/trivy) | Filesystem/container/dependency/secret/IaC/license scanning and SBOM generation | Supply-chain, container, IaC or licence coverage is required | Optional scoped scan; do not stack overlapping scanners on every commit |
| [OWASP ZAP](https://github.com/zaproxy/zaproxy) | Dynamic application security testing against a running web app | Authorized staging application is available | Use a safe scan profile and test scope only; never scan third parties or production data by default |

Existing CodeQL, Gitleaks, npm audit, Strix and public-target audit guards remain. New scanners are options to fill a concrete gap, not an automatic pile of CI jobs.

## 10. Backend and analytics candidates

| Candidate | Capability added | When to invoke | Zero-cost boundary |
|---|---|---|---|
| [Supabase](https://github.com/supabase/supabase) | Postgres, auth, storage, realtime and functions; optional MCP integration | A real backend/data/auth requirement is defined | Open-source core; self-hosting needs compute. Managed free tiers have quotas and may require billing controls |
| [Appwrite](https://github.com/appwrite/appwrite) | Auth, database, storage, functions, messaging, realtime and agent-oriented MCP | Backend requirements favor its integrated service model | BSD-3-Clause project; self-hosting needs Docker/compute, cloud free tier is limited |
| [Umami](https://github.com/umami-software/umami) | Privacy-oriented web analytics | Product measurement is needed and a privacy/retention policy exists | MIT software, but self-hosting needs a server and PostgreSQL; cloud offering has separate limits |

**Do not add a backend just because it exists.** For a static site, GitHub Pages plus local/static content may be enough. For a real backend, compare Supabase and Appwrite against data ownership, authentication, storage, backup and hosting constraints. An open-source backend is not a free server.

## 11. Watchlist, not included in the active candidate set

- [pursr](https://github.com/0xheycat/pursr) combines browser capture, screenshot diffs, sweeps and axe-based audits through CLI/MCP. It is promising, but this review did not establish sufficient maturity for the core workflow; reassess its recent releases, licence and compatibility before adopting.
- Other skill collections and component directories surfaced during the search are discovery sources, not dependencies. A high skill count or star count is not proof of quality, security, licensing suitability or fit.

## 12. Adoption rules

Every addition passes this sequence:

1. Identify an actual acceptance criterion or engineering defect that requires the capability.
2. Check the upstream repository's recent activity, releases, package owner, security posture, licence and component-level third-party notices.
3. Check framework/runtime compatibility and browser/device support.
4. Estimate actual cost: package license, hosting, compute, API usage, limits and overage behavior.
5. Check whether an existing organ already covers the task. Prefer extending one tool over installing a competing one.
6. Record the selected source, why it won, dependency list and fallback in the feature contract.
7. Run relevant unit, browser, accessibility, performance and security checks.
8. Keep unused candidates in this catalogue and do not install them.

## 13. Research source links

Selected primary project sources used for this expansion:

- [Emil Kowalski animation build/review/audit skills](https://github.com/emilkowalski/skills)
- [Microsoft Playwright MCP and accessibility snapshots](https://github.com/microsoft/playwright-mcp)
- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp)
- [Storybook MCP addon migration](https://github.com/storybookjs/mcp)
- [Base UI primitives](https://github.com/mui/base-ui)
- [axe-core accessibility engine](https://github.com/dequelabs/axe-core)
- [TanStack Query](https://github.com/TanStack/query) and [TanStack Table](https://github.com/TanStack/table)
- [Vitest](https://github.com/vitest-dev/vitest) and [React Testing Library](https://github.com/testing-library/react-testing-library)
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) and [Drei](https://github.com/pmndrs/drei)
- [dotLottie Web](https://github.com/LottieFiles/dotlottie-web)
- [Biome](https://github.com/biomejs/biome)
- [Astro](https://github.com/withastro/astro) and [Starlight](https://github.com/withastro/starlight)
- [Trivy](https://github.com/aquasecurity/trivy), [OSV-Scanner](https://github.com/google/osv-scanner), and [OWASP ZAP](https://github.com/zaproxy/zaproxy)
- [Appwrite](https://github.com/appwrite/appwrite) and [Umami](https://github.com/umami-software/umami)

## 14. Additional high-leverage additions (registry 1.2.0)

Five more candidates are included because they close specific gaps in skill-to-package alignment, continuous audits, content management and documentation quality:

- [TanStack Intent](https://github.com/TanStack/intent): install and map package-maintained, version-matched Agent Skills for selected TanStack packages. Review generated guidance and permissions; it complements the central orchestrator rather than replacing it.
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci): automate repeatable Lighthouse performance budgets against a real local/staging preview. Use GitHub-hosted runners where feasible; a persistent LHCI server is a separate hosting decision.
- [Pa11y CI](https://github.com/pa11y/pa11y-ci): accessibility checks across multiple routes or a sitemap, including axe and HTML_CodeSniffer runners. Automated results do not certify complete accessibility.
- [Payload CMS](https://github.com/payloadcms/payload): open-source Next.js-native CMS/admin/API for structured editorial content. It requires an appropriate Next.js deployment and database; not a static-site default.
- [CSpell](https://github.com/streetsidesoftware/cspell): spell checking for code, Markdown and project terminology. Use only when the documentation volume justifies the check.

### Explicit exclusions

- [PocketBase](https://github.com/pocketbase/pocketbase) is excluded from the candidate set because its repository was archived on 2026-10-26. Reassess only if the project is maintained again and the risk is acceptable.
- Browser automation products requiring a paid cloud browser or paid model API were not added as default organs. Prefer the already documented Playwright/Chrome-local options unless a real feature requires something else.

## 15. Application builders, interactive UI, flows and dynamic layouts (registry 1.3.0)

This section adds 30 candidates because the earlier catalogue focused too heavily on design-engineering infrastructure and not enough on tools that create the actual application surfaces.

### Visual webpage builders and visual editing

| Tool | Main use | Selection boundary |
|---|---|---|
| [Puck](https://github.com/puckeditor/puck) | Visual page editing inside React applications | Best when React owns the site and editable page composition is a product feature |
| [GrapesJS](https://github.com/GrapesJS/grapesjs) | Drag-and-drop HTML/CSS website and template builder | Generated HTML/CSS workflow; not automatically React-native |
| [Webstudio](https://github.com/webstudio-is/webstudio) | Full visual website builder and Webflow alternative | AGPL-3.0; assess hosting and source-modification obligations |
| [Onlook](https://github.com/onlook-dev/onlook) | Visually edit real code-backed interfaces | Apache-2.0 core; optional AI integrations may have external model/API costs |

### App builders and admin frameworks

| Tool | Main use | Choose it when |
|---|---|---|
| [Appsmith](https://github.com/appsmithorg/appsmith) | Visual internal tools, dashboards and admin panels | Low-code composition and data connectors matter |
| [Budibase](https://github.com/Budibase/budibase) | Internal business apps and operations workflows | GPLv3 model and package-level terms are acceptable |
| [ToolJet](https://github.com/ToolJet/ToolJet) | Visual internal applications and workflows | AGPL-3.0 terms are acceptable |
| [Refine](https://github.com/refinedev/refine) | Code-first React admin/B2B applications | Custom React code and data-provider architecture are preferred |
| [React Admin](https://github.com/marmelab/react-admin) | CRUD and data-centric admin interfaces | REST/GraphQL resource-driven admin UI is the requirement |

Do not confuse internal app builders with general public website builders. Managed services may charge even when the source is open source; self-hosting still needs compute and maintenance.

### Interactive component systems

- [Magic UI](https://github.com/magicuidesign/magicui) — animated React/Tailwind components and effects.
- [daisyUI](https://github.com/saadeghi/daisyui) — semantic Tailwind components and theme utilities.
- [Flowbite React](https://github.com/themesberg/flowbite-react) — broad Tailwind-based React components; verify free versus Pro asset boundaries.
- [Chakra UI](https://github.com/chakra-ui/chakra-ui) — alternative complete React component system.
- [MUI](https://github.com/mui/material-ui) — Material Design component system.
- [Headless UI](https://github.com/tailwindlabs/headlessui) — unstyled accessible interaction primitives.
- [Floating UI](https://github.com/floating-ui/floating-ui) — positioning engine for popovers, tooltips, menus and anchored elements.

These are not all additive. Keep one primary component system; use Headless UI/Floating UI only for gaps in that system.

### Interactive flows, diagrams and canvas

- [React Flow / Svelte Flow](https://github.com/xyflow/xyflow) — node-based workflow and graph editors.
- [Rete.js](https://github.com/retejs/rete) — extensible visual programming and dataflow editors.
- [Excalidraw](https://github.com/excalidraw/excalidraw) — freeform diagrams and whiteboard canvas.

Choose based on whether the user manipulates structured nodes, executable/programmatic dataflow or freeform sketches.

### Dynamic layouts and drag/drop

- [React Grid Layout](https://github.com/react-grid-layout/react-grid-layout) — draggable/resizable responsive dashboard widgets.
- [dnd-kit](https://github.com/clauderic/dnd-kit) — accessible sortable and nested drag/drop interactions.
- [FormKit Drag and Drop](https://github.com/formkit/drag-and-drop) — framework-agnostic drag/drop alternative.
- [React Resizable Panels](https://github.com/bvaughn/react-resizable-panels) — resizable panes and workspace splits.

Every drag/resize interaction needs keyboard alternatives, touch behavior, responsive fallback and a deliberate layout persistence model.

### Dynamic CSS and motion

- [Open Props](https://github.com/argyleink/open-props) — CSS custom-property library for design tokens, spacing, typography and easing. Map values into the project's existing token contract.
- [CSS Doodle](https://github.com/css-doodle/css-doodle) — generative CSS patterns and creative visuals. Keep decorative effects performant and accessible.
- [React Spring](https://github.com/pmndrs/react-spring) — spring-physics animation for React.
- [Anime.js](https://github.com/juliangarnier/anime) — framework-agnostic property, SVG and timeline animation.

React Spring and Anime.js are alternatives to the existing Motion/GSAP/CSS allocation, not extra owners on the same target.

### App framework choices

- [Next.js](https://github.com/vercel/next.js) — React full-stack framework.
- [SvelteKit](https://github.com/sveltejs/kit) — Svelte full-stack framework.
- [Nuxt](https://github.com/nuxt/nuxt) — Vue full-stack framework.

Choose one framework for an app. Do not combine multiple app shells simply because they appear in the catalogue.

### Offline authoring, static search and publishing checks

| Project | When to use it | Selection notes |
| --- | --- | --- |
| [Squoosh](https://github.com/GoogleChromeLabs/squoosh) | Compare a hero image at several quality settings in the browser and export the smallest acceptable version. | Use for one-off visual comparisons. Keep Sharp for repeatable batches. |
| [draw.io Desktop](https://github.com/jgraph/drawio-desktop) | Draw a navigation map or architecture diagram offline and keep its editable source alongside the SVG export. | Choose for diagrams that contributors need to edit. Include a text description when publishing. |
| [fontTools](https://github.com/fonttools/fonttools) | Subset a locally supplied font to reduce the bytes a page downloads. | Check the font license permits modification and test all supported scripts before shipping a subset. |
| [Pagefind](https://github.com/Pagefind/pagefind) | Index rendered HTML after the site build and ship the search index with the static site. | Choose when a documentation site needs full-text search on GitHub Pages. Index only public output. |
| [lychee](https://github.com/lycheeverse/lychee) | Find broken links in Markdown and generated HTML before publishing. | Use offline mode for local paths. Enable external checks only when network access is appropriate. |

### Desktop and Android apps

The [app toolkit](APP-TOOLKIT.md) covers cross-platform frameworks, platform-specific sample apps, theming, accessibility, device performance and APK inspection.

### License and cost policy

The registry records upstream license metadata for each candidate. That is a screening aid, not legal approval: check the exact package, plugins, templates, assets and deployment model before adoption. AGPL/GPL obligations need explicit review. Free/open-source code does not make managed hosting, AI APIs, storage, database operations or compute free. None of these candidates has been installed or activated in the app.
