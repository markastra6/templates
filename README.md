# Website Creation

Start with the [website and app creation directory](docs/CREATION-DIRECTORY.md) to find design skills, component connectors, motion libraries, graphics and audit tools.

For Windows, macOS and Android, use the [app toolkit](docs/references/APP-TOOLKIT.md) and copy the [app planning and audit template](docs/contracts/APP-PLAN-AND-AUDIT.md) into your feature folder.

Original work and third-party resources have separate [reuse terms](RIGHTS.md).

## Cost policy

This project has a strict zero-spend requirement. Use free/open-source tools, free public-repository GitHub Actions, and GitHub Pages. Do not introduce paid subscriptions, paid model APIs, paid hosting, paid assets, or paid component licenses. Optional free tiers may have usage limits.

## Current repository setup

- Agent skills: Motion, GSAP, Taste, Vercel React best practices, Vercel web design guidelines, 21st.dev, UI/UX Pro Max, and the repository's design-to-code skill.
- MCP configuration: shadcn, Watermelon UI, optional 21st.dev, Penpot remote MCP, and optional Context7 documentation MCP.
- Design sources: Penpot (preferred open source), Lunacy (optional desktop MCP), and Figma through the connected ChatGPT app when available.
- Validation: repository validation checks MCP JSON, environment placeholders, `.gitignore`, local Markdown links, audit-target URL safety tests, installer syntax, GitHub Actions workflow syntax and full-diff whitespace on every push/pull request.
- Quality: Markdown lint and optional Node.js dependency audit, lint, typecheck, test and build jobs.
- Security: CodeQL for JavaScript/TypeScript when present, Gitleaks history scans and npm audit when a Node.js project exists.
- Browser and UX: Chromium browser tests, manual Pa11y accessibility audit and manual Lighthouse audit.
- Deployment: manual GitHub Pages workflow for the generated static directory in `dist/site/`.
- Dependency maintenance: weekly Dependabot updates for GitHub Actions; npm updates cover the starter and local toolkit.

## Mobile-first workflow

Repository changes can be managed through GitHub's website and connected GitHub integration. The agent skill installer is optional and requires a compatible coding-agent environment; it has not been run on the user's Android device. MCP configuration in this repository does not automatically connect custom MCP servers to ChatGPT's Android app. Penpot's remote MCP can work only through a compatible MCP client; Lunacy's documented MCP requires its native desktop app. Figma's ChatGPT connection is separate from project MCP configuration.

See [the unified toolchain architecture](docs/architecture/UNIFIED-TOOLCHAIN.md), [the orchestrator skill](.agents/skills/unified-web-engineering/SKILL.md), and [the shared UI handoff contract](docs/contracts/ui-handoff.template.json) for the coordinated design-to-release workflow. The tool registry is [docs/contracts/toolchain.registry.json](docs/contracts/toolchain.registry.json). The [expanded open-source ecosystem catalogue](docs/references/EXPANDED-WEB-TOOL-ECOSYSTEM.md) adds 97 reviewed candidates across skills, MCP, components, data, testing, accessibility, assets, 3D, frameworks, security, backend and analytics; candidates are not automatically installed. See [docs/DEVELOPMENT-TOOLKIT.md](docs/DEVELOPMENT-TOOLKIT.md) for setup, free-tier limits, quality/security workflows, local Strix requirements and component sources. See [docs/DESIGN-TOOLS.md](docs/DESIGN-TOOLS.md) for Penpot and Lunacy setup. See [docs/REPOSITORY-GOVERNANCE.md](docs/REPOSITORY-GOVERNANCE.md) for the recommended `main` branch protections and current enforcement status. See [docs/AI-HANDOFF.md](docs/AI-HANDOFF.md) for the dated project context and continuation instructions for another coding agent. See [the Code and Chill UI playbook](docs/references/CODE-AND-CHILL-UI-PLAYBOOK.md) and its [structured catalogue](docs/references/code-and-chill-catalogue.json) for public-source UI patterns and original reusable prompts.

Coding agents must read [AGENTS.md](AGENTS.md) before making changes and read [.agents/skills/design-to-code/SKILL.md](.agents/skills/design-to-code/SKILL.md) before substantial design-to-code work.

## UI component source explorer

The [UI source directory](docs/references/ui-component-sources.json) lists 31 sites. Fifteen sources have linked metadata snapshots under [ui-index](docs/references/ui-index), currently totaling 9,403 public component references. Run `npm run build` and open `dist/site/ui-explorer.html` to browse the static, searchable index. Each result links to the original publisher. No third-party code, screenshots or paid templates are bundled. See [data provenance and refresh process](docs/references/UI-COMPONENT-INDEX.md) before using any component.

## Run the starter

The example website searches the tool registry. From the repository root, run the following with Node.js 24 and Python 3, then open the address printed by the local server.

```sh
node scripts/build-site.mjs
python -m http.server 8080 --bind 127.0.0.1 --directory dist/site
```

Open [the local starter](http://127.0.0.1:8080). Edit the registry and rebuild to update the directory. The static site has no runtime packages and works with keyboard, touch, and JavaScript disabled. For automated checks, run npm ci, npm test and npm run typecheck. Install Chromium with npx playwright install chromium before running npx playwright test.

For manual external audits, set the repository variable AUDIT_HOST to a DNS name you control. The default is the owner's GitHub Pages hostname. The hosted browser can reach only the chosen host's pinned TLS endpoint. Cross-origin assets will be blocked, so use a first-party staging build when measuring performance. Lighthouse minimums are 75 for performance, 90 for accessibility, 85 for best practices and 80 for SEO. Reports are retained when a budget fails.

Windows, macOS and Android native starter builds are outside this static example. See the app toolkit for target-specific plans.
