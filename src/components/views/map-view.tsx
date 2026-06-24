"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Home, Heart, Navigation, ExternalLink } from "lucide-react";
import { ORPHANAGES, type Orphanage, type ViewName } from "@/lib/data";
import { useLanguage, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { AksaraName } from "@/components/aksara-name";

// Approx. marker positions on the stylized Java map SVG (viewBox 0 0 800 220)
const POSITIONS: Record<string, { x: number; y: number }> = {
  bantul: { x: 300, y: 150 },
  semarang: { x: 360, y: 120 },
  surabaya: { x: 600, y: 135 },
};

export function MapView({
  onNavigate,
}: {
  onNavigate: (v: ViewName) => void;
}) {
  const t = useT();
  const lang = useLanguage((s) => s.lang);
  const [active, setActive] = useState<string>(ORPHANAGES[0].id);
  const activeOrphan = ORPHANAGES.find((o) => o.id === active)!;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="parchment-bg relative">
        <div className="absolute inset-0 bg-background/40" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-3 max-w-2xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-800/30 bg-amber-100/40 px-4 py-1.5 text-sm font-medium text-amber-900">
              <Navigation className="h-4 w-4" />
              {t("map.badge")}
            </div>
            <h1 className="font-blackletter text-4xl leading-tight text-ember sm:text-5xl">
              {t("map.heading")}
            </h1>
            <p className="mt-4 font-im-fell text-lg italic text-foreground/70">
              {t("map.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20">
        {/* The antique map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="parchment-card aged-edge relative overflow-hidden rounded-sm border border-amber-900/30 p-4 shadow-xl sm:p-6"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-blackletter text-2xl text-ember">
              {t("map.isleTitle")}
            </h2>
            <span className="hidden font-im-fell text-sm italic text-foreground/50 sm:inline">
              {t("map.note")}
            </span>
          </div>
          <JavaMap active={active} onSelect={setActive} lang={lang} />
        </motion.div>

        {/* Active orphanage detail + selector cards */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeOrphan.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
              >
                <OrphanageDetail
                  orphanage={activeOrphan}
                  onNavigate={onNavigate}
                  lang={lang}
                  t={t}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-3">
            <h3 className="font-garamond text-lg font-bold text-foreground/70">
              {t("map.allLocations")}
            </h3>
            {ORPHANAGES.map((o) => (
              <button
                key={o.id}
                onClick={() => setActive(o.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all",
                  active === o.id
                    ? "border-amber-700/40 bg-amber-700/10"
                    : "border-border bg-card hover:border-amber-700/30"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
                    active === o.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-foreground">
                    {o.name[lang]}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {o.location[lang]}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type TFunc = (k: string) => string;

function JavaMap({
  active,
  onSelect,
  lang,
}: {
  active: string;
  onSelect: (id: string) => void;
  lang: "en" | "id";
}) {
  return (
    <svg
      viewBox="0 0 800 220"
      className="h-auto w-full"
      role="img"
      aria-label={
        lang === "id"
          ? "Peta Jawa menampilkan tiga lokasi panti asuhan"
          : "Map of Java showing three orphanage locations"
      }
    >
      {/* Sea background */}
      <rect width="800" height="220" fill="oklch(0.86 0.05 70)" />
      {/* Sea hatching */}
      <g stroke="oklch(0.70 0.05 65)" strokeWidth="0.4" opacity="0.4">
        {Array.from({ length: 30 }).map((_, i) => (
          <line key={i} x1={i * 30} y1={220} x2={i * 30 + 60} y2={0} />
        ))}
      </g>

      {/* Java island — elongated shape */}
      <path
        d="M70,130 Q120,105 180,115 Q260,100 340,120 Q420,105 520,118 Q620,108 700,128 Q730,135 720,150 Q620,165 520,155 Q420,165 340,152 Q260,160 180,150 Q120,158 80,150 Z"
        fill="oklch(0.74 0.08 68)"
        stroke="oklch(0.45 0.07 58)"
        strokeWidth="1.5"
      />
      {/* Mountain ridges */}
      <g fill="oklch(0.62 0.08 65)" opacity="0.6">
        <path d="M200,120 L215,108 L230,120 Z" />
        <path d="M340,118 L358,104 L376,118 Z" />
        <path d="M500,120 L518,106 L536,120 Z" />
        <path d="M620,122 L636,110 L652,122 Z" />
      </g>

      {/* City labels */}
      <text x="230" y="180" className="font-im-fell" fontSize="11" fill="oklch(0.40 0.05 55)">
        Jakarta
      </text>
      <text x="710" y="170" className="font-im-fell" fontSize="11" fill="oklch(0.40 0.05 55)">
        Bali →
      </text>

      {/* Compass rose */}
      <g transform="translate(740,40)">
        <circle r="22" fill="none" stroke="oklch(0.40 0.05 55)" strokeWidth="0.8" />
        <path d="M0,-20 L4,0 L0,20 L-4,0 Z" fill="oklch(0.40 0.05 55)" />
        <text x="0" y="-26" textAnchor="middle" fontSize="9" className="font-im-fell" fill="oklch(0.40 0.05 55)">N</text>
      </g>

      {/* Markers */}
      {ORPHANAGES.map((o) => {
        const pos = POSITIONS[o.id];
        const isActive = active === o.id;
        return (
          <g
            key={o.id}
            transform={`translate(${pos.x},${pos.y})`}
            className="cursor-pointer"
            onClick={() => onSelect(o.id)}
          >
            {/* pulse */}
            {isActive && (
              <motion.circle
                r="18"
                fill="oklch(0.72 0.16 60)"
                fillOpacity="0.2"
                animate={{ r: [14, 24, 14], opacity: [0.5, 0.05, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <circle
              r={isActive ? 9 : 7}
              fill={isActive ? "oklch(0.62 0.18 45)" : "oklch(0.55 0.12 55)"}
              stroke="oklch(0.98 0.04 75)"
              strokeWidth="2"
            />
            <circle r="3" fill="oklch(0.98 0.04 75)" />
            {/* label */}
            <text
              y={-16}
              textAnchor="middle"
              fontSize="11"
              className="font-im-fell"
              fontWeight="bold"
              fill="oklch(0.30 0.05 55)"
            >
              {o.location[lang].split(",")[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function OrphanageDetail({
  orphanage,
  onNavigate,
  lang,
  t,
}: {
  orphanage: Orphanage;
  onNavigate: (v: ViewName) => void;
  lang: "en" | "id";
  t: TFunc;
}) {
  return (
    <div className="parchment-card aged-edge overflow-hidden rounded-sm border border-amber-900/20 shadow-sm">
      <div className="relative h-56 overflow-hidden sm:h-64">
        { }
        <img
          src={orphanage.image}
          alt={`${orphanage.name[lang]} in ${orphanage.location[lang]}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-amber-50">
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-700/40 px-2.5 py-1 text-xs font-medium backdrop-blur">
            <MapPin className="h-3 w-3" /> {orphanage.region[lang]}
          </span>
          <h3 className="mt-2 font-garamond text-2xl font-bold sm:text-3xl">
            {orphanage.name[lang]}
          </h3>
          <p className="text-sm text-amber-100/80">{orphanage.location[lang]}</p>
          {orphanage.aksaraJawa && orphanage.fullName && (
            <p className="mt-2 font-javanese text-lg leading-tight text-amber-100/90">
              {orphanage.aksaraJawa}
            </p>
          )}
        </div>
      </div>
      <div className="p-6">
        <div className="mb-4 flex flex-wrap gap-4">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-700/10 px-3 py-1.5 text-sm font-semibold text-ember">
            <Users className="h-4 w-4" /> {orphanage.children} {t("map.children")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground">
            <Home className="h-4 w-4" /> {orphanage.established[lang]}
          </span>
        </div>
        <p className="font-im-fell text-[1.05rem] leading-relaxed text-foreground/80">
          {orphanage.story[lang]}
        </p>
        <div className="mt-4 rounded-lg border border-amber-800/20 bg-amber-50/40 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-900/70">
            {t("map.presentCondition")}
          </p>
          <p className="mt-1 font-im-fell text-[1rem] italic leading-relaxed text-foreground/75">
            {orphanage.condition[lang]}
          </p>
        </div>

        {/* Full name + Aksara Jawa + full address (when available) */}
        {orphanage.fullName && orphanage.aksaraJawa && (
          <div className="mt-4 rounded-lg border border-amber-900/20 bg-background/50 p-4">
            <div className="flex flex-col items-center gap-1 sm:flex-row sm:items-start sm:gap-4">
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-900/70">
                  {t("map.fullName")}
                </p>
                <p className="mt-0.5 font-garamond text-base font-bold text-foreground">
                  {orphanage.fullName[lang]}
                </p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-900/70">
                  {t("map.aksaraJawa")}
                </p>
                <p className="mt-0.5 font-javanese text-xl leading-tight text-ember">
                  {orphanage.aksaraJawa}
                </p>
              </div>
            </div>
            {orphanage.fullAddress && (
              <div className="mt-3 border-t border-amber-900/15 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-900/70">
                  {t("map.address")}
                </p>
                <p className="mt-0.5 font-im-fell text-[0.95rem] italic leading-relaxed text-foreground/75">
                  {orphanage.fullAddress}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Google Maps embed + open-in-maps link (when available) */}
        {orphanage.mapsEmbedUrl && (
          <div className="mt-4 overflow-hidden rounded-lg border border-amber-900/20">
            <iframe
              title={`${orphanage.name[lang]} — Google Maps`}
              src={orphanage.mapsEmbedUrl}
              className="h-64 w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {orphanage.mapsLinkUrl && (
              <a
                href={orphanage.mapsLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-amber-700/10 px-4 py-2.5 text-sm font-semibold text-ember transition-colors hover:bg-amber-700/20"
              >
                <ExternalLink className="h-4 w-4" />
                {t("map.openInMaps")}
              </a>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => onNavigate("donation")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.03]"
          >
            <Heart className="h-4 w-4" /> {t("map.give")}
          </button>
          <button
            onClick={() => onNavigate("calendar")}
            className="inline-flex items-center gap-2 rounded-full border border-amber-800/40 bg-amber-50/50 px-5 py-2.5 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-100/60"
          >
            <Users className="h-4 w-4" /> {t("map.schedule")}
          </button>
          <button
            onClick={() => onNavigate("gallery")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground/80 transition-colors hover:bg-muted"
          >
            {t("map.gallery")}
          </button>
        </div>
      </div>
    </div>
  );
}
