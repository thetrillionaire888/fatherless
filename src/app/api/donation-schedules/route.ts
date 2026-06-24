import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const schedules = await db.donationSchedule.findMany({
      orderBy: { donationDate: "asc" },
    });
    return NextResponse.json({ schedules });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch donation schedules" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, donationDate, reminderEmail, note } = body;

    if (!name || !email || !donationDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const schedule = await db.donationSchedule.create({
      data: {
        name: String(name),
        email: String(email),
        donationDate: String(donationDate),
        reminderEmail: Boolean(reminderEmail),
        note: note ? String(note) : null,
      },
    });

    return NextResponse.json({ schedule }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to schedule donation" },
      { status: 500 }
    );
  }
}
