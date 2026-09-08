import { test, expect } from "@playwright/test";

const ROUTES = [
  "/",
  "/experience",
  "/projects",
  "/skills",
  "/designs",
  "/education",
  "/extracurricular",
  "/wins",
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
      await expect(page.locator(".wordmark")).toContainText("D3athSkulll", {
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

test("blog search filters the list", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.getByRole("link", { name: /B0 Baud/i })).toBeVisible();
  await page.getByPlaceholder("grep posts...").fill("nonsense-xyz");
  await expect(page.getByText("no posts match.")).toBeVisible();
});

test("unknown route shows the 404 section", async ({ page }) => {
  await page.goto("/no-such-page");
  await expect(page.getByRole("heading", { name: /404/ })).toBeVisible();
});

test("theme switch persists across reload", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "retro");
  await page.getByRole("button", { name: "VIM", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "vim");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "vim");
});
