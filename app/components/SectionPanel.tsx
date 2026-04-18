import type { ReactNode } from "react";

interface SectionPanelProps {
  id: string;
  title: string;
  dark: boolean;
  children: ReactNode;
}

export function SectionPanel({ id, title, dark, children }: SectionPanelProps) {
  const b = dark ? "#27272a" : "#e4e4e7";
  const titleColor = dark ? "#f4f4f5" : "#09090b";
  return (
    <section
      id={id}
      style={{ borderLeft: `1px solid ${b}`, borderRight: `1px solid ${b}` }}
    >
      <header style={{ padding: "8px 16px", borderBottom: `1px solid ${b}` }}>
        <h2
          style={{
            fontFamily: "'JetBrains Mono','Courier New',monospace",
            fontSize: 26,
            fontWeight: 700,
            color: titleColor,
            margin: 0,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h2>
      </header>
      <div style={{ padding: 16 }}>{children}</div>
    </section>
  );
}
