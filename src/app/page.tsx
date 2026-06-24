"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomeView } from "@/components/views/home-view";
import { CalendarView } from "@/components/views/calendar-view";
import { MapView } from "@/components/views/map-view";
import { GalleryView } from "@/components/views/gallery-view";
import { DonationView } from "@/components/views/donation-view";
import type { ViewName } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const [view, setView] = useState<ViewName>("home");
  const lang = useLanguage((s) => s.lang);

  const navigate = useCallback((v: ViewName) => {
    setView(v);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const titles: Record<ViewName, { en: string; id: string }> = {
      home: {
        en: "Rumah Buah Hati — Help the Fatherless in Indonesia",
        id: "Rumah Buah Hati — Bantulah Anak Yatim di Indonesia",
      },
      calendar: {
        en: "Calendar — Rumah Buah Hati",
        id: "Kalender — Rumah Buah Hati",
      },
      map: { en: "Map — Rumah Buah Hati", id: "Peta — Rumah Buah Hati" },
      gallery: {
        en: "Gallery — Rumah Buah Hati",
        id: "Galeri — Rumah Buah Hati",
      },
      donation: {
        en: "Patreon — Rumah Buah Hati",
        id: "Patreon — Rumah Buah Hati",
      },
    };
    const apply = () => {
      document.title = titles[view][lang];
    };
    // Apply immediately, then re-apply after a short delay to win over any
    // Next.js metadata hydration that may re-assert the static SSR title.
    apply();
    const t1 = setTimeout(apply, 0);
    const t2 = setTimeout(apply, 100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [view, lang]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader view={view} onNavigate={navigate} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {view === "home" && <HomeView onNavigate={navigate} />}
            {view === "calendar" && <CalendarView onNavigate={navigate} />}
            {view === "map" && <MapView onNavigate={navigate} />}
            {view === "gallery" && <GalleryView onNavigate={navigate} />}
            {view === "donation" && <DonationView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter onNavigate={navigate} />
    </div>
  );
}
