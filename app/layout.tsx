import type { Metadata, Viewport } from "next";
import { Playfair_Display, Almarai, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
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
  metadataBase: new URL("https://voxondigital.net"),
  title: {
    default: "Voxon Digital | تصميم مواقع وتطوير رقمي | Web Design & Development Saudi Arabia",
    template: "%s | Voxon Digital",
  },
  description: "فوكسون ديجيتال وكالة رقمية سعودية — تصميم مواقع احترافي، متاجر إلكترونية، SEO، هوية تجارية. Voxon Digital: premium web design, e-commerce, SEO & digital growth for Saudi businesses.",
  keywords: [
    "تصميم مواقع السعودية",
    "web design Saudi Arabia",
    "وكالة رقمية الرياض",
    "digital agency Riyadh",
    "تطوير مواقع عربي",
    "Arabic website development",
    "متجر إلكتروني السعودية",
    "e-commerce Saudi Arabia",
    "تحسين محركات البحث",
    "SEO Saudi Arabia",
    "وكالة هوية تجارية السعودية",
    "branding agency Saudi Arabia",
    "تطوير مواقع جدة",
    "web development Jeddah",
    "تصميم مواقع الدمام",
    "website design Dammam",
    "وكالة رقمية سعودية",
    "Saudi digital agency",
    "مواقع شركات السعودية",
    "business website Saudi Arabia",
    "شركة تصميم مواقع الرياض",
    "web design company Riyadh",
    "تطوير مواقع السعودية",
    "Saudi web development",
    "تسويق إلكتروني السعودية",
    "digital marketing Saudi Arabia",
    "أفضل شركة تصميم مواقع",
    "best web design company Saudi Arabia",
    "تصميم مواقع احترافي",
    "professional web design Saudi Arabia",
    "تصميم واجهة مستخدم",
    "UI UX design Saudi Arabia",
    "تطوير تطبيقات الموبايل",
    "mobile app development Saudi Arabia",
    "تصميم مواقع رخيص",
    "affordable web design Saudi Arabia",
    "تصميم مواقع bilingual",
    "bilingual web design Saudi Arabia",
  ],
  alternates: {
    canonical: "https://voxondigital.net",
    languages: {
      "ar": "https://voxondigital.net",
      "en": "https://voxondigital.net",
      "x-default": "https://voxondigital.net",
    },
  },
  applicationName: "Voxon Digital",
  authors: [{ name: "Voxon Digital Agency", url: "https://voxondigital.net" }],
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
    google: "7DFypz2--zSS4u3vmuJIDF_Xc00JCfM3Bpmov46RmI8",
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_SA",
    url: "https://voxondigital.net",
    siteName: "Voxon Digital",
    title: "Voxon Digital | تصميم مواقع وتطوير رقمي | Web Design & Development Saudi Arabia",
    description: "فوكسون ديجيتال — تصميم مواقع احترافي، متاجر إلكترونية، SEO، هوية تجارية. Premium web design, e-commerce, SEO & digital growth for Saudi businesses.",
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
    title: "Voxon Digital | تصميم مواقع وتطوير رقمي | Web Design Saudi Arabia",
    description: "تصميم مواقع احترافي وتطوير رقمي — Web design, e-commerce, SEO & digital growth for Saudi businesses.",
    creator: "@voxon_sa",
    site: "@voxon_sa",
    images: ["/og-image.svg"],
  },
  appleWebApp: {
    capable: true,
    title: "Voxon Digital",
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://voxondigital.net/#organization",
    name: "Voxon Digital",
    alternateName: "فوكسون ديجيتال",
    url: "https://voxondigital.net",
    logo: "https://voxondigital.net/og-image.svg",
    image: "https://voxondigital.net/og-image.svg",
    telephone: "+966542288828",
    email: "info@voxondigital.net",
    description: "Voxon Digital — وكالة رقمية سعودية متخصصة في تصميم المواقع والتطوير والتسويق الإلكتروني. Premium web design, e-commerce, SEO & digital growth agency in Saudi Arabia.",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riyadh",
      addressRegion: "Riyadh Province",
      addressCountry: "SA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 24.7136,
      longitude: 46.6753,
    },
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
    sameAs: [
      "https://www.facebook.com/voxondigital",
      "https://www.instagram.com/voxondigital",
      "https://www.linkedin.com/company/voxon-digital",
      "https://twitter.com/voxondigital",
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "18:00",
    },
  };

  return (
    <html lang="ar" className={`${playfair.variable} ${almarai.variable} ${plusJakarta.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
