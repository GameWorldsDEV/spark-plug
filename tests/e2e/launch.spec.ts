import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  ["/", /your local ai.*one control hub/i],
  ["/why-spark-plug", /local ai should feel owned—not improvised/i],
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
    { width: 320, height: 700 },
    { width: 375, height: 812 },
    { width: 390, height: 844 },
    { width: 430, height: 932 },
    { width: 768, height: 1024 },
    { width: 1280, height: 720 },
    { width: 1280, height: 640 },
    { width: 1366, height: 507 },
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

test("the product story presents the real workflow and keeps non-affiliation copy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /download for dgx spark/i })).toHaveAttribute("href", "#release");
  await expect(page.getByRole("link", { name: /see compatible tools/i })).toHaveAttribute("href", "#tools");
  await expect(page.locator("#profile-workflow")).toHaveCount(0);
  await expect(page.getByText(/independent software and is not affiliated with NVIDIA/i)).toBeVisible();
  const huggingFaceMark = page.locator('img[src="/integrations/hugging-face.svg"]').first();
  await expect.poll(() => huggingFaceMark.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
});

test("the mobile hero uses store-specific client actions without overlapping the animation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("button", { name: /ios app store.*coming soon/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /google play.*coming soon/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /download for dgx spark/i })).toBeHidden();
  await expect(page.locator('[data-intro="true"]')).toBeHidden();
  await expect(page.getByRole("link", { name: /see compatible tools/i })).toBeVisible();
});

test("all mobile runtime badges stay in their copy rail and clear every heading", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.goto("/");
  const story = page.locator('section[class*="story"]');
  const distance = await story.evaluate((element) => Math.max(1, element.clientHeight - innerHeight));
  const scene = page.locator('[class*="scene"][data-stage]');
  const stages = [
    { stage: "0", progress: 0.08 },
    { stage: "1", progress: 0.25 },
    { stage: "2", progress: 0.42 },
    { stage: "3", progress: 0.58 },
    { stage: "4", progress: 0.75 },
    { stage: "5", progress: 0.92 },
  ];
  for (const { stage, progress } of stages) {
    await page.evaluate(({ y }) => scrollTo(0, y), { y: distance * progress });
    await expect(scene).toHaveAttribute("data-stage", stage);
    const activeBeat = page.locator('[class*="beats"] article[data-active="true"]');
    const status = activeBeat.locator('small[class*="beatStatus"]');
    await expect(status).toBeVisible();
    await expect(page.locator('[class*="scene"] [class*="machineStatus"]')).toBeHidden();
    const statusBox = await status.boundingBox();
    const headingBox = await activeBeat.getByRole("heading", { level: 2 }).boundingBox();
    expect(statusBox).not.toBeNull();
    expect(headingBox).not.toBeNull();
    expect(statusBox!.y + statusBox!.height).toBeLessThanOrEqual(headingBox!.y);
    const headerGap = await page.evaluate(() => {
      const header = document.querySelector("main > header")?.getBoundingClientRect();
      const agents = document.querySelector('[class*="agentStack"]')?.getBoundingClientRect();
      return header && agents ? agents.top - header.bottom : -1;
    });
    if (stage === "2") expect(headerGap).toBeGreaterThanOrEqual(20);
  }
});

test("compatible tool links and endpoint boundaries are explicit", async ({ page }) => {
  await page.goto("/#tools");
  const tools = page.getByLabel("Compatible tools");
  for (const name of ["OpenClaw", "Hermes Agent", "Paperclip", "Codex", "Claude Code"]) {
    await expect(tools.getByRole("link", { name: new RegExp(name, "i") })).toBeVisible();
  }
  await expect(page.getByText("OpenAI-compatible endpoint", { exact: true })).toBeVisible();
  await expect(page.getByText("Anthropic-compatible endpoint", { exact: true })).toBeVisible();
  await expect(page.getByText(/not a partnership or endorsement/i)).toBeVisible();
  for (const asset of ["codex.png", "claude-code.png"]) {
    const marks = page.locator(`img[src="/integrations/${asset}"]`);
    await expect(marks).toHaveCount(3);
    await expect.poll(async () => marks.evaluateAll((images: HTMLImageElement[]) =>
      images.every((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0),
    )).toBe(true);
  }
});

test("reduced motion lays the story out statically without scroll choreography", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.getByRole("heading", { level: 1, name: /your local ai.*one control hub/i })).toBeVisible();
  await expect(page.getByText("Install Spark Plug.", { exact: true }).last()).toBeVisible();
  for (const stage of ["Add your engines.", "Connect your agents.", "Download your models.", "Build and load a profile.", "Run local. Switch when you need."]) {
    await expect(page.getByRole("heading", { level: 2, name: stage }).last()).toBeVisible();
  }
  await expect(page.getByText(/independent software and is not affiliated with NVIDIA/i)).toBeVisible();
  await expect(page.locator('[class*="staticStory"]')).toBeVisible();
  await expect(page.locator('[class*="machineStage"]')).toBeHidden();
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
  const release = page.getByRole("region", { name: "Spark Plug releases" });
  await expect(release.getByRole("link", { name: /open the github repository/i })).toHaveAttribute("href", "https://github.com/GameWorldsDEV/spark-plug");
  await expect(page.getByRole("button", { name: /public artifact preparing/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /coming soon/i })).toHaveCount(5);
  await expect(page.getByLabel("Spark Plug platform releases").locator("article")).toHaveCount(3);
  const mobileReleases = page.getByLabel("Spark Plug mobile control releases");
  await expect(mobileReleases.locator("article")).toHaveCount(2);
  await expect(mobileReleases.getByRole("heading", { name: "iOS App Store", exact: true })).toBeVisible();
  await expect(mobileReleases.getByRole("heading", { name: "Google Play", exact: true })).toBeVisible();
});

test("an iPad requesting the desktop site is detected as iOS, not macOS", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "platform", { configurable: true, get: () => "MacIntel" });
    Object.defineProperty(navigator, "maxTouchPoints", { configurable: true, get: () => 5 });
    Object.defineProperty(navigator, "userAgent", {
      configurable: true,
      get: () => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Version/18.6 Mobile/15E148 Safari/604.1",
    });
  });
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/#release");

  const macos = page.getByRole("heading", { name: "macOS", exact: true }).locator("..");
  const ios = page.getByRole("heading", { name: "iOS App Store", exact: true }).locator("..");
  await expect(macos.getByText("YOUR DEVICE", { exact: true })).toHaveCount(0);
  await expect(ios.getByText("YOUR DEVICE", { exact: true })).toBeVisible();
});

test("GitHub proof uses aggregate labels without fabricating a release count", async ({ page }) => {
  await page.goto("/");
  const proof = page.getByRole("region", { name: /follow the build/i });
  await expect(proof.getByText("GitHub stars", { exact: true })).toBeVisible();
  await expect(proof.getByText("Latest release downloads", { exact: true })).toBeVisible();
  await expect(proof.getByText(/GitHub aggregate counts.*refreshed hourly/i)).toBeVisible();
  await expect(proof.getByRole("link", { name: /open the github repository/i })).toHaveAttribute("href", "https://github.com/GameWorldsDEV/spark-plug");
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

test("downloads follow the hero on desktop while remaining near the bottom on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const desktopOrder = await page.evaluate(() => {
    const story = document.querySelector('section[class*="story"]');
    const release = document.querySelector("#release");
    const proof = document.querySelector("#github-proof-title")?.closest("section");
    return story?.nextElementSibling === release && release?.nextElementSibling === proof;
  });
  expect(desktopOrder).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileOrder = await page.evaluate(() => {
    const roadmap = document.querySelector("#roadmap");
    const release = document.querySelector("#release");
    const faq = document.querySelector('section[class*="faq"]');
    if (!roadmap || !release || !faq) return false;
    const elements = [roadmap, release, faq];
    const positions = elements.map((element) => element.getBoundingClientRect().top + scrollY);
    return positions[0] < positions[1] && positions[1] < positions[2];
  });
  expect(mobileOrder).toBe(true);

  await page.setViewportSize({ width: 1440, height: 900 });
  const screenCount = await page.evaluate(
    () => document.documentElement.scrollHeight / window.innerHeight,
  );
  expect(screenCount).toBeLessThanOrEqual(22);
});

test("marketplace and training previews stay truthful and engine-aware", async ({ page }) => {
  await page.goto("/#marketplace");
  await expect(page.locator("#rabbit-r1")).toHaveCount(0);
  const marketplace = page.locator("#marketplace");
  await expect(marketplace.getByRole("heading", { name: /start with a profile.*make it yours/i })).toBeVisible();
  await expect(marketplace.getByRole("button", { name: /catalog preparing/i })).toHaveCount(3);
  await expect(marketplace.getByText(/no profile download is advertised as live yet/i)).toBeVisible();
  const huggingFaceMark = marketplace.locator('img[src="/integrations/hugging-face.svg"]');
  await expect.poll(() => huggingFaceMark.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  for (const engine of ["vLLM", "Colibri", "ComfyUI", "MLX", "Ollama"]) {
    await expect(marketplace.getByText(engine, { exact: true }).last()).toBeVisible();
  }

  const training = page.locator("#training");
  await expect(training.getByRole("heading", { name: /tune the model.*keep control of the adapter/i })).toBeVisible();
  await expect(training.getByText("UNSLOTH INTEGRATION", { exact: true })).toBeVisible();
  await expect(training.getByText("LORA WORKFLOWS", { exact: true })).toBeVisible();
  await expect(training.getByText(/not a first-release claim/i)).toBeVisible();

  const roadmap = page.locator("#roadmap");
  for (const title of ["DGX Spark clustering", "Apple Mac nodes", "Windows nodes"]) {
    await expect(roadmap.getByRole("heading", { name: title, exact: true })).toBeVisible();
  }
});

test("security and prelaunch indexing headers are present", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(response.headers()["content-security-policy"]).not.toContain("sketchfab.com");
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
