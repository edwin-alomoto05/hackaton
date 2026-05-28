import { useState } from "react";
import { MODE_CONFIG } from "../constants/runner";
import type { GameMode } from "../types/game";
import MichiSprite from "./MichiSprite";
import { MenuPageLayout, StepIndicator } from "./menu/MenuChrome";

interface ModeSelectScreenProps {
  onSelect: (mode: GameMode) => void;
}

const PRIMARIA_PREVIEWS = [
  "Alcancía vs Dulces",
  "Ahorrar vs Pedir",
  "Regalo vs Gastar",
];

const CARD_PARTICLES = [
  { top: "15%", left: "10%", delay: "0s" },
  { top: "70%", left: "85%", delay: "-0.8s" },
  { top: "40%", left: "90%", delay: "-1.4s" },
  { top: "80%", left: "15%", delay: "-0.4s" },
];

type HoveredMode = GameMode | null;

function ModeCard({
  mode,
  hoveredMode,
  flashMode,
  onHover,
  onLeave,
  onSelect,
}: {
  mode: GameMode;
  hoveredMode: HoveredMode;
  flashMode: GameMode | null;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
}) {
  const config = MODE_CONFIG[mode];
  const isPrimaria = mode === "primaria";
  const isHovered = hoveredMode === mode;
  const isFlashing = flashMode === mode;
  const accent = isPrimaria ? "#4ade80" : "#60a5fa";
  const slideClass = isPrimaria ? "end-slide-left" : "end-slide-right";

  return (
    <div
      role="button"
      tabIndex={0}
      className={[
        "mode-card-premium",
        slideClass,
        isPrimaria ? "mode-card-primaria" : "mode-card-secundaria",
        isHovered ? "mode-card-premium--hover" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      style={{ animationDelay: isPrimaria ? "0.2s" : "0.3s" }}
    >
      {isFlashing && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: isPrimaria ? "rgba(74,222,128,0.35)" : "rgba(96,165,250,0.35)",
            zIndex: 5,
            animation: "instantFlash 0.25s steps(3) forwards",
            pointerEvents: "none",
          }}
        />
      )}

      <div className="mode-card-neon-frame" aria-hidden />
      <div className="mode-card-particles" aria-hidden>
        {CARD_PARTICLES.map((p, i) => (
          <span
            key={i}
            className="mode-card-particle"
            style={{ top: p.top, left: p.left, animationDelay: p.delay }}
          />
        ))}
      </div>

      <div className="mode-card-age-badge" style={{ background: accent }}>
        {isPrimaria ? "6-11" : "12-17"}
      </div>

      <div className="mode-card-michi-wrap">
        <div className="mode-card-michi-glow" aria-hidden />
        <MichiSprite
          reaction={isHovered ? "celebrate" : "curious"}
          isTransforming={false}
          showLevelUp={false}
          showLevelDown={false}
          level={isPrimaria ? 1 : 2}
          size="12vmin"
          embedded
        />
      </div>

      <div className={`mode-card-emoji ${isHovered ? "michi-celebrate-sprite" : "menu-emoji-idle"}`}>
        {config.emoji}
      </div>

      <div className="mode-card-label" style={{ color: isHovered ? accent : "#f1f5f9" }}>
        {config.label.toUpperCase()}
      </div>

      <div className="mode-card-ages">{config.ages}</div>

      <div className="mode-card-divider" style={{ background: isHovered ? accent : "#27272a" }} />

      {isHovered && isPrimaria ? (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.6vmin", zIndex: 1 }}>
          {PRIMARIA_PREVIEWS.map((line, i) => (
            <div
              key={line}
              className="end-row-reveal"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1vmin",
                color: "#94a3b8",
                animationDelay: `${i * 0.08}s`,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      ) : (
        <div className="mode-card-desc">
          {isPrimaria ? "Finanzas para niños" : "Finanzas para adolescentes"}
        </div>
      )}

      <div
        className="mode-card-cta"
        style={{
          background: isHovered ? accent : "transparent",
          color: isHovered ? "#000" : "#94a3b8",
          borderColor: isHovered ? accent : "#27272a",
        }}
      >
        {isHovered ? "▶ SELECCIONAR" : "ELEGIR"}
      </div>
    </div>
  );
}

export function ModeSelectScreen({ onSelect }: ModeSelectScreenProps) {
  const [hoveredMode, setHoveredMode] = useState<HoveredMode>(null);
  const [flashMode, setFlashMode] = useState<GameMode | null>(null);

  const handleSelect = (mode: GameMode) => {
    setFlashMode(mode);
    window.setTimeout(() => onSelect(mode), 200);
  };

  return (
    <MenuPageLayout step={1} showMap>
      <h2 className="menu-screen-title">¿QUIÉN VA A JUGAR?</h2>

      <div className="menu-cards-row">
        <ModeCard
          mode="primaria"
          hoveredMode={hoveredMode}
          flashMode={flashMode}
          onHover={() => setHoveredMode("primaria")}
          onLeave={() => setHoveredMode(null)}
          onSelect={() => handleSelect("primaria")}
        />
        <ModeCard
          mode="secundaria"
          hoveredMode={hoveredMode}
          flashMode={flashMode}
          onHover={() => setHoveredMode("secundaria")}
          onLeave={() => setHoveredMode(null)}
          onSelect={() => handleSelect("secundaria")}
        />
      </div>

      <div style={{ marginTop: "3vmin" }}>
        <StepIndicator activeStep={0} />
      </div>
    </MenuPageLayout>
  );
}
