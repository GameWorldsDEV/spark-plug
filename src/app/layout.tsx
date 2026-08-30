import type { Metadata } from "next";
import "./globals.css";

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const isIndexable = process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Spark Plug — Route local AI without losing control",
    template: "%s | Spark Plug",
  },
  description:
    "A local-first model broker that connects agents to the AI hardware, tools, and creative workflows you already own.",
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
    title: "Spark Plug — Route local AI. Keep control.",
    description:
      "One dependable path between your agents and the AI hardware, models, and creative tools you already own.",
    images: [
      {
        url: "/og.png",
        width: 1729,
        height: 910,
        alt: "Spark Plug routes local AI into a glowing GPU compute node",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spark Plug — Route local AI. Keep control.",
    description:
      "One dependable path between your agents and the AI hardware, models, and creative tools you already own.",
    images: ["/og.png"],
  },
  robots: { index: isIndexable, follow: isIndexable },
  referrer: "strict-origin-when-cross-origin",
};

const motionBootstrap = `document.documentElement.dataset.motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "reduced" : "ready";`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
        {children}
      </body>
    </html>
  );
}
