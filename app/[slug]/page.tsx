import type { Metadata } from "next";
import Link from "next/link";
import { SEO_PAGES, getSeoPage, type SeoLandingPage } from "@/lib/seo-pages";
import SlugShell from "./SlugShell";

export const dynamicParams = false;

export function generateStaticParams() {
  return SEO_PAGES.map((p) => ({ slug: p.slug }));
}

const BASE = "https://voxondigital.net";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return {};

  const url = `${BASE}/${page.slug}`;

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "ar_SA",
      alternateLocale: "en_SA",
      url,
      siteName: "Voxon Digital",
      title: page.title,
      description: page.description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: page.title }],
      countryName: "Saudi Arabia",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    other: page.geo
      ? {
          "geo.region": page.geo.region,
          "geo.placename": page.geo.placename,
          "geo.position": `${page.geo.latitude};${page.geo.longitude}`,
          ICBM: `${page.geo.latitude}, ${page.geo.longitude}`,
        }
      : undefined,
  };
}

function relatedLinks(page: SeoLandingPage) {
  return page.related
    .map((slug) => getSeoPage(slug))
    .filter((p): p is SeoLandingPage => Boolean(p));
}

function jsonLd(page: SeoLandingPage) {
  const url = `${BASE}/${page.slug}`;
  const isCity = page.kind === "city";

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: isCity ? "Cities" : "Services", item: `${BASE}/#services` },
      { "@type": "ListItem", position: 3, name: page.h1, item: url },
    ],
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const mainEntity = isCity
    ? {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${url}#localbusiness`,
        name: `Voxon Digital — ${page.h1}`,
        url,
        image: "https://voxondigital.net/og-image.png",
        logo: "https://voxondigital.net/og-image.png",
        telephone: "+966542288828",
        email: "info@voxondigital.net",
        priceRange: "$$",
        description: page.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: page.geo?.placename ?? "Saudi Arabia",
          addressRegion: page.cityRegion ?? "",
          addressCountry: "SA",
        },
        geo: page.geo
          ? {
              "@type": "GeoCoordinates",
              latitude: parseFloat(page.geo.latitude),
              longitude: parseFloat(page.geo.longitude),
            }
          : undefined,
        areaServed: { "@type": "Country", name: "Saudi Arabia" },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
          opens: "09:00",
          closes: "18:00",
        },
        sameAs: [
          "https://www.facebook.com/voxondigital",
          "https://www.instagram.com/voxondigital",
          "https://www.linkedin.com/company/voxon-digital",
          "https://twitter.com/voxondigital",
        ],
      }
    : {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${url}#service`,
        name: page.h1,
        serviceType: page.h1,
        description: page.description,
        url,
        provider: { "@id": "https://voxondigital.net/#organization" },
        areaServed: { "@type": "Country", name: "Saudi Arabia" },
      };

  return [breadcrumb, faq, mainEntity];
}

export default async function SeoLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getSeoPage(slug);
  if (!page) return null;

  const related = relatedLinks(page);

  return (
    <>
      {jsonLd(page).map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      <SlugShell kind={page.kind} h1={page.h1}>
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pt-14 pb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9A84C]/30 text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-6">
            {page.kind === "city" ? "Serving KSA" : "Voxon Digital Services"}
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-6 max-w-4xl">
            {page.h1}
          </h1>
          <p className="text-lg text-white/70 max-w-3xl mb-8">{page.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/#contact" className="px-6 py-3 rounded-full bg-[#C9A84C] text-white text-sm font-semibold hover:bg-[#b8953d] transition-colors">
              Get Free Consultation
            </Link>
            <Link href="/#portfolio" className="px-6 py-3 rounded-full border border-white/20 text-white/80 text-sm font-semibold hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
              View Our Work
            </Link>
          </div>
        </section>

        {/* Intro */}
        <section className="max-w-7xl mx-auto px-6 lg:px-10 pb-16">
          <div className="grid md:grid-cols-2 gap-8">
            {page.intro.map((p, i) => (
              <p key={i} className="text-white/70 leading-relaxed">{p}</p>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-white/5 py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <h2 className="font-playfair text-2xl md:text-3xl font-semibold mb-10">
              Why Businesses Choose Voxon Digital
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {page.features.map((f) => (
                <div key={f.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-[#C9A84C]/40 transition-colors">
                  <h3 className="text-base font-semibold mb-2 text-[#C9A84C]">{f.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/5 py-16">
          <div className="max-w-4xl mx-auto px-6 lg:px-10">
            <h2 className="font-playfair text-2xl md:text-3xl font-semibold mb-10 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {page.faqs.map((f) => (
                <details key={f.q} className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 open:border-[#C9A84C]/40 transition-colors">
                  <summary className="flex items-center justify-between gap-4 cursor-pointer text-sm font-semibold">
                    {f.q}
                    <span className="shrink-0 text-[#C9A84C] transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-sm text-white/60 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="border-t border-white/5 py-16">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              <h2 className="font-playfair text-2xl md:text-3xl font-semibold mb-10">
                Related Services & Locations
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {related.map((r) => (
                  <Link key={r.slug} href={`/${r.slug}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-[#C9A84C]/40 hover:bg-white/[0.06] transition-all">
                    <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#C9A84C] mb-2 block">
                      {r.kind === "city" ? "City" : "Service"}
                    </span>
                    <span className="text-sm font-semibold leading-snug">{r.h1}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </SlugShell>
    </>
  );
}
