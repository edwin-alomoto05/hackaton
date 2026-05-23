import type { CSSProperties } from "react";
import type { GameMode, GameType } from "../types/game";
import { MichiSprite } from "./MichiSprite";

interface CountdownScreenProps {
  value: number | null;
  gameType: GameType;
  rivalName?: string;
  playerName?: string;
  mode: GameMode;
  michiLevel?: 1 | 2 | 3;
}

const NUMBER_SHADOW =
  "-0.5vmin -0.5vmin 0 #000, 0.5vmin -0.5vmin 0 #000, -0.5vmin 0.5vmin 0 #000, 0.5vmin 0.5vmin 0 #000, -1vmin 0 0 #000, 1vmin 0 0 #000, 0 -1vmin 0 #000, 0 1vmin 0 #000";

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
  mode,
  michiLevel,
}: {
  playerName: string;
  rivalName?: string;
  mode: GameMode;
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
      <div
        style={{
          background: "#1a1a2e",
          border: "0.4vmin solid #a78bfa",
          boxShadow: "0.4vmin 0.4vmin 0 #000",
          padding: "1.5vmin 2.5vmin",
          textAlign: "center",
          minWidth: "15vmin",
        }}
      >
        <div
          style={{
            height: "8vmin",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div style={{ transform: "scale(0.55)", transformOrigin: "center" }}>
            <MichiSprite
              emoji=""
              isRunning={false}
              level={michiLevel}
              reaction="run"
              mode={mode}
              isTransforming={false}
              showLevelUp={false}
              showLevelDown={false}
              previousLevel={michiLevel}
            />
          </div>
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

      <div
        style={{
          background: "#1a1a2e",
          border: "0.4vmin solid #60a5fa",
          boxShadow: "0.4vmin 0.4vmin 0 #000",
          padding: "1.5vmin 2.5vmin",
          textAlign: "center",
          minWidth: "15vmin",
        }}
      >
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
          <div style={{ transform: "scale(0.55)", transformOrigin: "center" }}>
            <MichiSprite
              emoji=""
              isRunning={false}
              level={2}
              reaction="run"
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

function ProgressBars({ value }: { value: number | null }) {
  const bars = [
    { label: "3", color: "#f87171", threshold: 3 },
    { label: "2", color: "#fde047", threshold: 2 },
    { label: "1", color: "#4ade80", threshold: 1 },
  ] as const;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1vmin",
        marginTop: "3vmin",
        width: "40vmin",
        zIndex: 2,
      }}
    >
      {bars.map((bar) => {
        const filled = value === null || value <= bar.threshold;
        return (
          <div
            key={bar.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1vmin",
            }}
          >
            <span
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1.2vmin",
                color: bar.color,
                width: "2.5vmin",
                flexShrink: 0,
              }}
            >
              {bar.label}
            </span>
            <div
              style={{
                flex: 1,
                height: "1.5vmin",
                background: "#1a1a2e",
                border: "0.3vmin solid #000",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: filled ? "100%" : "0%",
                  background: bar.color,
                  transition: "width 0.9s steps(9)",
                }}
              />
            </div>
            <span
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1.2vmin",
                color: "#4ade80",
                width: "2vmin",
                opacity: filled ? 1 : 0,
              }}
            >
              ✓
            </span>
          </div>
        );
      })}
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
      className="screen-shake"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
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
            mode={mode}
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
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40vmin",
            }}
          >
            <ImpactParticles color={getNumberColor(value)} count={8} distance="8vmin" />
            <div
              key={value}
              className="number-impact"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "35vmin",
                lineHeight: 1,
                color: getNumberColor(value),
                textShadow: NUMBER_SHADOW,
              }}
            >
              {value}
            </div>
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <ImpactParticles color="#4ade80" count={16} distance="15vmin" />
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                lineHeight: 1.2,
              }}
            >
              <span style={{ fontSize: "3vmin", color: "#4ade80" }}>¡</span>
              <span
                className="go-explosion-text"
                style={{
                  fontSize: "12vmin",
                  color: "#fff",
                  textShadow: NUMBER_SHADOW,
                }}
              >
                CORRE
              </span>
              <span style={{ fontSize: "3vmin", color: "#4ade80" }}>!</span>
            </div>
            <div
              className="countdown-michi-run"
              style={{
                marginTop: "2vmin",
                transform: "scale(0.85)",
                transformOrigin: "center top",
              }}
            >
              <MichiSprite
                emoji=""
                isRunning
                level={michiLevel}
                reaction="run"
                mode={mode}
                isTransforming={false}
                showLevelUp={false}
                showLevelDown={false}
                previousLevel={michiLevel}
              />
            </div>
          </div>
        )}

        {value !== null && (
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.6vmin",
              color: "#94a3b8",
              marginTop: "2vmin",
              textAlign: "center",
              zIndex: 2,
            }}
          >
            {mode === "primaria"
              ? "¡ATRAPA LAS BUENAS DECISIONES!"
              : "¡DEMUESTRA TU INTELIGENCIA FINANCIERA!"}
          </div>
        )}

        <ProgressBars value={value} />
      </div>
    </div>
  );
}
