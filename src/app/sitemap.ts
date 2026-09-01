import type { MetadataRoute } from "next";
import { currentLaunch } from "@/lib/launch-stage";
import { siteOrigin } from "./layout";

const paths = [
  "", "/docs", "/download", "/marketplace", "/training", "/support",
  "/changelog", "/community-leaders", "/pricing", "/account", "/why-spark-plug", "/benchmarks", "/legal", "/accessibility",
  "/privacy", "/terms", "/security", "/trademarks",
  "/legal/software", "/legal/commercial", "/legal/marketplace",
];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!currentLaunch.indexable) return [];
  return paths.map((path) => ({ url: `${siteOrigin}${path}`, changeFrequency: path === "" ? "weekly" : "monthly" }));
}
