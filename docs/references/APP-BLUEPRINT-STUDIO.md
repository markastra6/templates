# Cross-platform App Blueprint Studio

The [App Blueprint Studio](../../site/app-blueprint.html) is a zero-cost original planning tool included in the built workbench at `dist/site/app-blueprint.html`. It is **not** a Flutter/Tauri/Avalonia/Compose compiler, emulator, deployment service, package scanner, or native application.

## Start without installing Node.js on the target Windows PC

For an offline prebuilt release, download **ui-workbench-offline** from the [offline-bundle Actions workflow](https://github.com/markastra6/templates/actions/workflows/offline-bundle.yml) after a successful run. The ZIP includes `Start_Workbench.bat` for Windows and `Start_Workbench.command` for macOS, plus a per-file SHA-256 manifest that is verified while packaging.

The checked-in `site/` folder is source code and is not a complete offline distribution of the entire existing workbench: the component explorer still needs the generated `ui-index.json` built by CI. Use the prebuilt website distribution once packaged by the repository's release pipeline, or build the whole site once on a development machine using `npm ci && npm run build`. Serve `dist/site` with `python -m http.server 8080 --bind 127.0.0.1 --directory dist/site` and open `http://127.0.0.1:8080/app-blueprint.html`. This avoids any external web hosting and does not require npm on the machine running the built website. Do not assume the offline ZIP exists until a release job publishes it.

## Workflows

1. Choose **Operations**, **Assessment**, **Project tracker**, **Inventory** or **Custom**. These are original navigation/workflow patterns, not third-party templates.
2. Select target operating systems and a framework. Choose a single primary codebase and validate platform integrations before expanding scope. A responsive PWA is not automatically a native installable app.
3. Write the user's most important task, and inspect desktop, tablet and phone previews. They illustrate information architecture only; do not mistake the sample button or sample data for functioning application logic.
4. For every intended screen, design loading, empty, normal, validation, offline, save-failure, conflict and recovery states. Test keyboard and touch interactions.
5. Record 12 independent release checks as **pass**, **fail**, **blocked** or **not tested**. A pass indicates a manually recorded claim, not automatically gathered evidence. The page never certifies a release.
6. Export the versioned project JSON to preserve and transfer plans. Import validates its schema, platform set, lengths and audit values. Imported JSON is not evaluated as executable code.

### Storage and privacy

The app stores project name, task, platforms, notes and audit statuses in browser-local storage only. No server account, telemetry, API key or upload is required. Local browser storage can disappear when the browser cache/profile is cleared and cannot substitute for a backed-up project document. Project names, notes and exported files should not contain confidential project/customer/employee data if you intend to commit or share them publicly.

### Framework selection

| Need | Starting candidate | Critical proof |
| --- | --- | --- |
| One shared UI across desktop and Android | Flutter | File access, plugin lifecycle, signed builds and OS accessibility |
| Reuse web code in a native shell | Tauri | Capability permissions, platform WebViews, target Android plugins |
| Existing C#/.NET UI expertise | Avalonia | Android runtime support, UI Automation, keyboard/touch |
| Android-first Kotlin with desktop target | Compose Multiplatform | Desktop packaging, macOS signing, native integration |
| Browser-only access without native device capabilities | Responsive web/PWA | Storage durability, service worker versioning, online/offline recovery |

These choices are alternatives, not dependencies added to the repository. Each needs native testing on supported physical devices and packaging environments. macOS signed distribution must be validated on a Mac.

## Audit priorities for an assessment/MCQ app

A real application needs more than a redesigned theme. Prioritize: atomic backup and verified restore; tamper-resistant scores (server-side verification or authenticated integrity keys, not editable client-side fields); paused assessment submission semantics; failed admin-login and review audit events; truthful diagnostics; and canonical session identifiers for live-employee counts. Then improve the learner's stable navigation and save status, admin review queues, searchable question banks, and live counters with freshness timestamps. Tests must cover concurrency, interruption, offline/resume and upgrade. None of these changes are implemented in the standalone MCQ executable by this planning tool.

## Evidence and release rule

Keep a release record outside the local JSON with device/OS/build ID, exact test steps, observed outcome, screenshot/log location and SHA-256 of each native artifact. A fully green checklist without that evidence is **not** a release certification. Existing [app planning/audit worksheet](../contracts/APP-PLAN-AND-AUDIT.md) is the written version of this workflow. The [app toolkit](APP-TOOLKIT.md) links to free frameworks and platform test tools.
