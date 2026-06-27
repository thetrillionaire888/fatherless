import { scryptSync, randomBytes, randomUUID } from "node:crypto";
import type { NextRequest, NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";
import { authenticator } from "otplib";
import { db } from "@/lib/db";

// ---- Admin defaults (auto-seeded on first login) ----
export const ADMIN_DEFAULTS = {
  email: "jansen.simanullang@gmail.com",
  password: "4God50Lov3",
  totpSecret: "7GX3GUDR2OZUYM5P5RQPYZHS74",
} as const;

// ---- Session cookie ----
export const SESSION_COOKIE_NAME = "rbh_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
// Use a stable secret; in production set JWT_SECRET env var.
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "rbh-dev-jwt-secret-change-me-in-production-please"
);

// ---- Password hashing (scrypt) ----
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const test = scryptSync(password, salt, 64).toString("hex");
    return test === hash;
  } catch {
    return false;
  }
}

// ---- TOTP (otplib v12) ----
export function generateTotpSecret(): string {
  return authenticator.generateSecret();
}

export function verifyTotp(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token: token.trim(), secret });
  } catch {
    return false;
  }
}

export function totpKeyUri(email: string, secret: string): string {
  // otpauth://totp/Label:account?secret=...&issuer=...
  return authenticator.keyuri(email, "Rumah Buah Hati", secret);
}

// ---- JWT session ----
export type SessionRole = "admin" | "patron";

export type SessionPayload = {
  sub: string; // user id
  role: SessionRole;
  email: string;
};

export async function createSession(payload: SessionPayload): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_MAX_AGE_SECONDS)
    .sign(JWT_SECRET);
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (
      typeof payload.sub !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }
    return {
      sub: payload.sub,
      role: payload.role as SessionRole,
      email: payload.email,
    };
  } catch {
    return null;
  }
}

// ---- Cookie helpers ----
export function buildSessionCookie(token: string): string {
  const parts = [
    `${SESSION_COOKIE_NAME}=${token}`,
    "Path=/",
    `Max-Age=${SESSION_MAX_AGE_SECONDS}`,
    "SameSite=Lax",
    "HttpOnly",
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookie(): string {
  const parts = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "Max-Age=0",
    "SameSite=Lax",
    "HttpOnly",
  ];
  if (process.env.NODE_ENV === "production") parts.push("Secure");
  return parts.join("; ");
}

// Helper: attach Set-Cookie to a NextResponse.
export function setSessionCookieOnResponse(
  res: NextResponse,
  token: string
): NextResponse {
  res.headers.set("Set-Cookie", buildSessionCookie(token));
  return res;
}

export function clearSessionCookieOnResponse(res: NextResponse): NextResponse {
  res.headers.set("Set-Cookie", clearSessionCookie());
  return res;
}

// ---- Default admin seeding ----
export async function ensureDefaultAdmin(): Promise<void> {
  const existing = await db.admin.findUnique({
    where: { email: ADMIN_DEFAULTS.email },
  });
  if (existing) return;
  await db.admin.create({
    data: {
      email: ADMIN_DEFAULTS.email,
      passwordHash: hashPassword(ADMIN_DEFAULTS.password),
      totpSecret: ADMIN_DEFAULTS.totpSecret,
    },
  });
}

// ---- Request guards ----
type AuthResult =
  | { ok: true; role: SessionRole; userId: string; email: string }
  | { ok: false; status: 401 };

async function readSessionFromRequest(
  req: NextRequest
): Promise<SessionPayload | null> {
  // Prefer cookie; also allow Authorization: Bearer <token> for flexibility.
  const cookie = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (cookie) return await verifySession(cookie);
  const auth = req.headers.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return await verifySession(auth.slice(7).trim());
  }
  return null;
}

export async function requireUser(req: NextRequest): Promise<AuthResult> {
  const session = await readSessionFromRequest(req);
  if (!session) return { ok: false, status: 401 };
  return {
    ok: true,
    role: session.role,
    userId: session.sub,
    email: session.email,
  };
}

export async function requireAdmin(req: NextRequest): Promise<AuthResult> {
  const session = await readSessionFromRequest(req);
  if (!session || session.role !== "admin")
    return { ok: false, status: 401 };
  // Confirm admin record still exists.
  const admin = await db.admin.findUnique({ where: { id: session.sub } });
  if (!admin) return { ok: false, status: 401 };
  return {
    ok: true,
    role: "admin",
    userId: session.sub,
    email: admin.email,
  };
}

export async function requirePatron(req: NextRequest): Promise<AuthResult> {
  const session = await readSessionFromRequest(req);
  if (!session || session.role !== "patron")
    return { ok: false, status: 401 };
  const patron = await db.patron.findUnique({ where: { id: session.sub } });
  if (!patron) return { ok: false, status: 401 };
  return {
    ok: true,
    role: "patron",
    userId: session.sub,
    email: patron.email,
  };
}

// ---- Password reset ----
export const RESET_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

export function generateResetToken(): string {
  // URL-safe token
  return randomUUID().replace(/-/g, "") + randomBytes(8).toString("hex");
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<{ resetUrl: string; devFallback: boolean }> {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  const resetUrl = `${base}/login?reset=${token}`;
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    // Real SMTP not wired here; would integrate nodemailer in production.
    // For now we still return the URL so the caller can surface it.
    return { resetUrl, devFallback: false };
  }
  // No SMTP configured — return the link so dev callers can display it.
  return { resetUrl, devFallback: true };
}
