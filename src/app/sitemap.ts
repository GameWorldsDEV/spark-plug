import type { MetadataRoute } from "next";
import { currentLaunch } from "@/lib/launch-stage";
import { siteOrigin } from "./layout";

const paths = [
  "", "/docs", "/download", "/marketplace", "/pricing", "/account", "/themes", "/training", "/support",
  "/changelog", "/community-leaders", "/why-spark-plug", "/benchmarks", "/legal", "/accessibility",
  "/privacy", "/terms", "/security", "/trademarks",
  "/legal/software", "/legal/marketplace", "/legal/refunds", "/legal/commercial",
];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!currentLaunch.indexable) return [];
  return paths.map((path) => ({ url: `${siteOrigin}${path}`, changeFrequency: path === "" ? "weekly" : "monthly" }));
}
