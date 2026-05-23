import { useEffect, useState, type CSSProperties } from "react";
import { MichiLogoSprite } from "./MichiLogoSprite";
import { TypeWriter } from "./ui/TypeWriter";

interface IntroScreenProps {
  onStart: () => void;
}

const LARGE_STARS: { top: string; left: string; delay: string }[] = [
  { top: "6%", left: "8%", delay: "0s" },
  { top: "18%", left: "72%", delay: "-0.5s" },
  { top: "32%", left: "22%", delay: "-1s" },
  { top: "12%", left: "48%", delay: "-1.5s" },
  { top: "42%", left: "85%", delay: "-2s" },
  { top: "55%", left: "38%", delay: "-2.5s" },
];

const MEDIUM_STARS: { top: string; left: string; delay: string }[] = [
  { top: "10%", left: "15%" },
  { top: "8%", left: "55%" },
  { top: "22%", left: "88%" },
  { top: "28%", left: "5%" },
  { top: "35%", left: "62%" },
  { top: "48%", left: "18%" },
  { top: "52%", left: "78%" },
  { top: "65%", left: "42%" },
  { top: "70%", left: "8%" },
  { top: "75%", left: "92%" },
].map((s, i) => ({ ...s, delay: `${-(i * 0.2)}s` }));

const SMALL_STARS: { top: string; left: string; delay: string }[] = [
  { top: "5%", left: "30%" },
  { top: "14%", left: "40%" },
  { top: "20%", left: "68%" },
  { top: "25%", left: "12%" },
  { top: "30%", left: "95%" },
  { top: "38%", left: "52%" },
  { top: "45%", left: "28%" },
  { top: "50%", left: "70%" },
  { top: "58%", left: "15%" },
  { top: "62%", left: "58%" },
  { top: "68%", left: "82%" },
  { top: "72%", left: "35%" },
  { top: "78%", left: "65%" },
  { top: "82%", left: "22%" },
].map((s, i) => ({ ...s, delay: `${-(i * 0.07)}s` }));

const ORBIT_DELAYS = ["0s", "-0.75s", "-1.5s", "-2.25s"];

const MARQUEE_TEXT =
  "BASÍLICA → PLAZA GRANDE → LA RONDA → LA CAROLINA → MERCADO CENTRAL    ·    ·    ·    APRENDE FINANZAS    ·    ·    ·    JUEGA CON UN AMIGO    ·    ·    ·    TOMA BUENAS DECISIONES    ·    ·    ·    ";

function CornerDecor({
  position,
  className,
}: {
  position: "tl" | "tr" | "bl" | "br";
  className: string;
}) {
  const base: CSSProperties = { position: "absolute", width: "3vmin", height: "3vmin" };
  const positions: Record<string, CSSProperties> = {
    tl: { top: "1vmin", left: "1vmin" },
    tr: { top: "1vmin", right: "1vmin" },
    bl: { bottom: "1vmin", left: "1vmin" },
    br: { bottom: "1vmin", right: "1vmin" },
  };
  const alignRight = position === "tr" || position === "br";

  return (
    <div className={className} style={{ ...base, ...positions[position] }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          ...(alignRight ? { right: 0 } : { left: 0 }),
          width: "3vmin",
          height: "0.4vmin",
          background: "#fde047",
          border: "0.2vmin solid #000",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          ...(alignRight ? { right: 0 } : { left: 0 }),
          width: "0.4vmin",
          height: "3vmin",
          background: "#fde047",
          border: "0.2vmin solid #000",
        }}
      />
    </div>
  );
}

function PixelSeparator() {
  return (
    <div
      className="intro-separator-wrap"
      style={{
        width: "60%",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1vmin",
      }}
    >
      <div style={{ display: "flex", gap: "0.3vmin", flex: 1, justifyContent: "flex-end" }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "0.8vmin",
              height: "0.3vmin",
              background: "#fde047",
              animation: "separatorSlide 0.5s steps(10) forwards",
              animationDelay: "2300ms",
              opacity: 0,
            }}
          />
        ))}
      </div>
      <div
        style={{
          width: "1.5vmin",
          height: "1.5vmin",
          background: "#fde047",
          border: "0.3vmin solid #000",
          flexShrink: 0,
          animation: "diamondSpin 2s steps(4) infinite",
          animationDelay: "2500ms",
          willChange: "transform",
        }}
      />
      <div style={{ display: "flex", gap: "0.3vmin", flex: 1 }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "0.8vmin",
              height: "0.3vmin",
              background: "#fde047",
              animation: "separatorSlideRight 0.5s steps(10) forwards",
              animationDelay: "2300ms",
              opacity: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const [introStage, setIntroStage] = useState(1);
  const [logoLanded, setLogoLanded] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [btnActive, setBtnActive] = useState(false);

  useEffect(() => {
    const cornerTimer = window.setTimeout(() => setIntroStage(2), 200);
    const logoTimer = window.setTimeout(() => setLogoLanded(true), 800);
    return () => {
      window.clearTimeout(cornerTimer);
      window.clearTimeout(logoTimer);
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0f0f1a",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2vmin",
        paddingBottom: "6vmin",
      }}
    >
      {/* Capas estelares + meteoros — visibles al cargar */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {LARGE_STARS.map((s, i) => (
          <div
            key={`lg-${i}`}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              width: "0.4vmin",
              height: "0.4vmin",
              background: "#ffffff",
              animation: "starTwinkleSlow 3s steps(2) infinite",
              animationDelay: s.delay,
              willChange: "transform",
            }}
          />
        ))}
        {MEDIUM_STARS.map((s, i) => (
          <div
            key={`md-${i}`}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              width: "0.25vmin",
              height: "0.25vmin",
              background: "#fde047",
              animation: "starTwinkleMed 2s steps(2) infinite",
              animationDelay: s.delay,
            }}
          />
        ))}
        {SMALL_STARS.map((s, i) => (
          <div
            key={`sm-${i}`}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              width: "0.12vmin",
              height: "0.12vmin",
              background: "#a78bfa",
              animation: "starTwinkleFast 1s steps(2) infinite",
              animationDelay: s.delay,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            top: "-5%",
            left: "20%",
            width: "0.2vmin",
            height: "2vmin",
            background: "#fff",
            transform: "rotateZ(45deg)",
            animation: "meteorShoot 6s steps(12) infinite",
            willChange: "transform",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-5%",
            left: "65%",
            width: "0.2vmin",
            height: "2vmin",
            background: "#fff",
            transform: "rotateZ(45deg)",
            animation: "meteorShoot 6s steps(12) infinite",
            animationDelay: "-3s",
            willChange: "transform",
          }}
        />
      </div>

      {introStage >= 2 && (
        <>
          <CornerDecor position="tl" className="corner-in-tl" />
          <CornerDecor position="tr" className="corner-in-tr" />
          <CornerDecor position="bl" className="corner-in-bl" />
          <CornerDecor position="br" className="corner-in-br" />
        </>
      )}

      <div
        className="intro-side-coin"
        style={{
          position: "absolute",
          bottom: "20%",
          left: "5%",
          width: "1.5vmin",
          height: "1.5vmin",
          background: "#ffd700",
          border: "0.3vmin solid #cc8800",
          zIndex: 1,
          willChange: "transform",
        }}
      />
      <div
        className="intro-side-coin"
        style={{
          position: "absolute",
          bottom: "20%",
          right: "5%",
          width: "1.5vmin",
          height: "1.5vmin",
          background: "#ffd700",
          border: "0.3vmin solid #cc8800",
          animationDelay: "-2s",
          zIndex: 1,
          willChange: "transform",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2vmin",
          maxWidth: "90vmin",
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "16vmin",
            height: "16vmin",
            marginBottom: "1vmin",
          }}
        >
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <MichiLogoSprite className={logoLanded ? "michi-logo-idle" : "michi-logo"} />
            </div>
            {ORBIT_DELAYS.map((delay, i) => (
              <div
                key={i}
                className="intro-orbit-coin"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: "1.5vmin",
                  height: "1.5vmin",
                  background: "#ffd700",
                  border: "0.3vmin solid #cc8800",
                  animationDelay: delay,
                }}
              />
            ))}
        </div>

        <h1 style={{ margin: 0, lineHeight: 1.2, minHeight: "5vmin" }}>
          <TypeWriter
            text="MICHIMONEY"
            delay={80}
            startDelay={900}
            color="#fde047"
            fontSize="4vmin"
            showCursor
          />
        </h1>

        <p style={{ margin: 0, minHeight: "3.5vmin" }}>
          <TypeWriter
            text="RUNNER"
            delay={120}
            startDelay={1800}
            color="#a78bfa"
            fontSize="2.5vmin"
          />
        </p>

        <PixelSeparator />

        <p style={{ margin: 0, maxWidth: "50vmin", minHeight: "2.5vmin" }}>
          <TypeWriter
            text="¡Aprende finanzas corriendo!"
            delay={50}
            startDelay={2400}
            color="#94a3b8"
            fontSize="1.4vmin"
          />
        </p>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1vmin" }}>
          <button
            type="button"
            className="px-btn intro-btn-play"
            onClick={onStart}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => {
              setBtnHover(false);
              setBtnActive(false);
            }}
            onMouseDown={() => setBtnActive(true)}
            onMouseUp={() => setBtnActive(false)}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.4vmin",
              padding: "1.5vmin 3vmin",
              transform: btnActive
                ? "translate(0.5vmin, 0.5vmin)"
                : btnHover
                  ? "translate(-0.4vmin, -0.4vmin)"
                  : undefined,
              boxShadow: btnActive
                ? "0 0 0 #000"
                : btnHover
                  ? "0.9vmin 0.9vmin 0 #000"
                  : undefined,
              transition: "transform 0.05s steps(1), box-shadow 0.05s steps(1)",
            }}
          >
            <span
              style={{
                display: "inline-block",
                marginRight: "0.8vmin",
                transform: btnHover ? "translateX(0.3vmin)" : undefined,
                transition: "transform 0.05s steps(1)",
              }}
            >
              ▶
            </span>
            JUGAR
          </button>
          <p
            className="intro-press-hint"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.2vmin",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            PRESIONA JUGAR
          </p>
        </div>
      </div>

      {/* Banner inferior — siempre activo */}
      <div
        style={{
          position: "absolute",
          bottom: "3vmin",
          left: 0,
          right: 0,
          overflow: "hidden",
          background: "#09090b",
          borderTop: "0.3vmin solid #27272a",
          padding: "0.8vmin 0",
          zIndex: 3,
        }}
      >
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "marqueeScroll 20s steps(200) infinite linear",
            willChange: "transform",
          }}
        >
          <span
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.2vmin",
              color: "#94a3b8",
              whiteSpace: "nowrap",
              paddingRight: "4vmin",
            }}
          >
            {MARQUEE_TEXT}
          </span>
          <span
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.2vmin",
              color: "#94a3b8",
              whiteSpace: "nowrap",
              paddingRight: "4vmin",
            }}
          >
            {MARQUEE_TEXT}
          </span>
        </div>
      </div>
    </div>
  );
}
