# App planning and audit template

## Scope

| Fill in before implementation | Decision |
| --- | --- |
| App, build identifier and owner | |
| Primary user and the one task they must finish | |
| Target OS versions, devices and input methods | |
| Chosen framework, source example and license | |
| Data stored locally, permissions and offline behavior | |
| Distribution method and available test hardware | |

## Design one complete workflow

Sketch the entry point, main action, confirmation and recovery path. For a list editor, for example, open a record, change a value, save, close the app and verify the value after reopening.

| Design decision | Desktop example | Android example | Your choice |
| --- | --- | --- | --- |
| Navigation | Sidebar and detail pane in a wide window | List and detail on separate screens with Back | |
| Input | Tab order, visible focus and keyboard shortcut | Touch targets, on-screen keyboard and scroll-to-error | |
| Appearance | Check light, dark and high-contrast appearances at increased text size | Check system theme, large text and portrait/landscape | |
| Recovery | Keep edits when a file dialog is cancelled | Restore state after backgrounding and explain denied permissions | |

For every screen, specify the loading, empty, populated and error states that can occur. Attach screenshots of the narrowest supported layout and the largest supported text size.

## Run and record the audit

Use one row per test run. Record OS/device, build ID, observed result and evidence. Mark each row pass, fail, blocked or outside scope. Include the reason for any skipped target.

| Target | Exercise on the installed build | Result and evidence |
| --- | --- | --- |
| Windows | Install as the intended user. Resize the window, finish the primary task with keyboard only, and inspect control names with Narrator or Accessibility Insights. | |
| macOS | Launch on a Mac using the intended distribution route. Try menu shortcuts, VoiceOver, window resize and file-dialog cancellation. Record signing and Gatekeeper behavior for the tested artifact. | |
| Android | Install the APK, complete the task with TalkBack, rotate, background and resume, deny an optional permission, and repeat offline. | |
| Usability | Give someone the primary task without coaching. Record where they hesitate, the outcome and one change to retest. | |
| Performance | Set a startup or interaction budget before testing. Measure the same action on the same device and capture a trace for regressions. | |
| Security and privacy | Compare declared permissions and network destinations with the feature brief. Inspect the release package for bundled credentials and record scanner findings and dispositions. | |
| Upgrade and recovery | Create sample data in the previous version, install the candidate over it and verify data survives. Test export or recovery when offered. | |

## Release record

Record the artifact name and SHA-256 for each platform, unresolved issues, retest results and release decision. Keep screenshots and traces free of personal data. Record local installation, package signing and store submission separately so the evidence identifies exactly what was tested.
