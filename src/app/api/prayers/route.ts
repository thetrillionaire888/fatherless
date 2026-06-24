import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const prayers = await db.prayerSchedule.findMany({
      orderBy: { prayerDate: "asc" },
    });
    return NextResponse.json({ prayers });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch prayers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, prayerDate, prayerTime, reminderEmail, note } = body;

    if (!name || !email || !prayerDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prayer = await db.prayerSchedule.create({
      data: {
        name: String(name),
        email: String(email),
        prayerDate: String(prayerDate),
        prayerTime: prayerTime ? String(prayerTime) : "",
        reminderEmail: Boolean(reminderEmail),
        note: note ? String(note) : null,
      },
    });

    return NextResponse.json({ prayer }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to schedule prayer" },
      { status: 500 }
    );
  }
}
