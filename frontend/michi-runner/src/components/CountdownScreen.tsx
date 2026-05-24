import type { CSSProperties } from "react";
import type { GameMode, GameType } from "../types/game";
import MichiSprite from "./MichiSprite";
import { CountdownCinematicBackground } from "./menu/MenuCinematicLayers";

interface CountdownScreenProps {
  value: number | null;
  gameType: GameType;
  rivalName?: string;
  playerName?: string;
  mode: GameMode;
  michiLevel?: 1 | 2 | 3;
}

function getNumberColor(v: number): string {
  if (v === 3) return "#f87171";
  if (v === 2) return "#fde047";
  return "#4ade80";
}

function getFlashColor(v: number | null): string {
  if (v === null) return "rgba(74,222,128,0.4)";
  if (v === 3) return "rgba(248,113,113,0.3)";
  if (v === 2) return "rgba(253,224,71,0.3)";
  return "rgba(74,222,128,0.3)";
}

function getVignetteStyle(v: number | null): CSSProperties {
  const base: CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    animation: "vignettePulse 0.4s steps(4) forwards",
  };

  if (v === null) {
    return {
      ...base,
      background: "rgba(15, 15, 26, 0.6)",
      boxShadow: "inset 0 0 20vmin rgba(74,222,128,0.7)",
    };
  }

  const bg = "rgba(15, 15, 26, 0.85)";
  if (v === 3) {
    return { ...base, background: bg, boxShadow: "inset 0 0 15vmin rgba(248,113,113,0.4)" };
  }
  if (v === 2) {
    return { ...base, background: bg, boxShadow: "inset 0 0 15vmin rgba(253,224,71,0.4)" };
  }
  return { ...base, background: bg, boxShadow: "inset 0 0 15vmin rgba(74,222,128,0.5)" };
}

function ImpactParticles({
  color,
  count,
  distance,
}: {
  color: string;
  count: number;
  distance: "8vmin" | "15vmin";
}) {
  const animClass = distance === "15vmin" ? "particle-explode-go" : "particle-explode";
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i * (360 / count)) % 360;
        const particleColor =
          distance === "15vmin" ? (i % 2 === 0 ? "#4ade80" : "#fde047") : color;
        return (
          <div
            key={i}
            className={animClass}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "0.8vmin",
              height: "0.8vmin",
              background: particleColor,
              border: "0.2vmin solid #000",
              ["--angle" as string]: `${angle}deg`,
              animationDelay: `${i * 0.02}s`,
              willChange: "transform",
            }}
          />
        );
      })}
    </>
  );
}

function VsPanel({
  playerName,
  rivalName,
  michiLevel,
}: {
  playerName: string;
  rivalName?: string;
  michiLevel: 1 | 2 | 3;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "3vmin",
        marginBottom: "3vmin",
        zIndex: 2,
      }}
    >
      <div className="countdown-vs-card countdown-vs-card--player">
        <div
          style={{
            height: "8vmin",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <MichiSprite
          reaction="run"
          isTransforming={false}
          showLevelUp={false}
          showLevelDown={false}
          level={michiLevel}
          size="8vmin"
          embedded
        />
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1.4vmin",
            color: "#a78bfa",
            marginTop: "1vmin",
          }}
        >
          TÚ
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1vmin",
            color: "#94a3b8",
          }}
        >
          {playerName}
        </div>
      </div>

      <div
        className="countdown-vs-pulse"
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "4vmin",
          color: "#fde047",
          textShadow: "0.3vmin 0.3vmin 0 #000",
        }}
      >
        VS
      </div>

      <div className="countdown-vs-card countdown-vs-card--rival">
        <div
          style={{
            height: "8vmin",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            transform: "scaleX(-1)",
          }}
        >
          <MichiSprite
          reaction="run"
          isTransforming={false}
          showLevelUp={false}
          showLevelDown={false}
          level={2}
          size="8vmin"
          embedded
        />
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1.4vmin",
            color: "#60a5fa",
            marginTop: "1vmin",
          }}
        >
          RIVAL
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1vmin",
            color: "#94a3b8",
          }}
        >
          {rivalName ?? "???"}
        </div>
      </div>
    </div>
  );
}

function CountdownSubtleFX({ value }: { value: number | null }) {
  const accent =
    value === null ? "#4ade80" : value === 3 ? "#f87171" : value === 2 ? "#fde047" : "#4ade80";

  return (
    <div className="countdown-subtle-fx" aria-hidden>
      <div
        className="countdown-subtle-glow-line"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          boxShadow: `0 0 2vmin ${accent}`,
        }}
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="countdown-subtle-spark"
          style={{
            left: `${18 + i * 16}%`,
            animationDelay: `${i * 0.12}s`,
            background: i % 2 === 0 ? accent : "#fde047",
          }}
        />
      ))}
      {value === null && <div className="countdown-subtle-go-ring" />}
    </div>
  );
}

export function CountdownScreen({
  value,
  gameType,
  rivalName,
  playerName = "TÚ",
  mode,
  michiLevel = 1,
}: CountdownScreenProps) {
  const shakeKey = value === null ? "go" : value;
  const vignetteKey = value === null ? "go" : value;

  return (
    <div
      key={`shake-${shakeKey}`}
      className="countdown-screen-premium screen-shake"
    >
      <CountdownCinematicBackground />
      <div key={vignetteKey} style={getVignetteStyle(value)} />

      <div
        key={`flash-${shakeKey}`}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 11,
          background: getFlashColor(value),
          animation:
            value === null
              ? "instantFlash 0.8s steps(8) forwards"
              : "instantFlash 0.3s steps(3) forwards",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          width: "100%",
        }}
      >
        {gameType === "multi" && value !== null && (
          <VsPanel
            playerName={playerName}
            rivalName={rivalName}
            michiLevel={michiLevel}
          />
        )}

        {gameType === "single" && value !== null && (
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "2vmin",
              color: "#4ade80",
              marginBottom: "3vmin",
            }}
          >
            {mode === "primaria" ? "¡PREPÁRATE!" : "¡PREPÁRATE!"}
          </div>
        )}

        {value !== null ? (
          <div className="countdown-hero-wrap">
            <ImpactParticles color={getNumberColor(value)} count={8} distance="8vmin" />
            <div
              key={value}
              className={`number-impact countdown-number-neon countdown-number-neon--${value}`}
            >
              {value}
            </div>
            <CountdownSubtleFX value={value} />
          </div>
        ) : (
          <div className="countdown-hero-wrap countdown-hero-wrap--go">
            <div className="countdown-go-burst" aria-hidden />
            <div className="countdown-energy-sweep" aria-hidden />
            <ImpactParticles color="#4ade80" count={16} distance="15vmin" />
            <div className="countdown-go-text">
              <span className="countdown-go-punct">¡</span>
              <span className="go-explosion-text countdown-go-mega">CORRE</span>
              <span className="countdown-go-punct">!</span>
            </div>
            <CountdownSubtleFX value={value} />
          </div>
        )}

        {value !== null && (
          <p className="countdown-mode-hint">
            {mode === "primaria"
              ? "¡ATRAPA LAS BUENAS DECISIONES!"
              : "¡DEMUESTRA TU INTELIGENCIA FINANCIERA!"}
          </p>
        )}
      </div>
    </div>
  );
}
