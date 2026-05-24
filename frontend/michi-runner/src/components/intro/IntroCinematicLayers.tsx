import { useEffect, useState, type CSSProperties } from "react";

type ShootingStarColor = "white" | "gold" | "purple" | "green";
type ShootingStarSize = "sm" | "md" | "lg";

interface ShootingStarSpec {
  top: string;
  left: string;
  delay: string;
  duration: string;
  size: ShootingStarSize;
  color: ShootingStarColor;
  trail: boolean;
}

interface BuildingSpec {
  left: string;
  w: string;
  h: string;
  color: string;
  windows?: number;
  neon?: string;
}

const SHOOTING_STARS_EXT: ShootingStarSpec[] = [
  { top: "3%", left: "6%", delay: "0s", duration: "11s", size: "lg", color: "white", trail: true },
  { top: "8%", left: "42%", delay: "-3.5s", duration: "14s", size: "md", color: "gold", trail: true },
  { top: "5%", left: "78%", delay: "-7s", duration: "16s", size: "sm", color: "purple", trail: true },
  { top: "14%", left: "22%", delay: "-9.5s", duration: "13s", size: "md", color: "green", trail: false },
  { top: "2%", left: "58%", delay: "-12s", duration: "18s", size: "sm", color: "white", trail: true },
  { top: "18%", left: "88%", delay: "-5.5s", duration: "12s", size: "lg", color: "gold", trail: true },
  { top: "11%", left: "12%", delay: "-15s", duration: "15s", size: "md", color: "purple", trail: true },
  { top: "6%", left: "65%", delay: "-18s", duration: "17s", size: "sm", color: "green", trail: false },
];

const DEEP_STARS = Array.from({ length: 52 }, (_, i) => ({
  top: `${(i * 13 + 5) % 94}%`,
  left: `${(i * 19 + 11) % 97}%`,
  delay: `${-(i * 0.11)}s`,
  layer: (i % 3) as 0 | 1 | 2,
  tint: (["#fff", "#fde047", "#c4b5fd"] as const)[i % 3],
}));

const AMBIENT_SPARKLES = Array.from({ length: 14 }, (_, i) => ({
  top: `${(i * 23 + 9) % 88}%`,
  left: `${(i * 31 + 4) % 94}%`,
  delay: `${-(i * 1.3)}s`,
  duration: `${2.2 + (i % 3) * 0.6}s`,
}));

const SKYLINE_MOUNTAINS: BuildingSpec[] = [
  { left: "-8%", w: "42vmin", h: "11vmin", color: "#080810" },
  { left: "28%", w: "38vmin", h: "9vmin", color: "#0a0a14" },
  { left: "58%", w: "45vmin", h: "12vmin", color: "#07070f" },
  { left: "85%", w: "30vmin", h: "8vmin", color: "#090912" },
];

const SKYLINE_FAR: BuildingSpec[] = [
  { left: "0%", w: "7vmin", h: "5vmin", color: "#12122a" },
  { left: "6%", w: "5vmin", h: "8vmin", color: "#161633" },
  { left: "12%", w: "8vmin", h: "4vmin", color: "#101028" },
  { left: "20%", w: "11vmin", h: "10vmin", color: "#1a1a3d", windows: 3 },
  { left: "32%", w: "6vmin", h: "6vmin", color: "#141430" },
  { left: "40%", w: "13vmin", h: "12vmin", color: "#1e1e48", windows: 4 },
  { left: "54%", w: "7vmin", h: "7vmin", color: "#151535" },
  { left: "62%", w: "10vmin", h: "9vmin", color: "#181840", windows: 2 },
  { left: "74%", w: "12vmin", h: "11vmin", color: "#1c1c44", windows: 3 },
  { left: "88%", w: "9vmin", h: "5vmin", color: "#111128" },
  { left: "96%", w: "6vmin", h: "8vmin", color: "#141432" },
];

const SKYLINE_MID: BuildingSpec[] = [
  { left: "2%", w: "6vmin", h: "9vmin", color: "#1e1b4b", windows: 4 },
  { left: "9%", w: "5vmin", h: "12vmin", color: "#252360", windows: 5, neon: "#60a5fa" },
  { left: "16%", w: "7vmin", h: "7vmin", color: "#1a1845", windows: 2 },
  { left: "24%", w: "12vmin", h: "14vmin", color: "#2d2a6e", windows: 6, neon: "#a78bfa" },
  { left: "38%", w: "8vmin", h: "10vmin", color: "#221f55", windows: 4 },
  { left: "48%", w: "14vmin", h: "16vmin", color: "#312e81", windows: 8, neon: "#fde047" },
  { left: "64%", w: "7vmin", h: "11vmin", color: "#252260", windows: 3 },
  { left: "72%", w: "11vmin", h: "13vmin", color: "#2a2770", windows: 5, neon: "#4ade80" },
  { left: "86%", w: "9vmin", h: "9vmin", color: "#1e1c50", windows: 3 },
];

const SKYLINE_NEAR: BuildingSpec[] = [
  { left: "4%", w: "5vmin", h: "6vmin", color: "#3730a3", windows: 2, neon: "#fde047" },
  { left: "14%", w: "4vmin", h: "8vmin", color: "#4338ca", neon: "#a78bfa" },
  { left: "26%", w: "6vmin", h: "7vmin", color: "#4c1d95", windows: 3, neon: "#60a5fa" },
  { left: "36%", w: "5vmin", h: "9vmin", color: "#5b21b6", neon: "#4ade80" },
  { left: "46%", w: "7vmin", h: "5vmin", color: "#6d28d9", windows: 2, neon: "#fde047" },
  { left: "56%", w: "5vmin", h: "8vmin", color: "#553c9a", neon: "#fb923c" },
  { left: "68%", w: "6vmin", h: "6vmin", color: "#4c1d95", windows: 2, neon: "#60a5fa" },
  { left: "78%", w: "5vmin", h: "7vmin", color: "#5b21b6", neon: "#fde047" },
  { left: "88%", w: "6vmin", h: "5vmin", color: "#4338ca", neon: "#4ade80" },
];

export function useIntroParallax() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setOffset({ x: nx, y: ny });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return offset;
}

export function parallaxStyle(
  px: number,
  py: number,
  multX: number,
  multY: number,
): CSSProperties {
  return {
    transform: `translate(${px * multX}vmin, ${py * multY}vmin)`,
    willChange: "transform",
  };
}

function BuildingBlock({ b, layer }: { b: BuildingSpec; layer: string }) {
  const winCount = b.windows ?? 0;
  return (
    <div
      className={`intro-building intro-building-${layer}`}
      style={{
        position: "absolute",
        left: b.left,
        bottom: 0,
        width: b.w,
        height: b.h,
        background: b.color,
        border: "0.12vmin solid rgba(0,0,0,0.45)",
      }}
    >
      {winCount > 0 &&
        Array.from({ length: winCount }).map((_, wi) => (
          <span
            key={wi}
            className="intro-building-window"
            style={{
              left: `${12 + Math.floor(((wi * 76) / Math.max(winCount, 1)) % 76)}%`,
              top: `${18 + (wi % 4) * 18}%`,
              animationDelay: `${-(wi * 0.65 + layer.length * 0.1)}s`,
            }}
          />
        ))}
      {b.neon && (
        <span
          className="intro-building-neon"
          style={{ background: b.neon, boxShadow: `0 0 0.8vmin ${b.neon}` }}
        />
      )}
    </div>
  );
}

export function IntroEpicAtmosphere() {
  return (
    <div className="intro-atmosphere" aria-hidden>
      <div className="intro-nebula intro-nebula-purple" />
      <div className="intro-nebula intro-nebula-blue" />
      <div className="intro-glow-orb intro-glow-orb-gold" />
      <div className="intro-glow-orb intro-glow-orb-purple" />
      <div className="intro-glow-orb intro-glow-orb-green" />
      <div className="intro-vignette intro-vignette-cinematic" />
    </div>
  );
}

export function IntroEpicSkyline() {
  const renderLayer = (buildings: BuildingSpec[], className: string) => (
    <div
      className={className}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "130%",
        height: "100%",
      }}
    >
      {buildings.map((b, i) => (
        <BuildingBlock key={`${className}-${i}`} b={b} layer={className} />
      ))}
    </div>
  );

  return (
    <div className="intro-skyline intro-skyline-epic" aria-hidden>
      <div className="intro-city-ambient-glow" aria-hidden />
      {renderLayer(SKYLINE_MOUNTAINS, "intro-skyline-mountains")}
      {renderLayer(SKYLINE_FAR, "intro-skyline-far")}
      {renderLayer(SKYLINE_MID, "intro-skyline-mid")}
      {renderLayer(SKYLINE_NEAR, "intro-skyline-near")}
    </div>
  );
}

export function IntroCinematicSky({
  parallax,
}: {
  parallax: { x: number; y: number };
}) {
  return (
    <div className="intro-cinematic-sky" aria-hidden>
      <div
        className="intro-sky-layer intro-sky-layer-deep"
        style={parallaxStyle(parallax.x, parallax.y, 0.25, 0.15)}
      >
        {DEEP_STARS.filter((s) => s.layer === 0).map((s, i) => (
          <span
            key={`deep0-${i}`}
            className="intro-deep-star intro-star-dim"
            style={{
              top: s.top,
              left: s.left,
              background: s.tint,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>
      <div
        className="intro-sky-layer intro-sky-layer-mid"
        style={parallaxStyle(parallax.x, parallax.y, 0.5, 0.35)}
      >
        {DEEP_STARS.filter((s) => s.layer === 1).map((s, i) => (
          <span
            key={`deep1-${i}`}
            className="intro-deep-star intro-star-bright"
            style={{
              top: s.top,
              left: s.left,
              background: s.tint,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>
      <div
        className="intro-sky-layer intro-sky-layer-near"
        style={parallaxStyle(parallax.x, parallax.y, 0.85, 0.55)}
      >
        {DEEP_STARS.filter((s) => s.layer === 2).map((s, i) => (
          <span
            key={`deep2-${i}`}
            className="intro-deep-star intro-star-flash"
            style={{
              top: s.top,
              left: s.left,
              background: s.tint,
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>
      {SHOOTING_STARS_EXT.map((s, i) => (
        <div
          key={`shoot-ext-${i}`}
          className={[
            "intro-shooting-star",
            "intro-shooting-star-ext",
            `intro-shooting-star--${s.size}`,
            `intro-shooting-star--${s.color}`,
            s.trail ? "intro-shooting-star--trail" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            top: s.top,
            left: s.left,
            animationDuration: s.duration,
            animationDelay: s.delay,
          }}
        />
      ))}
      {AMBIENT_SPARKLES.map((s, i) => (
        <div
          key={`amb-spark-${i}`}
          className="intro-ambient-spark"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
      <div className="intro-energy-lines" aria-hidden>
        <div className="intro-energy-line intro-energy-line-1" />
        <div className="intro-energy-line intro-energy-line-2" />
        <div className="intro-energy-line intro-energy-line-3" />
      </div>
    </div>
  );
}

export const BTN_SPARKLES = [
  { top: "-25%", left: "10%", delay: "0s" },
  { top: "-15%", left: "85%", delay: "-0.5s" },
  { top: "110%", left: "20%", delay: "-1s" },
  { top: "105%", left: "75%", delay: "-0.3s" },
  { top: "50%", left: "-8%", delay: "-1.4s" },
  { top: "40%", left: "108%", delay: "-0.8s" },
] as const;
