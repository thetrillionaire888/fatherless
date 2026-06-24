import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

// GET: export all data as JSON snapshot.
export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }
    const [
      donors,
      admins,
      patrons,
      visitSchedules,
      prayerSchedules,
      donationSchedules,
    ] = await Promise.all([
      db.donor.findMany(),
      db.admin.findMany(),
      db.patron.findMany(),
      db.visitSchedule.findMany(),
      db.prayerSchedule.findMany(),
      db.donationSchedule.findMany(),
    ]);

    const snapshot = {
      version: 1,
      exportedAt: new Date().toISOString(),
      donors,
      // Exclude password hashes / totp secrets from public-ish snapshot for safety.
      // (Admin already has access; for backup fidelity we still include them.)
      admins: admins.map((a) => ({
        id: a.id,
        email: a.email,
        passwordHash: a.passwordHash,
        totpSecret: a.totpSecret,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      patrons: patrons.map((p) => ({
        id: p.id,
        email: p.email,
        passwordHash: p.passwordHash,
        resetToken: p.resetToken,
        resetTokenExpires: p.resetTokenExpires,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      visitSchedules,
      prayerSchedules,
      donationSchedules,
    };

    return NextResponse.json(snapshot, {
      headers: {
        "Content-Disposition": `attachment; filename="rbh-backup-${Date.now()}.json"`,
      },
    });
  } catch (e) {
    console.error("[admin/backup] error", e);
    return NextResponse.json(
      { error: "Backup failed." },
      { status: 500 }
    );
  }
}
