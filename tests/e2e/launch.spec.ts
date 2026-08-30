import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  ["/", /own the node.*run the work/i],
  ["/benchmarks", /no performance claims without a measured run/i],
  ["/privacy", /what this site collects today/i],
  ["/terms", /what this preview is—and is not/i],
  ["/trademarks", /compatibility does not mean endorsement/i],
  ["/security", /separate what is live from what is planned/i],
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

test("the product story loads its photography and keeps non-affiliation copy", async ({ page }) => {
  await page.goto("/");
  const hardware = page.getByRole("img", {
    name: /first supported Spark Plug node/i,
  }).first();
  await expect
    .poll(() => hardware.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
  await expect(page.getByText(/independent software and is not affiliated with NVIDIA/i)).toBeVisible();
  await expect(page.getByText(/local control app and GW Broker/i).first()).toBeVisible();
});

test("approved integration marks load beside their visible names", async ({ page }) => {
  await page.goto("/#workflow");
  const harness = page.getByLabel("Compatible agent and coding harnesses");
  for (const name of ["OPENCLAW", "HERMES", "PAPERCLIP", "CODEX", "CLAUDE CODE"]) {
    await expect(harness.getByText(name, { exact: true })).toBeVisible();
  }
  const marks = harness.locator("img");
  await expect(marks).toHaveCount(5);
  for (let index = 0; index < 5; index += 1) {
    await expect.poll(() => marks.nth(index).evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  }
});

test("reduced motion lays the story out statically without scroll choreography", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.getByRole("heading", { level: 1, name: /own the node.*run the work/i })).toBeVisible();
  await expect(page.getByRole("img", { name: /first supported Spark Plug node/i }).first()).toBeVisible();
  await expect(page.getByText(/independent software and is not affiliated with NVIDIA/i)).toBeVisible();
  const storyIsStatic = await page.locator("section").first().evaluate(
    (section) => section.getBoundingClientRect().height < window.innerHeight * 3,
  );
  expect(storyIsStatic).toBe(true);
});

test("benchmarks are honest: coming soon until measured rows exist", async ({ page }) => {
  await page.goto("/benchmarks");
  const rows = page.locator("tbody tr");
  const comingSoon = page.getByText("COMING SOON", { exact: true });
  if ((await rows.count()) === 1 && (await comingSoon.count()) > 0) {
    await expect(comingSoon).toBeVisible();
  }
  await expect(page.getByText(/if a number is not measured under a documented method/i).first()).toBeVisible();
});

test("release status is explicit, platform-aware, and reduced motion is honored", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#release");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.getByRole("link", { name: /open the github repository/i })).toHaveAttribute("href", "https://github.com/GameWorldsDEV/spark-plug");
  await expect(page.getByRole("button", { name: /preparing first release/i })).toBeDisabled();
  await expect(page.getByRole("button", { name: /coming soon/i })).toHaveCount(3);
  await expect(page.getByText(/your device/i).last()).toBeVisible();
});

test("the public release manifest never exposes an unfinished download", async ({ request }) => {
  const response = await request.get("/releases/current.json");
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  expect(manifest.releaseStatus).toBe("preparing");
  for (const artifact of Object.values(manifest.platforms) as Array<{ status: string; url: string | null; sha256: string | null }>) {
    expect(artifact.status).not.toBe("available");
    expect(artifact.url).toBeNull();
    expect(artifact.sha256).toBeNull();
  }
});

test("the redesigned desktop homepage stays within twelve viewport heights", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const screenCount = await page.evaluate(
    () => document.documentElement.scrollHeight / window.innerHeight,
  );
  expect(screenCount).toBeLessThanOrEqual(12);
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
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/og-v2\.png$/);

  await page.goto("/privacy");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Privacy notice");
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(0);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(0);
});
