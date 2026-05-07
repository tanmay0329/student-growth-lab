import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SEO_CONFIG.siteName,
    short_name: "SGL",
    description: SEO_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: SEO_CONFIG.themeColor,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
