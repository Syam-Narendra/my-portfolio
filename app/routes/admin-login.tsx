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

  return (
    <>
      <style>{`
  .dot-bg {
    background-color: #0a0a0b;
    background-image: radial-gradient(circle, #2a2a2e 0.8px, transparent 0.8px);
    background-size: 22px 22px;
  }
  .hatched-border {
    background: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 4px,
      #1a1a1f 4px,
      #1a1a1f 5px
    );
  }
  .font-mono-ui {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
  }
`}</style>

      <div className="font-mono-ui dot-bg min-h-screen flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[420px]">
          {/* Top border */}
          <div className="hatched-border h-6 rounded-t-lg" />

          <div className="bg-[#0e0e11] border-x border-[#1e1e24] px-8 py-12 sm:px-10 sm:py-14 shadow-[0_8px_32px_rgba(0,0,0,0.45),0_1.5px_4px_rgba(0,0,0,0.25)]">
            {/* Header */}
            <header className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Admin Access
                </span>
              </div>

              <h1 className="text-[26px] font-bold text-zinc-100 tracking-tight mb-4">
                Sign in
              </h1>

              <p className="text-[13px] text-zinc-500">
                Enter your credentials to continue
              </p>
            </header>

            {/* Error */}
            {actionData?.error && (
              <div
                role="alert"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-[13px] mb-10 bg-red-500/[0.08] border border-red-500/20 text-red-300"
              >
                <span>{actionData.error}</span>
              </div>
            )}

            <Form method="post" className="space-y-8 mt-56">
              {/* Email */}
              <div className="space-y-3">
                <label
                  htmlFor="admin-username"
                  className="block text-[11px] uppercase tracking-[0.12em] text-zinc-400"
                >
                  Email
                </label>

                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  required
                  placeholder="you@example.com"
                  className="w-full h-12 rounded-lg px-4 text-[13px] bg-[#141417] border border-[#27272a] text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-3">
                <label
                  htmlFor="admin-password"
                  className="block text-[11px] uppercase tracking-[0.12em] text-zinc-400"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="admin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full h-12 rounded-lg pl-4 pr-12 text-[13px] bg-[#141417] border border-[#27272a] text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-zinc-500 hover:text-zinc-300"
                  >
                    👁
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-12 mt-6 rounded-lg text-[13px] font-semibold bg-zinc-100 text-zinc-900 hover:bg-white"
              >
                Sign in →
              </button>
            </Form>

            {/* Footer */}
            <p className="mt-12 text-center text-[11px] text-zinc-600">
              Protected area · Authorized personnel only
            </p>
          </div>

          {/* Bottom border */}
          <div className="hatched-border h-6 rounded-b-lg" />
        </div>
      </div>
    </>
  );
}
