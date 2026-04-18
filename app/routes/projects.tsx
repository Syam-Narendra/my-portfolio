import { useState } from "react";
import type { MetaFunction } from "react-router";

import {
  projects,
  projectsMeta,
  footer,
  type Project,
} from "~/data/portfolio";
import { Hatch } from "~/components/Hatch";
import { Navbar } from "~/components/Navbar";
import { SectionPanel } from "~/components/SectionPanel";

export const meta: MetaFunction = () => [
  { title: projectsMeta.title },
  { name: "description", content: projectsMeta.description },
];

function ProjectCard({ project, dark }: { project: Project; dark: boolean }) {
  const border = dark ? "#27272a" : "#e4e4e7";
  const muted = dark ? "#a1a1aa" : "#71717a";
  const fg = dark ? "#f4f4f5" : "#09090b";
  const cardBg = dark ? "#18181b" : "#ffffff";
  const tagBg = dark ? "#27272a" : "#f4f4f5";
  const mono = "'JetBrains Mono','Courier New',monospace";

  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${border}`,
        background: cardBg,
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = dark
          ? "0 12px 32px rgba(0,0,0,0.5)"
          : "0 12px 32px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Cover image */}
      <div style={{ aspectRatio: "16 / 9", overflow: "hidden" }}>
        <img
          src={project.imageUrl}
          alt={project.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        />
      </div>

      {/* Content */}
      <div style={{ padding: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <h3
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: fg,
              margin: 0,
            }}
          >
            {project.title}
          </h3>

          {/* Link icons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View source"
                style={{ color: muted, lineHeight: 0, transition: "color 0.2s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = fg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = muted;
                }}
              >
                <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                title="View live"
                style={{ color: muted, lineHeight: 0, transition: "color 0.2s" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = fg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = muted;
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
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}
          </div>
        </div>

        <p
          style={{
            fontSize: 13,
            color: muted,
            lineHeight: 1.6,
            margin: 0,
            marginBottom: 12,
          }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: mono,
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 6,
                border: `1px solid ${border}`,
                background: tagBg,
                color: muted,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [dark, setDark] = useState(true);

  const bg = dark ? "#09090b" : "#ffffff";
  const fg = dark ? "#f4f4f5" : "#09090b";
  const border = dark ? "#27272a" : "#e4e4e7";
  const muted = dark ? "#a1a1aa" : "#71717a";
  const mono = "'JetBrains Mono','Courier New',monospace";

  const dotGrid = {
    backgroundImage: `radial-gradient(${dark ? "rgba(113,113,122,.6)" : "rgba(161,161,170,.5)"} 1px, transparent 0)`,
    backgroundSize: "10px 10px",
  } as React.CSSProperties;

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
      <Navbar dark={dark} onToggleTheme={() => setDark((d) => !d)} />

      <main style={{ paddingInline: 8, overflow: "hidden" }}>
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <Hatch dark={dark} />

          {/* ── Page Header ──────────────────────────────────────── */}
          <div
            style={{
              borderLeft: `1px solid ${border}`,
              borderRight: `1px solid ${border}`,
              padding: "20px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <svg
                viewBox="0 0 24 24"
                width={26}
                height={26}
                fill="none"
                stroke={fg}
                strokeWidth={1.5}
              >
                <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M17 18h1" /><path d="M12 18h1" /><path d="M7 18h1" />
              </svg>
              <h1
                style={{
                  fontFamily: mono,
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  margin: 0,
                }}
              >
                {projectsMeta.heading}
              </h1>
            </div>
            <p style={{ fontSize: 14, color: muted, margin: 0 }}>
              {projectsMeta.subheading}
            </p>
          </div>

          <Hatch dark={dark} />

          {/* ── Projects Grid ────────────────────────────────────── */}
          <SectionPanel id="projects" title="All Projects" dark={dark}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 16,
              }}
            >
              {projects.map((project) => (
                <ProjectCard key={project.title} project={project} dark={dark} />
              ))}
            </div>
          </SectionPanel>

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
            paddingTop: 2,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 16px 12px",
            }}
          >
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", lineHeight: 1.5 }}>
              <span style={{ fontFamily: mono, fontSize: 12, color: muted }}>
                {footer.copyright}
              </span>
              <span style={{ fontFamily: mono, fontSize: 12, color: muted }}>
                {footer.tagline}
              </span>
            </div>
            <div
              style={{
                width: 80,
                height: 80,
                cursor: "pointer",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                userSelect: "none",
              }}
            >
              <span style={{ fontSize: 38, lineHeight: 1 }}>{footer.emoji}</span>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          <div
            style={{
              borderLeft: `1px solid ${border}`,
              borderRight: `1px solid ${border}`,
            }}
          >
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
