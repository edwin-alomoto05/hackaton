import {
  IntroCinematicSky,
  IntroEpicAtmosphere,
  IntroEpicSkyline,
  useIntroParallax,
} from "../intro/IntroCinematicLayers";

const FLOAT_COINS = [
  { top: "14%", left: "4%", delay: "0s" },
  { top: "72%", left: "6%", delay: "-1.4s" },
  { top: "22%", right: "5%", delay: "-0.5s" },
  { top: "65%", right: "8%", delay: "-2s" },
  { top: "40%", left: "10%", delay: "-1.1s" },
  { top: "55%", right: "12%", delay: "-0.8s" },
] as const;

const AMBIENT_SPARKS = [
  { top: "18%", left: "22%" },
  { top: "32%", left: "88%" },
  { top: "58%", left: "15%" },
  { top: "78%", left: "75%" },
  { top: "45%", left: "50%" },
] as const;

export function MenuCinematicBackground({ showSkyline = true }: { showSkyline?: boolean }) {
  const parallax = useIntroParallax();

  return (
    <div className="menu-cinematic-root" aria-hidden>
      <IntroEpicAtmosphere />
      <IntroCinematicSky parallax={parallax} />
      {showSkyline && <IntroEpicSkyline />}
      <div className="menu-cinematic-gradient" />
      <div className="menu-scanlines" />

      {FLOAT_COINS.map((coin, i) => (
        <div
          key={`menu-coin-${i}`}
          className="intro-float-coin menu-float-coin"
          style={{
            top: coin.top,
            left: "left" in coin ? coin.left : undefined,
            right: "right" in coin ? coin.right : undefined,
            animationDelay: coin.delay,
          }}
        />
      ))}

      {AMBIENT_SPARKS.map((s, i) => (
        <div
          key={`menu-spark-${i}`}
          className="intro-sparkle menu-ambient-spark"
          style={{
            top: s.top,
            left: s.left,
            animationDelay: `${-i * 0.55}s`,
          }}
        />
      ))}

      <div className="menu-energy-lines">
        <div className="menu-energy-line menu-energy-line-1" />
        <div className="menu-energy-line menu-energy-line-2" />
      </div>
    </div>
  );
}

export function CountdownCinematicBackground() {
  const parallax = useIntroParallax();

  return (
    <div className="countdown-cinematic-root" aria-hidden>
      <IntroEpicAtmosphere />
      <IntroCinematicSky parallax={parallax} />
      <IntroEpicSkyline />
      <div className="countdown-cinematic-vignette" />
      <div className="menu-scanlines menu-scanlines-countdown" />
      <div className="countdown-speed-lines" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="intro-sparkle countdown-bg-spark"
          style={{
            top: `${12 + i * 14}%`,
            left: `${8 + i * 15}%`,
            animationDelay: `${-i * 0.35}s`,
          }}
        />
      ))}
    </div>
  );
}
