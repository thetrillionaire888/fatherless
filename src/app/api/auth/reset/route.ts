import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = String(body.token || "").trim();
    const newPassword = String(body.newPassword || "");

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required." },
        { status: 400 }
      );
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const patron = await db.patron.findFirst({
      where: { resetToken: token },
    });
    if (!patron || !patron.resetTokenExpires) {
      return NextResponse.json(
        { error: "Invalid or expired token." },
        { status: 400 }
      );
    }
    if (patron.resetTokenExpires.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "Reset token has expired." },
        { status: 400 }
      );
    }

    await db.patron.update({
      where: { id: patron.id },
      data: {
        passwordHash: hashPassword(newPassword),
        resetToken: null,
        resetTokenExpires: null,
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[auth/reset] error", e);
    return NextResponse.json(
      { error: "Password reset failed." },
      { status: 500 }
    );
  }
}
