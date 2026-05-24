import { useMemo } from "react";
import type { GamePhase } from "../types/game";

interface RunJuiceProps {
  phase: GamePhase;
  isPaused: boolean;
  comboCount: number;
  timeLeft: number;
  cityColor: string;
}

export function RunJuice({ phase, isPaused, comboCount, timeLeft, cityColor }: RunJuiceProps) {
  const active = (phase === "running" || phase === "decision") && !isPaused;

  const urgent = timeLeft <= 10;
  const critical = timeLeft <= 5;
  const comboActive = comboCount >= 2;

  const speedLines = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        top: `${8 + i * 11}%`,
        width: `${18 + (i % 3) * 8}%`,
        delay: `${i * 0.12}s`,
        opacity: 0.04 + (i % 3) * 0.02,
      })),
    [],
  );

  const dustPuffs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        delay: `${i * 0.35}s`,
        size: 0.35 + (i % 3) * 0.15,
      })),
    [],
  );

  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${5 + ((i * 17) % 90)}%`,
        top: `${10 + ((i * 23) % 55)}%`,
        delay: `${(i * 0.4) % 2.5}s`,
        size: i % 3 === 0 ? "0.45vmin" : "0.3vmin",
      })),
    [],
  );

  if (!active) return null;

  const intensity = critical ? 1 : urgent ? 0.65 : comboActive ? 0.5 + comboCount * 0.08 : 0.35;

  return (
    <div className="run-juice-root" aria-hidden>
      <div
        className={`run-juice-vignette${critical ? " run-juice-vignette--critical" : urgent ? " run-juice-vignette--urgent" : ""}`}
        style={
          comboActive && !critical
            ? { boxShadow: `inset 0 0 12vmin ${cityColor}33` }
            : undefined
        }
      />

      <div
        className="run-juice-combo-glow"
        style={{
          opacity: comboActive ? Math.min(0.7, 0.25 + comboCount * 0.12) : 0,
          background: `radial-gradient(ellipse 50% 35% at 15% 82%, ${cityColor}55 0%, transparent 70%)`,
        }}
      />

      <div className="run-juice-speed-lines" style={{ opacity: intensity * 0.9 }}>
        {speedLines.map((line) => (
          <div
            key={line.id}
            className="run-juice-speed-line"
            style={{
              top: line.top,
              width: line.width,
              opacity: line.opacity * (urgent ? 1.8 : 1),
              animationDelay: line.delay,
            }}
          />
        ))}
      </div>

      <div className="run-juice-dust-zone">
        {dustPuffs.map((p) => (
          <div
            key={p.id}
            className="run-juice-dust"
            style={{
              width: `${p.size}vmin`,
              height: `${p.size * 0.6}vmin`,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <div className="run-juice-sparkles">
        {sparkles.map((s) => (
          <div
            key={s.id}
            className="run-juice-sparkle"
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

      {comboActive && (
        <div
          className="run-juice-trail"
          style={{
            opacity: Math.min(0.85, 0.3 + comboCount * 0.15),
            background: `linear-gradient(90deg, transparent 0%, ${cityColor}44 40%, transparent 100%)`,
          }}
        />
      )}
    </div>
  );
}
