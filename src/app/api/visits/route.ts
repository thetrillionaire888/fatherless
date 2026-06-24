import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const visits = await db.visitSchedule.findMany({
      orderBy: { visitDate: "asc" },
    });
    return NextResponse.json({ visits });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch visits" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { visitorName, email, orphanageId, visitDate, partySize, message } =
      body;

    if (!visitorName || !email || !orphanageId || !visitDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const visit = await db.visitSchedule.create({
      data: {
        visitorName: String(visitorName),
        email: String(email),
        orphanageId: String(orphanageId),
        visitDate: String(visitDate),
        partySize: Number(partySize) || 1,
        message: message ? String(message) : null,
      },
    });

    return NextResponse.json({ visit }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to schedule visit" },
      { status: 500 }
    );
  }
}
