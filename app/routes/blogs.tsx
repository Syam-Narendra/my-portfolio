import { useState } from "react";
import type { MetaFunction } from "react-router";

import {
  blogs,
  blogsMeta,
  footer,
  type BlogPost,
} from "~/data/portfolio";
import { Hatch } from "~/components/Hatch";
import { Navbar } from "~/components/Navbar";
import { SectionPanel } from "~/components/SectionPanel";

export const meta: MetaFunction = () => [
  { title: blogsMeta.title },
  { name: "description", content: blogsMeta.description },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function BlogCard({ post, dark }: { post: BlogPost; dark: boolean }) {
  const border = dark ? "#27272a" : "#e4e4e7";
  const muted = dark ? "#a1a1aa" : "#71717a";
  const fg = dark ? "#f4f4f5" : "#09090b";
  const cardBg = dark ? "#18181b" : "#ffffff";
  const tagBg = dark ? "#27272a" : "#f4f4f5";
  const mono = "'JetBrains Mono','Courier New',monospace";

  return (
    <article
      style={{
        borderRadius: 12,
        border: `1px solid ${border}`,
        background: cardBg,
        overflow: "hidden",
        cursor: "pointer",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = dark
          ? "0 8px 24px rgba(0,0,0,0.4)"
          : "0 8px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Cover image — compact */}
      <div style={{ height: 120, overflow: "hidden" }}>
        <img
          src={post.coverUrl}
          alt={post.title}
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
      <div style={{ padding: 12, flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
        {/* Date + Read time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: muted,
            fontFamily: mono,
          }}
        >
          <span>{formatDate(post.date)}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: muted }} />
          <span>{post.readTime}</span>
        </div>

        <h3
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: fg,
            margin: 0,
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.title}
        </h3>

        <p
          style={{
            fontSize: 12,
            color: muted,
            lineHeight: 1.5,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {post.excerpt}
        </p>

        {/* Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 2 }}>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: mono,
                fontSize: 10,
                padding: "1px 6px",
                borderRadius: 5,
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
    </article>
  );
}

export default function Blogs() {
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
                <path d="M12 20h9" />
                <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
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
                {blogsMeta.heading}
              </h1>
            </div>
            <p style={{ fontSize: 14, color: muted, margin: 0 }}>
              {blogsMeta.subheading}
            </p>
          </div>

          <Hatch dark={dark} />

          {/* ── Blog Posts Grid ───────────────────────────────────── */}
          <SectionPanel id="posts" title="All Posts" dark={dark}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 14,
              }}
            >
              {blogs.map((post) => (
                <BlogCard key={post.slug} post={post} dark={dark} />
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
