import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0E1A" },
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://voxon.sa"),
  title: {
    default: "Voxon | Premium Web Design & Development in Saudi Arabia",
    template: "%s | Voxon",
  },
  description: "Voxon is a premium Saudi digital agency building high-converting Arabic-English websites, e-commerce stores, SEO strategies, branding, and digital growth systems for businesses across Riyadh, Jeddah, and Dammam.",
  keywords: [
    "web design Saudi Arabia",
    "digital agency Riyadh",
    "Arabic website development",
    "e-commerce Saudi Arabia",
    "SEO Saudi Arabia",
    "branding agency Saudi Arabia",
    "web development Jeddah",
    "website design Dammam",
    "Saudi digital agency",
    "business website Saudi Arabia",
    "web design company Riyadh",
    "Saudi web development",
    "digital marketing Saudi Arabia",
    "UI UX design Saudi Arabia",
    "mobile app development Saudi Arabia",
  ],
  alternates: {
    canonical: "https://voxon.sa",
    languages: {
      "en-SA": "https://voxon.sa",
      "ar-SA": "https://voxon.sa/ar",
    },
  },
  applicationName: "Voxon",
  authors: [{ name: "Voxon Digital Agency", url: "https://voxon.sa" }],
  creator: "Voxon Digital Agency",
  publisher: "Voxon Digital Agency",
  category: "technology",
  classification: "Digital Agency & Web Development Services",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
  },
  openGraph: {
    type: "website",
    locale: "en_SA",
    alternateLocale: "ar_SA",
    url: "https://voxon.sa",
    siteName: "Voxon",
    title: "Voxon | Premium Web Design & Development in Saudi Arabia",
    description: "World-class digital experiences for Saudi companies — web design, e-commerce, SEO, branding, and digital growth. Built with performance and conversion in mind.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Voxon digital agency branding — web design and development in Saudi Arabia",
      },
    ],
    countryName: "Saudi Arabia",
    ttl: 604800,
  },
  twitter: {
    card: "summary_large_image",
    title: "Voxon | Premium Web Design & Development in Saudi Arabia",
    description: "World-class digital experiences for Saudi companies — web design, e-commerce, SEO, branding, and digital growth.",
    creator: "@voxon_sa",
    site: "@voxon_sa",
    images: ["/og-image.svg"],
  },
  appleWebApp: {
    capable: true,
    title: "Voxon",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  referrer: "origin-when-cross-origin",
  other: {
    "geo.region": "SA-01",
    "geo.placename": "Riyadh",
    "geo.position": "24.7136;46.6753",
    ICBM: "24.7136, 46.6753",
    "google-site-verification": "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
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
