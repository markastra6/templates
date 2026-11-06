import { test, expect } from "@playwright/test";
for(const width of [375,1280]){
  test(`app blueprint saves and audits at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:860});
    await page.goto("/app-blueprint.html");
    await expect(page.getByRole("heading",{name:"App Blueprint Studio"})).toBeVisible();
    await page.getByLabel("Application name").fill("Assessment Desk");
    await page.getByLabel("Starting pattern").selectOption("assessment");
    await expect(page.locator("#mock-name")).toHaveText("Assessment Desk");
    await expect(page.locator("#mock-nav")).toContainText("Assessments");
    await page.getByRole("button",{name:"Phone"}).click();
    await expect(page.locator("#preview")).toHaveClass(/phone/);
    await page.getByLabel("Keyboard and screen-reader flow result").selectOption("fail");
    await expect(page.locator("#release")).toContainText("1 failed");
    await page.reload();
    await expect(page.getByLabel("Application name")).toHaveValue("Assessment Desk");
    await expect(page.getByLabel("Keyboard and screen-reader flow result")).toHaveValue("fail");
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  });
}
