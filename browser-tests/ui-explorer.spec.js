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
    const category = page.getByLabel("Source category");
    await category.selectOption("motion");
    await expect(status).toContainText("component references");
    expect(await page.locator("#ui-sources > li:visible").count()).toBeGreaterThan(0);
    await category.selectOption("");
    await page.getByLabel("Order results").selectOption("name");
    await page.getByLabel("Show declared dependencies only").check();
    await expect(status).toContainText("component references");
    await page.getByLabel("Show declared dependencies only").uncheck();
    await expect(status).toContainText("9,403 component references");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}

test("component matches keep corresponding source cards visible",async({page})=>{
  await page.goto("/ui-explorer.html");
  await page.getByRole("searchbox").fill("accordion");
  await expect(page.getByRole("status")).not.toContainText("0 sources");
  expect(await page.locator("#ui-sources > li:visible").count()).toBeGreaterThan(0);
});
