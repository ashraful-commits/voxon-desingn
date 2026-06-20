import type { Metadata } from "next";
import { Playfair_Display, Amiri, Reem_Kufi, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});
const reemKufi = Reem_Kufi({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-reem-kufi",
});
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
});
import { Outfit } from "next/font/google";
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://voxon.sa"),
  title: "Voxon | Premium Web Design & Development in Saudi Arabia",
  description: "Voxon builds high-converting Arabic-English websites, e-commerce, SEO, branding, and digital growth systems for Saudi businesses.",
  keywords: [
    "web design Saudi Arabia",
    "digital agency Riyadh",
    "Arabic website development",
    "e-commerce Saudi Arabia",
    "SEO Saudi Arabia",
    "branding agency Saudi Arabia",
  ],
  alternates: { canonical: "https://voxon.sa" },
  applicationName: "Voxon",
  authors: [{ name: "Voxon Digital Agency" }],
  creator: "Voxon Digital Agency",
  publisher: "Voxon Digital Agency",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  openGraph: {
    type: "website",
    locale: "en_SA",
    url: "https://voxon.sa",
    title: "Voxon | Premium Web Design & Development in Saudi Arabia",
    description: "World-class digital experiences for Saudi companies, built with performance, SEO, and conversion in mind.",
    siteName: "Voxon",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Voxon digital agency branding" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Voxon | Premium Web Design & Development in Saudi Arabia",
    description: "World-class digital experiences for Saudi companies, built with performance, SEO, and conversion in mind.",
    creator: "@voxon_sa",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${amiri.variable} ${reemKufi.variable} ${plusJakarta.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
