import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import {
  storyRowToRecord,
  type StoryPerspective,
  type StoryStatus,
  type StoryLang,
} from "@/lib/stories";

// GET /api/stories
//   Public list of PUBLISHED stories.
//   Query params (all optional):
//     placement=stories|gallery   — filter by showInStories / showInGallery
//     status=all                  — (admin only) include archived + hidden
//     perspective=Caregiver|...   — filter by perspective
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const placement = sp.get("placement"); // "stories" | "gallery" | null
    const includeAll = sp.get("status") === "all";
    const perspective = sp.get("perspective");

    // If "all" is requested, require admin.
    let isAdmin = false;
    if (includeAll) {
      const auth = await requireAdmin(req);
      if (!auth.ok) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      }
      isAdmin = true;
    }

    const where: {
      status?: string;
      showInStories?: boolean;
      showInGallery?: boolean;
      perspective?: string;
    } = {};

    if (!isAdmin) where.status = "published";
    if (placement === "stories") where.showInStories = true;
    if (placement === "gallery") where.showInGallery = true;
    if (perspective) where.perspective = perspective;

    const rows = await db.story.findMany({
      where,
      orderBy: [{ sortIndex: "asc" }, { createdAt: "desc" }],
    });

    const stories = rows.map(storyRowToRecord);
    return NextResponse.json({ stories });
  } catch (e) {
    console.error("[stories GET] error", e);
    return NextResponse.json(
      { error: "Failed to fetch stories." },
      { status: 500 },
    );
  }
}

// POST /api/stories  (admin only)
//   Create a new story. Body shape (all fields optional except a title):
//   {
//     titleEn, titleId, subtitleEn, subtitleId,
//     body: [{en,id}, ...],
//     captionEn, captionId, tagEn, tagId, orphanageId,
//     image, perspective, originalLang, status,
//     showInStories, showInGallery, highlight, sortIndex
//   }
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const titleEn = String(body.titleEn ?? "").trim();
    const titleId = String(body.titleId ?? "").trim();
    if (!titleEn && !titleId) {
      return NextResponse.json(
        { error: "A title (in at least one language) is required." },
        { status: 400 },
      );
    }

    // Normalize body to Localized[] JSON string.
    let bodyArr: { en: string; id: string }[] = [];
    if (Array.isArray(body.body)) {
      bodyArr = body.body
        .filter((p: unknown) => p && typeof p === "object")
        .map((p: Record<string, unknown>) => ({
          en: String((p as { en?: unknown }).en ?? ""),
          id: String((p as { id?: unknown }).id ?? ""),
        }));
    }

    const perspective = String(body.perspective ?? "Field") as StoryPerspective;
    const originalLang = String(body.originalLang ?? "en") as StoryLang;
    const status = String(body.status ?? "published") as StoryStatus;

    // Determine sortIndex: append to end if not provided.
    let sortIndex = Number(body.sortIndex);
    if (!Number.isFinite(sortIndex)) {
      const max = await db.story.aggregate({ _max: { sortIndex: true } });
      sortIndex = (max._max.sortIndex ?? -1) + 1;
    }

    const row = await db.story.create({
      data: {
        titleEn,
        titleId,
        subtitleEn: String(body.subtitleEn ?? ""),
        subtitleId: String(body.subtitleId ?? ""),
        body: JSON.stringify(bodyArr),
        captionEn: String(body.captionEn ?? ""),
        captionId: String(body.captionId ?? ""),
        tagEn: String(body.tagEn ?? ""),
        tagId: String(body.tagId ?? ""),
        orphanageId: String(body.orphanageId ?? ""),
        image: String(body.image ?? ""),
        perspective,
        originalLang,
        status,
        showInStories: Boolean(body.showInStories ?? true),
        showInGallery: Boolean(body.showInGallery ?? false),
        highlight: Boolean(body.highlight ?? false),
        sortIndex,
      },
    });

    return NextResponse.json(
      { story: storyRowToRecord(row) },
      { status: 201 },
    );
  } catch (e) {
    console.error("[stories POST] error", e);
    return NextResponse.json(
      { error: "Failed to create story." },
      { status: 500 },
    );
  }
}
