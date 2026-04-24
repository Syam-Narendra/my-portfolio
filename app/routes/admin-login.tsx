 import { useState } from "react";
import type { MetaFunction } from "react-router";
import { redirect, useActionData, Form } from "react-router";
import type { Route } from "./+types/admin-login";
import {
  validateCredentials,
  createSessionCookie,
  getSessionUser,
} from "./auth.server";

export const meta: MetaFunction = () => [
  { title: "Admin Login" },
  { name: "robots", content: "noindex, nofollow" },
];

export function loader({ request }: Route.LoaderArgs) {
  const user = getSessionUser(request);
  if (user) throw redirect("/admin");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const username = String(form.get("username") || "");
  const password = String(form.get("password") || "");

  if (!username || !password) {
    return { error: "Please enter both username and password" };
  }

  const result = validateCredentials(request, username, password);
  if (!result.success) {
    return { error: result.error || "Invalid credentials" };
  }

  return redirect("/admin", {
    headers: {
      "Set-Cookie": createSessionCookie(username),
    },
  });
}

export default function AdminLogin() {
  const actionData = useActionData<typeof action>();
  const [showPassword, setShowPassword] = useState(false);

  const bg = "#09090b";
  const fg = "#f4f4f5";
  const border = "#27272a";
  const muted = "#a1a1aa";
  const cardBg = "#111113";
  const inputBg = "#18181b";
  const accent = "#6366f1";
  const accentHover = "#818cf8";
  const mono = "'JetBrains Mono','Courier New',monospace";

  return (
    <div
      style={{
        background: bg,
        color: fg,
        minHeight: "100vh",
        fontFamily: "'Inter',system-ui,sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: cardBg,
          border: `1px solid ${border}`,
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,.5)",
        }}
      >
        {/* Lock Icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${accent}, #a855f7)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 30px ${accent}33`,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={28}
              height={28}
              fill="none"
              stroke="white"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 600,
            textAlign: "center",
            marginBottom: 4,
          }}
        >
          Admin Access
        </h1>
        <p
          style={{
            fontSize: 13,
            color: muted,
            textAlign: "center",
            marginBottom: 28,
            fontFamily: mono,
          }}
        >
          authenticate to manage portfolio
        </p>

        {actionData?.error && (
          <div
            style={{
              background: "rgba(239,68,68,.12)",
              border: "1px solid rgba(239,68,68,.3)",
              borderRadius: 10,
              padding: "10px 14px",
              fontSize: 13,
              color: "#fca5a5",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={16}
              height={16}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {actionData.error}
          </div>
        )}

        <Form method="post">
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="admin-username"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: muted,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Username
            </label>
            <input
              id="admin-username"
              name="username"
              type="text"
              autoComplete="username"
              required
              style={{
                width: "100%",
                height: 44,
                background: inputBg,
                border: `1px solid ${border}`,
                borderRadius: 10,
                padding: "0 14px",
                fontSize: 14,
                color: fg,
                outline: "none",
                fontFamily: mono,
                transition: "border-color .2s",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = accent)
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = border)
              }
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="admin-password"
              style={{
                display: "block",
                fontSize: 12,
                fontWeight: 500,
                color: muted,
                marginBottom: 6,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                style={{
                  width: "100%",
                  height: 44,
                  background: inputBg,
                  border: `1px solid ${border}`,
                  borderRadius: 10,
                  padding: "0 44px 0 14px",
                  fontSize: 14,
                  color: fg,
                  outline: "none",
                  fontFamily: mono,
                  transition: "border-color .2s",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = accent)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = border)
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: muted,
                  cursor: "pointer",
                  padding: 6,
                  display: "flex",
                }}
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    width={18}
                    height={18}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width={18}
                    height={18}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              height: 46,
              background: `linear-gradient(135deg, ${accent}, #a855f7)`,
              border: "none",
              borderRadius: 10,
              color: "white",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
              transition: "opacity .2s, transform .1s",
              boxShadow: `0 4px 15px ${accent}44`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "translateY(1px)";
            }}
          >
            Sign In
          </button>
        </Form>

        <p
          style={{
            fontSize: 11,
            color: "#52525b",
            textAlign: "center",
            marginTop: 20,
            fontFamily: mono,
          }}
        >
          credentials configured in .env file
        </p>
      </div>
    </div>
  );
}
