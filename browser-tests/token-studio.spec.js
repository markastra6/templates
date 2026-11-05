import { test, expect } from "@playwright/test";

for (const width of [375, 1280]) {
  test(`Token studio previews and exports a responsive theme at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/token-studio.html");
    await expect(page.getByRole("heading", { name: "Design Token Studio" })).toBeVisible();
    await expect(page.locator("#contrast-body")).toHaveAttribute("data-pass","true");
    await expect(page.locator("#contrast-action")).toHaveAttribute("data-pass","true");
    await page.locator("#studio-preset").selectOption("night");
    await expect(page.locator("#studio-preview")).toHaveCSS("--ui-accent","#7be1bf");
    await page.getByRole("button", { name:"Mobile" }).click();
    await expect(page.locator("#studio-frame")).toHaveAttribute("data-width","mobile");
    await expect.poll(async () => page.locator("#studio-frame").evaluate(node => node.getBoundingClientRect().width)).toBeLessThanOrEqual(375);
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name:"Export CSS" }).click()
    ]);
    expect(download.suggestedFilename()).toMatch(/-tokens\.css$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}

test("Live theme edits are persisted, poor contrast warns, and invalid imports preserve values", async ({ page }) => {
  await page.goto("/token-studio.html");
  await page.locator("#studio-accent").fill("#ffffff");
  await expect(page.locator("#contrast-action")).toHaveAttribute("data-pass","false");
  await expect(page.locator("#contrast-action")).toContainText("Below AA");
  await page.locator("#studio-name").fill("My Workspace");
  await page.locator("#studio-name").press("Tab");
  await page.reload();
  await expect(page.locator("#studio-name")).toHaveValue("My Workspace");
  await expect(page.locator("#studio-accent")).toHaveValue("#ffffff");
  await page.locator("#studio-import").setInputFiles({
    name:"invalid.json",mimeType:"application/json",
    buffer:Buffer.from(JSON.stringify({version:1,name:"Injected",font:"url(http://bad)",radius:12,density:1,colors:{}}))
  });
  await expect(page.locator("#studio-status")).toContainText("Import rejected");
  await expect(page.locator("#studio-name")).toHaveValue("My Workspace");
  await page.getByRole("button",{name:"Reset preset"}).click();
  await expect(page.locator("#contrast-action")).toHaveAttribute("data-pass","true");
});

test("Valid exported JSON format imports without executing external content", async ({ page }) => {
  await page.goto("/token-studio.html");
  const colors = {canvas:"#f3f7ff",surface:"#ffffff",text:"#162c4d",muted:"#496785",
    accent:"#155eef",onAccent:"#ffffff",border:"#d5e0f2"};
  await page.locator("#studio-import").setInputFiles({
    name:"theme.json",mimeType:"application/json",
    buffer:Buffer.from(JSON.stringify({version:1,name:"QA Ocean",font:"serif",radius:6,density:1.15,colors}))
  });
  await expect(page.locator("#studio-status")).toContainText("Validated theme imported");
  await expect(page.locator("#studio-name")).toHaveValue("QA Ocean");
  await expect(page.locator("#studio-font")).toHaveValue("serif");
  await expect(page.locator("#studio-radius")).toHaveValue("6");
  await expect(page.locator("#studio-preview")).toHaveCSS("--ui-accent","#155eef");
});
