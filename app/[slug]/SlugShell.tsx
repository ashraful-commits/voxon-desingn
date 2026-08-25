"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { translations, type Locale } from "@/lib/translations";

export default function SlugShell({
  kind,
  h1,
  children,
}: {
  kind: "service" | "city";
  h1: string;
  children: React.ReactNode;
}) {
  const [locale] = useState<Locale>(() => {
    if (typeof window === "undefined") return "en";
    try {
      const stored = localStorage.getItem("voxon-locale") as Locale | null;
      if (stored === "ar" || stored === "en") return stored;
    } catch {}
    return "en";
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("voxon-locale") as Locale | null;
      if (stored === "ar" || stored === "en") {
        document.documentElement.lang = stored;
        document.documentElement.dir = stored === "ar" ? "rtl" : "ltr";
      }
    } catch {}
  }, []);

  const t = (key: string) => translations[locale]?.[key] ?? translations.en[key] ?? key;

  return (
    <div className="bg-midnight min-h-screen text-white" dir={locale === "ar" ? "rtl" : "ltr"}>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-midnight/90 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-end gap-1">
            <Image
              src="/voxon-white-transparent%20logo.png"
              alt="Voxon Digital"
              width={3904}
              height={1406}
              priority
              sizes="120px"
              className="h-8 w-auto object-contain"
            />
            <span className="text-[8px] font-bold tracking-[0.22em] uppercase px-1.5 py-0.5 rounded-sm mb-0.5" style={{ color: "#fff", background: "#C9A84C" }}>
              digital
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[11px] font-semibold tracking-wider uppercase text-white/50">
            <Link href="/#services" className="hover:text-white/90 transition-colors">{t("slug.nav.services")}</Link>
            <Link href="/#portfolio" className="hover:text-white/90 transition-colors">{t("slug.nav.portfolio")}</Link>
            <Link href="/#contact" className="hover:text-white/90 transition-colors">{t("slug.nav.contact")}</Link>
          </nav>
          <Link href="/#contact" className="text-[11px] font-semibold tracking-wider uppercase px-4 py-2 rounded-full border border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white transition-colors">
            {t("slug.cta.free")}
          </Link>
        </div>
      </header>

      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-6 lg:px-10 pt-8 text-xs text-white/40">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-[#C9A84C] transition-colors">{t("slug.breadcrumb.home")}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/#services" className="hover:text-[#C9A84C] transition-colors">{kind === "city" ? t("slug.breadcrumb.cities") : t("slug.breadcrumb.services")}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-white/70">{h1}</li>
        </ol>
      </nav>

      {children}

      <section className="border-t border-white/5 py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.06))" }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold mb-4">
            {t("slug.cta2.title")}
          </h2>
          <p className="text-white/70 mb-8">
            {t("slug.cta2.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/#contact" className="px-6 py-3 rounded-full bg-[#C9A84C] text-white text-sm font-semibold hover:bg-[#b8953d] transition-colors">
              {t("slug.cta2.start")}
            </Link>
            <a href="https://wa.me/966542288828" className="px-6 py-3 rounded-full border border-white/20 text-white/80 text-sm font-semibold hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
              {t("slug.cta2.whatsapp")}
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/40">
          <div className="flex items-end gap-1">
            <Image
              src="/voxon-white-transparent%20logo.png"
              alt="Voxon Digital"
              width={3904}
              height={1406}
              sizes="100px"
              className="h-6 w-auto object-contain"
            />
            <span className="text-[7px] font-bold tracking-[0.22em] uppercase px-1.5 py-0.5 rounded-sm mb-0.5" style={{ color: "#fff", background: "#C9A84C" }}>
              digital
            </span>
          </div>
          <p>{t("slug.footer.copyright")}</p>
          <div className="flex gap-5">
            <Link href="/#contact" className="hover:text-white/70 transition-colors">{t("slug.nav.contact")}</Link>
            <Link href="/sitemap.xml" className="hover:text-white/70 transition-colors">Sitemap</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
