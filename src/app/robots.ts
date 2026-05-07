import { MetadataRoute } from "next";
import { SEO_CONFIG } from "@/lib/seo-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/"],
    },
    sitemap: `${SEO_CONFIG.siteUrl}/sitemap.xml`,
  };
}
