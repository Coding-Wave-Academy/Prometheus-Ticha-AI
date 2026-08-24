import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Ticha AI — Mobile Learning PWA",
    short_name: "Ticha AI",
    description: "Cameroon GCE & BACC AI Learning Assistant.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7EC",
    theme_color: "#FAF7EC",
    orientation: "portrait",
    scope: "/",
    icons: [
      {
        src: "/images/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/ticha-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
