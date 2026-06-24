import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  ADMIN_DEFAULTS,
  createSession,
  ensureDefaultAdmin,
  hashPassword,
  setSessionCookieOnResponse,
} from "@/lib/auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const confirm = String(body.confirm || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }
    if (confirm && confirm !== password) {
      return NextResponse.json(
        { error: "Passwords do not match." },
        { status: 400 }
      );
    }

    await ensureDefaultAdmin();

    // Reject if email is the admin email or already a patron.
    if (email === ADMIN_DEFAULTS.email.toLowerCase()) {
      return NextResponse.json(
        { error: "This email is reserved." },
        { status: 400 }
      );
    }
    const existing = await db.patron.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 400 }
      );
    }

    const patron = await db.patron.create({
      data: { email, passwordHash: hashPassword(password) },
    });

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
    console.error("[auth/signup] error", e);
    return NextResponse.json(
      { error: "Sign up failed." },
      { status: 500 }
    );
  }
}
