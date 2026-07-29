import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ticha AI — Mobile Learning PWA",
    short_name: "Ticha AI",
    description: "Cameroon GCE & BACC AI Learning Assistant. Improving 1% every day.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#FAF7EC",
    theme_color: "#FAF7EC",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/images/madame-ticha.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/madame-ticha.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
