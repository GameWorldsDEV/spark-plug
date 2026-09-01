import type { Metadata } from "next";
import type { ReactNode } from "react";
import { currentLaunch } from "@/lib/launch-stage";
import "./globals.css";

export const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sparkplug.gameworlds.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Spark Plug — Control the local AI node you own",
    template: "%s | Spark Plug",
  },
  description:
    "A node-and-client control system for local AI models, media engines, profiles, queues, and authorized tools on hardware you own.",
  applicationName: "Spark Plug",
  keywords: [
    "local AI",
    "model routing",
    "MCP",
    "AI agents",
    "GPU orchestration",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Spark Plug",
    title: "Spark Plug — One control system for your local AI node.",
    description:
      "Pair clients, define workload profiles, apply them to the node, and observe real engine, model, queue, and memory state.",
    images: [
      {
        url: "/og-v2.png",
        width: 1731,
        height: 909,
        alt: "Spark Plug routes local AI work into an NVIDIA DGX Spark node",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spark Plug — One control system for your local AI node.",
    description:
      "Pair clients, define workload profiles, apply them to the node, and observe real engine, model, queue, and memory state.",
    images: ["/og-v2.png"],
  },
  robots: { index: currentLaunch.indexable, follow: currentLaunch.indexable },
  referrer: "strict-origin-when-cross-origin",
};

const motionBootstrap = `document.documentElement.dataset.motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "ready";`;

export default function RootLayout({ children }: { children: ReactNode }) {
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Spark Plug",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux, macOS, iOS, iPadOS, Windows, Android",
    url: siteOrigin,
    publisher: {
      "@type": "Organization",
      name: "GameWorlds LLC",
      url: "https://gameworlds.ai",
    },
    ...(currentLaunch.downloads
      ? { offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" } }
      : {}),
  }).replace(/</g, "\\u003c");
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
        {children}
      </body>
    </html>
  );
}
