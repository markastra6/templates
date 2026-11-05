import { test, expect } from "@playwright/test";

for (const width of [375, 1280]) {
  test(`Unified homepage preserves search and links to workspaces at ${width}px`, async ({page}) => {
    await page.setViewportSize({width,height:800});
    await page.goto("/");
    await expect(page.getByRole("heading",{name:/One place to explore/})).toBeVisible();
    await expect(page.locator(".hub-metrics strong")).toHaveText(["31","9,403","15"]);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("searchbox")).toBeFocused();
    await page.getByRole("searchbox").fill("AutoAnimate");
    await expect(page.locator("#tools > li")).toHaveCount(1);
    await page.getByRole("searchbox").clear();
    await expect(page.getByRole("link",{name:"Open component explorer"})).toBeVisible();
    await expect(page.getByRole("link",{name:"Open design studio"})).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}
test("Primary workspace links navigate to local, working pages", async ({page}) => {
  await page.goto("/");
  await page.getByRole("link",{name:"Open component explorer"}).click();
  await expect(page).toHaveURL(/ui-explorer\.html$/);
  await expect(page.getByRole("status")).toContainText("9,403 component references");
  await page.goto("/");
  await page.getByRole("link",{name:"Open design studio"}).click();
  await expect(page).toHaveURL(/token-studio\.html$/);
  await expect(page.getByRole("heading",{name:"Design Token Studio"})).toBeVisible();
});
