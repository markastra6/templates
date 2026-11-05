import { test, expect } from "@playwright/test";

for (const width of [375, 1280]) {
  test(`UI explorer supports searching and library filtering at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/ui-explorer.html");
    const query = page.getByRole("searchbox");
    const source = page.getByLabel("Library");
    const status = page.getByRole("status");
    await expect(status).toContainText("9,403 component references");
    await source.selectOption("motion-primitives");
    await expect(status).toContainText("33 component references");
    expect(await page.locator("#ui-components > li").count()).toBeLessThanOrEqual(72);
    await query.fill("animated");
    await expect(status).toContainText("component references");
    expect(await page.locator("#ui-components > li:visible").count()).toBeGreaterThan(0);
    await query.clear();
    await source.selectOption("");
    await expect(status).toContainText("9,403 component references");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}
