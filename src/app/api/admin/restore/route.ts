import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type Snapshot = {
  version?: number;
  donors?: any[];
  admins?: any[];
  patrons?: any[];
  visitSchedules?: any[];
  prayerSchedules?: any[];
  donationSchedules?: any[];
};

// POST: restore from JSON snapshot (wipe + insert).
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }
    const body = (await req.json()) as Snapshot;
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid snapshot payload." },
        { status: 400 }
      );
    }

    // Use a transaction; SQLite supports it. Wipe then insert.
    await db.$transaction([
      db.donor.deleteMany({}),
      db.admin.deleteMany({}),
      db.patron.deleteMany({}),
      db.visitSchedule.deleteMany({}),
      db.prayerSchedule.deleteMany({}),
      db.donationSchedule.deleteMany({}),
      db.donor.createMany({ data: body.donors ?? [] }),
      db.admin.createMany({ data: body.admins ?? [] }),
      db.patron.createMany({ data: body.patrons ?? [] }),
      db.visitSchedule.createMany({ data: body.visitSchedules ?? [] }),
      db.prayerSchedule.createMany({ data: body.prayerSchedules ?? [] }),
      db.donationSchedule.createMany({ data: body.donationSchedules ?? [] }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/restore] error", e);
    return NextResponse.json(
      { error: "Restore failed." },
      { status: 500 }
    );
  }
}
