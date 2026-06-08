import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["fr", "en"];
  const routes = [""]; // Single page sections are loaded via hash links; main entry points are the root locales

  const sitemaps: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      sitemaps.push({
        url: `https://kolade-cyber.vercel.app/${locale}${route ? `/${route}` : ""}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1.0,
      });
    }
  }

  return sitemaps;
}
