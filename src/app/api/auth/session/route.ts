import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_DEFAULTS,
  SESSION_COOKIE_NAME,
  ensureDefaultAdmin,
  verifySession,
} from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await ensureDefaultAdmin();
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ authenticated: false });
    }
    if (session.role === "admin") {
      const admin = await db.admin.findUnique({
        where: { id: session.sub },
      });
      if (!admin) return NextResponse.json({ authenticated: false });
      // Expose the current TOTP secret so the dashboard can show/register it.
      const isDefault =
        admin.email === ADMIN_DEFAULTS.email.toLowerCase();
      return NextResponse.json({
        authenticated: true,
        role: "admin",
        email: admin.email,
        totpSecret: admin.totpSecret,
        isDefaultAdmin: isDefault,
      });
    }
    // patron
    const patron = await db.patron.findUnique({
      where: { id: session.sub },
    });
    if (!patron) return NextResponse.json({ authenticated: false });
    return NextResponse.json({
      authenticated: true,
      role: "patron",
      email: patron.email,
    });
  } catch (e) {
    console.error("[auth/session] error", e);
    return NextResponse.json({ authenticated: false });
  }
}
