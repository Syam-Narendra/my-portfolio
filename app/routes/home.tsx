import { useState, useEffect, Suspense } from "react";
import type { MetaFunction } from "react-router";
import { useLoaderData, Await } from "react-router";

import { about, education, experience, footer, meta as siteMeta, profile, quote, socialLinks, getVisitorCount } from "~/data/portfolio";
import { readGitHubCache } from "~/github-scheduler.server";
import { Hatch } from "~/components/Hatch";
import { Navbar } from "~/components/Navbar";
import { ProfileHeader } from "~/components/ProfileHeader";
import { SectionPanel } from "~/components/SectionPanel";
import { SocialIcon } from "~/components/SocialIcon";
import { GitHubGrid } from "~/components/GitHubGrid";

export const meta: MetaFunction = () => [
  { title: siteMeta.title },
  { name: "description", content: siteMeta.description },
];

export function loader() {
  return {
    github: readGitHubCache(),
    visitorCount: getVisitorCount(),
  };
}

function GitHubGridSkeleton({ dark }: { dark: boolean }) {
  const color = dark ? "#161b22" : "#ebedf0";
  const cells: { w: number; d: number }[] = [];
  for (let w = 0; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      cells.push({ w, d });
    }
  }
  return (
    <div>
      <svg width={52 * 13} height={7 * 13} style={{ display: "block", opacity: 0.5 }}>
        {cells.map(({ w, d }, i) => (
          <rect
            key={i}
            x={w * 13}
            y={d * 13}
            width={11}
            height={11}
            rx={2}
            fill={color}
            style={{
              animation: `ghShimmer 1.5s ease-in-out ${(w * 7 + d) * 3}ms infinite`,
            }}
          />
        ))}
      </svg>
      <style>{`
        @keyframes ghShimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const { github, visitorCount } = useLoaderData<typeof loader>();
  const [dark, setDark] = useState(true);
  const [status, setStatus] = useState(profile.statusChecking);

  useEffect(() => {
    const t = setTimeout(() => setStatus(profile.statusReady), 1500);
    return () => clearTimeout(t);
  }, []);

  const bg     = dark ? "#09090b" : "#ffffff";
  const fg     = dark ? "#f4f4f5" : "#09090b";
  const border = dark ? "#27272a" : "#e4e4e7";
  const muted  = dark ? "#a1a1aa" : "#71717a";
  const tagBg  = dark ? "#18181b" : "#fafafa";
  const mono   = "'JetBrains Mono','Courier New',monospace";

  const dotGrid = {
    backgroundImage: `radial-gradient(${dark ? "rgba(113,113,122,.6)" : "rgba(161,161,170,.5)"} 1px, transparent 0)`,
    backgroundSize: "10px 10px",
  } as React.CSSProperties;

  function Cross({ pos }: { pos: "bl" | "br" }) {
    return (
      <div
        style={{
          position: "absolute",
          width: 12,
          height: 12,
          bottom: 0,
          ...(pos === "bl"
            ? { left: 0, transform: "translate(-50%,50%)" }
            : { right: 0, transform: "translate(50%,50%)" }),
        }}
      >
        <span style={{ position: "absolute", width: "100%", height: 1, top: 5, background: dark ? "#52525b" : "#a1a1aa" }} />
        <span style={{ position: "absolute", height: "100%", width: 1, left: 5, background: dark ? "#52525b" : "#a1a1aa" }} />
      </div>
    );
  }

  return (
    <div
      style={{
        background: bg,
        color: fg,
        minHeight: "100vh",
        fontFamily: "'Inter',system-ui,sans-serif",
        fontSize: 14,
        lineHeight: 1.7,
      }}
    >
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <Navbar dark={dark} onToggleTheme={() => setDark((d) => !d)} />

      {/* ── Main ───────────────────────────────────────────────────── */}
      <main style={{ paddingInline: 8, overflow: "hidden" }}>
        <div style={{ maxWidth: 768, margin: "0 auto" }}>

          {/* Top dot-grid banner */}
          <div style={{ borderLeft: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
            <div style={{ padding: 20 }}>
              <div style={{ ...dotGrid, minHeight: 110 }} />
            </div>
          </div>

          {/* Profile header */}
          <ProfileHeader dark={dark} status={status} visitorCount={visitorCount} />

          <Hatch dark={dark} />

          {/* ── About ────────────────────────────────────────────── */}
          <SectionPanel id="about" title="About" dark={dark}>
            <ul style={{ listStyle: "disc", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {about.map((p, i) => (
                <li key={i} style={{ fontFamily: mono, fontSize: 13, color: fg, lineHeight: 1.75 }}>
                  {p}
                </li>
              ))}
            </ul>
          </SectionPanel>

          <Hatch dark={dark} />

          {/* ── Connect ──────────────────────────────────────────── */}
          <SectionPanel id="connect" title="Connect" dark={dark}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingBottom: 4 }}>
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    height: 36,
                    padding: "0 12px",
                    borderRadius: 10,
                    border: `1px solid ${border}`,
                    background: dark ? "#18181b" : "#ffffff",
                    color: dark ? "rgba(255,255,255,.82)" : "rgba(0,0,0,.8)",
                    fontSize: 12,
                    fontWeight: 500,
                    fontFamily: "'Inter',sans-serif",
                    whiteSpace: "nowrap",
                    boxShadow: "0 1px 2px rgba(0,0,0,.06)",
                    textDecoration: "none",
                    flexShrink: 0,
                  }}
                >
                  <SocialIcon name={icon} size={14} />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </SectionPanel>

          <Hatch dark={dark} />

          {/* ── GitHub Activity ───────────────────────────────────── */}
          <SectionPanel id="github" title="GitHub Activity" dark={dark}>
            <div style={{ overflowX: "auto", paddingBlock: 6 }}>
              <Suspense fallback={<GitHubGridSkeleton dark={dark} />}>
                <Await resolve={github}>
                  {(data) => <GitHubGrid dark={dark} data={data} />}
                </Await>
              </Suspense>
            </div>
          </SectionPanel>

          <Hatch dark={dark} />

          {/* ── Experience ───────────────────────────────────────── */}
          <SectionPanel id="experience" title="Experience" dark={dark}>
            <div style={{ paddingRight: 8, paddingLeft: 16 }}>
              {experience.map((exp, ei) => (
                <div
                  key={ei}
                  style={{
                    paddingBlock: 16,
                    borderBottom: ei < experience.length - 1 ? `1px solid ${border}` : "none",
                  }}
                >
                  {/* Company row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <img
                      src={exp.logoUrl}
                      alt={exp.company}
                      width={36}
                      height={36}
                      style={{
                        borderRadius: 7,
                        border: `1px solid ${border}`,
                        background: dark ? "#18181b" : "#f4f4f5",
                        objectFit: "contain",
                        flexShrink: 0,
                        padding: 2,
                      }}
                    />
                    <h3 style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.3 }}>
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener"
                        style={{ textDecoration: "underline", textUnderlineOffset: 3, color: "inherit" }}
                      >
                        {exp.company}
                      </a>
                    </h3>
                  </div>

                  {/* Role row */}
                  <div style={{ paddingLeft: 36, position: "relative" }}>
                    <div style={{ position: "absolute", left: 12, top: 0, bottom: 0, width: 1, background: border }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 7,
                          border: `1px solid ${dark ? "#3f3f46" : "#d4d4d8"}`,
                          background: dark ? "#18181b" : "#f4f4f5",
                          boxShadow: `0 0 0 1px ${border}, 0 0 0 2px ${bg}`,
                          color: muted,
                        }}
                      >
                        <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path d="m14.5 4-5 16" />
                        </svg>
                      </div>
                      <h4 style={{ flex: 1, fontWeight: 500, fontSize: 14, color: fg }}>{exp.role}</h4>
                      <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={muted} strokeWidth={2}>
                        <path d="M7 15L12 20L17 15" /><path d="M7 9L12 4L17 9" />
                      </svg>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: muted, marginBottom: 6 }}>
                      <span>{exp.type}</span>
                      <span style={{ width: 1, height: 14, background: border }} />
                      <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <span>{exp.period[0]}</span>
                        <span style={{ fontFamily: mono }}>—</span>
                        <span>{exp.period[1]}</span>
                      </span>
                    </div>
                  </div>

                  {/* Skill tags */}
                  <div style={{ paddingLeft: 36, display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {exp.skills.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontFamily: mono,
                          fontSize: 11,
                          padding: "2px 7px",
                          borderRadius: 6,
                          border: `1px solid ${border}`,
                          background: tagBg,
                          color: muted,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionPanel>

          <Hatch dark={dark} />

          {/* ── Education ────────────────────────────────────────── */}
          <SectionPanel id="education" title="Education" dark={dark}>
            <div style={{ paddingRight: 8, paddingLeft: 16 }}>
              {education.map((edu, ei) => (
                <div
                  key={ei}
                  style={{
                    paddingBlock: 16,
                    borderBottom: ei < education.length - 1 ? `1px solid ${border}` : "none",
                  }}
                >
                  {/* Institution row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <img
                      src={edu.logoUrl}
                      alt={edu.institution}
                      width={36}
                      height={36}
                      style={{
                        borderRadius: 7,
                        border: `1px solid ${border}`,
                        background: dark ? "#18181b" : "#f4f4f5",
                        objectFit: "contain",
                        flexShrink: 0,
                        padding: 2,
                      }}
                    />
                    <h3 style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.3, flex: 1 }}>
                      {edu.url ? (
                        <a
                          href={edu.url}
                          target="_blank"
                          rel="noopener"
                          style={{ textDecoration: "underline", textUnderlineOffset: 3, color: "inherit" }}
                        >
                          {edu.institution}
                        </a>
                      ) : (
                        edu.institution
                      )}
                    </h3>
                  </div>

                  {/* Degree row */}
                  <div style={{ paddingLeft: 36, position: "relative" }}>
                    <div style={{ position: "absolute", left: 12, top: 0, bottom: 0, width: 1, background: border }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          width: 24,
                          height: 24,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 7,
                          border: `1px solid ${dark ? "#3f3f46" : "#d4d4d8"}`,
                          background: dark ? "#18181b" : "#f4f4f5",
                          boxShadow: `0 0 0 1px ${border}, 0 0 0 2px ${bg}`,
                          color: muted,
                        }}
                      >
                        <svg viewBox="0 0 24 24" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                          <path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                        </svg>
                      </div>
                      <h4 style={{ flex: 1, fontWeight: 500, fontSize: 14, color: fg }}>
                        {edu.degree}
                        <span style={{ fontWeight: 400, color: muted }}> · {edu.sub}</span>
                      </h4>
                      <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke={muted} strokeWidth={2}>
                        <path d="M7 15L12 20L17 15" /><path d="M7 9L12 4L17 9" />
                      </svg>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 13, color: muted }}>
                      <span>{edu.period[0]}</span>
                      <span style={{ fontFamily: mono }}>—</span>
                      <span>{edu.period[1]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionPanel>

          <Hatch dark={dark} />

          {/* ── Quote ────────────────────────────────────────────── */}
          <div
            style={{
              borderLeft: `1px solid ${border}`,
              borderRight: `1px solid ${border}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width={40}
              height={40}
              fill="currentColor"
              style={{ color: dark ? "#3f3f46" : "#d4d4d8", marginBottom: 24 }}
            >
              <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
              <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
            </svg>
            <blockquote
              style={{
                fontSize: 20,
                fontWeight: 500,
                fontStyle: "italic",
                color: dark ? "#d4d4d8" : "#3f3f46",
                maxWidth: 560,
                marginBottom: 24,
                lineHeight: 1.6,
              }}
            >
              "{quote.text}"
            </blockquote>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 32, height: 1, background: dark ? "#3f3f46" : "#d4d4d8" }} />
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: dark ? "#71717a" : "#a1a1aa" }}>
                {quote.author}
              </span>
              <span style={{ width: 32, height: 1, background: dark ? "#3f3f46" : "#d4d4d8" }} />
            </div>
          </div>

          <Hatch dark={dark} />

        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer style={{ paddingInline: 8 }}>
        <div
          style={{
            maxWidth: 768,
            margin: "0 auto",
            borderLeft: `1px solid ${border}`,
            borderRight: `1px solid ${border}`,
            position: "relative",
            paddingTop: 2,
          }}
        >
          <Cross pos="bl" />
          <Cross pos="br" />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 16px 12px" }}>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", lineHeight: 1.5 }}>
              <span style={{ fontFamily: mono, fontSize: 12, color: muted }}>{footer.copyright}</span>
              <span style={{ fontFamily: mono, fontSize: 12, color: muted }}>{footer.tagline}</span>
            </div>
            <div style={{ width: 80, height: 80, cursor: "pointer", display: "flex", alignItems: "flex-end", justifyContent: "center", userSelect: "none" }}>
              <span style={{ fontSize: 38, lineHeight: 1 }}>{footer.emoji}</span>
            </div>
          </div>
        </div>

        {/* Bottom dot-grid strip */}
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <div style={{ borderLeft: `1px solid ${border}`, borderRight: `1px solid ${border}` }}>
            <div style={{ padding: 20 }}>
              <div style={{ ...dotGrid, minHeight: 110 }} />
            </div>
          </div>
        </div>
        <div style={{ height: 2 }} />
      </footer>
    </div>
  );
}
