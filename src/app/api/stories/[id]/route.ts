import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { storyRowToRecord, type StoryPerspective, type StoryStatus, type StoryLang } from "@/lib/stories";

// GET /api/stories/[id]  (admin only — public reads via the list endpoint)
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const { id } = await params;
    const row = await db.story.findUnique({ where: { id } });
    if (!row) {
      return NextResponse.json({ error: "Story not found." }, { status: 404 });
    }
    return NextResponse.json({ story: storyRowToRecord(row) });
  } catch (e) {
    console.error("[stories/[id] GET] error", e);
    return NextResponse.json({ error: "Failed to fetch story." }, { status: 500 });
  }
}

// PUT /api/stories/[id]  (admin only)
//   Partial update. Accepts the same shape as POST (all fields optional).
//   Special action: { action: "reorder", sortIndex: number }
//   Special action: { action: "setStatus", status: "published"|"archived"|"hidden" }
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();

    // Lightweight status / archive / hide actions.
    if (body.action === "setStatus" && body.status) {
      const status = String(body.status) as StoryStatus;
      const row = await db.story.update({
        where: { id },
        data: { status },
      });
      return NextResponse.json({ story: storyRowToRecord(row) });
    }
    if (body.action === "reorder" && Number.isFinite(Number(body.sortIndex))) {
      const row = await db.story.update({
        where: { id },
        data: { sortIndex: Number(body.sortIndex) },
      });
      return NextResponse.json({ story: storyRowToRecord(row) });
    }

    const data: Record<string, unknown> = {};
    if (typeof body.titleEn === "string") data.titleEn = body.titleEn;
    if (typeof body.titleId === "string") data.titleId = body.titleId;
    if (typeof body.subtitleEn === "string") data.subtitleEn = body.subtitleEn;
    if (typeof body.subtitleId === "string") data.subtitleId = body.subtitleId;
    if (typeof body.captionEn === "string") data.captionEn = body.captionEn;
    if (typeof body.captionId === "string") data.captionId = body.captionId;
    if (typeof body.tagEn === "string") data.tagEn = body.tagEn;
    if (typeof body.tagId === "string") data.tagId = body.tagId;
    if (typeof body.orphanageId === "string") data.orphanageId = body.orphanageId;
    if (typeof body.image === "string") data.image = body.image;
    if (typeof body.perspective === "string") data.perspective = body.perspective as StoryPerspective;
    if (typeof body.originalLang === "string") data.originalLang = body.originalLang as StoryLang;
    if (typeof body.status === "string") data.status = body.status as StoryStatus;
    if (typeof body.showInStories === "boolean") data.showInStories = body.showInStories;
    if (typeof body.showInGallery === "boolean") data.showInGallery = body.showInGallery;
    if (typeof body.highlight === "boolean") data.highlight = body.highlight;
    if (Number.isFinite(Number(body.sortIndex))) data.sortIndex = Number(body.sortIndex);

    if (Array.isArray(body.body)) {
      const bodyArr = body.body
        .filter((p: unknown) => p && typeof p === "object")
        .map((p: Record<string, unknown>) => ({
          en: String((p as { en?: unknown }).en ?? ""),
          id: String((p as { id?: unknown }).id ?? ""),
        }));
      data.body = JSON.stringify(bodyArr);
    }

    const row = await db.story.update({ where: { id }, data });
    return NextResponse.json({ story: storyRowToRecord(row) });
  } catch (e) {
    console.error("[stories/[id] PUT] error", e);
    return NextResponse.json({ error: "Failed to update story." }, { status: 500 });
  }
}

// DELETE /api/stories/[id]  (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    const { id } = await params;
    await db.story.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[stories/[id] DELETE] error", e);
    return NextResponse.json({ error: "Failed to delete story." }, { status: 500 });
  }
}
