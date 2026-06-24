"use client";

import { motion } from "framer-motion";
import {
  HandCoins,
  HandHeart,
  HeartHandshake,
  Calendar,
  Gift,
  type LucideIcon,
} from "lucide-react";
import { HELP_OPTIONS, type ViewName } from "@/lib/data";
import { useLanguage, useT } from "@/lib/i18n";

const ICONS: Record<string, LucideIcon> = {
  HandCoins,
  HandHeart,
  HeartHandshake,
};

export function WaysToHelp({
  onNavigate,
}: {
  onNavigate: (v: ViewName) => void;
}) {
  const t = useT();
  const lang = useLanguage((s) => s.lang);

  return (
    <section id="help" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="font-blackletter text-4xl leading-tight text-ember sm:text-5xl">
            {t("help.heading")}
          </h2>
          <p className="mt-4 font-im-fell text-lg italic text-foreground/70">
            {t("help.subtitle")}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {HELP_OPTIONS.map((opt, idx) => {
            const Icon = ICONS[opt.icon] ?? HandHeart;
            const target: ViewName =
              opt.id === "financial"
                ? "donation"
                : opt.id === "physical"
                  ? "calendar"
                  : "calendar";
            return (
              <motion.article
                key={opt.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                className="parchment-card aged-edge group relative flex flex-col overflow-hidden rounded-sm border border-amber-900/20 p-7 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-amber-700/10 text-ember transition-transform group-hover:scale-110">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                  {t(`help.kind.${opt.kind}`)}
                </span>
                <h3 className="mt-1 font-garamond text-2xl font-bold">
                  {opt.title[lang]}
                </h3>
                <p className="mt-2 flex-1 font-im-fell text-[1.02rem] leading-relaxed text-foreground/75">
                  {opt.description[lang]}
                </p>
                <button
                  onClick={() => onNavigate(target)}
                  className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.03]"
                >
                  {opt.id === "financial" ? (
                    <>
                      <Gift className="h-4 w-4" /> {t("help.giveNow")}
                    </>
                  ) : opt.id === "physical" ? (
                    <>
                      <Calendar className="h-4 w-4" /> {t("help.scheduleVisit")}
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="h-4 w-4" /> {t("help.commitPray")}
                    </>
                  )}
                </button>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
