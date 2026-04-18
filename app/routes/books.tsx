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
      className="book-card"
      style={{
        borderRadius: 12,
        border: `1px solid ${border}`,
        background: cardBg,
        overflow: "hidden",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = dark
          ? "0 12px 32px rgba(0,0,0,0.5)"
          : "0 12px 32px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Cover — tall and prominent */}
      <div
        style={{
          aspectRatio: "3 / 4",
          overflow: "hidden",
          borderBottom: `1px solid ${border}`,
          background: dark ? "#111" : "#f0f0f0",
        }}
      >
        <img
          src={book.coverUrl}
          alt={book.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
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

      {/* Info below cover */}
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        <h3
          style={{
            fontFamily: textFont,
            fontSize: isTelugu ? 24 : 14,
            fontWeight: 400,
            color: fg,
            lineHeight: 1.3,
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {book.title}
        </h3>

        <span
          style={{
            fontFamily: textFont,
            fontSize: isTelugu ? 18 : 12,
            color: muted,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {isTelugu ? "" : "by "}{book.author}
        </span>

       <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 6,
    alignItems: "flex-start",
  }}
>
  <span
    style={{
      fontFamily: isTelugu ? textFont : mono,
      fontSize: 15,
      padding: "1px 7px",
      borderRadius: 5,
      border: `1px solid ${border}`,
      background: tagBg,
      color: muted,
    }}
  >
    {book.genre}
  </span>

  {book.rating !== undefined && (
    <StarRating rating={book.rating} dark={dark} />
  )}
</div>
        {book.review && (
          <p
            style={{
              fontFamily: textFont,
              fontSize: isTelugu ? 13 : 11,
              color: muted,
              lineHeight: 1.5,
              margin: 0,
              marginTop: 2,
              fontStyle: isTelugu ? "normal" : "italic",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
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
            <div className="books-grid">
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
            <div className="books-grid">
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
            width: 18px;
            height: 18px;
          }
        }
        .books-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }
        @media (min-width: 540px) {
          .books-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
