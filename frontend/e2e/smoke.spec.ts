import { test, expect } from "@playwright/test";

const ROUTES = [
  "/",
  "/experience",
  "/projects",
  "/collaborations",
  "/skills",
  "/designs",
  "/education",
  "/test-scores",
  "/extracurricular",
  "/wins",
  "/likes",
  "/resume",
  "/contact",
  "/blog",
];

for (const theme of ["retro", "vim", "space"] as const) {
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
      await expect(page.locator(".wordmark")).toContainText(/D3athSkulll/i, {
        timeout: 10_000,
      });
      await expect(page.locator(".banner-sub")).toContainText("Shivam");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    });
  }
}

test("blog post opens from the index", async ({ page }) => {
  await page.goto("/blog");
  const firstPost = page.locator('a[href^="/blog/"]').first();
  await firstPost.click();
  await expect(page).toHaveURL(/\/blog\/[a-z0-9-]+$/);
  await expect(page.locator(".prose")).toBeVisible();
  const img = page.locator(".prose img").first();
  if (await img.count()) {
    const ok = await img.evaluate(
      (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
    );
    expect(ok).toBeTruthy();
  }
});

test("blog search filters the list", async ({ page }) => {
  await page.goto("/blog");
  await expect(page.locator('a[href^="/blog/"]').first()).toBeVisible();
  await page.getByPlaceholder("grep posts...").fill("nonsense-xyz");
  await expect(page.getByText("no posts match.")).toBeVisible();
});

test("unknown route shows the 404 section", async ({ page }) => {
  await page.goto("/no-such-page");
  await expect(page.getByRole("heading", { name: /404/ })).toBeVisible();
});

test("theme switch persists across reload", async ({ page }) => {
  await page.goto("/");
  // vim is the default
  await expect(page.locator("html")).toHaveAttribute("data-theme", "vim");
  await page.getByRole("button", { name: "RETRO", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "retro");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "retro");
});
