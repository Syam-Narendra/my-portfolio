interface HatchProps {
  dark: boolean;
}

export function Hatch({ dark }: HatchProps) {
  const c = dark ? "rgba(82,82,91,.45)" : "rgba(161,161,170,.35)";
  const b = dark ? "#27272a" : "#e4e4e7";
  return (
    <div
      style={{
        height: 24,
        backgroundImage: `repeating-linear-gradient(315deg,${c} 0,${c} 1px,transparent 0,transparent 50%)`,
        backgroundSize: "10px 10px",
        borderTop: `1px solid ${b}`,
        borderBottom: `1px solid ${b}`,
      }}
    />
  );
}
