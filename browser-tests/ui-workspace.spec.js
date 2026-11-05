import { test, expect } from "@playwright/test";

test("Save, export and restore a reference without sending it to a server", async ({page}) => {
  await page.goto("/ui-explorer.html");
  await expect(page.getByRole("status")).toContainText("9,403 component references");
  const first = page.locator("#ui-components > li").first();
  await first.getByRole("button", { name: /^Save / }).click();
  await expect(page.getByRole("status")).toContainText("1 saved");
  await page.locator("#ui-favorites-only").check();
  await expect(page.locator("#ui-components > li")).toHaveCount(1);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name:"Export saved" }).click()
  ]);
  expect(download.suggestedFilename()).toBe("ui-workbench-saved.json");
  await page.reload();
  await expect(page.getByRole("status")).toContainText("1 saved");
  await page.locator("#ui-favorites-only").check();
  await expect(page.locator("#ui-components > li")).toHaveCount(1);
});

test("Comparison and type filters use only metadata", async ({page}) => {
  await page.goto("/ui-explorer.html");
  await expect(page.getByRole("status")).toContainText("9,403 component references");
  await page.locator("#ui-components > li").nth(0).getByRole("button", { name: /^Compare / }).click();
  await page.locator("#ui-components > li").nth(1).getByRole("button", { name: /^Compare / }).click();
  await expect(page.locator("#ui-compare")).toBeVisible();
  await expect(page.locator(".comparison-item")).toHaveCount(2);
  await page.getByRole("button", { name: "Clear comparison" }).click();
  await expect(page.locator("#ui-compare")).toBeHidden();
  await page.locator("#ui-kind").selectOption("documentation");
  await expect(page.locator("#ui-components > li").first()).toBeVisible();
  await page.locator("#ui-group-variants").check();
  expect(await page.locator("#ui-components > li").count()).toBeLessThanOrEqual(72);
});

test("Import accepts known source IDs and rejects malformed JSON without erasing favorites", async ({page}) => {
  await page.goto("/ui-explorer.html");
  await expect(page.getByRole("status")).toContainText("9,403 component references");
  const id = await page.locator("#ui-components > li button[data-action='favorite']").first().getAttribute("data-id");
  expect(id).toBeTruthy();
  await page.locator("#ui-import").setInputFiles({
    name:"saved.json", mimeType:"application/json",
    buffer:Buffer.from(JSON.stringify({version:1,favorites:[id,"not-present"]}))
  });
  await expect(page.getByRole("status")).toContainText("1 saved");
  await page.locator("#ui-import").setInputFiles({
    name:"bad.json", mimeType:"application/json", buffer:Buffer.from("{broken")
  });
  await expect(page.locator("#ui-workspace-notice")).toContainText("Import failed");
  await expect(page.getByRole("status")).toContainText("1 saved");
});
