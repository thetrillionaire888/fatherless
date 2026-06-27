import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { storyRowToRecord, type StoryLang } from "@/lib/stories";

// POST /api/stories/[id]/translate  (admin only)
// Body: { direction: "en-to-id" | "id-to-en" }
//
// Uses the Z.AI chat completions model (z-ai-web-dev-sdk) to translate the
// story's content from the original language into the other language. Only
// fields that have source content are translated; the response returns the
// full updated story record.
//
// The model is asked to return STRICT JSON so we can parse it reliably.

type TranslatePayload = {
  title?: string;
  subtitle?: string;
  body?: string[];
  caption?: string;
  tag?: string;
};

export async function POST(
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
    const direction = String(body.direction ?? "") as "en-to-id" | "id-to-en";
    if (direction !== "en-to-id" && direction !== "id-to-en") {
      return NextResponse.json(
        { error: "direction must be 'en-to-id' or 'id-to-en'." },
        { status: 400 },
      );
    }

    const row = await db.story.findUnique({ where: { id } });
    if (!row) {
      return NextResponse.json({ error: "Story not found." }, { status: 404 });
    }

    const srcLang: StoryLang = direction === "en-to-id" ? "en" : "id";
    const dstLang: StoryLang = direction === "en-to-id" ? "id" : "en";

    // Gather source content.
    const src: TranslatePayload = {};
    if (srcLang === "en") {
      src.title = row.titleEn;
      src.subtitle = row.subtitleEn;
      src.caption = row.captionEn;
      src.tag = row.tagEn;
    } else {
      src.title = row.titleId;
      src.subtitle = row.subtitleId;
      src.caption = row.captionId;
      src.tag = row.tagId;
    }
    // Body is JSON Localized[]; pull the source language of each paragraph.
    let srcBody: string[] = [];
    try {
      const parsed = JSON.parse(row.body || "[]");
      if (Array.isArray(parsed)) {
        srcBody = parsed.map(
          (p: { en?: string; id?: string }) =>
            String((srcLang === "en" ? p.en : p.id) ?? ""),
        );
      }
    } catch {
      srcBody = [];
    }
    src.body = srcBody.filter((s) => s.trim().length > 0);

    // If there is nothing to translate, return the record unchanged.
    const hasContent =
      (src.title && src.title.trim()) ||
      (src.subtitle && src.subtitle.trim()) ||
      (src.caption && src.caption.trim()) ||
      (src.tag && src.tag.trim()) ||
      (src.body && src.body.length > 0);
    if (!hasContent) {
      return NextResponse.json({
        story: storyRowToRecord(row),
        translated: false,
        message: "No source content to translate.",
      });
    }

    // Build the translation prompt. Ask for strict JSON.
    const srcLabel = srcLang === "en" ? "English" : "Bahasa Indonesia";
    const dstLabel = dstLang === "en" ? "English" : "Bahasa Indonesia";

    const payload = {
      title: src.title ?? "",
      subtitle: src.subtitle ?? "",
      caption: src.caption ?? "",
      tag: src.tag ?? "",
      body: src.body ?? [],
    };

    const systemPrompt =
      `You are a professional literary translator for a Christian charity website ` +
      `("Rumah Buah Hati") that helps fatherless children in Indonesia. ` +
      `Translate the given JSON from ${srcLabel} into ${dstLabel}. ` +
      `Preserve the tone (reverent, compassionate, biblical), any scripture references, ` +
      `and paragraph structure exactly. Do NOT translate proper nouns (names of people, ` +
      `places like Bantul/Yogyakarta/Surabaya, or "Rumah Buah Hati"). ` +
      `Return ONLY a single JSON object with the same keys, where each value is the ` +
      `translation. The "body" value must be an array of strings, same length and order as the input.`;

    const userPrompt =
      `Translate this JSON from ${srcLabel} to ${dstLabel}. ` +
      `Return ONLY the JSON object, no markdown, no explanation.\n\n` +
      JSON.stringify(payload);

    // Dynamically import the SDK (it is a backend-only dependency).
    const ZAIModule = await import("z-ai-web-dev-sdk");
    const ZAI = ZAIModule.default;
    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      thinking: { type: "disabled" },
    });

    const raw: string = completion?.choices?.[0]?.message?.content ?? "";

    // Extract the JSON object from the response (tolerate code fences / extra text).
    const cleaned = extractJson(raw);
    if (!cleaned) {
      console.error("[translate] could not parse JSON from model output:", raw);
      return NextResponse.json(
        {
          error: "Translation model did not return valid JSON. Please try again.",
          raw,
        },
        { status: 502 },
      );
    }

    // Merge translated fields into the row.
    const data: Record<string, unknown> = {};
    if (dstLang === "en") {
      if (typeof cleaned.title === "string") data.titleEn = cleaned.title;
      if (typeof cleaned.subtitle === "string") data.subtitleEn = cleaned.subtitle;
      if (typeof cleaned.caption === "string") data.captionEn = cleaned.caption;
      if (typeof cleaned.tag === "string") data.tagEn = cleaned.tag;
      if (Array.isArray(cleaned.body)) {
        // Rebuild body Localized[] preserving source (id) + translated (en),
        // aligned by index.
        const existing = safeParseBody(row.body);
        const next = cleaned.body.map(
          (en: unknown, i: number): { en: string; id: string } => ({
            en: String(en ?? ""),
            id: existing[i]?.id ?? "",
          }),
        );
        // If the model returned fewer paragraphs, keep the remaining source-only ones.
        for (let i = next.length; i < existing.length; i++) {
          next.push({ en: "", id: existing[i].id });
        }
        data.body = JSON.stringify(next);
      }
    } else {
      if (typeof cleaned.title === "string") data.titleId = cleaned.title;
      if (typeof cleaned.subtitle === "string") data.subtitleId = cleaned.subtitle;
      if (typeof cleaned.caption === "string") data.captionId = cleaned.caption;
      if (typeof cleaned.tag === "string") data.tagId = cleaned.tag;
      if (Array.isArray(cleaned.body)) {
        const existing = safeParseBody(row.body);
        const next = cleaned.body.map(
          (idv: unknown, i: number): { en: string; id: string } => ({
            en: existing[i]?.en ?? "",
            id: String(idv ?? ""),
          }),
        );
        for (let i = next.length; i < existing.length; i++) {
          next.push({ en: existing[i].en, id: "" });
        }
        data.body = JSON.stringify(next);
      }
    }

    const updated = await db.story.update({ where: { id }, data });
    return NextResponse.json({
      story: storyRowToRecord(updated),
      translated: true,
    });
  } catch (e) {
    console.error("[translate] error", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { error: `Translation failed: ${msg}` },
      { status: 500 },
    );
  }
}

// ---- helpers ----
function safeParseBody(raw: string): { en: string; id: string }[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    if (Array.isArray(parsed)) {
      return parsed.map((p: { en?: string; id?: string }) => ({
        en: String(p?.en ?? ""),
        id: String(p?.id ?? ""),
      }));
    }
  } catch {
    /* ignore */
  }
  return [];
}

function extractJson(text: string): Record<string, unknown> | null {
  if (!text) return null;
  // Strip markdown code fences if present.
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  // Find the first { ... } block.
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const slice = t.slice(start, end + 1);
  try {
    return JSON.parse(slice);
  } catch {
    return null;
  }
}
