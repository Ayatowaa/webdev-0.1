import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { products } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    ...projects.map((p) => `/projects/${p.slug}`),
    "/demos/auren",
    "/demos/form",
    ...products.map((p) => `/demos/form/product/${p.slug}`),
  ].map((path) => ({
    url: siteUrl + path,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
