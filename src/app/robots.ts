import type { MetadataRoute } from "next";
import { currentLaunch } from "@/lib/launch-stage";
import { siteOrigin } from "./layout";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: currentLaunch.indexable
      ? { userAgent: "*", allow: "/", disallow: ["/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: currentLaunch.indexable ? `${siteOrigin}/sitemap.xml` : undefined,
    host: currentLaunch.indexable ? siteOrigin : undefined,
  };
}

