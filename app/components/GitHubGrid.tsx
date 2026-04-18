const CONTRIB_COLORS: Record<number, string> = {
  0: "#161b22",
  1: "#0e4429",
  2: "#006d32",
  3: "#26a641",
  4: "#39d353",
};

const CONTRIB_COLORS_LIGHT: Record<number, string> = {
  0: "#ebedf0",
  1: "#9be9a8",
  2: "#40c463",
  3: "#30a14e",
  4: "#216e39",
};

export interface ContribDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubStats {
  totalContributions: number;
  weeks: ContribDay[][];
}

interface GitHubGridProps {
  dark?: boolean;
  data: GitHubStats | null;
}

export function GitHubGrid({ dark = true, data }: GitHubGridProps) {
  const colors = dark ? CONTRIB_COLORS : CONTRIB_COLORS_LIGHT;
  const muted = dark ? "#a1a1aa" : "#71717a";
  const mono = "'JetBrains Mono','Courier New',monospace";

  if (!data) {
    // Fallback: show empty grid with message
    const fallbackCells: { w: number; d: number }[] = [];
    for (let w = 0; w < 52; w++) {
      for (let d = 0; d < 7; d++) {
        fallbackCells.push({ w, d });
      }
    }
    return (
      <div>
        <svg width={52 * 13} height={7 * 13} style={{ display: "block" }}>
          {fallbackCells.map(({ w, d }, i) => (
            <rect
              key={i}
              x={w * 13}
              y={d * 13}
              width={11}
              height={11}
              rx={2}
              fill={colors[0]}
            />
          ))}
        </svg>
        <p style={{ fontFamily: mono, fontSize: 11, color: muted, marginTop: 8, opacity: 0.7 }}>
          Unable to load GitHub activity — check back later
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Contribution count */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontFamily: mono,
            fontSize: 12,
            color: muted,
          }}
        >
          {data.totalContributions.toLocaleString()} contributions in the last year
        </span>
      </div>

      {/* Grid */}
      <svg width={52 * 13} height={7 * 13} style={{ display: "block" }}>
        {data.weeks.map((week, wi) =>
          week.map((day, di) => (
            <rect
              key={`${wi}-${di}`}
              x={wi * 13}
              y={di * 13}
              width={11}
              height={11}
              rx={2}
              fill={colors[day.level] || colors[0]}
            >
              <title>{`${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}`}</title>
            </rect>
          ))
        )}
      </svg>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginTop: 8,
          justifyContent: "flex-end",
        }}
      >
        <span style={{ fontFamily: mono, fontSize: 10, color: muted, marginRight: 4 }}>
          Less
        </span>
        {[0, 1, 2, 3, 4].map((lv) => (
          <span
            key={lv}
            style={{
              width: 11,
              height: 11,
              borderRadius: 2,
              background: colors[lv],
              display: "inline-block",
            }}
          />
        ))}
        <span style={{ fontFamily: mono, fontSize: 10, color: muted, marginLeft: 4 }}>
          More
        </span>
      </div>
    </div>
  );
}
