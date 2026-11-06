# Website Creation

Start with the [website and app creation directory](docs/CREATION-DIRECTORY.md) to find design skills, component connectors, motion libraries, graphics and audit tools.

Use the [interactive App Blueprint Studio](site/app-blueprint.html) to plan a cross-platform application, preview responsive navigation and record audit results locally. [Usage, privacy and test-evidence guide](docs/references/APP-BLUEPRINT-STUDIO.md). The studio does not build native binaries.\n\nFor Windows, macOS and Android, use the [app toolkit](docs/references/APP-TOOLKIT.md) and copy the [app planning and audit template](docs/contracts/APP-PLAN-AND-AUDIT.md) into your feature folder.

Original work and third-party resources have separate [reuse terms](RIGHTS.md).

## Offline Windows/macOS workbench

The [offline-bundle workflow](.github/workflows/offline-bundle.yml) creates an integrity-checked, prebuilt ZIP containing the full website catalogue plus Windows and macOS Python launchers. Download the **ui-workbench-offline** artifact from a successful [GitHub Actions run](https://github.com/markastra6/templates/actions/workflows/offline-bundle.yml), extract it, and run `Start_Workbench.bat` on Windows or `Start_Workbench.command` on macOS. Open `http://127.0.0.1:8080/` in your browser. Only Python 3 is needed to run the prebuilt site—no npm or hosting. This is not a native installer or APK.

## Cost policy

This project has a strict zero-spend requirement. Use free/open-source tools, free public-repository GitHub Actions, and GitHub Pages. Do not introduce paid subscriptions, paid model APIs, paid hosting, paid assets, or paid component licenses. Optional free tiers may have usage limits.

## Current audit and improvement roadmap

The [5 November 2026 repository-wide audit](docs/audits/2026-11-05-repository-audit.md) documents verified code, catalogue, security, governance, accessibility, publishing and Windows-access findings. It provides prioritized acceptance criteria and an implementation order. The audit distinguishes 9,403 discovery metadata records from executable or license-verified components.

## Current repository setup

- Agent skills: Motion, GSAP, Taste, Vercel React best practices, Vercel web design guidelines, 21st.dev, UI/UX Pro Max, and the repository's design-to-code skill.
- MCP configuration: shadcn, Watermelon UI, optional 21st.dev, Penpot remote MCP, and optional Context7 documentation MCP.
- Design sources: Penpot (preferred open source), Lunacy (optional desktop MCP), and Figma through the connected ChatGPT app when available.
- Validation: repository validation checks MCP JSON, environment placeholders, `.gitignore`, local Markdown links, audit-target URL safety tests, installer syntax, GitHub Actions workflow syntax and full-diff whitespace on every push/pull request.
- Quality: Markdown lint and optional Node.js dependency audit, lint, typecheck, test and build jobs.
- Security: CodeQL for JavaScript/TypeScript when present, Gitleaks history scans and npm audit when a Node.js project exists.
- Browser and UX: Chromium browser tests, manual Pa11y accessibility audit and manual Lighthouse audit.
- Deployment: GitHub Pages workflow builds and publishes `dist/site/` on every push to `main`, with optional manual dispatch. Requires one-time Pages source configuration in repository settings.
- Dependency maintenance: weekly Dependabot updates for GitHub Actions; npm updates cover the starter and local toolkit.

## Mobile-first workflow

Repository changes can be managed through GitHub's website and connected GitHub integration. The agent skill installer is optional and requires a compatible coding-agent environment; it has not been run on the user's Android device. MCP configuration in this repository does not automatically connect custom MCP servers to ChatGPT's Android app. Penpot's remote MCP can work only through a compatible MCP client; Lunacy's documented MCP requires its native desktop app. Figma's ChatGPT connection is separate from project MCP configuration.

See [the unified toolchain architecture](docs/architecture/UNIFIED-TOOLCHAIN.md), [the orchestrator skill](.agents/skills/unified-web-engineering/SKILL.md), and [the shared UI handoff contract](docs/contracts/ui-handoff.template.json) for the coordinated design-to-release workflow. The tool registry is [docs/contracts/toolchain.registry.json](docs/contracts/toolchain.registry.json). The [expanded open-source ecosystem catalogue](docs/references/EXPANDED-WEB-TOOL-ECOSYSTEM.md) adds 97 reviewed candidates across skills, MCP, components, data, testing, accessibility, assets, 3D, frameworks, security, backend and analytics; candidates are not automatically installed. See [docs/DEVELOPMENT-TOOLKIT.md](docs/DEVELOPMENT-TOOLKIT.md) for setup, free-tier limits, quality/security workflows, local Strix requirements and component sources. See [docs/DESIGN-TOOLS.md](docs/DESIGN-TOOLS.md) for Penpot and Lunacy setup. See [docs/REPOSITORY-GOVERNANCE.md](docs/REPOSITORY-GOVERNANCE.md) for the recommended `main` branch protections and current enforcement status. See [docs/AI-HANDOFF.md](docs/AI-HANDOFF.md) for the dated project context and continuation instructions for another coding agent. See [the Code and Chill UI playbook](docs/references/CODE-AND-CHILL-UI-PLAYBOOK.md) and its [structured catalogue](docs/references/code-and-chill-catalogue.json) for public-source UI patterns and original reusable prompts.

Coding agents must read [AGENTS.md](AGENTS.md) before making changes and read [.agents/skills/design-to-code/SKILL.md](.agents/skills/design-to-code/SKILL.md) before substantial design-to-code work.

## Unified workbench home

The static homepage now brings the three core workflows together: component reference discovery and saved comparisons, original design-token editing and CSS export, and the repository's searchable development tool registry. The source and reference counts are generated from the checked-in index at build time rather than hard-coded into the page. This is a unified navigation and tool workspace, not a claim that 31 independent websites or their paid templates are installed locally.

## UI component source explorer

The [UI source directory](docs/references/ui-component-sources.json) lists 31 sites. Fifteen sources have linked metadata snapshots under [ui-index](docs/references/ui-index), currently totaling 9,403 public component references. Run `npm run build` and open `dist/site/ui-explorer.html` to browse the static, searchable index. Each result links to the original publisher. No third-party code, screenshots or paid templates are bundled. See [data provenance and refresh process](docs/references/UI-COMPONENT-INDEX.md) before using any component.

## Component discovery workspace

The [source explorer](site/ui-explorer.js) now supports source and component-type filters, conservative grouping of known implementation variants, browser-local saved references, and side-by-side metadata comparison of up to three items. Save up to 200 component references and use **Export saved** / **Import saved JSON** to move your shortlist between browsers. The shortlist contains only source IDs; it never uploads personal information to a backend. Browser storage is best-effort, so export important shortlists before clearing browser data.

The explorer deliberately **does not execute or embed third-party components**; it links to their original websites or GitHub source for licensing, compatibility and preview review. See the [workspace instructions](docs/references/UI-WORKSPACE.md) and [source provenance](docs/references/UI-COMPONENT-INDEX.md). Implementation decisions and quality gates are recorded in the [feature handoff contract](docs/contracts/features/ui-discovery-workspace.json).

## Design Token Studio

The [Design Token Studio](site/token-studio.html) is an original, browser-local theme editor included in the static-site build. It provides three starting palettes (Forest, Ocean, Night), editable seven-color design tokens, typography, spacing and corner radius, and responsive desktop/tablet/mobile previews of a deliberately non-functional sample dashboard. It calculates WCAG normal-text contrast for both body and primary-action color pairs and explicitly warns when a combination falls below 4.5:1.

Export reusable CSS custom properties or validated JSON, and import JSON themes (maximum 16 KiB). Themes are stored locally when browser storage is available; nothing is sent to a server. The studio does not embed or execute indexed third-party components. See the [token-studio reference](docs/references/DESIGN-TOKEN-STUDIO.md) and [feature contract](docs/contracts/features/design-token-studio.json).

## Starter Page Composer

The [Page Composer](site/page-composer.html) assembles a standalone original page from five built-in section types (Hero, Features, Highlights, Call to action, Footer). Use the section list's **Move up** and **Move down** controls for keyboard-accessible reordering; edit headings, descriptions and section-navigation labels; preview desktop, tablet or mobile; and import your saved Design Token Studio theme. Export a single-file HTML page with inline, validated CSS tokens, or a portable editable project JSON. Up to 16 sections are supported, with best-effort local browser persistence.

The composer is **not** an arbitrary third-party code runner or a production CMS. Its sample content and navigation should be reviewed and rewritten for the intended website before publication. See [usage, safety and export details](docs/references/PAGE-COMPOSER.md) and the [feature contract](docs/contracts/features/starter-page-composer.json).

## Original Component Lab

The [Component Lab](site/component-lab.html) contains six repository-owned examples: toggle button, keyboard tabs, native accordion, email-validation form, status notification and example metric. Each example uses an isolated `sandbox="allow-scripts"` iframe with an opaque origin, built-in restrictive CSP, repository-owned CSS and scripts, and the shared seven-color token schema. No external component code or catalogue assets are executed.

Switch between desktop, tablet and mobile frame sizes, edit bounded example text, select Forest/Ocean/Night or import the locally saved Design Token Studio theme, and inspect the generated source. Export a standalone HTML document that works without a network connection, or editable JSON that can be imported again. The iframe is recreated when editing changes; interactive demo state is not persisted. The standalone form is a non-network demo and never submits an email address. These are starter components, not a general React source-code runner or production application backend.

See [Component Lab reference](docs/references/COMPONENT-LAB.md) and its [feature contract](docs/contracts/features/original-component-lab.json).

## Hosted workbench (no Node.js needed on your computer)

This public repository can host the complete static workbench through GitHub Pages. In repository **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions** once. Thereafter, the [Pages workflow](.github/workflows/pages.yml) automatically builds and deploys the site whenever changes land on `main`; it also supports a manual **Run workflow** action. Deployment must succeed before these URLs become available:

- Workbench: `https://markastra6.github.io/templates/`
- Component Lab: `https://markastra6.github.io/templates/component-lab.html`

No local Node.js, npm or Python web server is needed for visitors. To check a failure, open **Actions → Deploy static site to GitHub Pages** and inspect the latest deployment log. If Pages has not been enabled in settings, the repository owner must enable that setting; a workflow cannot guarantee access on its own.

## Run the starter

The example website searches the tool registry. From the repository root, run the following with Node.js 24 and Python 3, then open the address printed by the local server.

```sh
node scripts/build-site.mjs
python -m http.server 8080 --bind 127.0.0.1 --directory dist/site
```

Open [the local starter](http://127.0.0.1:8080). Edit the registry and rebuild to update the directory. The static site has no runtime packages and works with keyboard, touch, and JavaScript disabled. For automated checks, run npm ci, npm test and npm run typecheck. Install Chromium with npx playwright install chromium before running npx playwright test.

For manual external audits, set the repository variable AUDIT_HOST to a DNS name you control. The default is the owner's GitHub Pages hostname. The hosted browser can reach only the chosen host's pinned TLS endpoint. Cross-origin assets will be blocked, so use a first-party staging build when measuring performance. Lighthouse minimums are 75 for performance, 90 for accessibility, 85 for best practices and 80 for SEO. Reports are retained when a budget fails.

Windows, macOS and Android native starter builds are outside this static example. See the app toolkit for target-specific plans.
