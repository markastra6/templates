# Windows, macOS and Android app toolkit

Use the [app planning and audit template](../contracts/APP-PLAN-AND-AUDIT.md) to define a feature and record results from an installed build. Start with one framework and one representative workflow. The examples below can be explored individually.

## Choose an app framework

| Project | What it provides | When to use it |
| --- | --- | --- |
| [Flutter](https://github.com/flutter/flutter) | Create a single Dart UI for Windows, macOS and Android. | Start here when mobile and desktop share workflows. Prototype the most platform-specific plugin first. |
| [Tauri](https://github.com/tauri-apps/tauri) | Package a web frontend with native platform integration. | Choose when reusing an existing web UI. Test system WebView differences and grant only required capabilities. |
| [Avalonia](https://github.com/AvaloniaUI/Avalonia) | Build desktop and Android interfaces in C# and XAML. | Choose for a .NET team. Verify touch layout, keyboard navigation and the target runtime on each device. |
| [Compose Multiplatform](https://github.com/JetBrains/compose-multiplatform) | Share declarative Kotlin screens between Android and desktop. | Choose when Kotlin is already in use. Keep platform file pickers and application lifecycle handling behind small interfaces. |

## Adapt a screen or theme

| Project | What it provides | When to use it |
| --- | --- | --- |
| [Flutter samples](https://github.com/flutter/samples) | Study runnable examples of navigation, state and adaptive layouts. | Copy the smallest example that matches the feature and review its dependencies and asset licenses. |
| [Now in Android](https://github.com/android/nowinandroid) | Study an Android reference app built with Kotlin and Compose. | Use selected patterns for adaptive layouts, theming and offline data. Start with its demo data. |
| [Windows Community Toolkit](https://github.com/CommunityToolkit/Windows) | Explore Windows controls and sample usage for a native Windows interface. | Use when a Windows-specific feature benefits from a native control. Check keyboard and high-contrast behavior. |
| [Food Truck (SwiftUI sample)](https://github.com/apple/sample-food-truck) | Explore a working SwiftUI sample with navigation and platform-adaptive views. | Use the macOS target as a UI reference. Review the sample license and the requirements for individual features. |
| [Material Color Utilities](https://github.com/material-foundation/material-color-utilities) | Generate coordinated light and dark color roles from a seed color. | Use when building a theme. Check contrast on actual surfaces, including disabled, focused and error states. |

## Audit a running app or package

| Project | What it provides | When to use it |
| --- | --- | --- |
| [Accessibility Insights for Windows](https://github.com/microsoft/accessibility-insights-windows) | Inspect Windows UI Automation names, roles and focus order. | Run on the installed Windows app and follow the automated checks with a keyboard-only task. |
| [Maestro](https://github.com/mobile-dev-inc/Maestro) | Replay an Android user journey from a readable YAML flow. | Run the local CLI with an emulator or attached device. Keep hosted device services optional. |
| [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) | Inspect an Android package for risky permissions, manifest settings and bundled code. | Scan your own release candidate locally. Triage findings against actual app behavior before release. |
| [Perfetto](https://github.com/google/perfetto) | Trace Android startup, rendering stalls and scheduling on a device. | Capture a short local trace around a slow interaction and compare the same action after the change. |
