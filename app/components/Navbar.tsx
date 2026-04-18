import { useLocation } from "react-router";
import { nav } from "~/data/portfolio";

interface NavbarProps {
  dark: boolean;
  onToggleTheme: () => void;
}

export function Navbar({ dark, onToggleTheme }: NavbarProps) {
  const location = useLocation();
  const bg = dark ? "#09090b" : "#ffffff";
  const border = dark ? "#27272a" : "#e4e4e7";
  const muted = dark ? "#a1a1aa" : "#71717a";
  const fg = dark ? "#f4f4f5" : "#09090b";
  const mono = "'JetBrains Mono','Courier New',monospace";

  function isActive(href: string) {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: bg,
        borderBottom: `1px solid ${border}`,
        padding: "8px 8px 0",
      }}
    >
      <div
        style={{
          maxWidth: 768,
          margin: "0 auto",
          borderLeft: `1px solid ${border}`,
          borderRight: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 48,
          paddingInline: 8,
          gap: 8,
        }}
      >
        {/* Logo */}
        <a href="/" aria-label="Home" style={{ lineHeight: 0 }}>
          <img
            src={nav.logoUrl}
            alt={nav.logoAlt}
            width={36}
            height={36}
            style={{ display: "block" }}
          />
        </a>

        <div style={{ flex: 1 }} />

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {nav.links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontFamily: mono,
                fontSize: 13,
                fontWeight: isActive(href) ? 600 : 500,
                color: isActive(href) ? fg : muted,
                textDecoration: "none",
                transition: "color .2s",
              }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
         

          <span style={{ width: 1, height: 16, background: border }} />

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            title="Toggle theme"
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              color: muted,
            }}
          >
            {dark ? (
              <svg
                viewBox="0 0 24 24"
                width={15}
                height={15}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx={12} cy={12} r={4} />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width={15}
                height={15}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
