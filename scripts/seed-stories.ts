/**
 * One-time seed: imports the existing hardcoded STORIES (from src/lib/data.ts)
 * and the gallery ITEMS (from src/components/views/gallery-view.tsx) into the
 * new `Story` database table, so the CMS starts with the site's current content.
 *
 * Run with:  bun run scripts/seed-stories.ts
 *
 * Idempotent: if a story with the same legacy id-slug already exists (matched
 * by titleEn), it is skipped. Gallery items are seeded as separate rows with
 * showInGallery=true, showInStories=false.
 */
import { db } from "../src/lib/db";
import { STORIES } from "../src/lib/data";

// Gallery items are not exported from the view, so we re-declare the seed data
// here (kept in sync with gallery-view.tsx at seed time).
type GallerySeed = {
  src: string;
  title: { en: string; id: string };
  caption: { en: string; id: string };
  orphanageId: string;
  tag: { en: string; id: string };
};

const GALLERY_SEED: GallerySeed[] = [
  {
    src: "/images/house-real-street.png",
    title: { en: "The real house, in Bantul", id: "Rumah yang nyata, di Bantul" },
    caption: {
      en: "Yayasan Rumah Buah Hati — the actual modest home where Mrs Telly keeps her vow. Thirty fatherless children sleep under this roof tonight.",
      id: "Yayasan Rumah Buah Hati — rumah sederhana yang nyata tempat Ibu Telly menepati janjinya. Tiga puluh anak yatim tidur di bawah atap ini malam ini.",
    },
    orphanageId: "bantul",
    tag: { en: "Bantul, Yogyakarta", id: "Bantul, Yogyakarta" },
  },
  {
    src: "/images/house-real-facade.png",
    title: { en: "The sign at the gate", id: "Papan nama di gerbang" },
    caption: {
      en: "The sign reads 'Panti Asuhan Anak Yatim Piatu & Terlantar' — a shelter for orphaned and abandoned children. Behind this gate, thirty small lives are kept in the faith the state would take from them.",
      id: "Papan nama bertuliskan 'Panti Asuhan Anak Yatim Piatu & Terlantar'. Di balik gerbang ini, tiga puluh kehidupan kecil dijaga dalam iman yang ingin diambil negara dari mereka.",
    },
    orphanageId: "bantul",
    tag: { en: "The sign", id: "Papan nama" },
  },
  {
    src: "/images/children-hands.png",
    title: { en: "Hands joined at sundown", id: "Tangan yang terkatup saat senja" },
    caption: {
      en: "The children gather each evening to pray together — for the rice that ran low, for the mama who never sleeps, for the fathers they never knew.",
      id: "Anak-anak berkumpul setiap malam untuk berdoa bersama — untuk beras yang menipis, untuk mama yang tak pernah tidur, untuk ayah yang tak pernah mereka kenal.",
    },
    orphanageId: "bantul",
    tag: { en: "Evening prayer", id: "Doa malam" },
  },
  {
    src: "/images/candle-hope.png",
    title: { en: "A candle in the dark", id: "Lilin dalam kegelapan" },
    caption: {
      en: "When the power is cut for unpaid bills, a single candle lights the children's homework. Hope burns longer than the wick.",
      id: "Ketika listrik diputus karena tagihan belum dibayar, satu lilin menerangi pekerjaan rumah anak-anak. Harapan menyala lebih lama dari sumbunya.",
    },
    orphanageId: "bantul",
    tag: { en: "Daily life", id: "Kehidupan sehari-hari" },
  },
  {
    src: "/images/orphanage-surabaya.png",
    title: { en: "The weathered house in East Java", id: "Rumah yang lapuk di Jawa Timur" },
    caption: {
      en: "Near Makam Kembang Kuning, Surabaya, a peeling-walled home receives infants abandoned at dawn. Volunteers keep watch in shifts.",
      id: "Di dekat Makam Kembang Kuning, Surabaya, rumah berdinding mengelupas menerima bayi yang ditinggalkan saat fajar. Relawan bergiliran menjaga.",
    },
    orphanageId: "surabaya",
    tag: { en: "Surabaya", id: "Surabaya" },
  },
  {
    src: "/images/open-bible.png",
    title: { en: "The one Book they share", id: "Satu Kitab yang mereka bagikan" },
    caption: {
      en: "One King James Bible, read aloud each morning, is the wall that keeps these children in the faith the state would take from them.",
      id: "Satu Alkitab Terjemahan Baru, dibacakan setiap pagi, adalah dinding yang menjaga anak-anak ini dalam iman yang ingin diambil negara dari mereka.",
    },
    orphanageId: "bantul",
    tag: { en: "Faith", id: "Iman" },
  },
  {
    src: "/images/offering-hands.png",
    title: { en: "What a visit looks like", id: "Seperti apa sebuah kunjungan" },
    caption: {
      en: "Not cameras — but hands. Rice, books, a repaired roof, an hour of holding a child. This is the help that reaches them.",
      id: "Bukan kamera — melainkan tangan. Beras, buku, atap yang diperbaiki, sejam menggendong anak. Inilah bantuan yang sampai kepada mereka.",
    },
    orphanageId: "semarang",
    tag: { en: "Visiting", id: "Berkunjung" },
  },
  {
    src: "/images/scroll-bg.png",
    title: { en: "The promise on parchment", id: "Janji di atas perkamen" },
    caption: {
      en: "Above the doorway, the vow is written: 'Pure religion and undefiled is to visit the fatherless in their affliction.' James 1:27.",
      id: "Di atas pintu, janji itu tertulis: 'Ibadah yang murni dan tak bernoda adalah mengunjungi yatim piatu dalam kesusahan mereka.' Yakobus 1:27.",
    },
    orphanageId: "bantul",
    tag: { en: "The vow", id: "Janji" },
  },
  {
    src: "/images/globe-cries.png",
    title: { en: "One cry among millions", id: "Satu jeritan di antara jutaan" },
    caption: {
      en: "Across the turning earth the fatherless cry for help. Here, in one small house in Indonesia, the cry is heard.",
      id: "Melintasi bumi yang berputar anak yatim berseru minta tolong. Di sini, di satu rumah kecil di Indonesia, jeritan itu didengar.",
    },
    orphanageId: "bantul",
    tag: { en: "The world", id: "Dunia" },
  },
];

async function main() {
  console.log("[seed-stories] starting...");
  const existing = await db.story.count();
  if (existing > 0) {
    console.log(
      `[seed-stories] table already has ${existing} rows — skipping seed (idempotent).`,
    );
    return;
  }

  let idx = 0;
  // 1) Seed the stories-section content.
  for (const s of STORIES) {
    idx += 1;
    await db.story.create({
      data: {
        titleEn: s.title.en,
        titleId: s.title.id,
        subtitleEn: s.subtitle.en,
        subtitleId: s.subtitle.id,
        body: JSON.stringify(s.body),
        image: s.image ?? "",
        perspective: s.perspective,
        originalLang: "en",
        status: "published",
        showInStories: true,
        showInGallery: false,
        highlight: Boolean(s.highlight),
        sortIndex: idx,
      },
    });
  }
  console.log(`[seed-stories] inserted ${STORIES.length} stories.`);

  // 2) Seed the gallery content as separate rows.
  for (const g of GALLERY_SEED) {
    idx += 1;
    await db.story.create({
      data: {
        titleEn: g.title.en,
        titleId: g.title.id,
        subtitleEn: "",
        subtitleId: "",
        body: "[]",
        captionEn: g.caption.en,
        captionId: g.caption.id,
        tagEn: g.tag.en,
        tagId: g.tag.id,
        orphanageId: g.orphanageId,
        image: g.src,
        perspective: "Field",
        originalLang: "en",
        status: "published",
        showInStories: false,
        showInGallery: true,
        highlight: false,
        sortIndex: idx,
      },
    });
  }
  console.log(`[seed-stories] inserted ${GALLERY_SEED.length} gallery items.`);
  console.log("[seed-stories] done.");
}

main()
  .catch((e) => {
    console.error("[seed-stories] FAILED:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
