import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// One-off helper: clears all donor rows so the seed can repopulate with
// currency fields. Safe to call multiple times.
export async function POST() {
  try {
    await db.donor.deleteMany({});
    return NextResponse.json({ ok: true, deleted: true });
  } catch {
    return NextResponse.json({ error: "Failed to reset donors" }, { status: 500 });
  }
}
