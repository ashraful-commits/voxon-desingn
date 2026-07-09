import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://voxon.sa";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0, alternates: { languages: { ar: base, en: base } } },
  ];
} 
