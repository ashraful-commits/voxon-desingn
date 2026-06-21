"use client";
import { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from "react";
import Image from "next/image";
import Script from "next/script";
import styled from "@emotion/styled";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { motion, useScroll, useTransform } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

// Text-scramble hook: reveals text character-by-character with a random char shuffle
function useTextScramble(finalText: string, startDelay = 300) {
  const [displayText, setDisplayText] = useState(finalText);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

  useEffect(() => {
    let frame = 0;
    let raf: number;
    const totalFrames = finalText.length * 4;

    const timeout = setTimeout(() => {
      const tick = () => {
        const progress = frame / totalFrames;
        const revealedCount = Math.floor(progress * finalText.length);
        const scrambled = finalText
          .split("")
          .map((ch, i) => {
            if (ch === " " || ch === "\n") return ch;
            if (i < revealedCount) return ch;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
        setDisplayText(scrambled);
        frame++;
        if (frame <= totalFrames) raf = requestAnimationFrame(tick);
        else setDisplayText(finalText);
      };
      raf = requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalText]);

  return displayText;
}

// Animated count-up hook — counts from 0 to value when in view
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}



// Mouse movement handler to support glowing cursor radial effects on cards
const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  card.style.setProperty("--mouse-x", `${x}px`);
  card.style.setProperty("--mouse-y", `${y}px`);
};

import {
  ArrowRight, Menu, X, Globe, Code2, TrendingUp,
  Palette, ShieldCheck, HeadphonesIcon, ChevronLeft,
  ChevronRight, Star, MapPin, Phone, Mail, ExternalLink,
  Play, Check, Zap, Users, Award, BarChart3, Sun, Moon, Leaf
} from "lucide-react";
import { translations, type Locale } from "@/lib/translations";

const LocaleCtx = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
} | null>(null);

function useLocale() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error("LocaleCtx missing");
  return ctx;
}

type Theme = "dark" | "light" | "green";

const LoadingCtx = createContext(true);
const ThemeCtx = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("ThemeCtx missing");
  return { ...ctx, isLight: ctx.theme === "light" };
}

const NAV_LINKS_EN = [
  { href: "#home" },
  { href: "#services" },
  { href: "#portfolio" },
  { href: "#process" },
  { href: "#testimonials" },
  { href: "#contact" },
];

const SERVICES = [
  { icon: <Globe size={22}/>, title: "Website Design", titleAr: "تصميم المواقع", ar: "service.website_design", desc: "Custom corporate sites, landing pages, and bilingual web experiences built to convert Saudi audiences.", descAr: "مواقع شركات مخصصة وصفحات هبوط وتجارب ويب ثنائية اللغة مصممة خصيصاً لتحويل الجمهور السعودي.", tags: ["Corporate","Landing Pages","Bilingual"], tagsAr: ["شركات", "صفحات هبوط", "ثنائي اللغة"] },
  { icon: <Code2 size={22}/>, title: "Web Development", titleAr: "تطوير الويب", ar: "service.web_dev", desc: "Next.js and modern stack development — fast, scalable, and SEO-ready from day one.", descAr: "تطوير باستخدام Next.js والمكتبات الحديثة — سريع وقابل للتوسع وجاهز لمحركات البحث من اليوم الأول.", tags: ["Next.js","MongoDB","API"], tagsAr: ["Next.js", "MongoDB", "API"] },
  { icon: <TrendingUp size={22}/>, title: "SEO & Growth", titleAr: "تحسين محركات البحث", ar: "service.seo", desc: "Arabic and English SEO, Google Ads, and analytics to keep your business visible and growing.", descAr: "تحسين محركات البحث بالعربية والإنجليزية، إعلانات Google، وتحليلات لإبقاء نشاطك التجاري مرئياً ومتنامياً.", tags: ["Arabic SEO","Google Ads","Analytics"], tagsAr: ["SEO عربي", "Google Ads", "تحليلات"] },
  { icon: <Palette size={22}/>, title: "Brand Identity", titleAr: "هوية العلامة التجارية", ar: "service.branding", desc: "Logo, visual identity, and brand guidelines designed with Saudi cultural aesthetics in mind.", descAr: "شعار، هوية بصرية، ودليل علامة تجارية مصممة وفقاً للجماليات الثقافية السعودية.", tags: ["Logo","Visual Identity","Guidelines"], tagsAr: ["شعار", "هوية بصرية", "إرشادات"] },
  { icon: <ShieldCheck size={22}/>, title: "E-Commerce", titleAr: "التجارة الإلكترونية", ar: "service.ecommerce", desc: "Full-featured online stores with Arabic payment gateways, inventory, and order management.", descAr: "متاجر إلكترونية متكاملة مع بوابات دفع عربية وإدارة المخزون والطلبات.", tags: ["Online Store","Payments","Inventory"], tagsAr: ["متجر إلكتروني", "مدفوعات", "مخزون"] },
  { icon: <HeadphonesIcon size={22}/>, title: "Ongoing Support", titleAr: "دعم مستمر", ar: "service.support", desc: "Dedicated 24/7 maintenance, speed optimization, and technical support whenever you need it.", descAr: "صيانة مخصصة على مدار الساعة، تحسين سرعة، ودعم فني عندما تحتاجه.", tags: ["24/7","Maintenance","Speed"], tagsAr: ["24/7", "صيانة", "سرعة"] },
];

const STATS_DATA = [
  { value: "300+", label: "stats.clients", sub: "stats.clients_sub" },
  { value: "98%", label: "stats.satisfaction", sub: "stats.satisfaction_sub" },
  { value: "5yr", label: "stats.market", sub: "stats.market_sub" },
  { value: "48h", label: "stats.response", sub: "stats.response_sub" },
];

const PORTFOLIO = [
  { name: "Al Bina Construction", cat: "Corporate Website", image: "/images/portfolio-construction.png" },
  { name: "Thouq Restaurant", cat: "Restaurant & Booking", image: "/images/portfolio-restaurant.png" },
  { name: "Al Salam Clinics", cat: "Medical & Health", image: "/images/portfolio-medical.png" },
  { name: "Al Aqariyah", cat: "Real Estate", image: "/images/portfolio-realestate.png" },
  { name: "NurLight Academy", cat: "Education Platform", image: "/images/portfolio-academy.png" },
  { name: "Barakat Pharma", cat: "Pharmaceutical", image: "/images/portfolio-medical.png" },
  { name: "AutoWorld Motors", cat: "Automotive", image: "/images/portfolio-automotive.png" },
  { name: "Gulf National Bank", cat: "Banking & Finance", image: "/images/portfolio-bank.png" },
  { name: "Al Noor Clinic", cat: "Healthcare", image: "/images/portfolio-clinic.png" },
  { name: "Qahwa Cafe", cat: "Coffee Shop", image: "/images/portfolio-coffe.png" },
  { name: "Dar Al-Khibra", cat: "Consulting", image: "/images/portfolio-consulting.png" },
  { name: "Saudi Drive", cat: "Transport & Logistics", image: "/images/portfolio-drive.png" },
  { name: "Najd E-Commerce", cat: "E-Commerce", image: "/images/portfolio-ecommerce.png" },
  { name: "Al Manar Academy", cat: "Education Portal", image: "/images/portfolio-education.png" },
  { name: "Riyadh Events", cat: "Event Management", image: "/images/portfolio-events.png" },
  { name: "GreenFields Farm", cat: "Agriculture", image: "/images/portfolio-farm.png" },
  { name: "Mirage Fashion", cat: "Fashion & Retail", image: "/images/portfolio-fashion.png" },
  { name: "PaySaudi Fintech", cat: "Financial Tech", image: "/images/portfolio-fintech.png" },
  { name: "FitZone KSA", cat: "Fitness Center", image: "/images/portfolio-fitness.png" },
  { name: "Elite Fitness", cat: "Premium Fitness", image: "/images/portfolio-fitness2.png" },
  { name: "Arabian Hospitality", cat: "Hotel & Resort", image: "/images/portfolio-hotel.png" },
  { name: "Al Durrat Resort", cat: "Luxury Hotel", image: "/images/portfolio-hotel2.png" },
  { name: "Saudi Industries", cat: "Industrial", image: "/images/portfolio-industrial.png" },
  { name: "Al Adl Legal", cat: "Legal Services", image: "/images/portfolio-legal.png" },
  { name: "Haqouq Law", cat: "Law Firm", image: "/images/portfolio-legal2.png" },
  { name: "ShipFast Logistics", cat: "Logistics", image: "/images/portfolio-logistics.png" },
  { name: "Saudi Petroleum", cat: "Oil & Gas", image: "/images/portfolio-petroleu.png" },
  { name: "TechVanguard", cat: "Technology", image: "/images/portfolio-tech.png" },
  { name: "Salam Telecom", cat: "Telecommunications", image: "/images/portfolio-telecom.png" },
  { name: "Wanderlust Travel", cat: "Travel Agency", image: "/images/portfolio-travel.png" },
  { name: "Al Safar Tourism", cat: "Travel & Tourism", image: "/images/portfolio-travel2.png" },
];


const PROCESS = [
  { step: "01", title: "Discovery", titleAr: "اكتشاف", desc: "We learn your business goals, audience, and what makes your Saudi brand unique.", descAr: "نتعرف على أهداف نشاطك التجاري وجمهورك وما يميز علامتك التجارية السعودية." },
  { step: "02", title: "Strategy", titleAr: "استراتيجية", desc: "A focused roadmap covering structure, content hierarchy, and conversion goals.", descAr: "خريطة طريق مركزة تغطي الهيكل والتسلسل الهرمي للمحتوى وأهداف التحويل." },
  { step: "03", title: "Design", titleAr: "تصميم", desc: "Modern, culturally-aware layouts crafted in Arabic and English simultaneously.", descAr: "تصاميم عصرية ومراعية للثقافة تم تصميمها بالعربية والإنجليزية في وقت واحد." },
  { step: "04", title: "Build", titleAr: "بناء", desc: "Clean Next.js code, MongoDB backend, and Cloudinary for blazing-fast media.", descAr: "كود Next.js نظيف، خلفية MongoDB، و Cloudinary لوسائط فائقة السرعة." },
  { step: "05", title: "Launch", titleAr: "إطلاق", desc: "Full QA, performance testing, SEO setup, and a smooth handover to your team.", descAr: "اختبار جودة شامل، اختبار أداء، إعداد SEO، وتسليم سلس لفريقك." },
];

const TESTIMONIALS = [
  { name: "Ahmed Al-Qahtani", role: "CEO, Al Bina Construction", text: "Voxon delivered a website that instantly elevated our brand. They understood the Saudi market deeply — the bilingual execution was flawless and the results were immediate.", rating: 5 },
  { name: "Noor Al-Harbi", role: "Marketing Manager, Thouq Restaurant", text: "From first call to launch in three weeks. The design is stunning and our online reservations tripled. A team that actually delivers what they promise.", rating: 5 },
  { name: "Dr. Sarah Khalid", role: "Owner, Al Salam Clinics", text: "Our patient inquiries increased by 80% after the new site went live. The team was professional, responsive, and genuinely cared about our growth.", rating: 5 },
];

const WHY_CHOOSE_DATA = [
  { icon: <Globe size={18}/>, titleKey: "why.arabic_first", descKey: "why.arabic_first_desc" },
  { icon: <Users size={18}/>, titleKey: "why.saudi_team", descKey: "why.saudi_team_desc" },
  { icon: <Zap size={18}/>, titleKey: "why.fast_delivery", descKey: "why.fast_delivery_desc" },
  { icon: <Award size={18}/>, titleKey: "why.award_quality", descKey: "why.award_quality_desc" },
  { icon: <ShieldCheck size={18}/>, titleKey: "why.secure_scalable", descKey: "why.secure_scalable_desc" },
  { icon: <BarChart3 size={18}/>, titleKey: "why.roi_focused", descKey: "why.roi_focused_desc" },
];

const HeroOrb = styled.div`
  position: absolute;
  border-radius: 9999px;
  filter: blur(80px);
  opacity: 0.35;
`;

const GlassPanel = styled.div`
  background: linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 18px 40px rgba(8, 15, 30, 0.35);
  backdrop-filter: blur(18px);
  border-radius: 24px;
`;

const ThreeDCard = styled.div`
  transform-style: preserve-3d;
  transform: rotateX(10deg) rotateY(-12deg);
  transition: transform 0.35s ease;
  &:hover { transform: rotateX(0deg) rotateY(0deg) scale(1.02); }
`;

const QUICK_BADGES = [
  { icon: <MapPin size={14}/>, labelKey: "hero.badge_team" },
  { icon: <Zap size={14}/>, labelKey: "hero.badge_delivery" },
  { icon: <Globe size={14}/>, labelKey: "hero.badge_bilingual" },
  { icon: <ShieldCheck size={14}/>, labelKey: "hero.badge_support" },
  { icon: <Award size={14}/>, labelKey: "hero.badge_vision" },
];

const MARQUEE_ITEMS = [
  { icon: <Zap size={14}/>, text: "Bilingual Arabic & English" },
  { icon: <ShieldCheck size={14}/>, text: "99.9% Uptime SLA" },
  { icon: <Award size={14}/>, text: "300+ Projects Delivered" },
  { icon: <Globe size={14}/>, text: "Digital Growth Partners" },
  { icon: <TrendingUp size={14}/>, text: "Top-Ranked SEO" },
  { icon: <Users size={14}/>, text: "Dedicated Expert Team" },
  { icon: <MapPin size={14}/>, text: "Based in Riyadh" },
  { icon: <Code2 size={14}/>, text: "Next.js & Modern Stack" },
];

const CONTACT_INFO = [
  { icon: <MapPin size={16}/>, labelKey: "contact.location_label", valueKey: "contact.location" },
  { icon: <Phone size={16}/>, labelKey: "contact.phone_label", valueKey: "contact.phone" },
  { icon: <Mail size={16}/>, labelKey: "contact.email_label", valueKey: "contact.email" },
];

const INCLUSION_LIST = [
  "contact.included_1",
  "contact.included_2",
  "contact.included_3",
  "contact.included_4",
];

function Navbar() {
  const { locale, setLocale, t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [animOpen, setAnimOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) setAnimOpen(true);
    else {
      const t = setTimeout(() => setAnimOpen(false), 300);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      // Track active section
      const sections = ["home","services","portfolio","process","testimonials","contact"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLang = () => setLocale(locale === "en" ? "ar" : "en");
  const isAr = locale === "ar";
  const isLight = theme === "light";
  const isGreen = theme === "green";

  const navBg = scrolled
    ? (isLight ? "rgba(248,246,240,0.92)" : "rgba(7,9,15,0.92)")
    : (isLight ? "rgba(248,246,240,0.6)" : "transparent");
  const navBorder = scrolled
    ? (isLight ? "1px solid rgba(10,14,26,0.06)" : "1px solid rgba(255,255,255,0.05)")
    : "1px solid transparent";
  const navShadow = scrolled
    ? (isLight ? "0 8px 32px rgba(10,14,26,0.06)" : "0 8px 40px rgba(0,0,0,0.3)")
    : "none";
  const navBlur = scrolled ? (isLight ? "blur(20px)" : "blur(24px) saturate(180%)") : "none";
  const accentColor = isLight ? "#1A6B3C" : isGreen ? "#34A853" : "#E8C96A";
  const activeColor = accentColor;
  const navTextBase = isLight ? "rgba(10,14,26,0.5)" : "rgba(255,255,255,0.4)";
  const navTextHover = isLight ? "rgba(10,14,26,0.85)" : "rgba(255,255,255,0.85)";
  const pillBorder = isLight ? "1px solid rgba(10,14,26,0.12)" : "1px solid rgba(255,255,255,0.1)";
  const pillTextBase = isLight ? "rgba(10,14,26,0.45)" : "rgba(255,255,255,0.35)";
  const pillTextHover = isLight ? "#1A6B3C" : isGreen ? "#34A853" : "#C9A84C";
  const pillBorderHover = isLight ? "rgba(26,107,60,0.35)" : isGreen ? "rgba(52,168,83,0.4)" : "rgba(201,168,76,0.4)";

  return (
    <nav ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center transition-all duration-700"
      style={{
        background: navBg,
        backdropFilter: navBlur,
        borderBottom: navBorder,
        boxShadow: navShadow,
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between w-full" dir={isAr ? "rtl" : "ltr"}>
        {/* Logo mark */}
        <a href="#home" className="flex items-center gap-3 group">
          <img
            src={isGreen ? "/voxon-green-transparent%20logo.png" : isLight ? "/voxon-dark-transparent%20logo.png" : "/voxon-white-transparent%20logo.png"}
            alt="Voxon"
            className="h-8 w-auto object-contain"
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
          {NAV_LINKS_EN.map((l) => {
            const id = l.href.slice(1);
            const isActive = activeSection === id;
            return (
              <a key={l.href} href={l.href}
                className="relative px-4 py-2 text-[11px] font-semibold tracking-[0.12em] uppercase transition-colors font-outfit"
                style={{ color: isActive ? activeColor : navTextBase }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = navTextHover; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = navTextBase; }}
              >
                {t(`nav.${id}`)}
                {isActive && <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C9A84C]"/>}
              </a>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-3" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
          <button onClick={toggleTheme}
            className="text-[11px] font-semibold tracking-[0.1em] uppercase cursor-pointer transition-all font-outfit px-3 py-1.5 rounded-full border"
            style={{ color: pillTextBase, borderColor: pillBorder }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.color = accentColor; el.style.borderColor = pillBorderHover; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.color = pillTextBase; el.style.borderColor = pillBorder; }}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={14} className="icon-spin-hover"/> : theme === "green" ? <Leaf size={14} className="icon-spin-hover"/> : <Moon size={14} className="icon-spin-hover"/>}
          </button>
          <button onClick={toggleLang}
            className="text-[11px] font-semibold tracking-[0.1em] uppercase cursor-pointer transition-all font-outfit px-3 py-1.5 rounded-full border"
            style={{ color: pillTextBase, borderColor: pillBorder }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.color = pillTextHover; el.style.borderColor = pillBorderHover; }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.color = pillTextBase; el.style.borderColor = pillBorder; }}
            aria-label="Toggle language"
          >
            <span className="font-arabic">{t("nav.lang_toggle")}</span>
          </button>
          <a href="#contact" className="btn-gold px-5 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 font-outfit tracking-wide">
            {t("nav.free_consultation")}
            <span className="btn-icon"><ArrowRight size={13} style={{ transform: isAr ? "rotate(180deg)" : "none" }}/></span>
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className={`lg:hidden transition-colors p-1 ${isLight ? "text-[#0A0E1A]/60 hover:text-[#0A0E1A]" : "text-white/60 hover:text-white"}`}>
          {open ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {/* Mobile menu */}
      {animOpen && (
        <div className={`lg:hidden absolute top-full left-0 right-0 border-t px-6 py-8 space-y-1 z-50 transition-all duration-300 ${open ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          style={{ background: isLight ? "rgba(248,246,240,0.98)" : "rgba(7,9,15,0.98)", backdropFilter: "blur(24px)", borderColor: isLight ? "rgba(10,14,26,0.06)" : "rgba(255,255,255,0.05)" }}
          dir={isAr ? "rtl" : "ltr"}>
          {NAV_LINKS_EN.map((l, i) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 py-3 text-sm font-outfit tracking-wide border-b last:border-0 transition-all duration-300 ${open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
              style={{ transitionDelay: open ? `${100 + i * 60}ms` : "0ms", color: isLight ? "rgba(10,14,26,0.6)" : "rgba(255,255,255,0.6)" }}>
              <span className={`w-1 h-1 rounded-full bg-[#C9A84C] opacity-50`}/>
              {t(`nav.${l.href.slice(1)}`)}
            </a>
          ))}
          <div className="flex items-center gap-3 pt-4">
            <button onClick={toggleTheme}
              className="text-xs font-medium cursor-pointer transition-colors px-3 py-1.5 border rounded-full font-outfit"
              style={{ color: pillTextBase, borderColor: pillBorder }}
            >
              {theme === "dark" ? <Sun size={14} className="icon-spin-hover"/> : theme === "green" ? <Leaf size={14} className="icon-spin-hover"/> : <Moon size={14} className="icon-spin-hover"/>}
            </button>
            <button onClick={toggleLang}
              className="text-xs font-medium cursor-pointer transition-colors px-3 py-1.5 border rounded-full font-outfit font-arabic"
              style={{ color: pillTextBase, borderColor: pillBorder }}
            >
              {t("nav.lang_toggle")}
            </button>
            <a href="#contact" className="btn-gold px-5 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 font-outfit">
              {t("nav.free_consultation")} <ArrowRight size={13}/>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}


function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const particleCount = 60;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
      });
    }

    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(201, 168, 76, 0.25)";
        ctx.fill();
      });

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(201, 168, 76, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw mouse connections
      if (mouse.x > -1000) {
        particles.forEach((p) => {
          const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(26, 107, 60, ${0.15 * (1 - dist / 180)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        });
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}

function rng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function SectionDesert({ speed = 1, heavy = false, variant = 0 }: { speed?: number; heavy?: boolean; variant?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { locale } = useLocale();
  const { theme } = useTheme();
  const isAr = locale === "ar";
  const isLight = theme === "light";
  const isGreen = theme === "green";
  const desertColor = (op: number) => isLight ? `rgba(201,168,76,${op * 0.5})` : isGreen ? `rgba(26,107,60,${op * 0.9})` : `rgba(201,168,76,${op})`;

  function initCfg() {
    const rand = rng(variant + 1);
    const cCount = heavy ? (3 + Math.floor(rand() * 3)) : (1 + Math.floor(rand() * 2));
    const pCount = heavy ? (8 + Math.floor(rand() * 12)) : (4 + Math.floor(rand() * 6));
    return {
      duneLayers: Array.from({ length: 3 }, () => ({
        yOff: -(40 + rand() * 60),
        amp: 15 + rand() * 45,
        freq: 0.002 + rand() * 0.008,
        op: 0.08 + rand() * 0.2,
        amp2: 0.15 + rand() * 0.35,
        freq2: 0.005 + rand() * 0.02,
      })),
      camels: Array.from({ length: cCount }, (_, i) => ({
        x: 0.1 + rand() * 0.8,
        spd: 0.08 + rand() * 0.25,
        scale: 0.12 + rand() * 0.13,
        bobPhase: Math.PI * 2 * (i / cCount) + rand() * 0.5,
      })),
      particles: Array.from({ length: pCount }, () => ({
        size: 1 + rand() * 2.5,
        spd: 0.1 + rand() * 0.6,
        op: 0.02 + rand() * 0.12,
      })),
    };
  }
  const cfgRef = useRef(initCfg());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = canvas.width = 1;
    let height = canvas.height = 1;
    let scrollOffset = 0;
    let visible = false;
    const camelImg = document.createElement("img");
    camelImg.src = "/images/ksa-camel.svg";

    const camels = cfgRef.current!.camels.map((c) => ({ ...c }));
    const particles = cfgRef.current!.particles.map((p) => ({ ...p, x: Math.random() * width, y: height - 20 - Math.random() * 50 }));

    const obs = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && animId) { cancelAnimationFrame(animId); animId = 0; }
      else if (visible && !animId) animId = requestAnimationFrame(draw);
    }, { threshold: 0.1 });
    if (containerRef.current) obs.observe(containerRef.current);

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const drawDunes = () => {
      cfgRef.current!.duneLayers.forEach((l) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 3) {
          const y = height + l.yOff
            + Math.sin((x + scrollOffset) * l.freq) * l.amp
            + Math.sin((x + scrollOffset) * l.freq2) * l.amp * l.amp2;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = desertColor(l.op);
        ctx.fill();
      });
    };

    const drawCamels = () => {
      camels.forEach((c) => {
        if (!camelImg.complete || camelImg.naturalWidth === 0) return;
        const bob = Math.sin(c.bobPhase) * 2;
        const y = height - 140 * c.scale + bob;
        ctx.save();
        ctx.translate(c.x, y);
        const s = c.scale;
        if (isAr) { ctx.scale(-s, s); } else { ctx.scale(s, s); }
        ctx.drawImage(camelImg, -200, -250, 400, 500);
        ctx.restore();
      });
    };

    const drawParticles = () => {
      particles.forEach((p) => {
        p.x -= p.spd * (isAr ? -1 : 1);
        if (isAr) { if (p.x > width + 5) p.x = -5; }
        else { if (p.x < -5) p.x = width + 5; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = desertColor(p.op);
        ctx.fill();
      });
    };

    const draw = () => {
      if (!visible) { animId = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, width, height);
      scrollOffset += (isAr ? 0.5 : -0.5) * speed;
      drawDunes();
      drawParticles();
      drawCamels();
      camels.forEach((c) => {
        if (isAr) { c.x -= c.spd; if (c.x < -300) c.x = width + 200; }
        else { c.x += c.spd; if (c.x > width + 300) c.x = -200; }
        c.bobPhase += 0.02;
      });
      animId = requestAnimationFrame(draw);
    };

    if (visible) animId = requestAnimationFrame(draw);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      obs.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [locale, theme, isAr, isLight, speed, heavy]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 left-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.55 }}
      />
    </div>
  );
}

function HeroSection() {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const heroRef = useRef<HTMLElement | null>(null);
  const isAr = locale === "ar";
  const isLight = theme === "light";
  const isGreen = theme === "green";
  const [slideIdx, setSlideIdx] = useState(0);
  const touchX = useRef(0);
  const slides = useMemo(() => PORTFOLIO.slice(0, 8), []);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const rawDiff = touchX.current - e.changedTouches[0].clientX;
    const diff = isAr ? -rawDiff : rawDiff;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setSlideIdx(i => Math.min(i + 1, slides.length - 1));
      else setSlideIdx(i => Math.max(i - 1, 0));
    }
  }, [slides.length, isAr]);

  const handleRipple = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "btn-ripple";
    ripple.style.left = `${e.clientX - rect.left - 3}px`;
    ripple.style.top  = `${e.clientY - rect.top  - 3}px`;
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  };

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-line",
        { y: 20 },
        { y: 0, duration: 0.25, stagger: { each: 0.05, from: "start" }, ease: "power2.out" }
      );
      gsap.fromTo(".hero-fade",
        { y: 15 },
        { y: 0, duration: 0.2, stagger: { each: 0.04, from: "random" }, ease: "power2.out" }
      );
      gsap.to(".hero-geo-star", {
        rotation: "random(10, 30)",
        scale: "random(1.05, 1.15)",
        opacity: "random(0.03, 0.08)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.3, from: "random" }
      });
      gsap.to(".hero-geo-pattern", {
        backgroundPosition: "50% 60%",
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        }
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative flex flex-col overflow-hidden"
      style={{
        minHeight: "100svh",
        background: isLight
          ? "linear-gradient(160deg, #F8F6F0 0%, #EDE9E0 50%, #F8F6F0 100%)"
          : "linear-gradient(160deg, #07090F 0%, #0D1117 50%, #07090F 100%)",
        paddingTop: "var(--nav-height, 72px)",
      }}
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* ── Layer 1: Geometric Saudi Pattern ── */}
      <div className="hero-geo-pattern" />

      {/* ── Layer 2: Geometric star accents ── */}
      <div className="hero-geo-star absolute" style={{ top: "10%", left: "5%", animation: "geoFloat 25s ease-in-out infinite" }} />
      <div className="hero-geo-star absolute" style={{ bottom: "15%", right: "8%", width: "80px", height: "80px", animation: "geoFloat 30s ease-in-out infinite reverse", opacity: 0.05 }} />
      <div className="hero-geo-star absolute" style={{ top: "45%", right: "35%", width: "60px", height: "60px", animation: "geoFloat 20s ease-in-out infinite 5s", opacity: 0.04 }} />

      {/* ── KSA Sun / Moon ── */}
      {isLight ? (
        <div className="absolute pointer-events-none z-[2]" style={{ top: "3%", right: "8%", width: "100px", height: "100px", opacity: 0.15 }}>
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" style={{ animation: "spin 30s linear infinite" }}>
            <circle cx="50" cy="50" r="18" fill="#C9A84C" />
            {[0,1,2,3,4,5,6,7,8,9,10,11].map((i) => (
              <rect key={i} x="47" y="4" width="6" height="20" rx="3" fill="#C9A84C"
                transform={`rotate(${i * 30} 50 50)`} />
            ))}
            <circle cx="50" cy="50" r="8" fill="#E8C96A" />
          </svg>
        </div>
      ) : (
        <div className="absolute pointer-events-none z-[2]" style={{ top: "3%", right: "8%", width: "80px", height: "80px", opacity: 0.2 }}>
          <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
            <path d="M55 10C42 10 30 22 30 40s12 30 25 30C48 68 42 55 42 40s6-28 13-30z" fill="#C9A84C" />
            <path d="M56 28l2 6 6-2-4 5 5 4-6 1 1 6-4-4-4 4 1-6-6-1 5-4-4-5 6 2 2-6z" fill="#C9A84C" />
          </svg>
        </div>
      )}

      {/* ── Per-section desert background ── */}
      <SectionDesert speed={0.8} heavy variant={1} />
      <div className="ksa-dunes-top" style={{ opacity: 0.25, height: "140px" }} />
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.08) 0%, transparent 100%)" }} />

      {/* ── Top accent stripe ── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-20"
        style={{ background: "linear-gradient(90deg, #C9A84C 0%, rgba(201,168,76,0.2) 50%, #C9A84C 100%)", opacity: 0.4 }} />

      {/* ── Subtle accent line ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        <div className="absolute left-0 right-0 h-px" style={{ top: "55%", background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.08) 30%, rgba(201,168,76,0.08) 70%, transparent 100%)" }} />
      </div>

      {/* ── Arabic calligraphy watermark ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-[1]">
        <p className="text-[22vw] leading-none font-arabic text-white opacity-[0.025] whitespace-nowrap">
          {t("hero.deco_1")}
        </p>
      </div>

      {/* ── Particle canvas ── */}
      <ParticleCanvas />

      {/* ── Main content ── */}
      <div className="flex-1 w-full relative z-10 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-16 lg:py-20">

          {/* Tag */}
          <div className="hero-fade flex items-center gap-3 mb-6" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
            <span className="block w-8 h-px bg-[#C9A84C]"/>
            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#C9A84C] font-outfit">
              {t("hero.tag")}
            </span>
            <span className="block w-8 h-px bg-[#C9A84C] opacity-40"/>
          </div>

          {/* Full-width heading */}
          <h1 className="font-outfit font-extrabold tracking-tight leading-[1.1] mb-8 lg:mb-10"
            style={{ fontSize: "clamp(2.2rem, 4.8vw, 5rem)" }}>
            {isAr ? (
              <>
                <span className="hero-line block" style={{ color: isLight ? "#0A0E1A" : "#fff" }}>{t("hero.heading_1")}</span>
                <span className="hero-line block text-gradient-gold italic">{t("hero.heading_accent")}</span>
              </>
            ) : (
              <>
                <span className="hero-line block" style={{ color: isLight ? "#0A0E1A" : "#fff" }}>{t("hero.heading_1")}</span>
                <span className="hero-line block" style={{ color: isLight ? "#0A0E1A" : "#fff" }}>{t("hero.heading_2")}</span>
                <span className="hero-line block text-gradient-gold italic" style={{ fontSize: "0.85em" }}>{t("hero.heading_accent")}</span>
              </>
            )}
          </h1>

          {/* Two-column grid */}
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_minmax(320px,480px)] gap-10 xl:gap-16 mb-8 lg:mb-10">

            {/* LEFT TOP — Subtitle + tagline (before carousel on mobile) */}
            <div className="lg:col-start-1 lg:row-start-1">
              <p className={`hero-fade text-base lg:text-lg leading-relaxed mb-5 max-w-xl ${isAr ? "font-arabic" : "font-outfit"}`}
                style={{ color: isLight ? "rgba(10,14,26,0.55)" : "rgba(255,255,255,0.5)" }}>
                {t("hero.subtitle")}
              </p>

              {/* Theme divider */}
              <div key={isGreen ? "green-line" : "gold-line"} className="hero-fade w-px h-12 rounded-full mb-5" style={{ background: isGreen ? "linear-gradient(180deg, #1A6B3C 0%, rgba(26,107,60,0.08) 100%)" : "linear-gradient(180deg, #C9A84C 0%, rgba(201,168,76,0.06) 100%)" }} />

              {/* Arabic tagline */}
              <p className={`hero-fade font-bold mb-6 text-[#C9A84C]/60 ${isAr ? "font-arabic text-base" : "font-outfit tracking-widest uppercase text-[10px]"}`}
                style={{ direction: "rtl" }}>
                {t("hero.arabic_tagline")}
              </p>
            </div>

            {/* CAROUSEL — right column on desktop, above CTAs on mobile */}
            <div className="lg:col-start-2 lg:row-span-2 self-start mb-6 lg:mb-0 lg:px-4 xl:px-8">
              <div className="relative w-full h-[300px] sm:h-[320px] md:h-[360px] lg:h-[420px]">
                <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden"
                  style={{ background: "radial-gradient(circle at 50% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)", filter: "blur(30px)" }} />
                <div className="absolute -inset-3 rounded-2xl pointer-events-none opacity-25" style={{
                  border: "1px solid rgba(201,168,76,0.2)",
                  maskImage: "linear-gradient(to bottom, rgba(201,168,76,0.4) 0%, transparent 35%, transparent 65%, rgba(201,168,76,0.4) 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(201,168,76,0.4) 0%, transparent 35%, transparent 65%, rgba(201,168,76,0.4) 100%)",
                }} />
                {["-top-1 -left-1 w-4 h-px","-top-1 -left-1 w-px h-4","-top-1 -right-1 w-4 h-px","-top-1 -right-1 w-px h-4","-bottom-1 -left-1 w-4 h-px","-bottom-1 -left-1 w-px h-4","-bottom-1 -right-1 w-4 h-px","-bottom-1 -right-1 w-px h-4"].map((pos) => (
                  <div key={pos} className={`absolute ${pos} bg-[#C9A84C]/40 pointer-events-none`} />
                ))}
                {isDesktop ? (
                  <Swiper
                    dir="ltr"
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 3500, disableOnInteraction: true }}
                    modules={[Pagination, EffectCards, Autoplay]}
                    className="w-full h-full rounded-xl"
                    effect="cards"
                    grabCursor
                    cardsEffect={{ perSlideOffset: 4, perSlideRotate: 2, slideShadows: false }}
                  >
                    {slides.map((item) => (
                      <SwiperSlide key={item.name} className="rounded-xl overflow-hidden">
                        <div className="w-full h-full relative overflow-hidden" style={{ background: isLight ? "#EDE9E0" : "#111827" }}>
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          <div className="card-overlay" />
                          <div className="card-content">
                            <div className={`text-[10px] font-semibold tracking-wider uppercase mb-1.5 ${isAr ? "font-arabic" : ""}`}
                              style={{ color: "rgba(201,168,76,0.8)" }}>
                              {item.cat}
                            </div>
                            <div className={`text-white font-bold text-lg ${isAr ? "font-arabic-display" : "font-outfit"}`}>
                              {item.name}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] text-white/50 tracking-wide uppercase font-outfit">{t("hero.view_work")}</span>
                              <ArrowRight size={12} className="text-[#C9A84C]" style={{ transform: isAr ? "rotate(180deg)" : "none" }} />
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div className="relative w-full h-full overflow-hidden rounded-xl select-none"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}>
                    <div className="flex h-full transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
                      style={{ transform: isAr ? `translateX(${slideIdx * 100}%)` : `translateX(-${slideIdx * 100}%)` }}>
                      {slides.map((item) => (
                        <div key={item.name} className="min-w-full h-full shrink-0 overflow-hidden">
                          <div className="w-full h-full relative overflow-hidden" style={{ background: isLight ? "#EDE9E0" : "#111827" }}>
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            <div className="card-overlay" />
                            <div className="card-content">
                              <div className={`text-[10px] font-semibold tracking-wider uppercase mb-1.5 ${isAr ? "font-arabic" : ""}`}
                                style={{ color: "rgba(201,168,76,0.8)" }}>
                                {item.cat}
                              </div>
                              <div className={`text-white font-bold text-lg ${isAr ? "font-arabic-display" : "font-outfit"}`}>
                                {item.name}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] text-white/50 tracking-wide uppercase font-outfit">{t("hero.view_work")}</span>
                                <ArrowRight size={12} className="text-[#C9A84C]" style={{ transform: isAr ? "rotate(180deg)" : "none" }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                      {slides.map((_, i) => (
                        <button key={i} onClick={() => setSlideIdx(i)}
                          className={`rounded-full transition-all ${i === slideIdx ? 'bg-[#C9A84C] w-2.5 h-2.5' : 'bg-white/30 w-1.5 h-1.5'}`} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="absolute -bottom-2 right-0 px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-semibold text-white/70 font-outfit glow-card"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.12)", backdropFilter: "blur(16px)", zIndex: 20 }}>
                  <div className="relative w-1.5 h-1.5 flex-shrink-0">
                    <span className="pulse-ring"/>
                    <span className="relative w-1.5 h-1.5 bg-[#E8C96A] rounded-full block"/>
                  </div>
                  <span className={isAr ? "font-arabic" : ""}>{t("hero.trusted")}</span>
                </div>
              </div>
            </div>

            {/* LEFT BOTTOM — CTAs + Stats (below carousel on mobile) */}
            <div className="lg:col-start-1 lg:row-start-2">
              <div className="hero-fade flex flex-wrap gap-3 mb-6" style={{ justifyContent: isAr ? "flex-end" : "flex-start" }}>
                <a href="#contact" onClick={handleRipple}
                  className="btn-gold px-6 py-3 rounded-sm text-xs font-bold inline-flex items-center gap-2 overflow-hidden relative">
                  {t("hero.cta")}
                  <span className="btn-icon"><ArrowRight size={13} style={{ transform: isAr ? "rotate(180deg)" : "none" }}/></span>
                </a>
                <a href="#portfolio"
                  className="btn-outline px-6 py-3 rounded-sm text-xs font-semibold inline-flex items-center gap-2 overflow-hidden">
                  <Play size={10}/>
                  {t("hero.view_work")}
                </a>
              </div>

              <div className="hero-fade flex flex-wrap gap-x-6 gap-y-1" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                {STATS_DATA.map((s) => (
                  <div key={s.label} className="flex items-baseline gap-1">
                    <span className="text-sm font-extrabold font-outfit text-gradient-gold">{s.value}</span>
                    <span className={`text-[9px] ${isLight ? "text-[rgba(10,14,26,0.35)]" : "text-white/25"} font-medium ${isAr ? "font-arabic" : ""}`}>
                      {t(s.label)}
                    </span>
                  </div>
            ))}
          </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Bottom decoration: dunes ── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to top, rgba(201,168,76,0.08) 0%, transparent 100%)" }} />
      <div className="ksa-dunes-bottom" style={{ opacity: 0.25, height: "140px" }} />

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className={`text-[9px] tracking-[0.2em] uppercase text-white/20 font-outfit ${isAr ? "font-arabic" : ""}`}>{t("hero.scroll")}</span>
        <div className="relative w-px h-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"/>
          <div className="scroll-indicator-line absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#C9A84C] to-transparent"/>
        </div>
      </div>
    </section>
  );
}

function GoToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(pct);
      setVisible(scrollTop > window.innerHeight * 0.5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // SVG circle math
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={handleClick}
      aria-label="Back to top"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(16px) scale(0.85)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.4s cubic-bezier(0.34,1.56,0.64,1), transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      className="fixed bottom-24 right-6 z-50 w-12 h-12 flex items-center justify-center group"
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 48 48"
        fill="none"
      >
        {/* Track */}
        <circle cx="24" cy="24" r={radius} stroke="rgba(201,168,76,0.15)" strokeWidth="2"/>
        {/* Progress */}
        <circle
          cx="24" cy="24" r={radius}
          stroke="url(#topGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.2s ease" }}
        />
        <defs>
          <linearGradient id="topGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C9A84C"/>
            <stop offset="100%" stopColor="#E8C96A"/>
          </linearGradient>
        </defs>
      </svg>
      {/* Inner button */}
      <div
        className="relative w-9 h-9 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #C9A84C, #E8C96A)",
          boxShadow: "0 4px 16px rgba(201,168,76,0.4)",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
        }}
      >
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="#0A0E1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: "transform 0.3s ease", transform: "translateY(0)" }}
          className="group-hover:-translate-y-0.5"
        >
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </div>
    </button>
  );
}

function SectionIndicator() {
  const { locale } = useLocale();
  const { theme } = useTheme();
  const isAr = locale === "ar";
  const isLight = theme === "light";
  const isGreen = theme === "green";
  const [active, setActive] = useState(0);

  const sections = ["home", "why-choose", "services", "portfolio", "process", "testimonials", "cta", "contact"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = sections.indexOf(entry.target.id);
            if (idx >= 0) setActive(idx);
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const accent = isLight ? "#1A6B3C" : isGreen ? "#34A853" : "#C9A84C";
  const inactiveColor = isLight ? "rgba(10,14,26,0.2)" : "rgba(255,255,255,0.15)";
  const lineInactive = isLight ? "rgba(10,14,26,0.08)" : "rgba(255,255,255,0.06)";
  const side = isAr ? "left" : "right";

  return (
    <div
      className="fixed z-40 hidden lg:flex flex-col items-center pointer-events-none"
      style={{
        [side]: "20px",
        top: "50%",
        transform: "translateY(-50%)",
        gap: "0",
      }}
    >
      {/* Main vertical dashed line track */}
      <div
        className="absolute top-0 bottom-0"
        style={{
          [isAr ? "right" : "left"]: "36px",
          width: "1px",
          background: `repeating-linear-gradient(to bottom, ${lineInactive} 0px, ${lineInactive} 4px, transparent 4px, transparent 8px)`,
        }}
      />

      {sections.map((_, i) => {
        const isActive = active === i;
        return (
          <div
            key={i}
            className="flex items-center cursor-pointer pointer-events-auto"
            onClick={() => {
              const el = document.getElementById(sections[i]);
              if (el) {
                try { ScrollSmoother.get()?.scrollTo(`#${sections[i]}`); } catch { el.scrollIntoView({ behavior: "smooth" }); }
              }
            }}
            style={{
              direction: "ltr",
              height: "36px",
              position: "relative",
            }}
          >
            {/* Number */}
            <span
              style={{
                fontSize: isActive ? "13px" : "10px",
                fontFamily: "var(--font-outfit)",
                fontWeight: 600,
                color: isActive ? accent : inactiveColor,
                transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                letterSpacing: "0.05em",
                minWidth: "26px",
                textAlign: "right",
                marginRight: "12px",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Vertical dash */}
            <div
              style={{
                width: "2px",
                height: isActive ? "28px" : "8px",
                borderRadius: "3px",
                background: isActive ? accent : lineInactive,
                transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                opacity: isActive ? 1 : 0.4,
                boxShadow: isActive ? `0 0 12px ${accent}66` : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function WhyChooseSection() {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" }
      })
        .fromTo(".why-heading", { opacity: 0, x: isAr ? 50 : -50, skewX: 10 }, { opacity: 1, x: 0, skewX: 0, duration: 0.4, ease: "expo.out" })
        .fromTo(".why-card", { opacity: 0, y: 60, scale: 0.94, borderRadius: "30px" }, { opacity: 1, y: 0, scale: 1, borderRadius: "16px", duration: 0.4, stagger: { each: 0.06, from: "center" }, ease: "expo.out" }, "-=0.25");
      gsap.fromTo(".why-dunes",
        { yPercent: -20 },
        { yPercent: 20, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 }
        }
      );
      gsap.to(".why-deco-number", {
        keyframes: [
          { opacity: 0.015, scale: 1, rotation: 0 },
          { opacity: 0.03, scale: 1.05, rotation: 2 },
          { opacity: 0.02, scale: 0.98, rotation: -1 },
          { opacity: 0.025, scale: 1.02, rotation: 1 },
          { opacity: 0.015, scale: 1, rotation: 0 },
        ],
        duration: 8,
        repeat: -1,
        ease: "sine.inOut",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isAr]);

  return (
    <section ref={sectionRef} id="why-choose" className="py-32 relative overflow-hidden ksa-sand-texture" dir={isAr ? "rtl" : "ltr"}
      style={{ background: "var(--pearl)" }}>
      <SectionDesert speed={0.6} variant={2} />
      <div className="why-dunes ksa-dunes-bottom" style={{ opacity: 0.15, height: "120px" }} />
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.05) 0%, transparent 100%)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to top, rgba(201,168,76,0.05) 0%, transparent 100%)" }} />

      {/* Decorative large number */}
      <div className="why-deco-number absolute top-0 right-0 text-[20vw] font-outfit font-extrabold leading-none text-[#0A0E1A] opacity-[0.025] pointer-events-none select-none overflow-hidden">
        WHY
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div className="why-heading grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-16 pb-8 border-b border-[rgba(10,14,26,0.08)]">
          <div>
            <div className="flex items-center gap-3 mb-5" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
              <span className="block w-8 h-px bg-[#C9A84C]"/>
              <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-[#C9A84C] font-outfit">{t("why.tag")}</span>
            </div>
            <h2 className="font-playfair font-bold text-[#0A0E1A] leading-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              {isAr ? (
                <><span className="font-arabic-display">{t("why.title_1")}</span>{" "}<span style={{ color: "#1A6B3C" }} className="font-arabic-display">{t("why.title_2")}</span></>
              ) : (
                <>{t("why.title_1")} <span style={{ color: "#1A6B3C" }}>{t("why.title_2")}</span></>
              )}
            </h2>
          </div>
          <div className="lg:max-w-sm">
            <p className={`text-base leading-relaxed text-ink-soft mb-5 ${isAr ? "font-arabic" : ""}`}>{t("why.subtitle")}</p>
            <a href="#contact" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald hover:opacity-70 transition-opacity font-outfit" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
              {t("why.cta")} <ArrowRight size={14} style={{ transform: isAr ? "rotate(180deg)" : "none" }}/>
            </a>
          </div>
        </div>

        {/* Cards grid — editorial with big numbers */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(10,14,26,0.07)]" id="why-cards-grid">
          {WHY_CHOOSE_DATA.map((item, i) => (
            <div
              key={item.titleKey}
              className="why-card card-circle group bg-[var(--pearl)] p-8 relative overflow-hidden"
              onMouseMove={handleCardMouseMove}
              style={{ transition: "background 0.3s ease" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--pearl-2)")}
              onMouseLeave={e => (e.currentTarget.style.background = "var(--pearl)")}
            >
              {/* Large editorial number */}
              <div className="absolute top-4 right-5 text-7xl font-extrabold font-outfit text-[#0A0E1A] opacity-[0.04] leading-none pointer-events-none select-none group-hover:opacity-[0.07] transition-opacity">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 relative z-10"
                style={{ background: "rgba(26,107,60,0.08)", color: "#1A6B3C", transition: "background 0.3s ease, box-shadow 0.3s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(26,107,60,0.14)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(26,107,60,0.2)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(26,107,60,0.08)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <span className="icon-hover-pulse">{item.icon}</span>
              </div>
              <div className="w-8 h-px bg-[#C9A84C] mb-4 relative z-10 opacity-50 group-hover:opacity-100 group-hover:w-12 transition-all duration-500"/>
              <h3 className={`font-semibold text-[#0A0E1A] text-base mb-2.5 relative z-10 font-outfit ${isAr ? "font-arabic-display" : ""}`}>{t(item.titleKey)}</h3>
              <p className={`text-sm leading-relaxed text-ink-mid relative z-10 ${isAr ? "font-arabic" : ""}`}>{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


function ServicesSection() {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const style = document.createElement("style");
    style.id = "service-water-style";
    style.textContent = `#services .service-card::before { opacity: 1 !important; } [data-theme="light"] #services .service-card::before { background: radial-gradient(400px circle at var(--mouse-x,50%) var(--mouse-y,50%),rgba(26,107,60,0.08),transparent 50%); }`;
    document.head.appendChild(style);
    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll(".service-card");
      gsap.fromTo(cards,
        { opacity: 0, y: 40, rotateY: 8, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.4,
          stagger: { each: 0.06, from: "random" },
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );
      gsap.fromTo(".services-drift",
        { yPercent: -25, scale: 1 },
        { yPercent: 25, scale: 1.06, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 }
        }
      );
      gsap.to(".service-card .icon-hover-float", {
        y: -4,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.2, from: "random" }
      });
      gsap.to(".service-card", {
        boxShadow: "0 0 30px rgba(201,168,76,0.08)",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.15, from: "start" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          onEnter: () => { gsap.set(".service-card", { boxShadow: "0 0 0px rgba(201,168,76,0)" }); }
        }
      });
      const waterAnims: gsap.core.Tween[] = [];
      cards.forEach((card) => {
        const anim = gsap.to(card, {
          "--mouse-x": "85%",
          "--mouse-y": "85%",
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        });
        waterAnims.push(anim);
        card.addEventListener("mouseenter", () => anim.pause());
        card.addEventListener("mouseleave", () => anim.resume());
      });
    }, sectionRef);
    return () => {
      ctx.revert();
      style.remove();
    };
  }, []);

  return (
    <section ref={sectionRef} id="services" className="py-24 relative overflow-hidden bg-midnight" dir={isAr ? "rtl" : "ltr"}>
      <div className="services-drift absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 40%, rgba(26,107,60,0.06) 0%, transparent 60%)" }} />
      <SectionDesert speed={0.7} heavy variant={3} />
      <div className="ksa-dunes-top" style={{ opacity: 0.15, height: "100px" }} />
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to bottom, rgba(26,107,60,0.06) 0%, transparent 100%)" }} />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] font-semibold mb-4">
            <span className={isAr ? "font-arabic flourish-gold" : ""}>{t("services.tag")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-playfair">
            {isAr ? (
              <><span className="font-arabic-display">{t("services.title_1")}</span><br/><span className="text-gradient-gold font-arabic-display">{t("services.title_2")}</span></>
            ) : (
              <>{t("services.title_1")}<br/><span className="text-gradient-gold">{t("services.title_2")}</span></>
            )}
          </h2>
          <p className={`text-base max-w-xl mx-auto text-white-soft ${isAr ? "font-arabic" : ""}`}>{t("services.subtitle")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s, i) => {
            if (i === 0) {
              return (
                <div 
                  key={s.title} 
                  onMouseMove={handleCardMouseMove}
                  className="rounded-lg p-7 group cursor-pointer transition-all duration-300 hover:-translate-y-1 card-dark service-card glow-card card-circle relative lg:col-span-2 lg:row-span-2 min-h-[420px] flex flex-col justify-between bg-white/[0.06]"
                >
                  <div>
                    <div className="flex items-start justify-between mb-5" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                      <div className="w-10 h-10 border rounded-md flex items-center justify-center text-[#C9A84C] transition-all duration-300 border-[rgba(201,168,76,0.2)] relative z-10"><span className="icon-hover-float">{s.icon}</span></div>
                      <span className="text-xs font-semibold text-right leading-tight text-[rgba(255,255,255,0.2)] font-arabic relative z-10">{t(s.ar)}</span>
                    </div>
                    <h3 className={`text-white font-semibold text-2xl mb-4 relative z-10 ${isAr ? "font-arabic-display" : ""}`}>{isAr ? s.titleAr : s.title}</h3>
                    <p className={`text-base leading-relaxed mb-6 text-[rgba(255,255,255,0.45)] relative z-10 ${isAr ? "font-arabic" : ""}`}>{isAr ? s.descAr : s.desc}</p>
                  </div>
                  <div>
                    <div className="flex flex-wrap gap-2 mb-6" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                      {(isAr ? s.tagsAr : s.tags).map((t) => <span key={t} className="text-xs px-2.5 py-1 rounded-full text-[rgba(201,168,76,0.6)] border border-[rgba(201,168,76,0.15)] relative z-10">{t}</span>)}
                    </div>
                    <div className="pt-4 border-t border-[rgba(255,255,255,0.05)]">
                      <span className="text-xs font-semibold flex items-center gap-1.5 transition-colors text-[rgba(201,168,76,0.5)] relative z-10" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                        {t("services.learn")} <ArrowRight size={12} style={{ transform: isAr ? "rotate(180deg)" : "none" }}/>
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            if (i === 5) {
              return (
                <div 
                  key={s.title} 
                  onMouseMove={handleCardMouseMove}
                  className="rounded-lg p-7 group cursor-pointer transition-all duration-300 hover:-translate-y-1 card-dark service-card glow-card card-circle relative lg:col-span-3 flex md:flex-row flex-col justify-between items-start md:items-center min-h-[140px] gap-6 bg-white/[0.06]"
                >
                    <div className="flex gap-5 items-start">
                      <div className="w-10 h-10 border rounded-md flex items-center justify-center text-[#C9A84C] transition-all duration-300 border-[rgba(201,168,76,0.2)] relative z-10 flex-shrink-0"><span className="icon-hover-float">{s.icon}</span></div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-white font-semibold text-lg relative z-10 ${isAr ? "font-arabic-display" : ""}`}>{isAr ? s.titleAr : s.title}</h3>
                        <span className="text-xs font-semibold text-[rgba(255,255,255,0.2)] font-arabic relative z-10">{t(s.ar)}</span>
                      </div>
                      <p className={`text-sm leading-relaxed text-[rgba(255,255,255,0.4)] relative z-10 ${isAr ? "font-arabic" : ""}`}>{isAr ? s.descAr : s.desc}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0 w-full md:w-auto">
                    <div className="flex flex-wrap gap-2" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                      {(isAr ? s.tagsAr : s.tags).map((t) => <span key={t} className="text-xs px-2.5 py-1 rounded-full text-[rgba(201,168,76,0.6)] border border-[rgba(201,168,76,0.15)] relative z-10">{t}</span>)}
                    </div>
                    <span className="text-xs font-semibold flex items-center gap-1.5 transition-colors text-[rgba(201,168,76,0.5)] relative z-10" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                      {t("services.learn")} <ArrowRight size={12} style={{ transform: isAr ? "rotate(180deg)" : "none" }}/>
                    </span>
                  </div>
                </div>
              );
            }
            return (
              <div 
                key={s.title} 
                onMouseMove={handleCardMouseMove}
                className={`rounded-lg p-7 group cursor-pointer transition-all duration-300 hover:-translate-y-1 card-dark service-card glow-card card-circle relative bg-white/[0.06] ${i === 4 ? "lg:col-span-2" : ""}`}
              >
                <div className="flex items-start justify-between mb-5" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                  <div className="w-10 h-10 border rounded-md flex items-center justify-center text-[#C9A84C] transition-all duration-300 border-[rgba(201,168,76,0.2)] relative z-10"><span className="icon-hover-float">{s.icon}</span></div>
                  <span className="text-xs font-semibold text-right leading-tight text-[rgba(255,255,255,0.2)] font-arabic relative z-10">{t(s.ar)}</span>
                </div>
                <h3 className={`text-white font-semibold text-base mb-2 relative z-10 ${isAr ? "font-arabic-display" : ""}`}>{isAr ? s.titleAr : s.title}</h3>
                <p className={`text-sm leading-relaxed mb-5 text-[rgba(255,255,255,0.4)] relative z-10 ${isAr ? "font-arabic" : ""}`}>{isAr ? s.descAr : s.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                  {(isAr ? s.tagsAr : s.tags).map((t) => <span key={t} className="text-xs px-2.5 py-1 rounded-full text-[rgba(201,168,76,0.6)] border border-[rgba(201,168,76,0.15)] relative z-10">{t}</span>)}
                </div>
                <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                  <span className="text-xs font-semibold flex items-center gap-1.5 transition-colors text-[rgba(201,168,76,0.5)] relative z-10" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                    {t("services.learn")} <ArrowRight size={12} style={{ transform: isAr ? "rotate(180deg)" : "none" }}/>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="ksa-dunes-bottom" style={{ opacity: 0.15, height: "100px" }} />
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to top, rgba(26,107,60,0.06) 0%, transparent 100%)" }} />
    </section>
  );
}

function PortfolioSection() {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll(".portfolio-card");
      gsap.fromTo(cards,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          stagger: { each: 0.06, from: "edges" },
          ease: "expo.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          }
        }
      );
      const images = sectionRef.current!.querySelectorAll(".parallax-img");
      images.forEach((img) => {
        gsap.fromTo(img, 
          { yPercent: -15, scale: 1.2 },
          {
            yPercent: 15,
            scale: 1.2,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              scrub: 1.5,
              start: "top bottom",
              end: "bottom top",
            }
          }
        );
      });
      gsap.to(".portfolio-card .parallax-img", {
        scale: 1.25,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.3, from: "random" }
      });
      gsap.fromTo(".portfolio-card",
        { borderRadius: "16px" },
        {
          borderRadius: "20px",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            onEnter: () => {},
            onEnterBack: () => {},
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="portfolio" className="py-24 bg-ivory relative overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      <SectionDesert speed={0.5} variant={4} />
      <div className="ksa-dunes-top" style={{ opacity: 0.12, height: "100px" }} />
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.04) 0%, transparent 100%)" }} />
      {/* ── Subtle dune edge ── */}
      <div className="ksa-dunes-bottom" style={{ opacity: 0.12, height: "100px" }} />
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to top, rgba(201,168,76,0.04) 0%, transparent 100%)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <div className="text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] font-semibold flex items-center gap-3 mb-4" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
              <span className="w-6 h-px bg-[#C9A84C]"/><span className={isAr ? "font-arabic" : ""}>{t("portfolio.tag")}</span>
            </div>
            <h2 className="text-4xl font-bold text-[#0A0E1A] leading-tight font-playfair">
              {isAr ? (
                <><span className="font-arabic-display">{t("portfolio.title_1")}</span><br/><span style={{color:"#1A6B3C"}} className="font-arabic-display">{t("portfolio.title_2")}</span></>
              ) : (
                <>{t("portfolio.title_1")}<br/><span style={{color:"#1A6B3C"}}>{t("portfolio.title_2")}</span></>
              )}
            </h2>
          </div>
          <a href="#contact" className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors text-ink-mid hover:text-ink-soft2`} style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
            {t("portfolio.view_all")} <ExternalLink size={14}/>
          </a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PORTFOLIO.map((p) => (
            <div 
              key={p.name} 
              data-cursor-label="VIEW"
              className="group bg-white rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-xl cursor-pointer border-ink-6 portfolio-card glow-card card-circle relative"
              onMouseMove={handleCardMouseMove}
            >
              <div className="relative h-52 overflow-hidden bg-[#0A0E1A]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover parallax-img"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,14,26,0.4),transparent)] z-10"/>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-[rgba(10,14,26,0.5)] backdrop-blur-[1px] z-20">
                  <span className="border text-white text-xs px-4 py-2 rounded-full font-semibold flex items-center gap-2 border-[rgba(255,255,255,0.6)]">
                    {t("portfolio.view_project")} <ExternalLink size={12}/>
                  </span>
                </div>
              </div>
              <div className="p-5 relative z-20">
                <div className={`text-xs font-medium mb-1 text-ink-soft2 ${isAr ? "font-arabic" : ""}`}>{p.cat}</div>
                <div className={`font-semibold text-[#0A0E1A] text-sm ${isAr ? "font-arabic-display" : ""}`}>{p.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection() {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const [pinWrapWidth, setPinWrapWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
    const mq = window.matchMedia("(max-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    function refresh() {
      const el = cardsRef.current;
      if (!el) return;
      setPinWrapWidth(el.scrollWidth);
    }
    refresh();
    ScrollTrigger.addEventListener("refreshInit", refresh);
    return () => ScrollTrigger.removeEventListener("refreshInit", refresh);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    if (!sectionRef.current || !cardsRef.current || pinWrapWidth <= 0) return;
    const ctx = gsap.context(() => {
      const scrollDistance = pinWrapWidth - window.innerWidth;
      gsap.to(cardsRef.current, {
        x: isAr ? scrollDistance : -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          start: "center center",
          end: () => `+=${pinWrapWidth}`,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isAr, pinWrapWidth, isMobile]);

  return (
    <section ref={sectionRef} id="process" className="relative bg-[#0A0E1A] overflow-hidden py-32 min-h-screen" dir={isAr ? "rtl" : "ltr"}>
      <SectionDesert speed={0.9} heavy variant={5} />
      <div className="ksa-dunes-top" style={{ opacity: 0.25, height: "140px" }} />
      <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.06) 0%, transparent 100%)" }} />
      <div className="ksa-dunes-bottom" style={{ opacity: 0.25, height: "140px" }} />
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to top, rgba(201,168,76,0.06) 0%, transparent 100%)" }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#C9A84C,transparent)]"/>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,#C9A84C,transparent)]"/>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="mb-12">
          <div className="text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] font-semibold mb-4">
            <span className={isAr ? "font-arabic flourish-gold" : ""}>{t("process.tag")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-playfair">
            {isAr ? (
              <><span className="font-arabic-display">{t("process.title_1")}</span>{" "}<span className="text-gradient-gold font-arabic-display">{t("process.title_2")}</span></>
            ) : (
              <>{t("process.title_1")}{" "}<span className="text-gradient-gold">{t("process.title_2")}</span></>
            )}
          </h2>
        </div>

        <div className="overflow-hidden">
          <div ref={cardsRef} className="flex gap-6 lg:flex-nowrap flex-wrap justify-center" style={{ width: isMobile ? "100%" : "max-content" }}>
            {PROCESS.map((p, i) => (
              <div
                key={p.step}
                className="glow-card rounded-2xl p-8 bg-white/4 border border-white/8 flex flex-col justify-between min-h-[300px] group relative card-circle"
                style={{ width: isMobile ? "100%" : "320px", maxWidth: "400px" }}
              >
                <div>
                  <div className="text-4xl font-bold font-playfair text-gold/20 group-hover:text-gold transition-colors duration-300 mb-6">{p.step}</div>
                  <h3 className={`text-white font-bold text-lg mb-4 relative z-10 ${isAr ? "font-arabic-display" : ""}`}>{isAr ? p.titleAr : p.title}</h3>
                  <p className={`text-sm leading-relaxed text-white-faint relative z-10 ${isAr ? "font-arabic" : ""}`}>{isAr ? p.descAr : p.desc}</p>
                </div>
                <div className="mt-8 flex justify-end relative z-10">
                  {i < PROCESS.length - 1 && (
                    <span className="text-gold/40 group-hover:translate-x-2 transition-transform duration-300" style={{ transform: isAr ? "scaleX(-1)" : "none" }}>
                      <ArrowRight size={20}/>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
    </section>
  );
}

function TestimonialsSection() {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const lastCarouselIdx = useRef(0);
  const { scrollYProgress: testimonialProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  useEffect(() => {
    const unsubscribe = testimonialProgress.on("change", (v) => {
      const idx = Math.round(v * (TESTIMONIALS.length - 1));
      const clamped = Math.min(Math.max(idx, 0), TESTIMONIALS.length - 1);
      if (clamped !== lastCarouselIdx.current) {
        lastCarouselIdx.current = clamped;
        setActive(clamped);
      }
    });
    return () => unsubscribe();
  }, [testimonialProgress]);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".testimonials-drift",
        { yPercent: -20, scale: 1 },
        { yPercent: 20, scale: 1.05, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 }
        }
      );
      gsap.to(".testimonial-quote", {
        y: -8,
        rotation: -3,
        scale: 1.05,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.fromTo(".testimonials-reveal",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.4, stagger: { each: 0.08, from: "start" }, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", toggleActions: "play none none reverse" }
        }
      );
      gsap.fromTo(".testimonials-card-reveal",
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%", toggleActions: "play none none reverse" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="relative bg-pearl z-0 py-24 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      <div className="ksa-dunes-top" style={{ opacity: 0.12, height: "100px" }} />
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.04) 0%, transparent 100%)" }} />
      <div className="testimonials-drift absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(circle at 70% 50%, rgba(201,168,76,0.04) 0%, transparent 60%)" }} />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="testimonials-reveal text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] font-semibold flex items-center gap-3 mb-4" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
              <span className="w-6 h-px bg-[#C9A84C]"/><span className={isAr ? "font-arabic" : ""}>{t("testimonials.tag")}</span>
            </div>
            <h2 className="testimonials-reveal text-4xl font-bold text-[#0A0E1A] leading-tight mb-6 font-playfair">
              {isAr ? (
                <><span className="font-arabic-display">{t("testimonials.title_1")}</span><br/><span className="text-emerald font-arabic-display">{t("testimonials.title_2")}</span></>
              ) : (
                <>{t("testimonials.title_1")}<br/><span className="text-emerald">{t("testimonials.title_2")}</span></>
              )}
            </h2>
            <p className={`testimonials-reveal text-sm leading-relaxed mb-8 text-ink-mid ${isAr ? "font-arabic" : ""}`}>{t("testimonials.subtitle")}</p>
            <div className="testimonials-reveal flex gap-3 mb-6" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
              <button type="button" onClick={() => setActive((a) => (a - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="slider-btn" aria-label="Previous testimonial"><ChevronLeft size={16}/></button>
              <button type="button" onClick={() => setActive((a) => (a + 1) % TESTIMONIALS.length)} className="slider-btn" aria-label="Next testimonial"><ChevronRight size={16}/></button>
            </div>
            <div className="testimonials-reveal flex gap-2" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${i === active ? "h-2 w-6 bg-emerald" : "h-2 w-2 bg-[rgba(10,14,26,0.2)]"}`}
                />
              ))}
            </div>
          </div>
          <div className="testimonials-card-reveal relative min-h-[300px]">
            {TESTIMONIALS.map((tData, i) => (
              <div key={tData.name} className={`transition-all duration-700 ${i === active ? "opacity-100 translate-y-0 testimonial-active" : "opacity-0 translate-y-4 pointer-events-none absolute inset-0"}`}>
                <div className="bg-white rounded-xl p-8 border shadow-sm border-ink-6 card-circle relative">
                  <div className="flex gap-1 mb-5" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                    {Array(tData.rating).fill(0).map((_, si) => <Star key={si} size={14} className="fill-[#C9A84C] text-[#C9A84C] icon-star"/>)}
                  </div>
                  <div className="testimonial-quote text-6xl leading-none mb-3 -mt-2 font-playfair text-[rgba(26,107,60,0.15)]" style={{ transform: isAr ? "scaleX(-1)" : "none" }}>&quot;</div>
                  <p className={`text-base leading-relaxed mb-6 -mt-4 text-[rgba(10,14,26,0.7)] ${isAr ? "font-arabic" : ""}`}>{tData.text}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-[rgba(10,14,26,0.06)]" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-10">
                      <span className="font-bold text-sm text-emerald">{tData.name[0]}</span>
                    </div>
                    <div>
                      <div className={`font-semibold text-[#0A0E1A] text-sm ${isAr ? "font-arabic-display" : ""}`}>{tData.name}</div>
                      <div className={`text-xs text-ink-soft2 ${isAr ? "font-arabic" : ""}`}>{tData.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
        <div className="ksa-dunes-bottom" style={{ opacity: 0.12, height: "100px" }} />
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-[1]"
          style={{ background: "linear-gradient(to top, rgba(201,168,76,0.04) 0%, transparent 100%)" }} />
    </section>
  );
}

function CtaBanner() {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-reveal",
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: { each: 0.08, from: "start" }, ease: "expo.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" }
        }
      );
      gsap.fromTo(".cta-orb-1",
        { yPercent: -25, scale: 0.9 },
        { yPercent: 25, scale: 1.1, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 }
        }
      );
      gsap.fromTo(".cta-orb-2",
        { yPercent: -30, scale: 0.85 },
        { yPercent: 10, scale: 1.15, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 }
        }
      );
      gsap.fromTo(".cta-dunes",
        { yPercent: -15 },
        { yPercent: 15, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 }
        }
      );
      gsap.fromTo(".cta-camera-bg",
        { yPercent: -20, scale: 1 },
        { yPercent: 20, scale: 1.08, ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 }
        }
      );
      gsap.to(sectionRef.current, {
        backgroundPosition: "50% 50%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });
      gsap.to(".cta-heading-glow", {
        textShadow: "0 0 40px rgba(201,168,76,0.3)",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      });
      gsap.to(".btn-gold", {
        keyframes: [
          { boxShadow: "0 0 20px rgba(201,168,76,0.3)" },
          { boxShadow: "0 0 40px rgba(201,168,76,0.5)" },
          { boxShadow: "0 0 20px rgba(201,168,76,0.3)" },
        ],
        duration: 2,
        repeat: -1,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="cta" className="py-24 relative z-10 overflow-hidden bg-charcoal cta-spotlight" dir={isAr ? "rtl" : "ltr"}>
      <SectionDesert speed={0.7} heavy variant={7} />
      <div className="ksa-dunes-top" style={{ opacity: 0.2, height: "120px" }} />
      <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.05) 0%, transparent 100%)" }} />
      {/* ── Subtle dune edge ── */}
      <div className="cta-dunes absolute bottom-0 left-0 right-0 h-20 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to top, rgba(201,168,76,0.05) 0%, transparent 100%)" }} />
      <div className="ksa-dunes-bottom" style={{ opacity: 0.2, height: "120px" }} />

      <div className="absolute inset-0 pointer-events-none">
        <div className="cta-camera-bg absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(201,168,76,0.05) 0%, transparent 55%)" }} />
        <div className="cta-orb-1 absolute top-0 left-1/2 pointer-events-none">
          <div className="-translate-x-1/2 w-96 h-96 rounded-full bg-[rgba(26,107,60,0.08)] blur-[80px]"/>
        </div>
        <div className="cta-orb-2 absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[rgba(201,168,76,0.06)] blur-[60px]"/>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 300" fill="none">
          <line x1="0" y1="300" x2="400" y2="0" stroke="rgba(201,168,76,0.08)" strokeWidth="1"/>
          <line x1="1440" y1="0" x2="1100" y2="300" stroke="rgba(201,168,76,0.08)" strokeWidth="1"/>
        </svg>
      </div>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="cta-reveal text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] font-semibold mb-5 flex items-center justify-center gap-3">
          <span className="w-6 h-px bg-[#C9A84C]"/><span className={isAr ? "font-arabic" : ""}>{t("cta.tag")}</span><span className="w-6 h-px bg-[#C9A84C]"/>
        </div>
        <h2 className="cta-reveal text-4xl md:text-5xl font-bold text-white mb-5 leading-tight font-playfair cta-heading-glow">
          {isAr ? (
            <><span className="font-arabic-display">{t("cta.title_1")}</span><br/><span className="text-gradient-gold italic font-arabic-display">{t("cta.title_2")}</span></>
          ) : (
            <>{t("cta.title_1")}<br/><span className="text-gradient-gold italic">{t("cta.title_2")}</span></>
          )}
        </h2>
        <p className={`cta-reveal text-base mb-10 max-w-lg mx-auto leading-relaxed text-white-soft ${isAr ? "font-arabic" : ""}`}>{t("cta.subtitle")}</p>
        <div className="cta-reveal flex flex-wrap gap-4 justify-center" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
          <a href="#contact" className="btn-gold px-8 py-4 rounded-sm text-sm font-bold inline-flex items-center gap-2.5 relative">
            {t("cta.cta")}
            <span className="btn-icon"><ArrowRight size={16} style={{ transform: isAr ? "rotate(180deg)" : "none" }}/></span>
          </a>
          <a href="https://wa.me/966542288828" className="btn-outline px-8 py-4 rounded-sm text-sm font-semibold inline-flex items-center gap-2.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            {t("cta.whatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}

type ContactForm = { name: string; email: string; company: string; service: string; message: string; };

function ContactSection() {
  const { locale, t } = useLocale();
  const isAr = locale === "ar";
  const [form, setForm] = useState<ContactForm>({ name:"", email:"", company:"", service:"", message:"" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: dunesScroll } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const dunesY = useTransform(dunesScroll, [0, 1], ["-18%", "18%"]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ name:"", email:"", company:"", service:"", message:"" });
      } else {
        const data = await res.json();
        setSubmitError(data.error || "Something went wrong.");
      }
    } catch {
      setSubmitError("Failed to connect to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full border rounded-md px-3.5 py-2.5 text-sm text-[#0A0E1A] focus:outline-none transition-colors";

  return (
    <section ref={sectionRef} id="contact" className="py-24 bg-pearl relative overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      <SectionDesert speed={0.5} variant={8} />
      <div className="ksa-dunes-top" style={{ opacity: 0.1, height: "80px" }} />
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.04) 0%, transparent 100%)" }} />
      {/* ── Subtle dune edge ── */}
      <motion.div className="contact-dunes ksa-dunes-bottom" style={{ opacity: 0.1, height: "80px", y: dunesY }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: isAr ? 60 : -60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, margin: "-20% 0px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="contact-fade"
          >
            <div className="text-[10px] tracking-[0.18em] uppercase text-[#C9A84C] font-semibold flex items-center gap-3 mb-4" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
              <span className="w-6 h-px bg-[#C9A84C]"/><span className={isAr ? "font-arabic" : ""}>{t("contact.tag")}</span>
            </div>
            <h2 className="text-4xl font-bold text-[#0A0E1A] mb-6 leading-tight font-playfair">
              {isAr ? (
                <><span className="font-arabic-display">{t("contact.title_1")}</span><br/><span className="text-emerald font-arabic-display">{t("contact.title_2")}</span></>
              ) : (
                <>{t("contact.title_1")}<br/><span className="text-emerald">{t("contact.title_2")}</span></>
              )}
            </h2>
            <p className={`text-base leading-relaxed mb-10 text-ink-soft ${isAr ? "font-arabic" : ""}`}>{t("contact.subtitle")}</p>
            <div className="space-y-5">
              {CONTACT_INFO.map((c) => (
                <div key={c.labelKey} className="flex items-center gap-4" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                  <div className="w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 bg-emerald/8 text-emerald icon-glow">{c.icon}</div>
                  <div>
                    <div className={`text-xs font-medium text-ink-soft2 ${isAr ? "font-arabic" : ""}`}>{t(c.labelKey)}</div>
                    <div className={`text-[#0A0E1A] text-sm font-semibold ${isAr ? "font-arabic" : ""}`}>{t(c.valueKey)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 p-6 bg-white rounded-lg border border-ink-6">
              <div className={`text-xs font-bold text-[#0A0E1A] mb-4 uppercase tracking-wider ${isAr ? "font-arabic" : ""}`}>{t("contact.included_title")}</div>
              {INCLUSION_LIST.map((item) => (
                <div key={item} className="flex items-center gap-3 py-2" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald"><Check size={10} color="white"/></div>
                  <span className={`text-sm text-[rgba(10,14,26,0.65)] ${isAr ? "font-arabic" : ""}`}>{t(item)}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: isAr ? 60 : -60, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, margin: "-20% 0px" }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
            className="bg-white rounded-xl p-8 border shadow-sm border-ink-6 card-circle relative"
          >
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-emerald/10"><Check size={24} className="text-emerald"/></div>
                <h3 className={`text-xl font-bold text-[#0A0E1A] mb-2 ${isAr ? "font-arabic-display" : "font-playfair"}`}>{t("contact.sent_title")}</h3>
                <p className={`text-sm text-ink-mid ${isAr ? "font-arabic" : ""}`}>{t("contact.sent_text")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className={`text-xl font-bold text-[#0A0E1A] mb-6 ${isAr ? "font-arabic-display" : "font-playfair"}`}>{t("contact.form_title")}</h3>
                {submitError && (
                  <div className="p-3 text-xs bg-red-50 text-red-600 rounded border border-red-200">
                    {submitError}
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`text-xs font-semibold block mb-1.5 text-ink-mid ${isAr ? "font-arabic" : ""}`}>{t("contact.form_name")}</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder={t("contact.form_placeholder_name")}
                      className={`${inputClass} border-[rgba(10,14,26,0.1)] contact-input`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs font-semibold block mb-1.5 text-ink-mid ${isAr ? "font-arabic" : ""}`}>{t("contact.form_email")}</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder={t("contact.form_placeholder_email")}
                      className={`${inputClass} border-[rgba(10,14,26,0.1)] contact-input`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 text-ink-mid ${isAr ? "font-arabic" : ""}`}>{t("contact.form_company")}</label>
                  <input value={form.company} onChange={(e) => setForm({...form,company:e.target.value})} placeholder={t("contact.form_placeholder_company")} className={`${inputClass} border-[rgba(10,14,26,0.1)]`}/>
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 text-ink-mid ${isAr ? "font-arabic" : ""}`}>{t("contact.form_service")}</label>
                  <select value={form.service} onChange={(e) => setForm({...form,service:e.target.value})} className={`${inputClass} border-[rgba(10,14,26,0.1)]`} aria-label={t("contact.form_service")}>
                    <option value="">{t("contact.form_select")}</option>
                    {SERVICES.map((s) => <option key={s.title} value={s.title}>{isAr ? s.titleAr : s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`text-xs font-semibold block mb-1.5 text-[#0A0E1A] font-semibold block mb-1.5 text-ink-mid ${isAr ? "font-arabic" : ""}`}>{t("contact.form_message")}</label>
                  <textarea required value={form.message} onChange={(e) => setForm({...form,message:e.target.value})} rows={4} placeholder={t("contact.form_placeholder_message")} className={`${inputClass} resize-none border-[rgba(10,14,26,0.1)]`}/>
                </div>
                <button
                  disabled={submitting}
                  type="submit"
                  className="btn-gold w-full py-3.5 rounded-sm text-sm font-bold inline-flex items-center justify-center gap-2 relative disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      {t("contact.form_submit")}
                      <span className="btn-icon"><ArrowRight size={16} style={{ transform: isAr ? "rotate(180deg)" : "none" }}/></span>
                    </>
                  )}
                </button>
                <p className={`text-center text-xs text-[rgba(10,14,26,0.3)] ${isAr ? "font-arabic" : ""}`}>{t("contact.form_nospam")}</p>
              </form>
            )}
          </motion.div>
          </div>
        </div>
    </section>
  );
}

function Footer() {
  const { locale, t } = useLocale();
  const { theme } = useTheme();
  const isAr = locale === "ar";
  const isLight = theme === "light";
  const isGreen = theme === "green";
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!footerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".footer-col",
        { opacity: 0, y: 20, scaleX: 0.97, transformOrigin: "left center" },
        { opacity: 1, y: 0, scaleX: 1, duration: 0.4, stagger: { each: 0.06, from: "edges" }, ease: "expo.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 90%", toggleActions: "play none none reverse" }
        }
      );
      gsap.fromTo(".footer-dunes",
        { yPercent: -20 },
        { yPercent: 5, ease: "none",
          scrollTrigger: { trigger: footerRef.current, start: "top bottom", end: "bottom top", scrub: 1.5 }
        }
      );
      gsap.to(".icon-footer-float", {
        y: -3,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="pt-16 pb-8 border-t bg-midnight border-[rgba(255,255,255,0.05)] relative z-10 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      <SectionDesert speed={0.3} variant={9} />
      <div className="ksa-dunes-top" style={{ opacity: 0.12, height: "80px" }} />
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to bottom, rgba(201,168,76,0.04) 0%, transparent 100%)" }} />
      <div className="footer-dunes absolute bottom-0 left-0 right-0 h-16 pointer-events-none z-[1]"
        style={{ background: "linear-gradient(to top, rgba(201,168,76,0.04) 0%, transparent 100%)" }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-12">
          <div className="footer-col">
            <div className="flex items-center gap-2.5 mb-4" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
              <img
                src={isGreen ? "/voxon-green-transparent%20logo.png" : isLight ? "/voxon-dark-transparent%20logo.png" : "/voxon-white-transparent%20logo.png"}
                alt="Voxon"
                className="h-7 w-auto object-contain"
              />
            </div>
            <p className={`text-xs leading-relaxed mb-5 text-white-muted ${isAr ? "font-arabic" : ""}`}>{t("footer.description")}</p>
            <p className="text-right text-sm font-arabic text-[rgba(201,168,76,0.4)]">{t("footer.arabic_tagline")}</p>
          </div>
          {[
            {title:t("footer.quick_links"), items:[
              t("nav.home"),t("nav.services"),t("nav.portfolio"),t("nav.process"),t("nav.testimonials"),t("nav.contact")
            ]},
            {title:t("footer.services"), items:["Website Design","E-Commerce","Web Development","SEO & Marketing","Brand Identity","Support"]},
            {title:t("footer.industries"), items:["Construction","Restaurants","Medical","E-Commerce","Real Estate","Education"]},
          ].map((col) => (
            <div key={col.title} className="footer-col">
              <h4 className={`text-white text-xs font-bold uppercase tracking-wider mb-4 ${isAr ? "font-arabic-display" : ""}`}>{col.title}</h4>
              <ul className="space-y-2.5">
                {col.items.map((item) => <li key={item}><a href="#" className={`text-xs hover:text-white/70 transition-colors text-white-faint ${isAr ? "font-arabic" : ""}`}>{item}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="h-px mb-6 bg-[linear-gradient(90deg,transparent,#C9A84C,transparent)]"/>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white-subtle">
          <span className={isAr ? "font-arabic" : ""}>{t("footer.copyright")}</span>
          <div className="flex items-center gap-1 text-white-subtle" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
            <MapPin size={10} className="text-[rgba(201,168,76,0.4)] icon-footer-float"/>
            <span className="font-arabic">{t("footer.location_arabic")}</span>
          </div>
          <div className="flex gap-5" style={{ flexDirection: isAr ? "row-reverse" : "row" }}>
            {["Privacy","Terms","Sitemap"].map((l) => <a key={l} href="#" className="hover:text-white/50 transition-colors">{l}</a>)}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [progress, setProgress] = useState(0);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");

  const updateHtml = useCallback((l: Locale) => {
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  }, []);

  const applyTheme = (t: Theme) => {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("voxon-theme", t); } catch {}
  };

  useEffect(() => {
    let initial: Theme = "dark";
    try {
      const stored = localStorage.getItem("voxon-theme");
      if (stored === "light" || stored === "green") initial = stored;
    } catch {}
    setTheme(initial);
    applyTheme(initial);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const order: Theme[] = ["dark", "light", "green"];
      const idx = order.indexOf(prev);
      const next = order[(idx + 1) % order.length];
      applyTheme(next);
      return next;
    });
  }, []);

  const switchLocale = useCallback((l: Locale) => {
    setLocale(l);
    updateHtml(l);
  }, [updateHtml]);

  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.5,
      effects: true,
    });

    const handleHashClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!link) return;
      const href = (link as HTMLAnchorElement).getAttribute('href');
      if (!href || href === "#") return;
      e.preventDefault();
      smoother.scrollTo(href);
    };
    document.addEventListener("click", handleHashClick, { capture: true });
    return () => {
      smoother.kill();
      document.removeEventListener("click", handleHashClick, { capture: true });
    };
  }, []);

  useEffect(() => {
    updateHtml(locale);
  }, [locale, updateHtml]);

  useEffect(() => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        gsap.to("#preloader", {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
          onComplete: () => {
            setPreloaderDone(true);
            ScrollTrigger.refresh();
          },
        });
      }
      setProgress(currentProgress);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (preloaderDone) ScrollTrigger.refresh();
  }, [preloaderDone]);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return;
    const cursorDot = document.querySelector(".custom-cursor") as HTMLElement;
    const cursorRing = document.querySelector(".custom-cursor-ring") as HTMLElement;
    if (!cursorDot || !cursorRing) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    };

    window.addEventListener("mousemove", onMouseMove);

    let active = true;
    const tick = () => {
      if (!active) return;
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(tick);
    };
    tick();

    const addHover = (e: Event) => {
      document.body.classList.add("custom-cursor-hover");
      const target = e.currentTarget as HTMLElement;
      const label = target.getAttribute("data-cursor-label");
      if (label) {
        cursorRing.setAttribute("data-label", label);
        document.body.classList.add("custom-cursor-label-active");
      }
    };
    const removeHover = () => {
      document.body.classList.remove("custom-cursor-hover");
      document.body.classList.remove("custom-cursor-label-active");
      cursorRing.removeAttribute("data-label");
    };

    const setupHoverListeners = () => {
      const hoverables = document.querySelectorAll("a, button, select, input, textarea, [role='button'], .group, .card-dark, .why-card, .portfolio-card");
      hoverables.forEach((el) => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
    };

    setupHoverListeners();

    const observer = new MutationObserver(setupHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      active = false;
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("voxon-theme");
      applyTheme(stored === "light" ? "light" : "dark");
    } catch {}
  }, []);

  const t = useCallback((key: string) => {
    return translations[locale][key] || key;
  }, [locale]);

  return (
    <LocaleCtx.Provider value={{ locale, setLocale: switchLocale, t }}>
      <ThemeCtx.Provider value={{ theme, toggleTheme }}>
      <LoadingCtx.Provider value={!preloaderDone}>
      {!preloaderDone && (
        <>
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#0A0E1A]" id="preloader">
          <div className="flex flex-col items-center">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              className="svg-logo-path"
              d="M20 20 L50 80 L80 20 Z"
              stroke="#C9A84C"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-white text-xs font-playfair uppercase tracking-[0.2em] mt-4">VOXON</div>
          <div className="preloader-line">
            <div className="preloader-progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        </div>
        </>
      )}

      {/* Custom Mouse Follower */}
      <div className="custom-cursor hidden lg:block" />
      <div className="custom-cursor-ring hidden lg:block" />

      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Voxon Digital Agency",
            url: "https://voxon.sa",
            logo: "https://voxon.sa/og-image.svg",
            sameAs: ["https://wa.me/966542288828"],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+966542288828",
              contactType: "customer service",
              areaServed: "SA",
              availableLanguage: ["Arabic", "English"],
            },
            description: "Premium web design, development, SEO, and branding services for Saudi businesses.",
          }),
        }}
      />
      <Navbar/>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main style={{ direction: locale === "ar" ? "rtl" : "ltr" }} className={`relative transition-opacity duration-700 ${preloaderDone ? "opacity-100" : "opacity-0"}`}>
            <HeroSection/>
            <WhyChooseSection/>
            <ServicesSection/>
            <PortfolioSection/>
            <ProcessSection/>
            <TestimonialsSection/>
            <CtaBanner/>
            <ContactSection/>
          </main>
          <Footer/>
        </div>
      </div>
      <SectionIndicator/>
      <GoToTop/>
      <a href="https://wa.me/966542288828" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200 bg-[#1A6B3C] shadow-[0_8px_32px_rgba(26,107,60,0.4)]" aria-label="WhatsApp">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="icon-bounce"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.587-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
      </a>
      </LoadingCtx.Provider>
    </ThemeCtx.Provider>
    </LocaleCtx.Provider>
  );
}