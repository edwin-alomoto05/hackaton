import beniBg from "../assets/background/beni.png";
import {
  BTN_SPARKLES,
  IntroCinematicSky,
  IntroEpicAtmosphere,
  IntroEpicSkyline,
  useIntroParallax,
} from "./intro/IntroCinematicLayers";

interface IntroScreenProps {
  onStart: () => void;
}

const FLOAT_COINS = [
  { top: "18%", left: "6%", size: "2.2vmin", delay: "0s" },
  { top: "62%", left: "4%", size: "1.8vmin", delay: "-1.2s" },
  { top: "28%", right: "5%", size: "2vmin", delay: "-0.6s" },
  { top: "70%", right: "7%", size: "2.4vmin", delay: "-1.8s" },
] as const;

const SIDE_SPARKLES = [
  { top: "22%", left: "12%" },
  { top: "48%", left: "8%" },
  { top: "35%", right: "10%" },
  { top: "58%", right: "14%" },
] as const;

export function IntroScreen({ onStart }: IntroScreenProps) {
  const parallax = useIntroParallax();

  return (
    <div className="intro-screen-root">
      <IntroEpicAtmosphere />
      <IntroCinematicSky parallax={parallax} />
      <IntroEpicSkyline />

      {FLOAT_COINS.map((coin, i) => (
        <div
          key={`coin-${i}`}
          className="intro-float-coin"
          style={{
            top: coin.top,
            left: "left" in coin ? coin.left : undefined,
            right: "right" in coin ? coin.right : undefined,
            width: coin.size,
            height: coin.size,
            animationDelay: coin.delay,
            zIndex: 1,
          }}
          aria-hidden
        />
      ))}

      {SIDE_SPARKLES.map((s, i) => (
        <div
          key={`spark-${i}`}
          className="intro-sparkle"
          style={{
            top: s.top,
            ...("left" in s ? { left: s.left } : { right: s.right }),
            zIndex: 1,
            animationDelay: `${-i * 0.4}s`,
          }}
          aria-hidden
        />
      ))}

      <div className="intro-card-stage">
        <div className="intro-card-portada px-card">
          <div className="intro-card-hero">
            <div className="intro-card-hero-sky" aria-hidden />

            <img
              src={beniBg}
              alt="Beni"
              className="intro-card-beni"
              draggable={false}
            />

            <div className="intro-card-hero-fade" aria-hidden />

            <div className="intro-card-corner intro-card-corner-tl" aria-hidden />
            <div className="intro-card-corner intro-card-corner-tr" aria-hidden />
          </div>

          <div className="intro-card-footer">
            <div className="intro-btn-wrap">
              {BTN_SPARKLES.map((spark, i) => (
                <span
                  key={i}
                  className="intro-stage-spark"
                  style={{
                    top: spark.top,
                    left: spark.left,
                    animationDelay: spark.delay,
                  }}
                  aria-hidden
                />
              ))}
              <button
                type="button"
                className="px-btn intro-btn-play intro-btn-premium intro-card-play"
                onClick={onStart}
              >
                <span className="intro-btn-icon">▶</span>
                JUGAR
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="intro-marquee-wrap intro-screen-marquee">
        <div
          className="intro-marquee-track"
          style={{
            animation: "marqueeScroll 20s steps(200) infinite linear",
          }}
        >
          <span className="intro-marquee-text intro-marquee-copy">
            ⛪ BASÍLICA → 🏛️ PLAZA GRANDE → 🎨 LA RONDA → 🗿 PANECILLO → 🌐 MITAD DEL
            MUNDO → 🚡 TELEFÉRICO → 🌳 LA CAROLINA → 🛒 MERCADO CENTRAL
            &nbsp;&nbsp;·&nbsp;&nbsp; 🐱 BENI RUNNER &nbsp;&nbsp;·&nbsp;&nbsp; ⛪ BASÍLICA →
            🏛️ PLAZA GRANDE → 🎨 LA RONDA → 🗿 PANECILLO → 🌐 MITAD DEL MUNDO → 🚡
            TELEFÉRICO → 🌳 LA CAROLINA → 🛒 MERCADO CENTRAL
          </span>
        </div>
      </div>
    </div>
  );
}
