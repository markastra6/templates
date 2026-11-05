import { test, expect } from "@playwright/test";

for (const width of [375,1280]) {
  test(`audit source coverage on ${width}px viewport`, async ({page}) => {
    await page.setViewportSize({width,height:800});
    await page.goto("/ui-audit.html");
    await expect(page.getByRole("status")).toContainText("Offline integrity checks passed");
    await expect(page.getByRole("table").getByRole("row")).toHaveCount(32);
    await expect(page.getByText("9,403")).toBeVisible();
    await expect(page.getByText("React Bits",{exact:true})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  });
}
