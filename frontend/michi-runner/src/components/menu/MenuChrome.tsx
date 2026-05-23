import type { CSSProperties, ReactNode } from "react";
import { CITIES } from "../../constants/runner";
import { MichiLogoSprite } from "../MichiLogoSprite";

const MENU_LARGE_STARS = [
  { top: "8%", left: "12%", delay: "0s" },
  { top: "15%", left: "78%", delay: "-0.5s" },
  { top: "35%", left: "90%", delay: "-1s" },
  { top: "50%", left: "8%", delay: "-1.5s" },
  { top: "70%", left: "85%", delay: "-2s" },
  { top: "82%", left: "40%", delay: "-2.5s" },
  { top: "25%", left: "55%", delay: "-0.8s" },
  { top: "60%", left: "50%", delay: "-1.2s" },
];

const MENU_MEDIUM_STARS = [
  { top: "12%", left: "30%" },
  { top: "20%", left: "65%" },
  { top: "45%", left: "25%" },
  { top: "55%", left: "72%" },
  { top: "75%", left: "20%" },
  { top: "88%", left: "68%" },
].map((s, i) => ({ ...s, delay: `${-(i * 0.2)}s` }));

const CITY_DOTS = [
  { top: "25%", left: "38%", delay: "0s", color: CITIES[0].color },
  { top: "55%", left: "28%", delay: "-0.3s", color: CITIES[1].color },
  { top: "60%", left: "42%", delay: "-0.6s", color: CITIES[2].color },
  { top: "58%", left: "22%", delay: "-0.9s", color: CITIES[3].color },
  { top: "18%", left: "35%", delay: "-1.2s", color: CITIES[4].color },
] as const;

const ROUTE_SEGMENTS: { top: string; left: string; width: string; rotate: string }[] = [
  { top: "22%", left: "34%", width: "6vmin", rotate: "-25deg" },
  { top: "38%", left: "28%", width: "10vmin", rotate: "55deg" },
  { top: "56%", left: "26%", width: "8vmin", rotate: "15deg" },
  { top: "58%", left: "30%", width: "6vmin", rotate: "-10deg" },
  { top: "42%", left: "32%", width: "9vmin", rotate: "-40deg" },
];

export function MenuStarsBackground() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {MENU_LARGE_STARS.map((s, i) => (
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
      {MENU_MEDIUM_STARS.map((s, i) => (
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
    </div>
  );
}

export function EcuadorMapBackground() {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "40vmin",
        height: "50vmin",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1a1a2e",
          border: "0.3vmin solid #27272a",
          opacity: 0.4,
          clipPath:
            "polygon(30% 5%, 45% 3%, 60% 8%, 75% 5%, 85% 15%, 90% 30%, 85% 45%, 90% 60%, 80% 75%, 65% 80%, 55% 90%, 45% 85%, 35% 90%, 25% 80%, 15% 65%, 10% 50%, 15% 35%, 20% 20%, 30% 5%)",
        }}
      />
      {ROUTE_SEGMENTS.map((seg, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: seg.top,
            left: seg.left,
            width: seg.width,
            height: "0.15vmin",
            background: "#fde047",
            opacity: 0.3,
            transform: `rotate(${seg.rotate})`,
            transformOrigin: "left center",
          }}
        />
      ))}
      {CITY_DOTS.map((city, i) => (
        <div
          key={i}
          className="city-dot-pulse"
          style={{
            position: "absolute",
            top: city.top,
            left: city.left,
            width: "1.2vmin",
            height: "1.2vmin",
            background: city.color,
            border: "0.2vmin solid #000",
            animationDelay: city.delay,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

export function MenuHeader({ step }: { step: 1 | 2 | 3 }) {
  return (
    <header
      className="menu-header-slide"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        background: "#1a1a2e",
        borderBottom: "0.4vmin solid #fde047",
        padding: "1.5vmin 3vmin",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1.5vmin" }}>
        <div style={{ transform: "scale(0.45)", transformOrigin: "left center", height: "5vmin" }}>
          <MichiLogoSprite />
        </div>
        <div>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.8vmin",
              color: "#fde047",
            }}
          >
            MICHIMONEY
          </div>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1vmin",
              color: "#94a3b8",
            }}
          >
            RUNNER
          </div>
        </div>
      </div>
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "1vmin",
          color: "#94a3b8",
        }}
      >
        PASO {step} DE 3
      </div>
    </header>
  );
}

export function StepIndicator({
  activeStep,
  blinkActive = false,
}: {
  activeStep: 0 | 1 | 2;
  blinkActive?: boolean;
}) {
  const steps = ["MODO", "TIPO", "SALA"] as const;

  return (
    <div
      style={{
        display: "flex",
        gap: "1.5vmin",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        zIndex: 2,
      }}
    >
      {steps.map((step, i) => {
        const isActive = i === activeStep;
        const isDone = i < activeStep;
        const filled = isDone || isActive;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", gap: "0.8vmin" }}>
            <div
              className={isActive && blinkActive ? "step-dot-blink" : undefined}
              style={{
                width: "1.5vmin",
                height: "1.5vmin",
                background: filled ? "#fde047" : "#27272a",
                border: "0.2vmin solid #000",
              }}
            />
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "0.9vmin",
                color: filled ? "#fde047" : "#444",
              }}
            >
              {step}
              {isDone ? " ✓" : ""}
            </div>
            {i < 2 && (
              <div
                style={{
                  width: "3vmin",
                  height: "0.2vmin",
                  background: isDone ? "#fde047" : "#27272a",
                  marginLeft: "0.5vmin",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function MenuPageLayout({
  step,
  showMap = false,
  children,
  style,
}: {
  step: 1 | 2 | 3;
  showMap?: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#0f0f1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        paddingTop: "10vmin",
        paddingBottom: "3vmin",
        ...style,
      }}
    >
      <MenuStarsBackground />
      {showMap && <EcuadorMapBackground />}
      <MenuHeader step={step} />
      {children}
    </div>
  );
}
