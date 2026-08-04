import type { MetadataRoute } from "next";

const BASE = "https://voxon.sa";

const PORTFOLIO_IMAGES = [
  "/images/sebabazar.png",
  "/images/salesfarm.png",
  "/images/nanosoft.png",
  "/images/voxon.png",
  "/images/Movix.png",
  "/images/coursemater.png",
  "/images/afterwe.png",
  "/images/facepillow.png",
  "/images/brightsimile.png",
  "/images/famclinic.png",
  "/images/portfolio-construction.png",
  "/images/portfolio-restaurant.png",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      images: PORTFOLIO_IMAGES.map((p) => `${BASE}${p}`),
    },
  ];
}
