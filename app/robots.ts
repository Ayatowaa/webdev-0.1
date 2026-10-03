import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/demos/orbit/",
        "/demos/form/cart",
        "/demos/form/checkout",
      ],
    },
    sitemap: siteUrl + "/sitemap.xml",
  };
}
