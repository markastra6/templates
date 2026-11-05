# Website development toolkit

This project has a strict zero-spend requirement. The toolkit below uses free/open-source software and optional free tiers. It does not require a paid subscription, paid model API, or paid component license.

The repository currently has no application scaffold, so frontend dependencies will be selected after the framework is chosen.

## Unified operation: one contract, many specialist tools

The system is coordinated by [the unified-web-engineering skill](../.agents/skills/unified-web-engineering/SKILL.md), not by assuming that all tools can call one another directly. Before a substantial feature, read [the architecture](architecture/UNIFIED-TOOLCHAIN.md) and create or resume one [feature handoff contract](contracts/ui-handoff.template.json). The [tool registry](contracts/toolchain.registry.json) records each tool's responsibility, configured status, inputs and outputs.

The operating chain is:

1. **Design intelligence:** UI/UX Pro Max proposes the information architecture, UX patterns and initial tokens; Taste shapes art direction and later critiques real browser output.
2. **Design authority:** choose one Penpot, Figma or Lunacy source for the feature and inspect its actual constraints, components, variables and assets.
3. **Component discovery:** shadcn/ui is the primitive baseline. Watermelon UI and 21st.dev find and compare candidates; React Bits is used through Manus when available; Motion Primitives supplies optional Motion-based components.
4. **Implementation:** project tokens own the visual system. Motion for React handles React state/gesture/layout transitions; GSAP handles complex timelines and scroll choreography; CSS handles simple states.
5. **Assets and browser feedback:** Haikei exports versioned assets. Alibaba Page Agent may explore a local/staging preview; Playwright remains the repeatable test runner.
6. **Security and release:** Strix performs authorized local/staging security work; GitHub Actions, CodeQL, Gitleaks, Pa11y and Lighthouse provide repeatable gates.

All specialist outputs must be written into the same feature handoff: tokens, chosen components, source/licence/dependencies, motion owner per target, data/mock truth, tool runs, defects and test evidence. Never depend on chat history to synchronize different clients.

**Important:** an entry in .mcp.json or an installer command does not prove that a tool is live in the current client. Check connectivity before use. Manus, ChatGPT and other coding clients need their own supported integrations; they synchronize through the committed contract and Git history.

## 1. Install agent skills

Run from the repository root:

```bash
bash scripts/setup-agent-toolkit.sh gsap
```

Choose one of motion, gsap, taste, vercel, 21st, uipro or shadcn. Select all explicitly to run each installer. The shadcn option prepares the local MCP CLI. Run the MCP client from the repository root. npm ci verifies dependencies against the committed toolkit lockfile.

Available selections:

| Tool / skill | Purpose | Cost |
|---|---|---|
| [Motion AI kit](https://motion.dev/docs/react) | Motion for React documentation and agent tooling | Free/open source |
| [GSAP skills](https://github.com/greensock/gsap-skills) | Timelines, ScrollTrigger, React integration and performance | Free; GSAP's full toolset is free |
| [Taste](https://github.com/Leonxlnx/taste-skill) | Art direction, layout, typography and browser-based visual QA | Free; no API key |
| [Vercel React best practices](https://github.com/vercel-labs/agent-skills) | React and Next.js performance guidelines | Open source |
| [Vercel web design guidelines](https://github.com/vercel-labs/agent-skills) | UX, accessibility, responsive behavior and interface review | Open source |
| [21st.dev skills](https://github.com/21st-dev/skill) | Discover and adapt component patterns | Free skill; service has free-tier limits |
| [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Design systems, styles, palettes, typography and UX patterns | Open-source basic version |
| [Design-to-code skill](../.agents/skills/design-to-code/SKILL.md) | Translate Penpot, Lunacy or connected Figma designs into accessible, token-based UI | Included in this repository |

Taste requires Node.js 22+ and Chrome, Edge or Chromium for its browser inspection script. It does not need API keys.

## 2. MCP integrations

Project configuration is in [.mcp.json](../.mcp.json).

| Server | Purpose | Cost / limit |
|---|---|---|
| shadcn | Search and install components from public shadcn-compatible registries | Free/open source |
| Watermelon UI | Search its component, block, dashboard and template catalog | Public MCP endpoint; no key configured |
| 21st.dev | Component search and retrieval | Free account supports 2 component-code retrievals per day; paid plan is not needed if we stay within that allowance |
| Penpot | Read and edit the active design file through Penpot's official MCP | Open source/local option; hosted remote availability depends on the Penpot account/deployment |
| Lunacy | Inspect selected layers, variables, components and assets in the running Lunacy desktop app | Free desktop app; local MCP, no paid API key |
| Context7 | Retrieve current library documentation and code examples | Public remote MCP; anonymous use has low rate limits |

21st.dev's free tier requires a free account/API token for most MCP clients. Set `API_KEY_21ST` in the environment used to launch the MCP client. Do not purchase Builder or AI credits. Its search/browsing is free and the free account currently includes 2 code retrievals daily. See [21st.dev MCP docs](https://docs.21st.dev/mcp) and [pricing/limits](https://mcp.21st.dev/pricing).

Penpot and Lunacy setup is optional and documented in [DESIGN-TOOLS.md](DESIGN-TOOLS.md). Penpot's project entry reads a complete URL from `PENPOT_MCP_URL`; do not commit the URL because it contains an access key. Lunacy supplies its own server configuration from the running app; copy its entry instead of guessing a local port or endpoint.

Context7 is configured at `https://mcp.context7.com/mcp`. Anonymous access is available with lower rate limits; optional authentication raises limits depending on its plan. Do not add a paid plan or API-credit dependency. See [Context7 installation](https://context7.com/docs/installation) and [MCP client guidance](https://context7.com/docs/resources/all-clients).

The connected ChatGPT Figma app is a separate design integration, not a project MCP server. Its availability and feature limits depend on the user's Figma/ChatGPT accounts.

The project MCP format may need translation for clients that do not support Claude Code-style `.mcp.json`.

## 3. Component and visual libraries

Use these as source libraries, not as a reason to install every package.

| Resource | Use | Cost guidance |
|---|---|---|
| [React Bits](https://reactbits.dev/) | Animated React components, text effects, backgrounds and micro-interactions; accessed through Manus in the owner's workflow | Select source deliberately; inspect the component-level licence and third-party notices before commercial reuse |
| [Watermelon UI](https://ui.watermelon.sh/) | React components, blocks, dashboards and templates | Use free/public components |
| [Motion Primitives](https://motion-primitives.com/) | Copy-in animated React components built around Motion and Tailwind CSS | Open-source; requires a compatible React/Tailwind application and Motion runtime |
| [21st.dev](https://21st.dev/) | Component marketplace and retrieval | Free tier only; 2 code retrievals/day |
| [shadcn/ui](https://ui.shadcn.com/) | Base component primitives and registry workflow | Free/open source |
| [Haikei](https://haikei.app/) | Generate/export SVG and PNG backgrounds | Free tier currently advertises 15 generators and SVG/PNG export; check current limits before use |
| [Alibaba Page Agent](https://github.com/alibaba/page-agent) | In-page DOM-aware natural-language browser exploration; optional extension and beta MCP | Open source; requires its own model/runtime configuration. Not a substitute for Playwright |

### Animation choice

- Use Motion for React (formerly Framer Motion) for React component transitions, layout animation and gestures. For a new app, install the `motion` package and import from `motion/react`; use the legacy `framer-motion` package only when a selected dependency requires it. Do not add both without a documented compatibility reason.
- Use GSAP for complex timelines and scroll choreography. Its full toolset, including formerly paid plugins, is now free. GSAP skills are agent guidance; the GSAP runtime is a separate app dependency.
- Do not animate the same element with both engines. Respect `prefers-reduced-motion`.
- Use CSS transitions for simple hover/focus states.

Motion Primitives is built on Motion and Tailwind CSS; it is a source library, not another animation engine. Do not add animation dependencies until the app framework is selected.

## 4. Automated repository checks

The repository contains GitHub Actions workflows for:

| Workflow | Trigger | Purpose | Current state |
|---|---|---|---|
| Repository validation | Every push, pull request, manual | Checks MCP JSON, env placeholders, `.gitignore`, local Markdown links, public audit URL regression tests, installer syntax, GitHub Actions syntax via actionlint and full-diff whitespace | Runs now; actionlint is checksum-verified before use |
| Quality checks | Push, pull request, manual | Markdown lint; optional npm dependency audit, lint, typecheck, test and build | Runs on the directory starter |
| CodeQL | Push, pull request, weekly schedule | Static security analysis for Python and JavaScript/TypeScript | Both languages have tracked source |
| Secret scan | Push, pull request, weekly schedule | Gitleaks scans Git history for accidentally committed credentials | Runs now |
| Browser tests | Push, pull request, manual | Playwright Chromium tests | Runs the directory search and keyboard tests at desktop and phone widths |
| Accessibility audit | Manual | Pa11y CI audit against a supplied public URL | Runs when a target URL is provided |
| Lighthouse audit | Manual | Performance, accessibility, best-practices and SEO report | Runs when a target URL is provided; report stored as a short-retention artifact |
| GitHub Pages deploy | Manual | Builds the directory and deploys `dist/site/` | Requires Pages configuration |

The repository also has a Python-based validator at `scripts/validate_repo.py`; it checks the repository-owned MCP and environment configuration, not whether remote MCP endpoints are reachable. The workflow separately runs actionlint against every GitHub Actions workflow, downloading a pinned release and verifying its SHA-256 checksum before execution. Its checkout disables persisted Git credentials. Keep this validation workflow and script when editing `.mcp.json`, `.env.example`, `.gitignore`, or Markdown links.

The public repository uses standard GitHub-hosted runners. The workflows do not call paid AI APIs or paid external scanning services. Lighthouse and accessibility audits accept only public HTTPS targets: a standard-library Python validator rejects credentials, local/reserved hostnames, non-default ports, and DNS answers containing non-global IP addresses. Its regression tests run in repository validation. The hosted browser runs inside a separate Linux network namespace with a pinned TLS relay for the authorized hostname. Use a staging site you control. Do not put credentials or private URLs into workflow inputs.

### Running manual audits from GitHub on mobile

1. Open the repository's **Actions** tab.
2. Select **Lighthouse audit** or **Accessibility audit**.
3. Choose **Run workflow**.
4. Enter the public website URL and start the workflow.
5. Open the run to see the logs or download the Lighthouse HTML artifact.

These manual audits become useful once the site is deployed.

### GitHub Pages setup

When the website is ready, open **Settings → Pages** and set the build/deployment source to **GitHub Actions**. The deployment workflow generates `dist/site/index.html` from the registry. No custom domain is required.

### Dependency updates

Dependabot checks Actions and both npm projects weekly. CI runs locked installs and rejects high-severity advisories.

## 5. Strix without API spending

Strix is open source. It can use a local model through Ollama, so no paid LLM API key is required. This avoids API charges but requires local compute, disk space, Docker and model downloads. A large model may not run well on modest hardware.

Install Ollama, then download a model that your computer can handle. Strix's docs currently show this example:

```bash
ollama pull qwen3-vl
```

Install Strix and configure the local model:

```bash
# Start after installing a reviewed Strix release from its upstream repository.
export STRIX_LLM="ollama/qwen3-vl"
export LLM_API_BASE="http://localhost:11434"
strix -n --target ./ --scan-mode quick
```

Strix's local-model guide: [Ollama setup](https://github.com/usestrix/strix/blob/main/docs/llm-providers/local.mdx).

**Do not use the removed GitHub Actions Strix workflow.** Cloud CI scans with hosted LLM inference could create charges. Run Strix locally only, with the Ollama endpoint selected. Only test this repository or systems you are authorized to assess.

## 6. What is free and what has limits?

- Free/open source: GSAP, Motion, shadcn/ui, public React Bits components, UI/UX Pro Max basic, Taste, Vercel agent skills, Playwright, Pa11y, Lighthouse, Gitleaks, CodeQL for public repositories, Dependabot, Strix software and Ollama.
- Free with usage limits: 21st.dev component retrieval (2/day on its free account) and Context7 anonymous requests.
- Penpot is open source; use its local MCP option when remote MCP is unavailable.
- Lunacy provides a free single-user desktop option; keep use within its free license.
- No paid React Bits Pro license, 21st.dev subscription, Strix API key, hosted LLM, or AI credits should be purchased.
- Normal internet/data usage, local electricity, and computer storage are not included in software pricing.

## 7. Pending app scaffold

The runnable starter is a static directory with a root npm test harness and optional GitHub Pages deployment. Do not install React, Next.js, Tailwind, Motion, GSAP, React Bits components, or Watermelon components until the framework and actual site requirements are selected.

Once the scaffold exists:

1. Initialize shadcn/ui.
2. Add free Watermelon UI components only when they solve a real requirement.
3. Copy/install public React Bits components selectively.
4. Add Motion and/or GSAP only where required.
5. Export Haikei SVG assets and commit them to the project.

## 8. Expanded ecosystem: choose specialists by need

The repository's [expanded ecosystem catalogue](references/EXPANDED-WEB-TOOL-ECOSYSTEM.md) and [112-entry tool registry](contracts/toolchain.registry.json) cover more than the original design/motion stack. The 97 additional projects are reviewed candidates, not automatically installed dependencies. Read the catalogue before adding any of them.

### Skills and agent capabilities

- [Emil Kowalski skills](https://github.com/emilkowalski/skills): build/review/audit motion with a high craft bar. Install only the specific skill needed.
- [UX Skills](https://github.com/Tranz007/ux-skills): challenge assumptions, preserve user evidence and produce engineering-ready UX decisions.
- [Frontend AI Skills](https://github.com/JustineBijuPaul/frontend-ai-skills): broad specialist-skill discovery pool. Do not install the entire 70+ skill collection.

These add methods and guidance. They do not install the frontend runtime packages they describe, and they must not create competing design-token systems.

### Browser, component and accessibility capabilities

- [Microsoft Playwright MCP](https://github.com/microsoft/playwright-mcp): agent-driven browser exploration using accessibility snapshots. Optional local MCP; Node.js and browser runtime required.
- [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp): Chrome console, network and performance diagnostics. Optional local MCP; desktop Chrome required.
- [Storybook](https://github.com/storybookjs/storybook): isolated component stories and component documentation; Storybook MCP addon is in the Storybook monorepo from v10.6.
- [axe-core](https://github.com/dequelabs/axe-core): automated accessibility checks that can run inside component/browser tests. It does not replace manual accessibility review.

Keep Page Agent/Playwright MCP as exploratory agents, Playwright Test as deterministic regression coverage and Chrome DevTools MCP as a diagnostics specialist.

### Component and application behavior candidates

Use the registry's trigger rules:

- **Primitives:** Base UI, Radix UI or React Aria are alternatives/underlying primitive choices. Mantine is a complete UI-system alternative. Do not blend multiple global systems.
- **Remote state and tables:** TanStack Query and TanStack Table.
- **Forms and schemas:** React Hook Form and Zod.
- **Mock APIs:** Mock Service Worker.
- **Client state:** Zustand only when ordinary React state/context no longer fits.
- **Charts:** Recharts only for real data-visualization needs.
- **Icons:** choose Lucide or Tabler Icons as the main family.

### Build, motion and asset capabilities

- **Tests:** Vitest and React Testing Library for unit/component behavior when the app stack supports them.
- **Motion/3D:** dotLottie Web for authored/licensed vector animations; Lenis only for a justified scroll experience; Three.js + React Three Fiber + Drei only for an explicit 3D requirement.
- **Assets:** SVGO for SVG optimization and Sharp for raster image variants.
- **Framework candidates:** Vite for a client-side app; Astro for content-first static/hybrid pages; Starlight for a separate documentation site. No framework is selected yet.

### Security and supply chain

- **Biome:** possible single formatter/linter choice; use Biome OR ESLint plus Prettier over the same files.
- **Knip:** unused files/exports/dependencies after a package manifest exists.
- **OSV-Scanner:** dependency advisories and optional license checks against a lockfile/SBOM.
- **Trivy:** filesystem, container, secret, IaC, SBOM and license scans.
- **OWASP ZAP:** dynamic security testing against explicitly authorized staging only.

These supplement existing CodeQL, Gitleaks, npm audit, Strix and the manual Pa11y/Lighthouse workflows. Add scanners only to fill a named coverage gap; do not run every scanner on every commit.

### Backend and analytics candidates

Supabase and Appwrite are backend alternatives. Umami is an optional privacy-oriented analytics system. All are conditional on an actual product requirement. Open-source software does not pay for hosting: self-hosting requires compute, storage, backups and maintenance; managed free tiers have quotas and may require billing controls. Do not configure them until the data model, access policy and ongoing cost boundary are clear.

### Activation policy

- The catalogue and registry are shared references, not proof of active connections.
- Optional MCP servers remain out of `.mcp.json` until a compatible client and desktop runtime can actually run them. ChatGPT Android cannot launch local Node.js/Chrome MCP processes from a GitHub commit.
- No package is added to the application before a framework, feature and acceptance criteria exist.
- At adoption time, inspect the upstream repository, current release, package-specific license, dependency tree, security posture, client compatibility and possible overage/hosting costs.
- Add the chosen component/tool and its provenance to the feature handoff contract.

### Further additions in registry 1.2.0

- **TanStack Intent:** version-matched package skills when using TanStack libraries. Review generated instructions/permissions.
- **Lighthouse CI:** automated Lighthouse budgets in CI against a real preview; do not add a persistent report server by default.
- **Pa11y CI:** multi-route or sitemap accessibility CI when the site has several pages. Keep manual assistive-technology checks.
- **Payload CMS:** optional Next.js-native content backend/admin for structured editorial workflows; requires hosting and a database.
- **CSpell:** spell-check documentation and code terminology when the content volume warrants it.

PocketBase is deliberately excluded from the recommended candidate list because its upstream repository was archived on October 26, 2026. A tool being open source is not enough; active maintenance and acceptable risk still matter.

## 1.3.0 — Application builders, interactive UI and dynamic layout

The latest expansion adds 30 candidates specifically for building apps, editable pages, interactive UI, visual flows, responsive workspaces and dynamic CSS. These tools solve different problems and should not be stacked indiscriminately.

### Visual webpage and page-authoring systems

- **Puck** — React-native visual page editor. Use when the product itself needs editable page composition inside a React app.
- **GrapesJS** — framework-agnostic HTML/CSS drag-and-drop builder. Use for template/CMS-style editing; inspect generated markup and plugin licenses.
- **Webstudio** — full visual website builder. AGPL-3.0; review deployment and modification obligations before self-hosting.
- **Onlook** — visual editing of real codebases. Core source is Apache-2.0; AI features may need external model services and must not silently create API spend.

### Visual app builders and code-first admin frameworks

- **Appsmith** — low-code internal tools, dashboards and data-backed admin panels.
- **Budibase** — internal business apps and operations workflows. Overall GPLv3 guidance; check each package's license.
- **ToolJet** — low-code internal apps and workflows. AGPL-3.0.
- **Refine** — code-first React framework for custom admin/B2B applications.
- **React Admin** — data-centric CRUD interfaces over REST/GraphQL.

Appsmith/Budibase/ToolJet are visual low-code builders; Refine/React Admin are code-first frameworks. Choose one architecture based on product requirements. Self-hosting still needs infrastructure; managed tiers can cost money.

### Interactive component systems and primitives

- **Magic UI** — animated React/Tailwind component source.
- **daisyUI** — semantic Tailwind components and theme layer.
- **Flowbite React** — Tailwind-based React components; distinguish free core from separately licensed Pro assets.
- **Chakra UI** and **MUI** — alternative full React component/design systems.
- **Headless UI** — unstyled accessible interactive primitives.
- **Floating UI** — low-level tooltip, popover, menu and anchored-element positioning engine.

Do not combine multiple global design systems. Keep shadcn as the existing baseline unless a feature has a documented reason to choose another.

### Flow editors, diagrams and canvas interfaces

- **React Flow / Svelte Flow** — interactive node graphs and workflow designers.
- **Rete.js** — programmable visual programming and dataflow editors.
- **Excalidraw** — freeform diagramming and whiteboard canvas.

Use structured node editors for workflows and Excalidraw for freeform sketching; these are not interchangeable.

### Dynamic layouts and drag/drop

- **React Grid Layout** — draggable/resizable dashboard widget grids with responsive breakpoints.
- **dnd-kit** — sortable, nested and custom drag/drop interactions.
- **FormKit Drag and Drop** — lighter framework-agnostic drag/drop alternative.
- **React Resizable Panels** — resizable split panes and workspace layouts.

Every drag interaction needs keyboard alternatives, touch support, responsive behavior and an explicit persistence policy.

### Dynamic CSS and alternative motion models

- **Open Props** — CSS custom properties for design tokens, easing, spacing, colors and typography. Map selected values into the existing project token contract.
- **CSS Doodle** — generative CSS visuals and backgrounds. Keep effects decorative, performant and accessible.
- **React Spring** — spring-physics animation for React.
- **Anime.js** — framework-agnostic property/SVG/timeline animation.

React Spring and Anime.js are alternatives, not additional defaults. Maintain one animation owner per DOM target.

### Application framework alternatives

- **Next.js** — React full-stack framework.
- **SvelteKit** — Svelte full-stack framework.
- **Nuxt** — Vue full-stack framework.

These are mutually exclusive app-shell choices for a given application. The repository still has no selected framework.

### Licensing and operating boundaries

All 30 projects have upstream repository license metadata recorded in the registry. The exact package, plugin, template, component and asset license must still be checked before copying or deploying. AGPL/GPL projects require deliberate review. No new runtime package, visual editor, MCP server, hosted backend or paid service was activated by this research.
