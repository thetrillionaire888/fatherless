"use client";

import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { BIBLE_VERSES } from "@/lib/data";
import { useLanguage, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function BibleScrolls() {
  const t = useT();
  const lang = useLanguage((s) => s.lang);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCount(api.scrollSnapList().length);
    };
    // Initialize + subscribe. setState happens inside the callback (not
    // synchronously in the effect body), which avoids cascading renders.
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Reset to first slide when language changes (so the user sees the
  // translated passage that matches the rest of the UI).
  useEffect(() => {
    if (api) api.scrollTo(0);
  }, [lang, api]);

  const scrollTo = useCallback(
    (idx: number) => {
      api?.scrollTo(idx);
    },
    [api]
  );

  return (
    <section id="scripture" className="relative py-20 sm:py-28">
      {/* Manuscript background */}
      <div className="parchment-bg absolute inset-0 aged-edge" />
      <div className="absolute inset-0 bg-background/30" />

      <div className="relative mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-700/30 bg-amber-100/40 px-4 py-1.5 text-sm font-medium text-amber-900">
            <BookOpen className="h-4 w-4" />
            {t("bible.badge")}
          </div>
          <h2 className="font-blackletter text-4xl leading-tight text-ember sm:text-5xl">
            {t("bible.heading")}
          </h2>
          <p className="mt-4 font-im-fell text-lg italic text-foreground/70">
            {t("bible.subtitle")}
          </p>
        </motion.div>

        <div className="relative">
          <Carousel
            opts={{ loop: true, align: "center" }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent>
              {BIBLE_VERSES.map((passage, idx) => (
                <CarouselItem key={passage.ref.en} className="basis-full">
                  <ScrollCard passage={passage} index={idx} lang={lang} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Themed prev/next controls */}
          <button
            onClick={() => api?.scrollPrev()}
            aria-label={t("bible.prev")}
            className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-amber-800/40 bg-amber-50/80 text-amber-900 shadow-md backdrop-blur transition-all hover:scale-110 hover:bg-amber-100 sm:-left-4"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            aria-label={t("bible.next")}
            className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-amber-800/40 bg-amber-50/80 text-amber-900 shadow-md backdrop-blur transition-all hover:scale-110 hover:bg-amber-100 sm:-right-4"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Counter + dot indicators */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: count }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(idx)}
                aria-label={`${t("bible.counter")} ${idx + 1}`}
                className={cn(
                  "h-2.5 rounded-full transition-all",
                  current === idx + 1
                    ? "w-8 bg-ember"
                    : "w-2.5 bg-amber-800/25 hover:bg-amber-800/50"
                )}
              />
            ))}
          </div>
          <p className="font-im-fell text-sm italic text-foreground/55">
            {t("bible.counter")} {current} / {count}
          </p>
        </div>
      </div>
    </section>
  );
}

function ScrollCard({
  passage,
  index,
  lang,
}: {
  passage: (typeof BIBLE_VERSES)[number];
  index: number;
  lang: "en" | "id";
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="parchment-card aged-edge relative mx-auto max-w-2xl overflow-hidden rounded-sm border border-amber-900/20 p-7 shadow-[0_10px_40px_-12px_oklch(0.3_0.05_55_/_0.5)] sm:p-10"
    >
      {/* Decorative corner flourishes */}
      <div className="pointer-events-none absolute left-2 top-2 h-8 w-8 border-l-2 border-t-2 border-amber-800/30" />
      <div className="pointer-events-none absolute right-2 top-2 h-8 w-8 border-r-2 border-t-2 border-amber-800/30" />
      <div className="pointer-events-none absolute bottom-2 left-2 h-8 w-8 border-b-2 border-l-2 border-amber-800/30" />
      <div className="pointer-events-none absolute bottom-2 right-2 h-8 w-8 border-b-2 border-r-2 border-amber-800/30" />

      <header className="mb-5 border-b border-amber-900/20 pb-4 text-center">
        <h3 className="font-blackletter text-3xl leading-none text-ember sm:text-4xl">
          {passage.title[lang]}
        </h3>
        <p className="mt-1.5 font-im-fell text-sm uppercase tracking-[0.2em] text-foreground/60">
          {passage.ref[lang]}
        </p>
      </header>

      <div className="mx-auto max-w-xl space-y-3 font-im-fell text-[1.1rem] leading-relaxed text-foreground/85">
        {passage.verses.map((v, i) => (
          <p key={i} className={i === 0 ? "drop-cap" : undefined}>
            <sup className="mr-1 text-xs font-semibold text-ember/70">
              {v.num[lang]}
            </sup>
            {v.text[lang]}
          </p>
        ))}
      </div>
    </motion.article>
  );
}
