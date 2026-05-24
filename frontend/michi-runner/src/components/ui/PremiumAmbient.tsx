import { useMemo } from "react";

type AmbientVariant = "default" | "gold" | "purple" | "danger" | "celebration";

interface PremiumAmbientProps {
  variant?: AmbientVariant;
  className?: string;
  sparkleCount?: number;
}

const GLOW: Record<AmbientVariant, string> = {
  default: "rgba(167, 139, 250, 0.2)",
  gold: "rgba(253, 224, 71, 0.25)",
  purple: "rgba(167, 139, 250, 0.28)",
  danger: "rgba(248, 113, 113, 0.2)",
  celebration: "rgba(74, 222, 128, 0.22)",
};

export function PremiumAmbient({
  variant = "default",
  className = "",
  sparkleCount = 10,
}: PremiumAmbientProps) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: sparkleCount }, (_, i) => ({
        id: i,
        left: `${8 + ((i * 19) % 84)}%`,
        top: `${10 + ((i * 23) % 75)}%`,
        delay: `${(i * 0.35) % 2.8}s`,
        size: i % 3 === 0 ? "0.45vmin" : "0.3vmin",
      })),
    [sparkleCount],
  );

  return (
    <div className={`premium-ambient ${className}`.trim()} aria-hidden>
      <div className="premium-ambient-glow premium-ambient-glow--tl" style={{ background: GLOW[variant] }} />
      <div className="premium-ambient-glow premium-ambient-glow--br" style={{ background: GLOW[variant] }} />
      <div className="premium-ambient-energy" />
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="premium-ambient-sparkle"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}
