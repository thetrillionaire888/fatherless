import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ADMIN_DEFAULTS,
  createSession,
  ensureDefaultAdmin,
  setSessionCookieOnResponse,
  verifyPassword,
  verifyTotp,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const totp = String(body.totp || "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Ensure the default admin exists.
    await ensureDefaultAdmin();

    // Admin path: matching admin email → password + TOTP.
    if (email === ADMIN_DEFAULTS.email.toLowerCase()) {
      const admin = await db.admin.findUnique({ where: { email } });
      if (!admin) {
        return NextResponse.json(
          { error: "Invalid credentials." },
          { status: 401 }
        );
      }
      if (!verifyPassword(password, admin.passwordHash)) {
        return NextResponse.json(
          { error: "Invalid credentials." },
          { status: 401 }
        );
      }
      if (!totp) {
        return NextResponse.json(
          { error: "TOTP token is required for admin login." },
          { status: 400 }
        );
      }
      if (!verifyTotp(totp, admin.totpSecret)) {
        return NextResponse.json(
          { error: "Invalid TOTP token." },
          { status: 401 }
        );
      }
      const token = await createSession({
        sub: admin.id,
        role: "admin",
        email: admin.email,
      });
      const res = NextResponse.json({
        authenticated: true,
        role: "admin",
        email: admin.email,
      });
      return setSessionCookieOnResponse(res, token);
    }

    // Patron path: password only.
    const patron = await db.patron.findUnique({ where: { email } });
    if (!patron) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }
    if (!verifyPassword(password, patron.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }
    const token = await createSession({
      sub: patron.id,
      role: "patron",
      email: patron.email,
    });
    const res = NextResponse.json({
      authenticated: true,
      role: "patron",
      email: patron.email,
    });
    return setSessionCookieOnResponse(res, token);
  } catch (e) {
    // Provide richer error output to help diagnose runtime/Prisma errors.
    console.error("[auth/login] error", e);
    try {
      console.error('[auth/login] error stack', (e && (e.stack || JSON.stringify(e))) || String(e));
    } catch {}
    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 }
    );
  }
}
