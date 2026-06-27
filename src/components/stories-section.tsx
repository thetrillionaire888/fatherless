"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, HandHeart, Baby, Camera, Users, Loader2 } from "lucide-react";
import { STORIES, type Story } from "@/lib/data";
import { useLanguage, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { StoryRecord } from "@/lib/stories";

// Map a CMS record to the minimal Story shape the cards consume.
function toStory(r: StoryRecord): Story {
  return {
    id: r.id,
    perspective: r.perspective,
    title: r.title,
    subtitle: r.subtitle,
    body: r.body,
    image: r.image,
    highlight: r.highlight,
  };
}

export function StoriesSection() {
  const t = useT();
  const lang = useLanguage((s) => s.lang);
  const [stories, setStories] = useState<Story[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stories?placement=stories", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (cancelled) return;
        const list: Story[] = (data.stories ?? []).map(toStory);
        setStories(list.length ? list : STORIES);
      })
      .catch(() => {
        if (!cancelled) setStories(STORIES);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stories) {
    return (
      <section id="stories" className="relative py-20 sm:py-28">
        <div className="flex items-center justify-center text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      </section>
    );
  }

  const main = stories.filter((s) => s.highlight);
  const nonHighlight = stories.filter((s) => !s.highlight);
  // The narrative trio: first three non-highlight stories (was hardcoded by id).
  const trio = nonHighlight.slice(0, 3);
  const voices = nonHighlight.slice(3);

  return (
    <section id="stories" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <Quote className="h-4 w-4" />
            {t("stories.badge")}
          </div>
          <h2 className="font-blackletter text-4xl leading-tight text-ember sm:text-5xl">
            {t("stories.heading")}
          </h2>
          <p className="mt-4 font-im-fell text-lg italic text-foreground/70">
            {t("stories.subtitle")}
          </p>
        </motion.div>

        {/* Highlighted main stories */}
        <div className="grid gap-8">
          {main.map((story, idx) => (
            <MainStoryCard key={story.id} story={story} index={idx} lang={lang} t={t} />
          ))}
        </div>

        {/* Narrative trio — first three non-highlight stories */}
        {trio.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {trio.map((story, idx) => (
              <TrioCard key={story.id} story={story} index={idx} lang={lang} t={t} />
            ))}
          </div>
        )}

        {/* Multi-perspective voices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-20 text-center"
        >
          <h3 className="font-blackletter text-3xl text-ember sm:text-4xl">
            {t("stories.perspectives.heading")}
          </h3>
          <p className="mt-3 font-im-fell text-lg italic text-foreground/70">
            {t("stories.perspectives.subtitle")}
          </p>
        </motion.div>

        {voices.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {voices.map((story, idx) => (
              <VoiceCard key={story.id} story={story} index={idx} lang={lang} t={t} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type TFunc = (k: string) => string;

function MainStoryCard({
  story,
  index,
  lang,
  t,
}: {
  story: Story;
  index: number;
  lang: "en" | "id";
  t: TFunc;
}) {
  const ps = PERSPECTIVE_STYLE[story.perspective];
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={cn(
        "parchment-card aged-edge relative grid overflow-hidden rounded-sm border border-amber-900/20 shadow-[0_10px_40px_-12px_oklch(0.3_0.05_55_/_0.4)]",
        "md:grid-cols-2"
      )}
    >
      {story.image && (
        <div className="relative min-h-[220px] overflow-hidden md:min-h-full">
          { }
          <img
            src={story.image}
            alt={story.title[lang]}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 to-transparent md:bg-gradient-to-r" />
        </div>
      )}
      <div className="p-7 sm:p-9">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
            ps.cls
          )}
        >
          {t(`stories.perspective.${story.perspective}`)}
        </span>
        <h3 className="mt-4 font-garamond text-2xl font-bold leading-snug text-foreground sm:text-3xl">
          {story.title[lang]}
        </h3>
        <p className="mt-2 font-im-fell text-lg italic text-ember">
          {story.subtitle[lang]}
        </p>
        <div className="mt-4 space-y-3 font-im-fell text-[1.02rem] leading-relaxed text-foreground/80">
          {story.body.map((para, i) => (
            <p key={i}>{para[lang]}</p>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function TrioCard({
  story,
  index,
  lang,
  t,
}: {
  story: Story;
  index: number;
  lang: "en" | "id";
  t: TFunc;
}) {
  const ps = PERSPECTIVE_STYLE[story.perspective];
  // Pick an icon by perspective (was previously keyed to hardcoded story ids).
  const icon =
    story.perspective === "Caregiver" ? (
      <HandHeart className="h-5 w-5" />
    ) : story.perspective === "Child" ? (
      <Baby className="h-5 w-5" />
    ) : story.perspective === "Field" ? (
      <Camera className="h-5 w-5" />
    ) : (
      <HandHeart className="h-5 w-5" />
    );
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="parchment-card aged-edge flex flex-col rounded-sm border border-amber-900/20 p-6 shadow-sm"
    >
      <div className="mb-3 flex items-center gap-2 text-ember">
        {icon}
        <span
          className={cn(
            "inline-flex rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider",
            ps.cls
          )}
        >
          {t(`stories.perspective.${story.perspective}`)}
        </span>
      </div>
      <h4 className="font-garamond text-xl font-bold leading-snug">
        {story.title[lang]}
      </h4>
      <p className="mt-1.5 font-im-fell text-base italic text-ember">
        {story.subtitle[lang]}
      </p>
      <div className="mt-3 space-y-2.5 font-im-fell text-[0.97rem] leading-relaxed text-foreground/80">
        {story.body.map((para, i) => (
          <p key={i}>{para[lang]}</p>
        ))}
      </div>
    </motion.article>
  );
}

function VoiceCard({
  story,
  index,
  lang,
  t,
}: {
  story: Story;
  index: number;
  lang: "en" | "id";
  t: TFunc;
}) {
  const ps = PERSPECTIVE_STYLE[story.perspective];
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex flex-col rounded-sm border border-border bg-card p-6 shadow-sm"
    >
      <Users className="absolute right-4 top-4 h-5 w-5 text-muted-foreground/40" />
      <span
        className={cn(
          "inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider",
          ps.cls
        )}
      >
        {t(`stories.perspective.${story.perspective}`)}
      </span>
      <h4 className="mt-4 font-garamond text-xl font-bold leading-snug">
        {story.title[lang]}
      </h4>
      <p className="mt-1.5 font-im-fell text-base italic text-foreground/60">
        {story.subtitle[lang]}
      </p>
      <div className="mt-3 space-y-2.5 font-im-fell text-[0.97rem] leading-relaxed text-foreground/80">
        {story.body.map((para, i) => (
          <p key={i}>{para[lang]}</p>
        ))}
      </div>
    </motion.article>
  );
}

const PERSPECTIVE_STYLE: Record<
  Story["perspective"],
  { cls: string }
> = {
  Caregiver: { cls: "bg-amber-700/15 text-amber-900 border-amber-700/30" },
  Child: { cls: "bg-rose-700/15 text-rose-900 border-rose-700/30" },
  Donor: { cls: "bg-emerald-800/15 text-emerald-900 border-emerald-800/30" },
  Field: { cls: "bg-stone-700/15 text-stone-800 border-stone-700/30" },
};
