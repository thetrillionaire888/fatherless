import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// DELETE: delete a single donor by id (?id=...)
export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Missing donor id." },
        { status: 400 }
      );
    }
    await db.donor.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/donors DELETE] error", e);
    return NextResponse.json(
      { error: "Failed to delete donor." },
      { status: 500 }
    );
  }
}
