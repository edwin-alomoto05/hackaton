import type { CSSProperties, ReactNode } from "react";
import { QUITO_PLACES } from "../../constants/runner";
import { MichiLogoSprite } from "../MichiLogoSprite";
import { MenuCinematicBackground } from "./MenuCinematicLayers";

const CITY_DOTS = [
  { top: "25%", left: "38%", delay: "0s", color: QUITO_PLACES[0].color },
  { top: "55%", left: "28%", delay: "-0.3s", color: QUITO_PLACES[1].color },
  { top: "60%", left: "42%", delay: "-0.6s", color: QUITO_PLACES[2].color },
  { top: "58%", left: "22%", delay: "-0.9s", color: QUITO_PLACES[3].color },
  { top: "18%", left: "35%", delay: "-1.2s", color: QUITO_PLACES[4].color },
] as const;

const ROUTE_SEGMENTS: { top: string; left: string; width: string; rotate: string }[] = [
  { top: "22%", left: "34%", width: "6vmin", rotate: "-25deg" },
  { top: "38%", left: "28%", width: "10vmin", rotate: "55deg" },
  { top: "56%", left: "26%", width: "8vmin", rotate: "15deg" },
  { top: "58%", left: "30%", width: "6vmin", rotate: "-10deg" },
  { top: "42%", left: "32%", width: "9vmin", rotate: "-40deg" },
];

export function EcuadorMapBackground() {
  return (
    <div className="menu-ecuador-map">
      <div className="menu-ecuador-shape" />
      {ROUTE_SEGMENTS.map((seg, i) => (
        <div
          key={i}
          className="menu-ecuador-route"
          style={{
            top: seg.top,
            left: seg.left,
            width: seg.width,
            transform: `rotate(${seg.rotate})`,
          }}
        />
      ))}
      {CITY_DOTS.map((city, i) => (
        <div
          key={i}
          className="city-dot-pulse menu-city-dot"
          style={{
            top: city.top,
            left: city.left,
            background: city.color,
            animationDelay: city.delay,
          }}
        />
      ))}
    </div>
  );
}

export function MenuHeader({ step }: { step: 1 | 2 | 3 }) {
  return (
    <header className="menu-header-premium menu-header-slide">
      <div className="menu-header-glow" aria-hidden />
      <div className="menu-header-inner">
        <div className="menu-header-brand">
          <div className="menu-header-logo">
            <MichiLogoSprite />
          </div>
          <div>
            <div className="menu-header-title">MICHIMONEY</div>
            <div className="menu-header-subtitle">RUNNER</div>
          </div>
        </div>
        <div className="menu-header-step">PASO {step} DE 3</div>
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
    <div className="menu-step-indicator">
      {steps.map((step, i) => {
        const isActive = i === activeStep;
        const isDone = i < activeStep;
        const filled = isDone || isActive;
        return (
          <div key={step} className="menu-step-item">
            <div
              className={[
                "menu-step-dot",
                isActive && blinkActive ? "step-dot-blink" : "",
                filled ? "menu-step-dot-filled" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
            <div className={filled ? "menu-step-label-filled" : "menu-step-label"}>
              {step}
              {isDone ? " ✓" : ""}
            </div>
            {i < 2 && <div className={isDone ? "menu-step-line-filled" : "menu-step-line"} />}
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
    <div className="menu-page-premium" style={style}>
      <MenuCinematicBackground showSkyline={step >= 2} />
      {showMap && <EcuadorMapBackground />}
      <MenuHeader step={step} />
      <div className="menu-page-content">{children}</div>
    </div>
  );
}
