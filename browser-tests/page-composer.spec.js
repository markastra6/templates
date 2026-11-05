import { test, expect } from "@playwright/test";

test("Compose, edit, reorder, export and restore original sections", async ({page}) => {
  await page.goto("/page-composer.html");
  await expect(page.getByRole("heading",{name:"Starter Page Composer"})).toBeVisible();
  await expect(page.locator("#composer-sections > li")).toHaveCount(5);
  await page.locator("#composer-title").fill("Quality Design Hub");
  await expect(page.locator("#composer-canvas h1")).toHaveText("Quality Design Hub");
  await page.locator("#composer-sections > li").first().getByRole("button",{name:/^Move down/}).click();
  await expect(page.locator("#composer-sections > li").first()).toContainText("A calmer way to build");
  await page.locator("#composer-add-type").selectOption("callout");
  await page.getByRole("button",{name:"Add section"}).click();
  await expect(page.locator("#composer-sections > li")).toHaveCount(6);
  await page.locator("#composer-title").fill("New call to action");
  await expect(page.locator("#composer-canvas")).toContainText("New call to action");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button",{name:"Export standalone HTML"}).click()
  ]);
  expect(download.suggestedFilename()).toBe("original-page.html");
  await page.reload();
  await expect(page.locator("#composer-sections > li")).toHaveCount(6);
  await expect(page.locator("#composer-canvas")).toContainText("Quality Design Hub");
  await expect(page.locator("#composer-canvas")).toContainText("New call to action");
});

test("Reuse validated token studio theme; malformed import leaves project unchanged",async ({page}) => {
  await page.goto("/token-studio.html");
  await page.locator("#studio-preset").selectOption("ocean");
  await page.goto("/page-composer.html");
  await page.getByRole("button",{name:"Use saved token-studio theme"}).click();
  await expect(page.locator("#composer-status")).toContainText("theme applied");
  await expect(page.locator("#composer-canvas")).toHaveCSS("--ui-accent","#155eef");
  await page.locator("#composer-import").setInputFiles({
    name:"bad.json",mimeType:"application/json",buffer:Buffer.from("{not-json")
  });
  await expect(page.locator("#composer-status")).toContainText("Import rejected");
  await expect(page.locator("#composer-canvas")).toHaveCSS("--ui-accent","#155eef");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button",{name:"Export editable JSON"}).click()
  ]);
  expect(download.suggestedFilename()).toBe("original-page.project.json");
});

test("Import supports safe section IDs, mobile preview, and reset confirmation",async ({page}) => {
  await page.setViewportSize({width:1280,height:800});
  await page.goto("/page-composer.html");
  const theme={version:1,name:"Forest",font:"system",radius:12,density:1,
    colors:{canvas:"#f1f6f2",surface:"#ffffff",text:"#183428",muted:"#496354",accent:"#17694e",onAccent:"#ffffff",border:"#d2e1d6"}};
  const project={version:1,theme,blocks:[{id:"0abc",type:"hero",title:"Imported section",body:"Safe text",action:"Continue"}]};
  await page.locator("#composer-import").setInputFiles({
    name:"project.json",mimeType:"application/json",buffer:Buffer.from(JSON.stringify(project))
  });
  await expect(page.locator("#composer-status")).toContainText("project imported");
  await expect(page.locator("#composer-canvas h1")).toHaveText("Imported section");
  await page.getByRole("button",{name:"Mobile"}).click();
  await expect(page.locator("#composer-frame")).toHaveAttribute("data-viewport","mobile");
  await expect.poll(async()=>page.locator("#composer-frame").evaluate(e=>e.getBoundingClientRect().width)).toBeLessThanOrEqual(390);
  page.on("dialog",dialog=>dialog.accept());
  await page.getByRole("button",{name:"Reset example"}).click();
  await expect(page.locator("#composer-sections > li")).toHaveCount(5);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
});
