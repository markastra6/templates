# Website development instructions

## Project state

The example website is a dependency-free static tool directory built from the registry, with npm tooling for CI. Choose a native framework only when a separate app brief requires it.

## Zero-cost requirement

- Do not add paid services, subscriptions, API-credit dependencies, paid templates, or paid component licenses.
- Prefer free and open-source tools, local execution, and free tiers with explicit usage limits.
- Never trigger paid model APIs or hosted scans. Ask before introducing any service that could incur charges.
- Use public/free React Bits components only; do not depend on React Bits Pro.
- For 21st.dev, stay within its free allowance; component retrieval is limited on the free account.
- Strix must use a local Ollama model by default, not a paid LLM API.
- Do not run cloud CI security scans that require paid inference.

## Unified toolchain orchestration

- Before substantial website, page, or component design/implementation, follow [.agents/skills/unified-web-engineering/SKILL.md](.agents/skills/unified-web-engineering/SKILL.md).
- Before selecting additional tools, inspect [the expanded ecosystem catalogue](docs/references/EXPANDED-WEB-TOOL-ECOSYSTEM.md) and machine-readable registry. These contain reviewed candidates, not instructions to install everything.
- Activate a candidate only when a feature's acceptance criteria require its capability; prefer an existing organ if it already solves the problem. Record the chosen tool, rationale, source/license, dependencies, cost boundary and fallback in the feature contract.
- Keep optional browser MCPs, backend services, 3D runtimes and security scanners disabled until their environment, permissions, scope and cost are explicitly suitable.
- Read [the unified toolchain architecture](docs/architecture/UNIFIED-TOOLCHAIN.md), [tool registry](docs/contracts/toolchain.registry.json), and the feature's current UI handoff contract before starting or resuming work.
- Use one feature contract as shared memory across ChatGPT, Manus, and other compatible coding clients. Record decisions, component provenance, motion ownership, data/mock status, tool availability and test evidence there.
- Check live skill/MCP availability in the current client. A configured endpoint or installer is not proof of a working connection.
- Keep shadcn/ui as the primitive baseline; use 21st.dev, Watermelon UI, React Bits and Motion Primitives as selectively reviewed component sources.
- For visual webpage authoring, compare Puck, GrapesJS, Webstudio and Onlook; for internal low-code apps, compare Appsmith, Budibase and ToolJet; for code-first admin apps, compare Refine and React Admin. These are architecture choices, not a list to install together.
- For interactive flows/canvas, evaluate React Flow, Rete.js and Excalidraw. For dynamic dashboards and workspace layouts, evaluate React Grid Layout, dnd-kit, FormKit Drag and Drop and React Resizable Panels. Preserve keyboard/touch access and responsive fallbacks.
- Treat Magic UI, daisyUI, Flowbite React, Chakra UI and MUI as alternative component systems; Headless UI and Floating UI provide narrower primitive/positioning capabilities. Do not layer competing global design systems.
- Next.js, SvelteKit and Nuxt are alternative app frameworks. Open Props/CSS Doodle and React Spring/Anime.js are optional CSS/motion specialists, not defaults.
- Use Motion for React for React state/gesture/layout transitions and GSAP for complex timelines/scroll choreography. Assign one motion owner per animated target.
- Use Alibaba Page Agent only for approved local/staging exploration; use Playwright for repeatable tests. Run Strix only against explicitly authorized scope with local-model defaults.

## Design and implementation

- Start each page or feature with a clear information hierarchy, responsive layout plan, and accessible interaction model.
- Build a coherent design system first: semantic color tokens, type scale, spacing, radii, elevation, and motion rules.
- Prefer custom, purposeful composition over generic template layouts.
- Use semantic HTML, keyboard-accessible controls, visible focus states, reduced-motion support, and responsive behavior.
- Keep components composable and source-owned. Add only dependencies required by the selected implementation.
- Prefer shadcn/ui as the base primitive layer; use React Bits, Watermelon UI, Motion Primitives, and 21st.dev as selective source libraries.
- Use GSAP for complex timelines and scroll choreography. Use Motion for React component transitions and layout animation. Avoid running two animation engines on the same element.
- Use Haikei for bespoke SVG backgrounds when a page needs them; commit exported assets rather than relying on a runtime generator.

## Design application integrations

- Penpot is the preferred open-source design source. When its MCP is connected, inspect the active file/page, layers, components, variables, typography, spacing, and exported assets before implementation.
- Lunacy is an optional desktop design source. Use its MCP only when the native app is running and the user has selected the relevant document or objects.
- Figma may be used through the connected ChatGPT Figma app when available; this is separate from project MCP configuration and is not a Figma MCP server.
- Treat the design file selected by the user as the source of truth for visual specifications. Do not silently combine Penpot, Lunacy, or Figma files or assume they contain the same design.
- Translate design values into project-owned semantic tokens and reusable components; do not copy demo styling or create a parallel design system.
- If an MCP connection is unavailable, state the limitation and work from user-provided exports, screenshots, or specifications instead.
- Read `.agents/skills/design-to-code/SKILL.md` before substantial design-to-code work.
- Keep all MCP URLs, access tokens, and keys out of commits, logs, screenshots, and generated documentation.

## Agent workflow

- Read relevant skill instructions before applying a specialist workflow.
- Use Vercel's `react-best-practices` skill when implementing React and `web-design-guidelines` for UX, accessibility, and visual review.
- Use UI/UX Pro Max for design-system and UX guidance; Taste for art direction and visual QA; GSAP skills for advanced GSAP implementation; 21st.dev and Watermelon MCPs for source-backed component discovery; Context7 for current library documentation when available.
- Inspect a component's source, dependencies, accessibility, license, and responsive behavior before adding it.
- Adapt imported components to project tokens. Do not leave demo colors or unrelated dependencies in production.
- Run type checks, lint, tests, and a production build when those scripts exist.
- Use browser-based visual checks for important responsive states.

## Repository automation

- Keep CI workflows least-privileged; grant only the permissions a job needs.
- Pin external GitHub Actions to reviewed major versions and allow Dependabot to keep them updated.
- Never introduce AI security scans, hosted LLM calls, paid Actions, or services that can incur charges.
- Keep manual audits scoped to public HTTPS URLs; the audit workflow validator rejects credentials, local/reserved names, non-default ports, and private/reserved DNS answers. This is a guardrail, not a network sandbox. Never pass secrets or authenticated URLs as workflow inputs.

## Security

- Never commit API keys, tokens, passwords, customer data, or environment files.
- Run Strix only against this repository or targets the owner has explicitly authorized.
- Treat security findings as actionable evidence; verify the affected code and retest fixes.

## Source-of-truth rule

The repository's design tokens and existing components take precedence over imported library defaults. Prefer editing a copied component over introducing a second competing design system.
