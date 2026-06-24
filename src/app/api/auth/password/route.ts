import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  hashPassword,
  requireUser,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const auth = await requireUser(req);
    if (!auth.ok) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 }
      );
    }
    const body = await req.json();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new passwords are required." },
        { status: 400 }
      );
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    if (auth.role === "admin") {
      const admin = await db.admin.findUnique({ where: { id: auth.userId } });
      if (!admin) {
        return NextResponse.json(
          { error: "Account not found." },
          { status: 404 }
        );
      }
      if (!verifyPassword(currentPassword, admin.passwordHash)) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 400 }
        );
      }
      await db.admin.update({
        where: { id: admin.id },
        data: { passwordHash: hashPassword(newPassword) },
      });
      return NextResponse.json({ ok: true });
    }

    // patron
    const patron = await db.patron.findUnique({ where: { id: auth.userId } });
    if (!patron) {
      return NextResponse.json(
        { error: "Account not found." },
        { status: 404 }
      );
    }
    if (!verifyPassword(currentPassword, patron.passwordHash)) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }
    await db.patron.update({
      where: { id: patron.id },
      data: { passwordHash: hashPassword(newPassword) },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[auth/password] error", e);
    return NextResponse.json(
      { error: "Password change failed." },
      { status: 500 }
    );
  }
}
