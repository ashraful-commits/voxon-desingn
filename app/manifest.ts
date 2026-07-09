import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Voxon | Premium Web Design & Development in Saudi Arabia",
    short_name: "Voxon",
    description:
      "Voxon builds high-converting Arabic-English websites, e-commerce, SEO, branding, and digital growth systems for Saudi businesses.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0E1A",
    theme_color: "#C9A84C",
    icons: [
      {
        src: "/voxon-dark-icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/voxon-dark-icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
