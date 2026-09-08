import { test, expect } from "@playwright/test";

const ROUTES = [
  "/",
  "/experience",
  "/projects",
  "/skills",
  "/education",
  "/achievements",
  "/resume",
  "/contact",
  "/blog",
];

for (const theme of ["retro", "vim"] as const) {
  for (const path of ROUTES) {
    test(`${theme} ${path} renders`, async ({ page }) => {
      await page.addInitScript((t) => {
        try {
          localStorage.setItem("theme", t as string);
        } catch {
          /* ignore */
        }
      }, theme);
      const res = await page.goto(path);
      expect(res?.status()).toBeLessThan(400);
      await expect(page.locator(".banner h1")).toContainText("D3athSkulll", {
        timeout: 10_000,
      });
      await expect(page.locator(".banner-sub")).toContainText("Shivam");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    });
  }
}

test("blog post renders with its image", async ({ page }) => {
  await page.goto("/blog");
  await page.getByRole("link", { name: /B0 Baud/i }).click();
  await expect(page).toHaveURL(/\/blog\/why-b0-baud-is-cursed$/);
  const img = page.locator(".prose img").first();
  await expect(img).toBeVisible();
  const ok = await img.evaluate(
    (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
  );
  expect(ok).toBeTruthy();
});

test("unknown route shows the retro 404", async ({ page }) => {
  await page.goto("/no-such-page");
  await expect(page.locator(".section-label")).toContainText("404");
});

test("theme switch persists across reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "retro");
  await page.getByRole("button", { name: "VIM", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "vim");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "vim");
});
