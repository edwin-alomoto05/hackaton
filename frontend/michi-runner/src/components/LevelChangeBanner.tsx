import MichiSprite from "./MichiSprite";
import { MICHI_LEVELS } from "../constants/runner";
import type { GameMode } from "../types/game";

interface LevelChangeBannerProps {
  showLevelUp: boolean;
  showLevelDown: boolean;
  newLevel: 1 | 2 | 3;
  mode: GameMode;
}

export function LevelChangeBanner({
  showLevelUp,
  showLevelDown,
  newLevel,
  mode,
}: LevelChangeBannerProps) {
  if (!showLevelUp && !showLevelDown) return null;

  const levelData = MICHI_LEVELS[mode].find((l) => l.level === newLevel);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "35%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9,
        pointerEvents: "none",
      }}
    >
      <div
        key={`${showLevelUp ? "up" : "down"}-${newLevel}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1vmin",
          animation: "comboAppear 0.5s ease-out forwards",
        }}
      >
        {showLevelUp && (
          <>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1.8vmin",
                color: "#fde047",
                background: "#0f0f1a",
                border: "0.4vmin solid #fde047",
                boxShadow: "0.4vmin 0.4vmin 0 #000",
                padding: "0.8vmin 1.5vmin",
                whiteSpace: "nowrap",
              }}
            >
              ▲ SUBISTE DE NIVEL
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5vmin",
                background: "#1a1a2e",
                border: "0.3vmin solid #fde047",
                padding: "1vmin 2vmin",
              }}
            >
              <MichiSprite
                reaction="idle"
                isTransforming
                showLevelUp={showLevelUp}
                showLevelDown={showLevelDown}
                level={newLevel}
                size="8vmin"
                embedded
              />
              <div>
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "1.6vmin",
                    color: "#fde047",
                  }}
                >
                  {levelData?.label}
                </div>
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "1.1vmin",
                    color: "#94a3b8",
                    marginTop: "0.4vmin",
                  }}
                >
                  {mode === "primaria" ? "¡Tu alcancía crece!" : "¡Tu patrimonio aumenta!"}
                </div>
              </div>
            </div>
          </>
        )}

        {showLevelDown && (
          <>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1.8vmin",
                color: "#f87171",
                background: "#0f0f1a",
                border: "0.4vmin solid #f87171",
                boxShadow: "0.4vmin 0.4vmin 0 #000",
                padding: "0.8vmin 1.5vmin",
                whiteSpace: "nowrap",
              }}
            >
              ▼ BAJASTE DE NIVEL
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5vmin",
                background: "#1a1a2e",
                border: "0.3vmin solid #f87171",
                padding: "1vmin 2vmin",
              }}
            >
              <MichiSprite
                reaction="idle"
                isTransforming
                showLevelUp={showLevelUp}
                showLevelDown={showLevelDown}
                level={newLevel}
                size="8vmin"
                embedded
              />
              <div>
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "1.6vmin",
                    color: "#f87171",
                  }}
                >
                  {levelData?.label}
                </div>
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "1.1vmin",
                    color: "#94a3b8",
                    marginTop: "0.4vmin",
                  }}
                >
                  {mode === "primaria" ? "¡Cuida tu alcancía!" : "¡Recupera tu camino!"}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
