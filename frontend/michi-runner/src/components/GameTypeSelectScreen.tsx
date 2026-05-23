import { useState } from "react";
import { MODE_CONFIG } from "../constants/runner";
import type { GameMode, GameType } from "../types/game";
import { MichiSprite } from "./MichiSprite";
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
  mode,
  hoveredType,
  onHover,
  onLeave,
  onSelect,
}: {
  type: GameType;
  mode: GameMode;
  hoveredType: HoveredType;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
}) {
  const isSolo = type === "single";
  const isHovered = hoveredType === type;
  const delay = isSolo ? "0.2s" : "0.4s";

  if (isSolo) {
    return (
      <div
        role="button"
        tabIndex={0}
        className="game-type-card-flip"
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect();
        }}
        style={{
          flex: 1,
          minWidth: "28vmin",
          maxWidth: "40vmin",
          background: "#1a1a2e",
          border: "0.4vmin solid #fde047",
          boxShadow: "0.5vmin 0.5vmin 0 #000",
          padding: "3vmin 2vmin",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5vmin",
          animationDelay: delay,
          zIndex: 2,
        }}
      >
        <div style={{ height: "11vmin", overflow: "hidden" }}>
          <div style={{ transform: "scale(0.7)", transformOrigin: "center top" }}>
            <MichiSprite
              emoji=""
              isRunning
              level={1}
              reaction="run"
              mode={mode}
              isTransforming={false}
              showLevelUp={false}
              showLevelDown={false}
              previousLevel={1}
            />
          </div>
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "2vmin",
            color: "#fde047",
          }}
        >
          YO SOLO
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1.1vmin",
            color: "#94a3b8",
          }}
        >
          Practica a tu ritmo
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1vmin",
            color: "#94a3b8",
          }}
        >
          Sin rival
        </div>
        {isHovered && (
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.5vmin" }}>
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
      className="game-type-card-flip"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
      style={{
        flex: 1,
        minWidth: "28vmin",
        maxWidth: "40vmin",
        background: "#0a0a1a",
        border: "0.5vmin solid #60a5fa",
        boxShadow: "0.6vmin 0.6vmin 0 #60a5fa",
        padding: "3vmin 2vmin",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5vmin",
        position: "relative",
        animationDelay: delay,
        zIndex: 2,
      }}
    >
      <div
        className="lobby-recommended-badge"
        style={{
          position: "absolute",
          top: "-1vmin",
          right: "2vmin",
          background: "#60a5fa",
          color: "#000",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "0.9vmin",
          padding: "0.3vmin 1vmin",
          border: "0.2vmin solid #000",
        }}
      >
        RECOMENDADO
      </div>

      <div
        style={{
          display: "flex",
          gap: "2vmin",
          alignItems: "flex-end",
          height: "10vmin",
        }}
      >
        <div className="handshake-michi" style={{ transform: "scale(0.55)", transformOrigin: "bottom" }}>
          <MichiSprite
            emoji=""
            isRunning={false}
            level={2}
            reaction="curious"
            mode={mode}
            isTransforming={false}
            showLevelUp={false}
            showLevelDown={false}
            previousLevel={2}
          />
        </div>
        <div
          className="handshake-michi"
          style={{ transform: "scaleX(-1) scale(0.55)", transformOrigin: "bottom" }}
        >
          <MichiSprite
            emoji=""
            isRunning={false}
            level={2}
            reaction="curious"
            mode={mode}
            isTransforming={false}
            showLevelUp={false}
            showLevelDown={false}
            previousLevel={2}
          />
        </div>
      </div>

      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "2vmin",
          color: "#60a5fa",
        }}
      >
        VS AMIGO
      </div>
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "1.1vmin",
          color: "#94a3b8",
        }}
      >
        Compite en tiempo real
      </div>
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "1vmin",
          color: "#94a3b8",
        }}
      >
        Dispositivos separados
      </div>
      {isHovered && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "0.5vmin" }}>
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
      <div
        style={{
          fontSize: "5vmin",
          margin: "2vmin 0 1vmin",
          zIndex: 2,
        }}
      >
        {modeEmoji}
      </div>
      <h2
        style={{
          fontFamily: '"Press Start 2P", monospace',
          color: "#f1f5f9",
          fontSize: "1.5vmin",
          margin: "0 0 3vmin",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        ¿CÓMO QUIERES JUGAR?
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
          perspective: "100vmin",
        }}
      >
        <GameTypeCard
          type="single"
          mode={mode}
          hoveredType={hoveredType}
          onHover={() => setHoveredType("single")}
          onLeave={() => setHoveredType(null)}
          onSelect={() => onSelect("single")}
        />
        <GameTypeCard
          type="multi"
          mode={mode}
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
