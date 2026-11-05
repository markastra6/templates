import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
const { tools } = JSON.parse(readFileSync("docs/contracts/toolchain.registry.json", "utf8"));
for (const width of [375, 1280]) {
  test(`find and reset a tool at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const search = page.getByRole("searchbox");
    await page.keyboard.press("Tab");
    await expect(search).toBeFocused();
    await search.fill("AutoAnimate");
    await expect(page.getByRole("listitem")).toHaveCount(1);
    await expect(page.getByRole("link", { name: "AutoAnimate" })).toBeVisible();
    await search.fill("no-such-tool-999");
    await expect(page.getByRole("status")).toContainText("No matching tools");
    await search.clear();
    await expect(page.getByRole("listitem")).toHaveCount(tools.length);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}
