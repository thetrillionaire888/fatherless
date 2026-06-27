"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Images, MapPin, X, Heart, Loader2 } from "lucide-react";
import { ORPHANAGES, type ViewName } from "@/lib/data";
import { useLanguage, useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StoryRecord } from "@/lib/stories";

// Map a CMS record to the gallery item shape this view renders.
function toGalleryItem(r: StoryRecord): GalleryItem {
  return {
    id: r.id,
    src: r.image,
    title: r.title,
    caption: r.caption,
    orphanageId: r.orphanageId,
    tag: r.tag,
  };
}

type GalleryItem = {
  id: string;
  src: string;
  title: { en: string; id: string };
  caption: { en: string; id: string };
  orphanageId: string;
  tag: { en: string; id: string };
};

const ITEMS: GalleryItem[] = [
  {
    id: "g1",
    src: "/images/house-real-street.png",
    title: {
      en: "The real house, in Bantul",
      id: "Rumah yang nyata, di Bantul",
    },
    caption: {
      en: "Yayasan Rumah Buah Hati — the actual modest home where Mrs Telly keeps her vow. Thirty fatherless children sleep under this roof tonight.",
      id: "Yayasan Rumah Buah Hati — rumah sederhana yang nyata tempat Ibu Telly menepati janjinya. Tiga puluh anak yatim tidur di bawah atap ini malam ini.",
    },
    orphanageId: "bantul",
    tag: { en: "Bantul, Yogyakarta", id: "Bantul, Yogyakarta" },
  },
  {
    id: "g2",
    src: "/images/house-real-facade.png",
    title: {
      en: "The sign at the gate",
      id: "Papan nama di gerbang",
    },
    caption: {
      en: "The sign reads 'Panti Asuhan Anak Yatim Piatu & Terlantar' — a shelter for orphaned and abandoned children. Behind this gate, thirty small lives are kept in the faith the state would take from them.",
      id: "Papan nama bertuliskan 'Panti Asuhan Anak Yatim Piatu & Terlantar'. Di balik gerbang ini, tiga puluh kehidupan kecil dijaga dalam iman yang ingin diambil negara dari mereka.",
    },
    orphanageId: "bantul",
    tag: { en: "The sign", id: "Papan nama" },
  },
  {
    id: "g3",
    src: "/images/children-hands.png",
    title: {
      en: "Hands joined at sundown",
      id: "Tangan yang terkatup saat senja",
    },
    caption: {
      en: "The children gather each evening to pray together — for the rice that ran low, for the mama who never sleeps, for the fathers they never knew.",
      id: "Anak-anak berkumpul setiap malam untuk berdoa bersama — untuk beras yang menipis, untuk mama yang tak pernah tidur, untuk ayah yang tak pernah mereka kenal.",
    },
    orphanageId: "bantul",
    tag: { en: "Evening prayer", id: "Doa malam" },
  },
  {
    id: "g4",
    src: "/images/candle-hope.png",
    title: {
      en: "A candle in the dark",
      id: "Lilin dalam kegelapan",
    },
    caption: {
      en: "When the power is cut for unpaid bills, a single candle lights the children's homework. Hope burns longer than the wick.",
      id: "Ketika listrik diputus karena tagihan belum dibayar, satu lilin menerangi pekerjaan rumah anak-anak. Harapan menyala lebih lama dari sumbunya.",
    },
    orphanageId: "bantul",
    tag: { en: "Daily life", id: "Kehidupan sehari-hari" },
  },
  {
    id: "g5",
    src: "/images/orphanage-surabaya.png",
    title: {
      en: "The weathered house in East Java",
      id: "Rumah yang lapuk di Jawa Timur",
    },
    caption: {
      en: "Near Makam Kembang Kuning, Surabaya, a peeling-walled home receives infants abandoned at dawn. Volunteers keep watch in shifts.",
      id: "Di dekat Makam Kembang Kuning, Surabaya, rumah berdinding mengelupas menerima bayi yang ditinggalkan saat fajar. Relawan bergiliran menjaga.",
    },
    orphanageId: "surabaya",
    tag: { en: "Surabaya", id: "Surabaya" },
  },
  {
    id: "g6",
    src: "/images/open-bible.png",
    title: {
      en: "The one Book they share",
      id: "Satu Kitab yang mereka bagikan",
    },
    caption: {
      en: "One King James Bible, read aloud each morning, is the wall that keeps these children in the faith the state would take from them.",
      id: "Satu Alkitab Terjemahan Baru, dibacakan setiap pagi, adalah dinding yang menjaga anak-anak ini dalam iman yang ingin diambil negara dari mereka.",
    },
    orphanageId: "bantul",
    tag: { en: "Faith", id: "Iman" },
  },
  {
    id: "g7",
    src: "/images/offering-hands.png",
    title: {
      en: "What a visit looks like",
      id: "Seperti apa sebuah kunjungan",
    },
    caption: {
      en: "Not cameras — but hands. Rice, books, a repaired roof, an hour of holding a child. This is the help that reaches them.",
      id: "Bukan kamera — melainkan tangan. Beras, buku, atap yang diperbaiki, sejam menggendong anak. Inilah bantuan yang sampai kepada mereka.",
    },
    orphanageId: "semarang",
    tag: { en: "Visiting", id: "Berkunjung" },
  },
  {
    id: "g8",
    src: "/images/scroll-bg.png",
    title: {
      en: "The promise on parchment",
      id: "Janji di atas perkamen",
    },
    caption: {
      en: "Above the doorway, the vow is written: 'Pure religion and undefiled is to visit the fatherless in their affliction.' James 1:27.",
      id: "Di atas pintu, janji itu tertulis: 'Ibadah yang murni dan tak bernoda adalah mengunjungi yatim piatu dalam kesusahan mereka.' Yakobus 1:27.",
    },
    orphanageId: "bantul",
    tag: { en: "The vow", id: "Janji" },
  },
  {
    id: "g9",
    src: "/images/globe-cries.png",
    title: {
      en: "One cry among millions",
      id: "Satu jeritan di antara jutaan",
    },
    caption: {
      en: "Across the turning earth the fatherless cry for help. Here, in one small house in Indonesia, the cry is heard.",
      id: "Melintasi bumi yang berputar anak yatim berseru minta tolong. Di sini, di satu rumah kecil di Indonesia, jeritan itu didengar.",
    },
    orphanageId: "bantul",
    tag: { en: "The world", id: "Dunia" },
  },
];

export function GalleryView({
  onNavigate,
}: {
  onNavigate: (v: ViewName) => void;
}) {
  const t = useT();
  const lang = useLanguage((s) => s.lang);
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [items, setItems] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stories?placement=gallery", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then((data) => {
        if (cancelled) return;
        const list: GalleryItem[] = (data.stories ?? []).map(toGalleryItem);
        setItems(list.length ? list : ITEMS);
      })
      .catch(() => {
        if (!cancelled) setItems(ITEMS);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen">
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
              <Images className="h-4 w-4" />
              {t("gallery.badge")}
            </div>
            <h1 className="font-blackletter text-4xl leading-tight text-ember sm:text-5xl">
              {t("gallery.heading")}
            </h1>
            <p className="mt-4 font-im-fell text-lg italic text-foreground/70">
              {t("gallery.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20">
        {/* Grid */}
        {!items ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item, idx) => {
            const span =
              idx === 0
                ? "col-span-2 row-span-2"
                : idx === 3
                  ? "col-span-2"
                  : "";
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (idx % 4) * 0.06 }}
                onClick={() => setLightbox(item)}
                className={cn(
                  "group relative overflow-hidden rounded-sm border border-amber-900/20 shadow-sm transition-shadow hover:shadow-lg",
                  span
                )}
              >
                { }
                <img
                  src={item.src}
                  alt={item.title[lang]}
                  className="aspect-square h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/80 via-amber-950/10 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <span className="inline-block rounded-full bg-amber-700/50 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider text-amber-50 backdrop-blur">
                    {item.tag[lang]}
                  </span>
                  <p className="mt-1.5 font-garamond text-sm font-bold text-amber-50 sm:text-base">
                    {item.title[lang]}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
        )}

        {/* Link to map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 rounded-sm border border-amber-900/20 bg-amber-50/40 p-6 text-center sm:p-8"
        >
          <MapPin className="mx-auto mb-3 h-8 w-8 text-ember" />
          <h3 className="font-garamond text-2xl font-bold">
            {t("gallery.openMapTitle")}
          </h3>
          <p className="mx-auto mt-2 max-w-xl font-im-fell text-base italic text-foreground/70">
            {t("gallery.openMapDesc")}
          </p>
          <Button
            onClick={() => onNavigate("map")}
            className="mt-5 gap-2"
            size="lg"
          >
            <MapPin className="h-4 w-4" /> {t("gallery.openMap")}
          </Button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-amber-950/80 p-4 backdrop-blur"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-sm border border-amber-900/40 bg-background shadow-2xl"
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-amber-950/60 text-amber-50 transition-colors hover:bg-amber-950/80"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              { }
              <img
                src={lightbox.src}
                alt={lightbox.title[lang]}
                className="max-h-[55vh] w-full object-cover"
              />
              <div className="p-5">
                <span className="inline-block rounded-full bg-amber-700/10 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-ember">
                  {lightbox.tag[lang]}
                </span>
                <h3 className="mt-2 font-garamond text-2xl font-bold">
                  {lightbox.title[lang]}
                </h3>
                <p className="mt-2 font-im-fell text-[1.02rem] italic leading-relaxed text-foreground/75">
                  {lightbox.caption[lang]}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => onNavigate("map")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-amber-800/40 bg-amber-50/50 px-4 py-2 text-sm font-semibold text-amber-900 transition-colors hover:bg-amber-100/60"
                  >
                    <MapPin className="h-4 w-4" /> {t("gallery.viewOnMap")}
                  </button>
                  <button
                    onClick={() => onNavigate("donation")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.03]"
                  >
                    <Heart className="h-4 w-4" /> {t("nav.give")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
