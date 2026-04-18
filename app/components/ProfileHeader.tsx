import { profile } from "~/data/portfolio";

interface ProfileHeaderProps {
  dark: boolean;
  status: string;
  visitorCount: number;
}

export function ProfileHeader({ dark, status, visitorCount }: ProfileHeaderProps) {
  const border = dark ? "#27272a" : "#e4e4e7";
  const muted = dark ? "#a1a1aa" : "#71717a";
  const fg = dark ? "#f4f4f5" : "#09090b";
  const mono = "'JetBrains Mono','Courier New',monospace";

  return (
    <div
      style={{
        display: "flex",
        borderLeft: `1px solid ${border}`,
        borderRight: `1px solid ${border}`,
        borderBottom: `1px solid ${border}`,
        position: "relative",
      }}
    >
      {/* Corner crosshairs */}
      {(["tl", "tr"] as const).map((pos) => (
        <div
          key={pos}
          style={{
            position: "absolute",
            width: 12,
            height: 12,
            top: 0,
            ...(pos === "tl" ? { left: 0, transform: "translate(-50%,-50%)" } : { right: 0, transform: "translate(50%,-50%)" }),
          }}
        >
          <span style={{ position: "absolute", width: "100%", height: 1, top: 5, background: dark ? "#52525b" : "#a1a1aa" }} />
          <span style={{ position: "absolute", height: "100%", width: 1, left: 5, background: dark ? "#52525b" : "#a1a1aa" }} />
        </div>
      ))}

      {/* Avatar */}
      <div style={{ padding: "8px 12px", display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 112,
            height: 112,
            borderRadius: 14,
            border: `1px solid ${border}`,
            padding: 4,
          }}
        >
          <div
            style={{
              overflow: "hidden",
              borderRadius: 10,
              width: "100%",
              height: "100%",
            }}
          >
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              draggable={false}
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 4,
          paddingLeft: 4,
          paddingRight: 16,
          paddingBlock: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 4,
            marginBottom: 4,
          }}
        >
          <button
            style={{
              width: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: muted,
              borderRadius: 6,
            }}
          >
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={12} cy={12} r={9} />
              <path d="M12 3l0 18" />
              <path d="M12 9l4.65-4.65" />
              <path d="M12 14.3l7.37-7.37" />
              <path d="M12 19.6l8.85-8.85" />
            </svg>
          </button>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontFamily: mono, fontSize: 12, color: muted }}>
            <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0" />
              <path d="M21 12c-2.4 4-5.4 6-9 6c-3.6 0-6.6-2-9-6c2.4-4 5.4-6 9-6c3.6 0 6.6 2 9 6" />
            </svg>
            <span>{visitorCount.toLocaleString()}</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1
            style={{
              fontFamily: mono,
              fontSize: 22,
              fontWeight: 900,
              lineHeight: 1,
              color: fg,
              letterSpacing: "-0.02em",
            }}
          >
            {profile.name}
          </h1>
          {/* Verified badge */}
          <svg viewBox="0 0 24 24" width={18} height={18} fill="#3b82f6" aria-label="Verified">
            <path d="M24 12a4.454 4.454 0 0 0-2.564-3.91 4.437 4.437 0 0 0-.948-4.578 4.436 4.436 0 0 0-4.577-.948A4.44 4.44 0 0 0 12 0a4.423 4.423 0 0 0-3.9 2.564 4.434 4.434 0 0 0-2.43-.178 4.425 4.425 0 0 0-2.158 1.126 4.42 4.42 0 0 0-1.12 2.156 4.42 4.42 0 0 0 .183 2.421A4.456 4.456 0 0 0 0 12a4.465 4.465 0 0 0 2.576 3.91 4.433 4.433 0 0 0 .936 4.577 4.459 4.459 0 0 0 4.577.95A4.454 4.454 0 0 0 12 24a4.439 4.439 0 0 0 3.91-2.563 4.26 4.26 0 0 0 5.526-5.526A4.453 4.453 0 0 0 24 12Zm-13.709 4.917-4.38-4.378 1.652-1.663 2.646 2.646L15.83 7.4l1.72 1.591-7.258 7.926Z" />
          </svg>
        </div>

        <p style={{ fontFamily: mono, fontSize: 13, color: muted, lineHeight: 1.4 }}>
          {profile.tagline}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }} aria-live="polite">
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              flexShrink: 0,
              background: status.includes("Available") ? "#22c55e" : "rgba(161,161,170,.4)",
              transition: "background .6s",
            }}
          />
          <span style={{ fontFamily: mono, fontSize: 12, color: muted }}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
