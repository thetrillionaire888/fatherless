import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const donors = await db.donor.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ donors });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch donors" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      displayName,
      amount,
      currency,
      anonymousName,
      anonymousAmount,
      paymentMethod,
      message,
    } = body;

    if (!displayName || amount == null || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Normalize currency; default to USD.
    const cur =
      currency === "IDR" ? "IDR" : currency === "USD" ? "USD" : "USD";

    const donor = await db.donor.create({
      data: {
        displayName: String(displayName),
        amount: Number(amount),
        currency: cur,
        anonymousName: Boolean(anonymousName),
        anonymousAmount: Boolean(anonymousAmount),
        paymentMethod: String(paymentMethod),
        message: message ? String(message) : null,
      },
    });

    return NextResponse.json({ donor }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to record donation" },
      { status: 500 }
    );
  }
}
