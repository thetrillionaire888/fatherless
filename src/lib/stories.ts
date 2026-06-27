import type { Localized } from "@/lib/data";

// ---- Story CMS shared contract (API <-> frontend) ----
// Mirrors the Prisma `Story` model but in the shape the frontend consumes.

export type StoryPerspective = "Caregiver" | "Child" | "Donor" | "Field";
export type StoryStatus = "published" | "archived" | "hidden";
export type StoryLang = "en" | "id";

export type StoryRecord = {
  id: string;
  title: Localized;
  subtitle: Localized;
  body: Localized[];
  caption: Localized;
  tag: Localized;
  orphanageId: string;
  image: string;
  perspective: StoryPerspective;
  originalLang: StoryLang;
  status: StoryStatus;
  showInStories: boolean;
  showInGallery: boolean;
  highlight: boolean;
  sortIndex: number;
  createdAt: string;
  updatedAt: string;
};

// ---- DB row <-> record mapping ----
// The Prisma `body` column is a JSON string of `Localized[]`.
export function storyRowToRecord(row: {
  id: string;
  titleEn: string;
  titleId: string;
  subtitleEn: string;
  subtitleId: string;
  body: string;
  captionEn: string;
  captionId: string;
  tagEn: string;
  tagId: string;
  orphanageId: string;
  image: string;
  perspective: string;
  originalLang: string;
  status: string;
  showInStories: boolean;
  showInGallery: boolean;
  highlight: boolean;
  sortIndex: number;
  createdAt: Date;
  updatedAt: Date;
}): StoryRecord {
  let body: Localized[] = [];
  try {
    const parsed = JSON.parse(row.body || "[]");
    if (Array.isArray(parsed)) {
      body = parsed
        .filter(
          (p): p is Localized =>
            p && typeof p === "object" && "en" in p && "id" in p,
        )
        .map((p) => ({ en: String(p.en ?? ""), id: String(p.id ?? "") }));
    }
  } catch {
    body = [];
  }
  return {
    id: row.id,
    title: { en: row.titleEn, id: row.titleId },
    subtitle: { en: row.subtitleEn, id: row.subtitleId },
    body,
    caption: { en: row.captionEn, id: row.captionId },
    tag: { en: row.tagEn, id: row.tagId },
    orphanageId: row.orphanageId,
    image: row.image,
    perspective: (row.perspective as StoryPerspective) || "Field",
    originalLang: (row.originalLang as StoryLang) || "en",
    status: (row.status as StoryStatus) || "published",
    showInStories: row.showInStories,
    showInGallery: row.showInGallery,
    highlight: row.highlight,
    sortIndex: row.sortIndex,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const PERSPECTIVES: StoryPerspective[] = [
  "Caregiver",
  "Child",
  "Donor",
  "Field",
];
export const STORY_STATUSES: StoryStatus[] = [
  "published",
  "archived",
  "hidden",
];
