import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// POST: delete all donors.
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }
    await db.donor.deleteMany({});
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/donors/clear] error", e);
    return NextResponse.json(
      { error: "Failed to clear donors." },
      { status: 500 }
    );
  }
}
