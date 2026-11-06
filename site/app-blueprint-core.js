/** Original offline-first app planning model. No third-party code or remote services. */
export const platforms = Object.freeze(["windows", "macos", "android", "web"]);
export const appTypes = Object.freeze({
  operations: { name: "Operations console", screens: ["Overview", "Work queue", "Record details", "Audit log"], task: "Review and resolve a pending item" },
  assessment: { name: "Assessment & quiz", screens: ["Sign in", "Assessments", "Answer questions", "Results", "Admin review"], task: "Complete and safely submit an assessment" },
  tracker: { name: "Project tracker", screens: ["Dashboard", "Projects", "Task details", "Reports"], task: "Update a task and verify its saved state" },
  inventory: { name: "Inventory manager", screens: ["Summary", "Items", "Edit item", "History"], task: "Edit an item and confirm the change" },
  custom: { name: "Custom application", screens: ["Overview", "Records", "Settings"], task: "Complete the primary task" }
});
export const checks = Object.freeze([
  { id: "keyboard", title: "Keyboard and screen-reader flow", group: "Accessibility", detail: "Tab order, focus visibility, accessible names, Windows Narrator/macOS VoiceOver/Android TalkBack" },
  { id: "touch", title: "Touch and responsive layout", group: "Accessibility", detail: "No horizontal clipping at 360 px, large text, orientation, touch targets, safe areas" },
  { id: "contrast", title: "Themes and contrast", group: "Accessibility", detail: "Light/dark/high-contrast, error, focus and disabled states; reduced motion" },
  { id: "states", title: "All screen states", group: "Usability", detail: "Loading, empty, normal, saving, success, validation, error, offline and retry states" },
  { id: "persistence", title: "Safe saves and restart", group: "Reliability", detail: "Atomic writes or transactions, crash/restart, interrupted save, backup restore and data integrity" },
  { id: "upgrade", title: "Upgrade and rollback", group: "Reliability", detail: "Existing data survives version upgrade and schema migration; verify export and recovery" },
  { id: "sessions", title: "Session and concurrency integrity", group: "Reliability", detail: "Unique session counts, simultaneous edits, expired sessions and idempotent submission" },
  { id: "security", title: "Permissions and tamper resistance", group: "Security", detail: "Least privilege, secure secrets, validation on authoritative boundary, immutable audit trail" },
  { id: "privacy", title: "Privacy and offline behavior", group: "Security", detail: "No surprise data collection; deny permission, disconnect, reconnect, minimize data disclosure" },
  { id: "performance", title: "Startup and interaction budgets", group: "Performance", detail: "Cold startup, navigation, large lists, battery/memory, background-resume with repeatable measurements" },
  { id: "observability", title: "Truthful status and diagnostics", group: "Operations", detail: "Failed backups/reviews are not reported as success; errors are actionable and auditable" },
  { id: "release", title: "Native packaged release", group: "Release", detail: "Install, uninstall, update, signature/provenance, artifact hash and OS/device evidence" }
]);
const clean = (s,max=120)=>String(s??"").trim().slice(0,max);
export function defaultBlueprint() {
  return { version:1, name:"New application", kind:"operations", framework:"flutter",
    platforms:["windows","android"], primaryTask:appTypes.operations.task, offline:true,
    audit:{}, notes:"", modified:"" };
}
export function validateBlueprint(value) {
  if (!value || value.version!==1 || typeof value.name!=="string" || !appTypes[value.kind] ||
      !["flutter","tauri","avalonia","compose","web"].includes(value.framework) ||
      !Array.isArray(value.platforms) || !value.platforms.length ||
      value.platforms.some(x=>!platforms.includes(x)) ||
      new Set(value.platforms).size!==value.platforms.length ||
      typeof value.primaryTask!=="string" || typeof value.offline!=="boolean" ||
      typeof value.notes!=="string" || !value.audit || typeof value.audit!=="object" ||
      Array.isArray(value.audit) || Object.keys(value.audit).some(id=>!checks.some(c=>c.id===id) ||
      !["pass","fail","blocked","not-run"].includes(value.audit[id]))) {
    throw new Error("Invalid app blueprint");
  }
  if (value.name.length>120 || value.primaryTask.length>240 || value.notes.length>2000) throw new Error("Field too long");
  return {version:1,name:clean(value.name)||"Untitled app",kind:value.kind,
    framework:value.framework,platforms:[...value.platforms],primaryTask:clean(value.primaryTask,240),
    offline:value.offline, audit:Object.fromEntries(checks.filter(c=>value.audit[c.id])
      .map(c=>[c.id,value.audit[c.id]])),notes:value.notes,modified:clean(value.modified,40)};
}
export function auditSummary(value) {
  const counts={pass:0,fail:0,blocked:0,"not-run":0};
  for (const check of checks) counts[value.audit?.[check.id]||"not-run"]++;
  return {counts, ready:counts.fail===0 && counts.blocked===0 && counts["not-run"]===0};
}
export function frameworkAdvice(value) {
  const p=value.platforms||[];
  if (value.framework==="web") return "A browser/PWA is not a native installer. Validate offline caching, updates, storage and browser support.";
  if (value.framework==="tauri" && p.includes("android"))
    return "Validate Android plugin capabilities and WebView behavior early; desktop support alone is not sufficient.";
  if (value.framework==="avalonia") return "Confirm the Android target and platform controls on actual hardware before committing.";
  if (value.framework==="compose" && p.includes("macos"))
    return "Kotlin desktop can target macOS; signing/notarization and native integration require macOS release checks.";
  return "Validate platform-specific plugins, file access, signing and upgrade behavior on each selected device.";
}
