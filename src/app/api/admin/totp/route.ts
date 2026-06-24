import { NextRequest, NextResponse } from "next/server";
import {
  generateTotpSecret,
  requireAdmin,
  totpKeyUri,
  verifyPassword,
  verifyTotp,
} from "@/lib/auth";
import { db } from "@/lib/db";

// GET: generate a new TOTP secret + otpauth URI (preview, not yet stored).
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }
  const secret = generateTotpSecret();
  const uri = totpKeyUri(auth.email, secret);
  return NextResponse.json({ secret, otpauthUri: uri });
}

// POST: register a new TOTP secret (requires currentPassword + newSecret + verification token).
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }
    const body = await req.json();
    const currentPassword = String(body.currentPassword || "");
    const newSecret = String(body.newSecret || "").trim().replace(/\s+/g, "");
    const token = String(body.token || "").trim();

    if (!currentPassword || !newSecret || !token) {
      return NextResponse.json(
        {
          error:
            "Current password, new secret, and verification token are required.",
        },
        { status: 400 }
      );
    }

    const admin = await db.admin.findUnique({ where: { id: auth.userId } });
    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found." },
        { status: 404 }
      );
    }
    if (!verifyPassword(currentPassword, admin.passwordHash)) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 400 }
      );
    }
    if (!verifyTotp(token, newSecret)) {
      return NextResponse.json(
        { error: "Verification token did not match the new secret." },
        { status: 400 }
      );
    }
    await db.admin.update({
      where: { id: admin.id },
      data: { totpSecret: newSecret },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/totp] error", e);
    return NextResponse.json(
      { error: "Failed to register TOTP." },
      { status: 500 }
    );
  }
}
