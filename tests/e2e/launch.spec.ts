import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  ["/", /plug in/i],
  ["/benchmarks", /measured on our own box/i],
  ["/privacy", /privacy without mystery/i],
  ["/terms", /clear rules for shared setups/i],
  ["/trademarks", /names stay with their owners/i],
  ["/security", /trust the wiring you can inspect/i],
] as const;

for (const [route, heading] of routes) {
  test(`${route} has one clear heading and no automatic accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}

test("homepage works without horizontal overflow at phone, tablet, and desktop widths", async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

test("the installation story loads its photography and keeps non-affiliation copy", async ({ page }) => {
  await page.goto("/");
  const hardware = page.getByRole("img", {
    name: /powering up as Spark Plug is installed/i,
  });
  await expect
    .poll(() => hardware.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await expect(page.getByText(/independent software and is not affiliated with NVIDIA/i)).toBeVisible();
  await expect(page.getByText(/node-and-client system for running local models/i)).toBeVisible();
});

test("reduced motion lays the story out statically without scroll choreography", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.getByRole("heading", { level: 1, name: /plug in.*power up/i })).toBeVisible();
  await expect(page.getByRole("img", { name: /powering up as Spark Plug is installed/i })).toBeVisible();
  await expect(page.getByText(/independent software and is not affiliated with NVIDIA/i)).toBeVisible();
  const storyIsStatic = await page.locator("section").first().evaluate(
    (section) => section.getBoundingClientRect().height < window.innerHeight * 3,
  );
  expect(storyIsStatic).toBe(true);
});

test("benchmarks are honest: coming soon until measured rows exist", async ({ page }) => {
  await page.goto("/#benchmarks");
  const section = page.locator("#benchmarks");
  await expect(section.getByText(/measured, not marketed/i)).toBeVisible();
  await expect(section.getByRole("link", { name: /benchmark method/i })).toBeVisible();

  await page.goto("/benchmarks");
  const rows = page.locator("tbody tr");
  const comingSoon = page.getByText("COMING SOON", { exact: true });
  if ((await rows.count()) === 1 && (await comingSoon.count()) > 0) {
    await expect(comingSoon).toBeVisible();
  }
  await expect(page.getByText(/median of at least five requests/i).first()).toBeVisible();
});

test("pricing remains explicit and reduced motion is honored", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#plans");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.getByRole("heading", { level: 3, name: /\$5.*month/i })).toBeVisible();
  await expect(page.getByText("$48 annually when available.")).toBeVisible();
  await expect(page.getByText(/security, routing, engines, local accounts, and accessibility are never Pro gates/i)).toBeVisible();
});

test("security and prelaunch indexing headers are present", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-frame-options"]).toBe("DENY");
  expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
});

test("root social card is explicit and detail pages do not inherit it", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og\.png$/);

  await page.goto("/privacy");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Privacy notice");
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(0);
});
