import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Spark Plug",
    short_name: "Spark Plug",
    description: "Control local AI engines, models, profiles, queues, and authorized tools.",
    start_url: "/",
    display: "standalone",
    background_color: "#05080b",
    theme_color: "#a9ff2e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

