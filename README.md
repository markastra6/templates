# Website Creation

Repository for building the website and its supporting development workflow.

For Windows, macOS and Android, use the [app toolkit](docs/references/APP-TOOLKIT.md) and copy the [app planning and audit template](docs/contracts/APP-PLAN-AND-AUDIT.md) into your feature folder.

## Cost policy

This project has a strict zero-spend requirement. Use free/open-source tools, free public-repository GitHub Actions, and GitHub Pages. Do not introduce paid subscriptions, paid model APIs, paid hosting, paid assets, or paid component licenses. Optional free tiers may have usage limits.

## Current repository setup

- Agent skills: Motion, GSAP, Taste, Vercel React best practices, Vercel web design guidelines, 21st.dev, UI/UX Pro Max, and the repository's design-to-code skill.
- MCP configuration: shadcn, Watermelon UI, optional 21st.dev, Penpot remote MCP, and optional Context7 documentation MCP.
- Design sources: Penpot (preferred open source), Lunacy (optional desktop MCP), and Figma through the connected ChatGPT app when available.
- Validation: repository validation checks MCP JSON, environment placeholders, `.gitignore`, local Markdown links, audit-target URL safety tests, installer syntax, GitHub Actions workflow syntax and full-diff whitespace on every push/pull request.
- Quality: Markdown lint and optional Node.js dependency audit, lint, typecheck, test and build jobs.
- Security: CodeQL for JavaScript/TypeScript when present, Gitleaks history scans and npm audit when a Node.js project exists.
- Browser and UX: conditional Playwright tests, manual Pa11y accessibility audit and manual Lighthouse audit.
- Deployment: manual GitHub Pages workflow for a built static site in `site/`.
- Dependency maintenance: weekly Dependabot updates for GitHub Actions; package-manager updates will be enabled when the application manifest and lockfile are added.

## Mobile-first workflow

Repository changes can be managed through GitHub's website and connected GitHub integration. The agent skill installer is optional and requires a compatible coding-agent environment; it has not been run on the user's Android device. MCP configuration in this repository does not automatically connect custom MCP servers to ChatGPT's Android app. Penpot's remote MCP can work only through a compatible MCP client; Lunacy's documented MCP requires its native desktop app. Figma's ChatGPT connection is separate from project MCP configuration.

See [the unified toolchain architecture](docs/architecture/UNIFIED-TOOLCHAIN.md), [the orchestrator skill](.agents/skills/unified-web-engineering/SKILL.md), and [the shared UI handoff contract](docs/contracts/ui-handoff.template.json) for the coordinated design-to-release workflow. The tool registry is [docs/contracts/toolchain.registry.json](docs/contracts/toolchain.registry.json). The [expanded open-source ecosystem catalogue](docs/references/EXPANDED-WEB-TOOL-ECOSYSTEM.md) adds 93 reviewed candidates across skills, MCP, components, data, testing, accessibility, assets, 3D, frameworks, security, backend and analytics; candidates are not automatically installed. See [docs/DEVELOPMENT-TOOLKIT.md](docs/DEVELOPMENT-TOOLKIT.md) for setup, free-tier limits, quality/security workflows, local Strix requirements and component sources. See [docs/DESIGN-TOOLS.md](docs/DESIGN-TOOLS.md) for Penpot and Lunacy setup. See [docs/REPOSITORY-GOVERNANCE.md](docs/REPOSITORY-GOVERNANCE.md) for the recommended `main` branch protections and current enforcement status. See [docs/AI-HANDOFF.md](docs/AI-HANDOFF.md) for the dated project context and continuation instructions for another coding agent. See [the Code and Chill UI playbook](docs/references/CODE-AND-CHILL-UI-PLAYBOOK.md) and its [structured catalogue](docs/references/code-and-chill-catalogue.json) for public-source UI patterns and original reusable prompts.

Coding agents must read [AGENTS.md](AGENTS.md) before making changes and read [.agents/skills/design-to-code/SKILL.md](.agents/skills/design-to-code/SKILL.md) before substantial design-to-code work.

## Project state

The repository is still a tooling starter. No frontend framework, application scaffold, package manifest or website content has been selected. App-specific CI checks and deployment remain conditional until the corresponding source/configuration exists.
