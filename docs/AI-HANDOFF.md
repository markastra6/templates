# AI agent handoff

Current repository: [markastra6/templates](https://github.com/markastra6/templates). Use the [creation directory](CREATION-DIRECTORY.md) for current capabilities. The following snapshot describes the upstream project before this fork.

- **Snapshot date:** 2026-11-03
- **Repository:** [astramark06-sudo/website-creation](https://github.com/astramark06-sudo/website-creation)
- **Default branch at snapshot:** `main`
- **Verified main commit:** `3cded413369bc3ce274175015d382e608e936de4`

> This is a dated handoff snapshot, not live state. Before acting, fetch the current `main` head, open pull requests, recent Actions runs, and repository rulesets. Another agent or session may have changed the repository since this file was written.

## Mission and constraints

Continue preparing this repository for high-quality website development. The owner requires a strict **zero-spend** approach: no paid subscriptions, paid APIs, API credits, paid templates, paid component licenses, paid hosting, or paid CI services. Prefer open-source tools and free GitHub features. Public-repository GitHub Actions and GitHub Pages are acceptable.

The repository owner has used ChatGPT Free and GitHub Free from an Android/mobile workflow and has previously indicated that they do not have a PC or terminal available. Do not assume they can run shell commands, install desktop MCP clients, use local Docker/Ollama, or run a skill installer. Prefer changes that can be performed through GitHub branches and pull requests.

Do not create the actual website until the owner supplies its purpose, audience, required pages/features, or explicitly asks the agent to propose a concept. The framework and package manager are intentionally undecided. Do not invent a product brief or add dependencies merely to make CI appear active.

## Mandatory reading

Before making changes, read:

1. [AGENTS.md](../AGENTS.md) — binding repository instructions and zero-cost rules.
2. [README.md](../README.md) — current repository setup and state.
3. [Development toolkit](DEVELOPMENT-TOOLKIT.md) — tools, limitations, validation and deployment.
4. [Design tools](DESIGN-TOOLS.md) — Penpot, Lunacy and Figma integration boundaries.
5. [MCP security](MCP-SECURITY.md) — credentials, trust boundaries and MCP safety.
6. [Repository governance](REPOSITORY-GOVERNANCE.md) — recommended main-branch protections.
7. [.agents/skills/design-to-code/SKILL.md](../.agents/skills/design-to-code/SKILL.md) before substantial design-to-code work.

Treat the owner-selected design file as the visual source of truth. Do not combine Penpot, Lunacy and Figma sources without explicit direction.

## Repository state at snapshot

The repository is a **development-tooling starter**, not a website application. At the verified main commit above:

- No `package.json`, package lockfile, frontend framework, app source, Playwright config, or `site/index.html` exists.
- `.mcp.json` contains shadcn, optional 21st.dev, Watermelon UI, Penpot remote MCP, and Context7.
- Lunacy integration is documented; its MCP requires the native desktop application.
- Figma is connected through the ChatGPT Figma app when available; this is separate from project MCP configuration.
- Agent tooling includes Motion, GSAP, Taste, Vercel React best practices, Vercel web design guidelines, 21st.dev, UI/UX Pro Max, and the repository's own design-to-code skill.
- Strix is documented as an optional local-only tool using Ollama. Do not introduce hosted model inference or run it in cloud CI.
- Dependabot currently updates GitHub Actions weekly. The npm updater was removed because it failed with `/package.json not found`; add package-manager updates only after the project chooses and commits a manifest and lockfile.
- A manual GitHub Pages workflow expects a built static website in `site/`; it is not deployable yet.

## Completed repository work

The following PRs had been merged by the snapshot date:

| PR | Change |
|---|---|
| [#4](https://github.com/astramark06-sudo/website-creation/pull/4) | Update `actions/deploy-pages` to v5 |
| [#5](https://github.com/astramark06-sudo/website-creation/pull/5) | Update `actions/upload-pages-artifact` to v5 |
| [#6](https://github.com/astramark06-sudo/website-creation/pull/6) | Remove inactive npm Dependabot updates; scope CodeQL permissions; improve diff validation; isolate Gitleaks networking; document branch governance |
| [#7](https://github.com/astramark06-sudo/website-creation/pull/7) | Add checksum-verified actionlint workflow linting |
| [#8](https://github.com/astramark06-sudo/website-creation/pull/8) | Fix CodeQL source detection and add regression self-tests |
| [#9](https://github.com/astramark06-sudo/website-creation/pull/9) | Validate public HTTPS targets for manual Pa11y and Lighthouse audits; add 12 Python regression tests |

The last change added `scripts/validate_public_url.py` and `tests/test_validate_public_url.py`. The validator rejects HTTP, credentials, local/reserved hostnames, non-default ports, private/reserved IP literals, and DNS answers containing non-global addresses. It is a guardrail, **not a network sandbox**: DNS may change after validation and a public URL can redirect elsewhere. Only audit public sites the owner trusts and controls.

## CI behavior and interpretation

The repository currently has workflows for:

- Repository validation: MCP/env configuration, Python regression tests, installer syntax, checksum-verified actionlint, and full-diff whitespace.
- Quality: Markdown lint and conditional npm checks.
- CodeQL: source detection always runs; JavaScript/TypeScript analysis starts when matching source exists.
- Secret scan: Gitleaks over full Git history.
- Browser tests: Playwright setup detection runs; browser tests start once package manifests, lockfile and config exist.
- Manual Pa11y accessibility and Lighthouse audits.
- Manual GitHub Pages deployment.

At the snapshot, the latest `main` commit had passing repository validation, Markdown lint, Gitleaks, Node-project detection, CodeQL source detection and Playwright setup detection. The app-specific CodeQL analysis and Playwright tests were correctly skipped because the app does not exist yet. Do not report skipped checks as completed application testing.

## Known repository-level gap

At the snapshot, GitHub reported `main` as **unprotected**. The governance checklist recommends:

- Require pull requests (zero mandatory approvals is appropriate for a single-maintainer project).
- Require the six always-running validation/detection checks listed in [REPOSITORY-GOVERNANCE.md](REPOSITORY-GOVERNANCE.md).
- Block force pushes and branch deletion.

The documentation does not activate branch protection. Verify current rulesets and configure the recommended one through repository Settings if the connected GitHub interface permits it.

## Required workflow for the next agent

1. Verify the live repository state first. Do not rely on this snapshot's commit SHA or PR count.
2. Read all mandatory instructions above.
3. Inspect the current diff and recent commit history before touching files. Other AI sessions may be working on the same repository.
4. Create a short-lived branch from the exact latest `main` SHA. Do not push directly to `main`.
5. Make small, coherent, zero-cost changes. Preserve existing Penpot/Lunacy/Figma integrations and all unrelated changes.
6. Run the available local checks when possible and open a pull request. Inspect every CI result and merge only when the PR head and base are current and all applicable checks pass.
7. Report exact commit, PR, checks, remaining blockers and anything that requires the owner's action. Never claim a remote service or local tool is connected unless verified.

## Next sensible milestones

1. Activate and verify the `main` branch ruleset.
2. Obtain the website brief and selected design source.
3. Choose the framework and package manager based on the actual site requirements.
4. Add the application scaffold, design tokens, responsive layouts, accessible components and tests.
5. Enable the matching dependency audit, CodeQL analysis, Playwright tests and deployment workflow.
6. Run Pa11y and Lighthouse against the deployed public HTTPS site.

Keep the project small until there is a real website requirement. More integrations are not automatically better.
