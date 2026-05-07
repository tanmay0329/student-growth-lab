import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/challenge", "/results"].map((route) => ({
    url: `${SEO_CONFIG.siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return routes;
}
