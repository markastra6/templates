# Website and app creation directory

| When you want to… | Start here | How it is available |
| --- | --- | --- |
| Choose a visual direction | [Taste skill](https://github.com/Leonxlnx/taste-skill) for composition and typography, [UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) for design-system guidance | Both have entries in the [optional skill installer](../scripts/setup-agent-toolkit.sh). |
| Find a component | [shadcn/ui](https://ui.shadcn.com/), [21st.dev](https://21st.dev/) and [Watermelon UI](https://ui.watermelon.sh/) | All three have entries in the [MCP config](../.mcp.json). Check the connection in your client. 21st.dev uses your own key and free allowance. |
| Adapt an animated React component | [React Bits](https://reactbits.dev/) through Manus, or [Motion Primitives](https://motion-primitives.com/) | Select free source components. Manus access depends on your session. Review each component's dependencies and license. |
| Build motion into a screen | [Motion for React, formerly Framer Motion](https://motion.dev/docs/react), for gestures and state transitions. [GSAP skills](https://github.com/greensock/gsap-skills) for scroll sequences and timelines. | Installer entries provide agent guidance. Add a runtime only when implementing a feature and test reduced motion. |
| Make an original background | [Haikei](https://haikei.app/) | Export an SVG or PNG and keep the chosen asset with the project. |
| Explore a staging UI | [Alibaba Page Agent](https://github.com/alibaba/page-agent) | Optional integration requiring a compatible model. Keep exploration on authorized targets and use Playwright to make an important journey repeatable. |
| Audit an owned application | [Strix](https://github.com/usestrix/strix) with local Ollama | Local-only setup is documented in the [development toolkit](DEVELOPMENT-TOOLKIT.md). Choose an authorized target before running it. |

## More free design tools

| Project | Use | Selection guidance |
| --- | --- | --- |
| [AutoAnimate](https://github.com/formkit/auto-animate) | Animate items entering, leaving or changing order in a list. | Use for simple list transitions. Give each element one animation owner and test reduced motion. |
| [Rough.js](https://github.com/rough-stuff/rough) | Draw sketch-style diagrams with SVG or Canvas. | Use for explanatory illustrations. Supply text equivalents for meaningful diagrams. |
| [Heroicons](https://github.com/tailwindlabs/heroicons) | Use a consistent set of SVG interface icons. | Choose one icon family for a screen. Give icon-only controls accessible names. |
| [OpenMoji](https://github.com/hfg-gmuend/openmoji) | Use a consistent emoji illustration set in onboarding or empty states. | Credit the artwork and track ShareAlike terms for adaptations. Pair meaningful images with text. |

## Continue by project type

- **Website or dashboard** — explore [components, frameworks, testing and deployment tools](references/EXPANDED-WEB-TOOL-ECOSYSTEM.md).
- **Windows, macOS or Android app** — compare [app frameworks and platform samples](references/APP-TOOLKIT.md), then copy the [planning and audit worksheet](contracts/APP-PLAN-AND-AUDIT.md).
- **Design file to implementation** — start with the [design tool setup](DESIGN-TOOLS.md) and [shared UI handoff](contracts/ui-handoff.template.json).
- **Automated tool selection** — look up IDs, inputs, outputs, availability and cost boundaries in the [machine-readable registry](contracts/toolchain.registry.json).
