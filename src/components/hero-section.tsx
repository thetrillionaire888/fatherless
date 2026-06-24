"use client";

import { motion } from "framer-motion";
import { HeartHandshake, ChevronDown, ScrollText } from "lucide-react";
import type { ViewName } from "@/lib/data";
import { CONTACT } from "@/lib/data";
import { useLanguage, useT } from "@/lib/i18n";
import { AksaraName } from "@/components/aksara-name";

export function HeroSection({
  onNavigate,
}: {
  onNavigate: (v: ViewName) => void;
}) {
  const t = useT();
  const lang = useLanguage((s) => s.lang);

  return (
    <section className="relative overflow-hidden">
      {/* Manuscript background */}
      <div className="parchment-bg absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left — text */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-800/30 bg-amber-100/40 px-4 py-1.5 text-sm font-medium text-amber-900"
            >
              <ScrollText className="h-4 w-4" />
              {t("hero.badge")}
            </motion.div>

            {/* Full official name in archaic Javanese (Aksara Jawa) + Bahasa Indonesia */}
            {CONTACT.aksaraJawa && CONTACT.fullName && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.03 }}
                className="mb-5 lg:flex lg:justify-start"
              >
                <AksaraName
                  aksaraJawa={CONTACT.aksaraJawa}
                  fullName={CONTACT.fullName[lang]}
                  variant="hero"
                  className="lg:items-start lg:text-left"
                />
              </motion.div>
            )}

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-blackletter text-5xl leading-[0.95] text-ember sm:text-6xl lg:text-7xl"
            >
              {t("hero.title1")}
              <br />
              {t("hero.title2")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mx-auto mt-6 max-w-xl font-im-fell text-xl italic leading-relaxed text-foreground/80 lg:mx-0"
            >
              {t("hero.verse")}
              <span className="mt-1 block text-base not-italic text-foreground/55">
                — {t("hero.verseRef")}
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start"
            >
              <button
                onClick={() => onNavigate("donation")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl sm:w-auto"
              >
                <HeartHandshake className="h-5 w-5" />
                {t("hero.cta.give")}
              </button>
              <a
                href="#stories"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-800/40 bg-amber-50/50 px-7 py-3.5 font-semibold text-amber-900 backdrop-blur transition-colors hover:bg-amber-100/60 sm:w-auto"
              >
                {t("hero.cta.story")}
                <ChevronDown className="h-4 w-4" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex items-center justify-center gap-6 text-sm text-foreground/60 lg:justify-start"
            >
              <span>
                <strong className="font-bold text-ember">30</strong>{" "}
                {t("hero.stats.children")}
              </span>
              <span className="h-4 w-px bg-border" />
              <span>
                <strong className="font-bold text-ember">3</strong>{" "}
                {t("hero.stats.orphanages")}
              </span>
              <span className="h-4 w-px bg-border" />
              <span>
                <strong className="font-bold text-ember">1</strong>{" "}
                {t("hero.stats.vow")}
              </span>
            </motion.div>
          </div>

          {/* Right — the real house (Rumah Buah Hati, Bantul) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mx-auto max-w-md"
          >
            <div className="relative overflow-hidden rounded-sm border border-amber-900/30 shadow-2xl aged-edge">
              <img
                src="/images/house-real-street.png"
                alt={
                  lang === "id"
                    ? "Rumah Buah Hati yang nyata di Bantul, Yogyakarta — rumah bagi 30 anak yatim"
                    : "The real Rumah Buah Hati in Bantul, Yogyakarta — home to 30 fatherless children"
                }
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-950/70 via-amber-950/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-im-fell text-lg italic text-amber-50 text-shadow-soft">
                  {t("hero.bibleVerse")}
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-amber-200/80">
                  {t("hero.bibleRef")}
                </p>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-amber-200/70">
                  {lang === "id"
                    ? "Rumah yang nyata di Bantul"
                    : "The real house, in Bantul"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
