import { useState } from "react";
import { MODE_CONFIG } from "../constants/runner";
import type { GameMode, GameType } from "../types/game";
import MichiSprite from "./MichiSprite";
import { MenuPageLayout, StepIndicator } from "./menu/MenuChrome";

interface GameTypeSelectScreenProps {
  mode: GameMode;
  onSelect: (type: GameType) => void;
}

type HoveredType = GameType | null;

const SOLO_PERKS = ["Sin esperar a nadie", "Practica las decisiones", "Guarda tu score"];
const VS_PERKS = ["Competencia real", "Compara tu score", "Combos vs rival"];

function GameTypeCard({
  type,
  hoveredType,
  onHover,
  onLeave,
  onSelect,
}: {
  type: GameType;
  hoveredType: HoveredType;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
}) {
  const isSolo = type === "single";
  const isHovered = hoveredType === type;
  const delay = isSolo ? "0.2s" : "0.4s";
  const hoverClass = isHovered ? "game-type-card-premium--hover" : "";

  if (isSolo) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={`game-type-card-premium game-type-card-flip game-type-solo ${hoverClass}`}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect();
        }}
        style={{ animationDelay: delay }}
      >
        <div className="game-type-halo" aria-hidden />
        <div className="game-type-michi-solo-wrap">
          <MichiSprite
            reaction="run"
            isTransforming={false}
            showLevelUp={false}
            showLevelDown={false}
            level={1}
            size="12vmin"
            embedded
          />
        </div>
        <div className="game-type-title game-type-title-shine">YO SOLO</div>
        <div className="game-type-sub">Practica a tu ritmo</div>
        <div className="game-type-sub">Sin rival</div>
        {isHovered && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.5vmin", zIndex: 1 }}>
            {SOLO_PERKS.map((line, i) => (
              <div
                key={line}
                className="end-row-reveal"
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1vmin",
                  color: "#4ade80",
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                ✓ {line}
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          className="px-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          ▶ JUGAR SOLO
        </button>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      className={`game-type-card-premium game-type-card-flip game-type-vs ${hoverClass}`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      style={{ animationDelay: delay }}
    >
      <div className="game-type-halo" aria-hidden />
      <div className="game-type-energy-ring" aria-hidden />
      <div className="game-type-vs-badge">RECOMENDADO</div>

      <div className="game-type-michi-row">
        <MichiSprite
          reaction="curious"
          isTransforming={false}
          showLevelUp={false}
          showLevelDown={false}
          level={2}
          size="12vmin"
          embedded
        />
        <div className="handshake-michi" style={{ transform: "scaleX(-1)", transformOrigin: "bottom" }}>
          <MichiSprite
            reaction="curious"
            isTransforming={false}
            showLevelUp={false}
            showLevelDown={false}
            level={2}
            size="12vmin"
            embedded
          />
        </div>
      </div>

      <div className="game-type-title game-type-title-shine">VS AMIGO</div>
      <div className="game-type-sub">Compite en tiempo real</div>
      <div className="game-type-sub">Dispositivos separados</div>
      {isHovered && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.5vmin", zIndex: 1 }}>
          {VS_PERKS.map((line, i) => (
            <div
              key={line}
              className="end-row-reveal"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1vmin",
                color: "#60a5fa",
                animationDelay: `${i * 0.08}s`,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        className="px-btn px-btn-blue"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        VERSUS
      </button>
    </div>
  );
}

export function GameTypeSelectScreen({ mode, onSelect }: GameTypeSelectScreenProps) {
  const [hoveredType, setHoveredType] = useState<HoveredType>(null);
  const modeEmoji = MODE_CONFIG[mode].emoji;

  return (
    <MenuPageLayout step={2}>
      <div className="menu-emoji-idle" style={{ fontSize: "5vmin", margin: "0 0 1vmin", zIndex: 2 }}>
        {modeEmoji}
      </div>
      <h2 className="menu-screen-title" style={{ marginTop: "1vmin" }}>
        ¿CÓMO QUIERES JUGAR?
      </h2>

      <div className="menu-cards-row">
        <GameTypeCard
          type="single"
          hoveredType={hoveredType}
          onHover={() => setHoveredType("single")}
          onLeave={() => setHoveredType(null)}
          onSelect={() => onSelect("single")}
        />
        <GameTypeCard
          type="multi"
          hoveredType={hoveredType}
          onHover={() => setHoveredType("multi")}
          onLeave={() => setHoveredType(null)}
          onSelect={() => onSelect("multi")}
        />
      </div>

      <div style={{ marginTop: "3vmin" }}>
        <StepIndicator activeStep={1} blinkActive />
      </div>
    </MenuPageLayout>
  );
}
