import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./browser-tests",
  testMatch: "**/*.spec.js",
  use: { baseURL: "http://127.0.0.1:8080", browserName: "chromium" },
  webServer: {
    command: "node scripts/build-site.mjs && python -m http.server 8080 --bind 127.0.0.1 --directory dist/site",
    url: "http://127.0.0.1:8080"
  }
});
