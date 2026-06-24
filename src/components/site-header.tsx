"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { type ViewName } from "@/lib/data";
import { useLanguage, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { LanguageToggle } from "@/components/language-toggle";
import { WhatsAppGlyph, buildWhatsAppUrl } from "@/components/whatsapp-button";

export function SiteHeader({
  view,
  onNavigate,
}: {
  view: ViewName;
  onNavigate: (v: ViewName) => void;
}) {
  const t = useT();
  const lang = useLanguage((s) => s.lang);
  const [open, setOpen] = useState(false);

  const NAV: { id: ViewName; label: string }[] = [
    { id: "home", label: t("nav.home") },
    { id: "calendar", label: t("nav.calendar") },
    { id: "map", label: t("nav.map") },
    { id: "gallery", label: t("nav.gallery") },
    { id: "donation", label: t("nav.donation") },
  ];

  const go = (v: ViewName) => {
    onNavigate(v);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-amber-900/20 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
        {/* Left: logo cluster — on mobile the Heart icon doubles as the menu
            toggle (integrated); the text wordmark goes home on click.
            On desktop the whole cluster is a "go home" button. */}
        <div className="flex flex-shrink-0 items-center gap-2.5">
          {/* Mobile: Heart = menu toggle. Desktop: Heart = go home. */}
          <button
            onClick={() =>
              typeof window !== "undefined" && window.innerWidth < 768
                ? setOpen((o) => !o)
                : go("home")
            }
            className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-transform group-hover:scale-110"
            aria-label={t("nav.menu")}
            aria-expanded={open}
          >
            {/* On desktop show Heart; on mobile show Menu/X */}
            <Heart className="hidden h-5 w-5 md:block" />
            <span className="md:hidden">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </span>
          </button>
          <button
            onClick={() => go("home")}
            className="group flex flex-col leading-none text-left"
            aria-label={t("nav.goHome")}
          >
            <span className="font-blackletter text-xl text-ember">
              {t("app.name")}
            </span>
            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
              {t("app.tagline")}
            </span>
          </button>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                view === item.id
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground"
              )}
            >
              {item.label}
              {view === item.id && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
          <LanguageToggle className="ml-1" />
          <a
            href={buildWhatsAppUrl(lang)}
            target="_blank"
            rel="noopener noreferrer"
            title={t("contact.whatsappTip")}
            aria-label={t("contact.whatsappTip")}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-amber-700/40 bg-amber-50/50 text-amber-900 shadow-sm transition-all hover:scale-110 hover:bg-amber-100/60"
          >
            <WhatsAppGlyph className="h-5 w-5" />
          </a>
          <button
            onClick={() => go("donation")}
            className="ml-1 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow transition-all hover:scale-[1.03]"
          >
            <Heart className="h-4 w-4" />
            {t("nav.give")}
          </button>
        </nav>

        {/* Mobile right cluster — now lighter (no hamburger here; it moved to
            the logo). Keeps only language + WhatsApp so it never overflows. */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageToggle />
          <a
            href={buildWhatsAppUrl(lang)}
            target="_blank"
            rel="noopener noreferrer"
            title={t("contact.whatsappTip")}
            aria-label={t("contact.whatsappTip")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-amber-700/40 bg-amber-50/50 text-amber-900 shadow-sm transition-all hover:scale-110 hover:bg-amber-100/60"
          >
            <WhatsAppGlyph className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Mobile nav drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-amber-900/15 bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => go(item.id)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-left text-base font-medium transition-colors",
                    view === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-muted"
                  )}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => go("donation")}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground"
              >
                <Heart className="h-5 w-5" />
                {t("nav.give")}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
