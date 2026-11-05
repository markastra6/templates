import { test, expect } from "@playwright/test";

for (const width of [375,1280]) {
  test("sandboxed original component lab responds to input at "+width+"px", async ({page}) => {
    await page.setViewportSize({width,height:850});
    await page.goto("/component-lab.html");
    const preview=page.frameLocator("#lab-preview");
    const button=preview.getByRole("button",{name:"Activate"});
    await expect(button).toHaveAttribute("aria-pressed","false");
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed","true");
    await expect(preview.getByRole("status")).toContainText("Action activated.");

    await page.getByLabel("Component",{exact:true}).selectOption("tabs");
    await expect(preview.getByRole("tab",{name:"Overview"})).toHaveAttribute("aria-selected","true");
    await preview.getByRole("tab",{name:"Overview"}).focus();
    await page.keyboard.press("ArrowRight");
    await expect(preview.getByRole("tab",{name:"Details"})).toHaveAttribute("aria-selected","true");
    await expect(preview.getByRole("tabpanel",{name:"Details"})).toBeVisible();

    await page.getByLabel("Component",{exact:true}).selectOption("accordion");
    const summary=preview.getByText("How does this component work?");
    await summary.click();
    await expect(preview.getByText("Native disclosure controls with keyboard support.").last()).toBeVisible();

    await page.getByLabel("Component",{exact:true}).selectOption("form");
    await preview.getByRole("button",{name:"Check email"}).click();
    await expect(preview.getByRole("status")).toContainText("Enter a valid email");
    await preview.getByRole("textbox",{name:"Email address"}).fill("hello@example.com");
    await preview.getByRole("button",{name:"Check email"}).click();
    await expect(preview.getByRole("status")).toContainText("Nothing was sent");

    await page.getByLabel("Component",{exact:true}).selectOption("toast");
    await preview.getByRole("button",{name:"Show notification"}).click();
    await expect(preview.getByRole("button",{name:"Dismiss"})).toBeVisible();
    await preview.getByRole("button",{name:"Dismiss"}).click();
    await expect(preview.getByRole("button",{name:"Dismiss"})).toBeHidden();

    await page.getByRole("button",{name:"Mobile",exact:true}).click();
    await expect(page.locator("#lab-preview-shell")).toHaveAttribute("data-width","mobile");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}

test("component lab reuses validated saved theme, escapes text and exports standalone HTML",async ({page})=>{
  await page.goto("/component-lab.html");
  const theme={
    version:1,name:"Ocean",font:"system",radius:12,density:1,
    colors:{canvas:"#f3f7ff",surface:"#ffffff",text:"#162c4d",muted:"#496785",accent:"#155eef",onAccent:"#ffffff",border:"#d5e0f2"}
  };
  await page.evaluate(value => localStorage.setItem("ui-token-studio-v1",JSON.stringify(value)),theme);
  await page.getByRole("button",{name:"Use saved Token Studio theme"}).click();
  await expect(page.getByRole("status").last()).toContainText("theme applied");
  await expect(page.locator("#lab-source")).toContainText("--ui-accent: #155eef;");

  await page.getByLabel("Heading").fill("<script>alert(1)</script>");
  await expect(page.locator("#lab-source")).toContainText("&lt;script&gt;alert(1)&lt;/script&gt;");
  const download=page.waitForEvent("download");
  await page.getByRole("button",{name:"Export standalone HTML"}).click();
  const file=await download;
  expect(file.suggestedFilename()).toBe("original-button.html");
});

test("invalid imported JSON leaves component unchanged", async ({page}) => {
  await page.goto("/component-lab.html");
  const before=await page.locator("#lab-source").inputValue();
  await page.locator("#lab-import").setInputFiles({
    name:"bad.json",mimeType:"application/json",
    buffer:Buffer.from(JSON.stringify({version:1,type:"untrusted",title:"bad"}))
  });
  await expect(page.getByRole("status").last()).toContainText("Import rejected");
  expect(await page.locator("#lab-source").inputValue()).toBe(before);
});
