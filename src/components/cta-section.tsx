"use client";

import { motion } from "framer-motion";
import { HeartHandshake, CalendarClock, MapPin } from "lucide-react";
import type { ViewName } from "@/lib/data";
import { useLanguage, useT } from "@/lib/i18n";
import { WhatsAppGlyph, buildWhatsAppUrl } from "@/components/whatsapp-button";

export function CTASection({
  onNavigate,
  variant = "light",
}: {
  onNavigate: (v: ViewName) => void;
  variant?: "light" | "dark";
}) {
  const t = useT();
  const lang = useLanguage((s) => s.lang);
  const dark = variant === "dark";
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? "radial-gradient(ellipse at 50% 50%, oklch(0.35 0.06 55), oklch(0.22 0.04 55) 70%, oklch(0.15 0.03 55) 100%)"
            : "radial-gradient(ellipse at 50% 50%, oklch(0.90 0.05 70), oklch(0.83 0.06 65) 70%, oklch(0.78 0.06 60) 100%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          <HeartHandshake
            className={`mx-auto mb-5 h-12 w-12 ${dark ? "text-amber-300" : "text-ember"}`}
          />
          <h2
            className={`font-blackletter text-4xl leading-tight sm:text-5xl ${dark ? "text-amber-100" : "text-ember"}`}
          >
            {t("cta.heading")}
          </h2>
          <p
            className={`mx-auto mt-5 max-w-2xl font-im-fell text-xl italic leading-relaxed ${dark ? "text-amber-100/80" : "text-foreground/75"}`}
          >
            {t("cta.verse")}
          </p>
          <p
            className={`mt-2 text-sm uppercase tracking-widest ${dark ? "text-amber-200/70" : "text-foreground/50"}`}
          >
            {t("cta.ref")}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => onNavigate("donation")}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 font-semibold shadow-lg transition-all hover:scale-[1.03] sm:w-auto ${dark ? "bg-amber-300 text-amber-950" : "bg-primary text-primary-foreground"}`}
            >
              <HeartHandshake className="h-5 w-5" />
              {t("cta.give")}
            </button>
            <button
              onClick={() => onNavigate("calendar")}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-8 py-3.5 font-semibold backdrop-blur transition-colors sm:w-auto ${dark ? "border-amber-200/40 bg-amber-100/10 text-amber-100 hover:bg-amber-100/20" : "border-amber-800/40 bg-amber-50/50 text-amber-900 hover:bg-amber-100/60"}`}
            >
              <CalendarClock className="h-5 w-5" />
              {t("cta.schedule")}
            </button>
            <button
              onClick={() => onNavigate("map")}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-8 py-3.5 font-semibold backdrop-blur transition-colors sm:w-auto ${dark ? "border-amber-200/40 bg-amber-100/10 text-amber-100 hover:bg-amber-100/20" : "border-amber-800/40 bg-amber-50/50 text-amber-900 hover:bg-amber-100/60"}`}
            >
              <MapPin className="h-5 w-5" />
              {t("cta.map")}
            </button>
            <a
              href={buildWhatsAppUrl(lang)}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-8 py-3.5 font-semibold backdrop-blur transition-colors sm:w-auto ${dark ? "border-amber-200/40 bg-amber-100/10 text-amber-100 hover:bg-amber-100/20" : "border-amber-800/40 bg-amber-50/50 text-amber-900 hover:bg-amber-100/60"}`}
            >
              <WhatsAppGlyph className="h-5 w-5" />
              {t("contact.whatsapp")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
