import { useState } from "react";
import type { MetaFunction } from "react-router";
import { redirect, useActionData, Form, useNavigation } from "react-router";
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
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <>
      <style>{css}</style>

      <div className="login-page">

        {/* ───── Main content ───── */}
        <main className="login-main">
          <div className="login-dot-field" aria-hidden="true" />
          <section className="login-card" aria-labelledby="login-heading">
            <div className="login-hatch login-hatch-top" aria-hidden="true" />

            <div className="login-card-inner">
              <header className="login-card-header">
                <h1 id="login-heading" className="login-title">Login</h1>
                <p className="login-subtitle">
                  Admin Login
                </p>
              </header>

              <hr className="login-rule" />

              <Form method="post" className="login-form" noValidate>
                {/* Server error */}
                {actionData?.error && (
                  <p className="login-error login-error-form" role="alert">
                    {actionData.error}
                  </p>
                )}

                {/* Username / Email */}
                <div className="login-field">
                  <label htmlFor="admin-username" className="login-label">
                    Username
                  </label>
                  <input
                    id="admin-username"
                    name="username"
                    type="text"
                    autoComplete="email"
                    required
                    placeholder="Enter Username"
                    className="login-input"
                  />
                </div>

                {/* Password */}
                <div className="login-field">
                  <label htmlFor="admin-password" className="login-label">
                    Password
                  </label>
                  <div className="login-password-wrap">
                    <input
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      className="login-input login-input-password"
                    />
                    <button
                      type="button"
                      className="login-eye-btn"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>



                {/* Submit */}
                <button
                  type="submit"
                  className="login-btn login-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in…" : "Login"}
                </button>

              </Form>
            </div>

            <div className="login-hatch login-hatch-bottom" aria-hidden="true" />
          </section>
        </main>
      </div>
    </>
  );
}

/* ───────────── Icons (inline SVG — zero dependencies) ───────────── */
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a19.77 19.77 0 015.06-5.94M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 8 11 8a19.86 19.86 0 01-3.17 4.19M1 1l22 22" />
      <path d="M14.12 14.12a3 3 0 11-4.24-4.24" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.77 5.47.77 11.75c0 4.96 3.22 9.16 7.69 10.65.56.1.77-.24.77-.54v-1.9c-3.13.68-3.79-1.5-3.79-1.5-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.68.08-.68 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.28.94.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.57 0-1.23.44-2.24 1.16-3.02-.12-.29-.5-1.44.1-3 0 0 .95-.3 3.1 1.15.9-.25 1.86-.38 2.82-.38.96 0 1.92.13 2.82.38 2.15-1.45 3.1-1.15 3.1-1.15.6 1.56.22 2.71.11 3 .72.78 1.15 1.79 1.15 3.02 0 4.33-2.63 5.28-5.14 5.56.4.35.76 1.04.76 2.1v3.11c0 .3.2.65.78.54 4.46-1.5 7.68-5.7 7.68-10.65C23.23 5.47 18.27.5 12 .5z" />
    </svg>
  );
}

/* ───────────── Styles (scoped via <style> tag — all prefixed with login-) ───────────── */
const css = `
  .login-page {
    --login-bg: #0a0a0b;
    --login-bg-elev: #0e0e10;
    --login-border: #1f2024;
    --login-border-strong: #2a2b31;
    --login-fg: #ededee;
    --login-fg-muted: #8b8c93;
    --login-fg-subtle: #5a5b62;
    --login-accent: #f4f4f5;
    --login-accent-ink: #0a0a0b;
    --login-dot: #3a3b42;
    --login-hatch-color: #2a2b31;
    --login-font-mono: "JetBrains Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular,
                 Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;

    min-height: 100vh;
    background: var(--login-bg);
    font-family: var(--login-font-mono);
    font-size: 14px;
    line-height: 1.5;
    color: var(--login-fg);
    -webkit-font-smoothing: antialiased;
  }

  /* ───── Nav ───── */
  .login-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 48px;
    max-width: 1200px;
    margin: 0 auto;
    background: var(--login-bg);
  }
  .login-brand {
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--login-fg);
    text-decoration: none;
    padding: 4px 8px;
    border: 1px solid var(--login-border-strong);
    border-radius: 2px;
    font-family: var(--login-font-mono);
  }
  .login-nav-links {
    display: flex;
    align-items: center;
    gap: 22px;
  }
  .login-nav-link {
    color: var(--login-fg-muted);
    text-decoration: none;
    font-size: 13px;
    font-family: var(--login-font-mono);
    transition: color 0.15s ease;
  }
  .login-nav-link:hover { color: var(--login-fg); }

  /* ───── Main / Card ───── */
  .login-main {
    position: relative;
    display: flex;
    justify-content: center;
    padding: 24px 48px 64px;
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Contained dotted grid behind (and flanking) the card */
  .login-dot-field {
    position: absolute;
    top: 24px;
    bottom: 64px;
    left: 48px;
    right: 48px;
    background-image:
      radial-gradient(circle at 1px 1px, var(--login-dot) 1px, transparent 1.5px);
    background-size: 14px 14px;
    background-position: 0 0;
    pointer-events: none;
    z-index: 0;
  }

  .login-card {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    background: var(--login-bg);
    border-left: 1px solid var(--login-border);
    border-right: 1px solid var(--login-border);
  }
  .login-card-inner { padding: 40px 40px 36px; }

  /* Diagonal hatching top/bottom */
  .login-hatch {
    height: 14px;
    background-image: repeating-linear-gradient(
      -45deg,
      var(--login-hatch-color) 0 6px,
      transparent 6px 12px
    );
    border-top: 1px solid var(--login-border);
    border-bottom: 1px solid var(--login-border);
  }

  /* ───── Header ───── */
  .login-card-header { margin-bottom: 20px; }
  .login-title {
    margin: 0 0 10px;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--login-fg);
    font-family: var(--login-font-mono);
  }
  .login-subtitle {
    margin: 0;
    color: var(--login-fg-muted);
    font-size: 13px;
    max-width: 38ch;
    font-family: var(--login-font-mono);
  }
  .login-rule {
    border: none;
    border-top: 1px solid var(--login-border);
    margin: 0 0 24px;
  }

  /* ───── Form ───── */
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .login-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .login-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--login-fg);
    font-family: var(--login-font-mono);
  }
  .login-input {
    width: 100%;
    height: 40px;
    padding: 0 14px;
    background: var(--login-bg);
    border: 1px solid var(--login-border-strong);
    border-radius: 2px;
    color: var(--login-fg);
    font-family: var(--login-font-mono);
    font-size: 13px;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .login-input::placeholder { color: var(--login-fg-subtle); }
  .login-input:focus {
    border-color: var(--login-fg-muted);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.04);
  }

  /* Password with eye button */
  .login-password-wrap {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 6px;
  }
  .login-eye-btn {
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--login-bg);
    border: 1px solid var(--login-border-strong);
    border-radius: 2px;
    color: var(--login-fg-muted);
    cursor: pointer;
    transition: color 0.15s ease, border-color 0.15s ease;
  }
  .login-eye-btn:hover { color: var(--login-fg); border-color: var(--login-fg-muted); }

  /* Row */
  .login-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: -2px;
  }
  .login-remember {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
    font-size: 13px;
    position: relative;
    color: var(--login-fg);
    font-family: var(--login-font-mono);
  }
  .login-remember input { position: absolute; opacity: 0; pointer-events: none; }
  .login-checkbox {
    width: 16px; height: 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--login-bg);
    border: 1px solid var(--login-border-strong);
    border-radius: 2px;
    color: var(--login-accent-ink);
  }
  .login-remember input:checked + .login-checkbox {
    background: var(--login-accent);
    border-color: var(--login-accent);
  }
  .login-remember input:focus-visible + .login-checkbox {
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }
  .login-link {
    color: var(--login-fg);
    font-size: 13px;
    text-decoration: underline;
    text-underline-offset: 3px;
    font-family: var(--login-font-mono);
  }
  .login-link:hover { color: var(--login-fg-muted); }

  /* Buttons */
  .login-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    height: 44px;
    padding: 0 16px;
    border-radius: 2px;
    font-family: var(--login-font-mono);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, transform 0.05s ease;
  }
  .login-btn:active { transform: translateY(1px); }
  .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }
  .login-btn-primary {
    background: var(--login-accent);
    color: var(--login-accent-ink);
    border: 1px solid var(--login-accent);
  }
  .login-btn-primary:hover:not(:disabled) { background: #e4e4e7; }
  .login-btn-ghost {
    background: transparent;
    color: var(--login-fg);
    border: 1px solid var(--login-border-strong);
  }
  .login-btn-ghost:hover { border-color: var(--login-fg-muted); }

  /* OR separator */
  .login-or {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 12px;
    color: var(--login-fg-muted);
    font-size: 12px;
    margin: 2px 0;
    font-family: var(--login-font-mono);
  }
  .login-or-line { height: 1px; background: var(--login-border-strong); }
  .login-or-text { letter-spacing: 0.1em; }

  /* Sign up footer */
  .login-signup {
    text-align: center;
    color: var(--login-fg-muted);
    font-size: 13px;
    margin: 12px 0 4px;
    font-family: var(--login-font-mono);
  }

  /* Errors */
  .login-error {
    color: #ff7070;
    font-size: 12px;
    margin: 0;
    font-family: var(--login-font-mono);
  }
  .login-error-form {
    text-align: center;
    padding: 10px 14px;
    background: rgba(255, 112, 112, 0.08);
    border: 1px solid rgba(255, 112, 112, 0.2);
    border-radius: 2px;
  }

  /* ───── Responsive ───── */
  @media (max-width: 640px) {
    .login-nav { padding: 16px 20px; gap: 12px; flex-wrap: wrap; }
    .login-nav-links { gap: 14px; }
    .login-main { padding: 12px 16px 40px; }
    .login-dot-field { top: 12px; bottom: 40px; left: 16px; right: 16px; }
    .login-card-inner { padding: 28px 22px 24px; }
    .login-title { font-size: 24px; }
  }
`;
