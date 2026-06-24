import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  RESET_EXPIRY_MS,
  generateResetToken,
  sendPasswordResetEmail,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    // For privacy, do not leak whether the account exists. But still return a
    // dev reset URL when no SMTP is configured so the caller can surface it.
    const patron = await db.patron.findUnique({ where: { email } });
    if (!patron) {
      return NextResponse.json({
        ok: true,
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const token = generateResetToken();
    const expires = new Date(Date.now() + RESET_EXPIRY_MS);
    await db.patron.update({
      where: { id: patron.id },
      data: { resetToken: token, resetTokenExpires: expires },
    });

    const { resetUrl, devFallback } = await sendPasswordResetEmail(
      email,
      token
    );
    return NextResponse.json({
      ok: true,
      message: "If that email exists, a reset link has been sent.",
      devResetUrl: devFallback ? resetUrl : undefined,
    });
  } catch (e) {
    console.error("[auth/forgot] error", e);
    return NextResponse.json(
      { error: "Failed to request reset." },
      { status: 500 }
    );
  }
}
