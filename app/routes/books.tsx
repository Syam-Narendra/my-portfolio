import { useState } from "react";
import type { MetaFunction } from "react-router";

import {
  booksCurrentlyReading,
  booksMeta,
  booksRead,
  footer,
  type Book,
} from "~/data/portfolio";
import { Hatch } from "~/components/Hatch";
import { Navbar } from "~/components/Navbar";
import { SectionPanel } from "~/components/SectionPanel";

export const meta: MetaFunction = () => [
  { title: booksMeta.title },
  { name: "description", content: booksMeta.description },
];

function StarRating({ rating, dark }: { rating: number; dark: boolean }) {
  const emptyStroke = dark ? "#52525b" : "#d4d4d8";
  const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFull = rating >= star;
        const isHalf = !isFull && rating >= star - 0.5;

        return (
          <svg
            key={star}
            viewBox="0 0 24 24"
            className="book-star"
            strokeWidth={2}
          >
            {isHalf ? (
              <>
                <defs>
                  <clipPath id={`half-${star}`}>
                    <rect x="0" y="0" width="12" height="24" />
                  </clipPath>
                </defs>
                {/* Filled left half */}
                <path d={starPath} fill="#eab308" stroke="#eab308" clipPath={`url(#half-${star})`} />
                {/* Empty right half */}
                <path d={starPath} fill="none" stroke={emptyStroke} />
              </>
            ) : (
              <path
                d={starPath}
                fill={isFull ? "#eab308" : "none"}
                stroke={isFull ? "#eab308" : emptyStroke}
              />
            )}
          </svg>
        );
      })}
    </div>
  );
}

function BookCard({ book, dark }: { book: Book; dark: boolean }) {
  const border = dark ? "#27272a" : "#e4e4e7";
  const muted = dark ? "#a1a1aa" : "#71717a";
  const fg = dark ? "#f4f4f5" : "#09090b";
  const cardBg = dark ? "#18181b" : "#ffffff";
  const tagBg = dark ? "#27272a" : "#f4f4f5";
  const mono = "'JetBrains Mono','Courier New',monospace";
  const isTelugu = book.language === "telugu";
  const textFont = isTelugu ? "'Ramabhadra', sans-serif" : "'Inter', system-ui, sans-serif";

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        padding: 16,
        borderRadius: 12,
        border: `1px solid ${border}`,
        background: cardBg,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = dark
          ? "0 8px 24px rgba(0,0,0,0.4)"
          : "0 8px 24px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Cover */}
      <div
        style={{
          width: 80,
          minWidth: 80,
          height: 120,
          borderRadius: 8,
          overflow: "hidden",
          border: `1px solid ${border}`,
          flexShrink: 0,
        }}
      >
        <img
          src={book.coverUrl}
          alt={book.title}
          width={80}
          height={120}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Info */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 0 }}>
        <h3 style={{ fontFamily: textFont, fontSize: isTelugu ? 17 : 15, fontWeight: 600, color: fg, lineHeight: 1.3, margin: 0 }}>
          {book.title}
        </h3>
        <span style={{ fontFamily: textFont, fontSize: 13, color: muted }}>
          {isTelugu ? "" : "by "}{book.author}
        </span>

        <span
          style={{
            fontFamily: isTelugu ? textFont : mono,
            fontSize: 11,
            padding: "2px 8px",
            borderRadius: 6,
            border: `1px solid ${border}`,
            background: tagBg,
            color: muted,
            alignSelf: "flex-start",
          }}
        >
          {book.genre}
        </span>

        {book.rating !== undefined && (
          <div style={{ marginTop: 2 }}>
            <StarRating rating={book.rating} dark={dark} />
          </div>
        )}

        {book.review && (
          <p
            style={{
              fontFamily: textFont,
              fontSize: 12,
              color: muted,
              lineHeight: 1.6,
              margin: 0,
              marginTop: 2,
              fontStyle: isTelugu ? "normal" : "italic",
            }}
          >
            "{book.review}"
          </p>
        )}
      </div>
    </div>
  );
}

export default function Books() {
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
            <h1
              style={{
                fontFamily: mono,
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                margin: 0,
                marginBottom: 12,
              }}
            >
              {booksMeta.heading}
            </h1>
            <p
              style={{
                fontSize: 14,
                color: muted,
                margin: 0,
                lineHeight: 1.7,
                whiteSpace: "pre-line",
              }}
            >
              {booksMeta.subheading}
            </p>
          </div>

          <Hatch dark={dark} />

          {/* ── Currently Reading ─────────────────────────────────── */}
          <SectionPanel id="currently-reading" title="Currently Reading" dark={dark}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#22c55e",
                  boxShadow: "0 0 8px rgba(34,197,94,0.5)",
                  animation: "pulse 2s infinite",
                }}
              />
              <span style={{ fontSize: 13, color: muted, fontFamily: mono }}>
                {booksCurrentlyReading.length} book{booksCurrentlyReading.length !== 1 ? "s" : ""} in progress
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {booksCurrentlyReading.map((book) => (
                <BookCard key={book.title} book={book} dark={dark} />
              ))}
            </div>
          </SectionPanel>

          <Hatch dark={dark} />

          {/* ── Read ──────────────────────────────────────────────── */}
          <SectionPanel id="read" title="Read" dark={dark}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width={16}
                height={16}
                fill="none"
                stroke={muted}
                strokeWidth={2}
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
              <span style={{ fontSize: 13, color: muted, fontFamily: mono }}>
                {booksRead.length} book{booksRead.length !== 1 ? "s" : ""} completed
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {booksRead.map((book) => (
                <BookCard key={book.title} book={book} dark={dark} />
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

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .book-star {
          width: 14px;
          height: 14px;
        }
        @media (min-width: 768px) {
          .book-star {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </div>
  );
}
