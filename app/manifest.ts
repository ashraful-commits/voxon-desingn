import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Voxon Digital | Premium Web Design & Development in Saudi Arabia",
    short_name: "Voxon Digital",
    description:
      "Voxon Digital builds high-converting Arabic-English websites, e-commerce, SEO, branding, and digital growth systems for Saudi businesses.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0E1A",
    theme_color: "#1A6B3C",
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
