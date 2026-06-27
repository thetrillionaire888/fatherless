import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

// POST /api/admin/upload  (admin only)
// Multipart form: field "file" = the image file.
// Saves to public/uploads/<safe-name> and returns { url }.
//
// Accepted content-types: image/png, image/jpeg, image/webp, image/gif.
// Max size enforced at ~8MB.
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);
const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded (field must be named 'file')." },
        { status: 400 },
      );
    }

    const type = file.type || "";
    if (!ALLOWED.has(type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${type || "unknown"}. Use PNG, JPEG, WEBP, or GIF.` },
        { status: 400 },
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_BYTES / 1024 / 1024}MB).` },
        { status: 400 },
      );
    }

    const ext = EXT_BY_TYPE[type] || "bin";
    const rand = randomBytes(8).toString("hex");
    const safeName = `${Date.now()}-${rand}.${ext}`;

    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const bytes = new Uint8Array(await file.arrayBuffer());
    await writeFile(join(uploadsDir, safeName), bytes);

    const url = `/uploads/${safeName}`;
    return NextResponse.json({ url }, { status: 201 });
  } catch (e) {
    console.error("[admin/upload POST] error", e);
    return NextResponse.json(
      { error: "Failed to upload file." },
      { status: 500 },
    );
  }
}
