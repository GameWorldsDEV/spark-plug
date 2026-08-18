import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  ["/", /plug in/i],
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

test("the MCP-returned power-on artwork loads with provenance and non-affiliation copy", async ({ page }) => {
  await page.goto("/#power-title");
  const artwork = page.getByRole("img", {
    name: /generic compute box powering on with a vivid green core/i,
  });
  await expect(artwork).toBeVisible();
  await expect
    .poll(() => artwork.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await expect(page.getByText(/returned to the requesting agent through MCP/i)).toBeVisible();
  await expect(page.getByText(/not sponsored, endorsed, or affiliated with NVIDIA/i)).toBeVisible();
});

test("pricing toggle updates the Pro price and reduced motion is honored", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#plans");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.getByText("$5", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /annual/i }).click();
  await expect(page.getByText("$4", { exact: true })).toBeVisible();
  await expect(page.getByText("Billed $48 yearly")).toBeVisible();
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
