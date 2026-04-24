import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { redirect } from "react-router";

const COOKIE_NAME = "admin_session";

// On Vercel, env vars are injected via the dashboard into process.env.
// Locally with Vite, use --env-file or dotenv in vite.config.
function getEnv(key: string): string | undefined {
  return process.env[key];
}

// ── Session secret from .env (NOT hardcoded in source) ──────────────
function getSessionSecret(): string {
  const secret = getEnv("SESSION_SECRET");
  if (!secret) {
    // Auto-generate a fallback but warn loudly
    console.warn("[auth] ⚠ SESSION_SECRET not set in .env — using ADMIN_PASSWORD as fallback. Set SESSION_SECRET for production!");
    const fallback = getEnv("ADMIN_PASSWORD");
    if (fallback) return "portfolio-" + fallback + "-session";
    return "insecure-default-change-me";
  }
  return secret;
}

// ── HMAC-SHA256 token signing (cryptographically secure) ────────────
// Token format: payload.timestamp.signature
// - payload = username
// - timestamp = when the token was created (for expiry)
// - signature = HMAC-SHA256(payload:timestamp, secret)

function signToken(username: string): string {
  const secret = getSessionSecret();
  const timestamp = Date.now().toString(36); // compact timestamp
  const payload = Buffer.from(username).toString("base64url");
  const signature = createHmac("sha256", secret)
    .update(`${payload}:${timestamp}`)
    .digest("base64url");
  return `${payload}.${timestamp}.${signature}`;
}

function verifyToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [payload, timestamp, signature] = parts;

    const secret = getSessionSecret();

    // Verify signature using timing-safe comparison
    const expectedSig = createHmac("sha256", secret)
      .update(`${payload}:${timestamp}`)
      .digest("base64url");

    const sigBuf = Buffer.from(signature, "base64url");
    const expectedBuf = Buffer.from(expectedSig, "base64url");
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return null;
    }

    // Check token age (expire after 7 days)
    const created = parseInt(timestamp, 36);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    if (Date.now() - created > maxAge) return null;

    return Buffer.from(payload, "base64url").toString("utf-8");
  } catch {
    return null;
  }
}

// ── Rate limiting (brute-force protection) ──────────────────────────
// Track failed login attempts by IP
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minute lockout

function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(request: Request): boolean {
  const ip = getClientIP(request);
  const entry = loginAttempts.get(ip);
  if (!entry) return false;

  // Reset if lockout period has passed
  if (Date.now() - entry.lastAttempt > LOCKOUT_MS) {
    loginAttempts.delete(ip);
    return false;
  }

  return entry.count >= MAX_ATTEMPTS;
}

function recordFailedAttempt(request: Request): void {
  const ip = getClientIP(request);
  const entry = loginAttempts.get(ip) || { count: 0, lastAttempt: 0 };
  entry.count++;
  entry.lastAttempt = Date.now();
  loginAttempts.set(ip, entry);
}

function clearFailedAttempts(request: Request): void {
  loginAttempts.delete(getClientIP(request));
}

// ── Cookie helpers ──────────────────────────────────────────────────
export function createSessionCookie(username: string): string {
  const token = signToken(username);
  const isProduction = getEnv("NODE_ENV") === "production" || !!getEnv("RAILWAY_ENVIRONMENT") || !!getEnv("VERCEL");
  const secureFlag = isProduction ? " Secure;" : "";
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly;${secureFlag} SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}`;
}

export function destroySessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`;
}

// ── Session validation ──────────────────────────────────────────────
export function getSessionUser(request: Request): string | null {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  return verifyToken(match[1]);
}

export function requireAdmin(request: Request): string {
  const user = getSessionUser(request);
  if (!user) throw redirect("/admin/login");
  return user;
}

// ── Credential validation with rate limiting ────────────────────────
export function validateCredentials(
  request: Request,
  username: string,
  password: string
): { success: boolean; error?: string } {
  // Check rate limit first
  if (isRateLimited(request)) {
    const ip = getClientIP(request);
    console.warn(`[auth] Rate limited login attempt from ${ip}`);
    return { success: false, error: "Too many failed attempts. Try again in 15 minutes." };
  }

  const adminUser = getEnv("ADMIN_USERNAME");
  const adminPass = getEnv("ADMIN_PASSWORD");
  if (!adminUser || !adminPass) {
    console.error("[auth] ADMIN_USERNAME or ADMIN_PASSWORD not set in .env");
    return { success: false, error: "Server configuration error" };
  }

  // Timing-safe comparison to prevent timing attacks
  const userMatch =
    username.length === adminUser.length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(adminUser));
  const passMatch =
    password.length === adminPass.length &&
    timingSafeEqual(Buffer.from(password), Buffer.from(adminPass));

  if (userMatch && passMatch) {
    clearFailedAttempts(request);
    return { success: true };
  }

  recordFailedAttempt(request);
  return { success: false, error: "Invalid credentials" };
}
