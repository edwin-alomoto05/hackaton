import { useState } from "react";
import { MODE_CONFIG } from "../constants/runner";
import type { GameMode } from "../types/game";
import { MichiSprite } from "./MichiSprite";
import { MenuPageLayout, StepIndicator } from "./menu/MenuChrome";

interface ModeSelectScreenProps {
  onSelect: (mode: GameMode) => void;
}

const PRIMARIA_PREVIEWS = [
  "Alcancía vs Dulces",
  "Ahorrar vs Pedir",
  "Regalo vs Gastar",
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
      className={slideClass}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      style={{
        animationDelay: isPrimaria ? "0.2s" : "0.3s",
        flex: 1,
        minWidth: "28vmin",
        maxWidth: "42vmin",
        background: isHovered ? (isPrimaria ? "#0a1a0a" : "#0a0a1a") : "#1a1a2e",
        border: isHovered ? `0.5vmin solid ${accent}` : "0.4vmin solid #27272a",
        boxShadow: isHovered ? `0.6vmin 0.6vmin 0 ${accent}` : "0.4vmin 0.4vmin 0 #000",
        padding: "3vmin 2vmin",
        cursor: "pointer",
        transition: "background 0.05s steps(1), border 0.05s steps(1), box-shadow 0.05s steps(1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5vmin",
        position: "relative",
        overflow: "hidden",
        zIndex: 2,
      }}
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

      <div
        style={{
          position: "absolute",
          top: "1vmin",
          right: "1vmin",
          background: accent,
          color: "#000",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "0.9vmin",
          padding: "0.3vmin 0.8vmin",
          border: "0.2vmin solid #000",
        }}
      >
        {isPrimaria ? "6-11" : "12-17"}
      </div>

      <div style={{ height: "12vmin", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: "scale(0.7)", transformOrigin: "center" }}>
          <MichiSprite
            emoji=""
            isRunning={false}
            level={isPrimaria ? 1 : 2}
            reaction={isHovered ? "celebrate" : "curious"}
            mode={mode}
            isTransforming={false}
            showLevelUp={false}
            showLevelDown={false}
            previousLevel={isPrimaria ? 1 : 2}
          />
        </div>
      </div>

      <div
        className={isHovered ? "michi-celebrate-sprite" : "menu-emoji-idle"}
        style={{ fontSize: "6vmin", lineHeight: 1 }}
      >
        {config.emoji}
      </div>

      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "2.2vmin",
          color: isHovered ? accent : "#f1f5f9",
        }}
      >
        {config.label.toUpperCase()}
      </div>

      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "1.1vmin",
          color: "#94a3b8",
        }}
      >
        {config.ages}
      </div>

      <div
        style={{
          width: "80%",
          height: "0.2vmin",
          background: isHovered ? accent : "#27272a",
          transition: "background 0.05s steps(1)",
        }}
      />

      {isHovered && isPrimaria ? (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.6vmin" }}>
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
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1.1vmin",
            color: "#94a3b8",
            textAlign: "center",
            minHeight: "4vmin",
          }}
        >
          {isPrimaria ? "Finanzas para niños" : "Finanzas para adolescentes"}
        </div>
      )}

      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "1.2vmin",
          background: isHovered ? accent : "transparent",
          color: isHovered ? "#000" : "#94a3b8",
          border: "0.3vmin solid",
          borderColor: isHovered ? accent : "#27272a",
          padding: "0.8vmin 2vmin",
          transition: "all 0.05s steps(1)",
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
      <h2
        style={{
          fontFamily: '"Press Start 2P", monospace',
          color: "#f1f5f9",
          fontSize: "1.5vmin",
          margin: "2vmin 0 3vmin",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        ¿QUIÉN VA A JUGAR?
      </h2>

      <div
        style={{
          display: "flex",
          gap: "3vmin",
          flexWrap: "wrap",
          justifyContent: "center",
          width: "100%",
          maxWidth: "95vmin",
          padding: "0 3vmin",
          flex: 1,
          alignItems: "center",
        }}
      >
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
