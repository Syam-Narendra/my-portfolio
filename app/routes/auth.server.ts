import { readFileSync } from "node:fs";
import path from "node:path";
import { redirect } from "react-router";

const COOKIE_NAME = "admin_session";
const SESSION_SECRET = "portfolio-admin-secret-key-2026";

// Load .env values (Vite SSR doesn't auto-populate process.env)
function loadEnvSync(): Record<string, string> {
  const vars: Record<string, string> = {};
  try {
    const content = readFileSync(path.join(process.cwd(), ".env"), "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      vars[key] = val;
    }
  } catch { /* no .env file */ }
  return vars;
}

function getEnv(key: string): string | undefined {
  return process.env[key] || loadEnvSync()[key];
}

function encode(value: string): string {
  const data = new TextEncoder().encode(value + ":" + SESSION_SECRET);
  return btoa(String.fromCharCode(...data));
}

function decode(token: string): string | null {
  try {
    const decoded = atob(token);
    const bytes = Uint8Array.from(decoded, (c) => c.charCodeAt(0));
    const str = new TextDecoder().decode(bytes);
    if (str.endsWith(":" + SESSION_SECRET)) {
      return str.slice(0, -(SESSION_SECRET.length + 1));
    }
    return null;
  } catch {
    return null;
  }
}

export function createSessionCookie(username: string): string {
  const token = encode(username);
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
}

export function destroySessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function getSessionUser(request: Request): string | null {
  const cookie = request.headers.get("Cookie") || "";
  const match = cookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  return decode(match[1]);
}

export function requireAdmin(request: Request): string {
  const user = getSessionUser(request);
  if (!user) throw redirect("/admin/login");
  return user;
}

export function validateCredentials(username: string, password: string): boolean {
  const adminUser = getEnv("ADMIN_USERNAME");
  const adminPass = getEnv("ADMIN_PASSWORD");
  if (!adminUser || !adminPass) {
    console.error("[admin] ADMIN_USERNAME or ADMIN_PASSWORD not set in .env");
    return false;
  }
  return username === adminUser && password === adminPass;
}
