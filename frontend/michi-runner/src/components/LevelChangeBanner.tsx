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
  const isUp = showLevelUp;

  return (
    <div className="premium-level-banner">
      <div key={`${isUp ? "up" : "down"}-${newLevel}`} className="premium-level-panel">
        <div className={`premium-level-tag premium-level-tag--${isUp ? "up" : "down"}`}>
          {isUp ? "▲ SUBISTE DE NIVEL" : "▼ BAJASTE DE NIVEL"}
        </div>
        <div className={`premium-level-card premium-level-card--${isUp ? "up" : "down"}`}>
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
            <div className={`premium-level-name premium-level-name--${isUp ? "up" : "down"}`}>
              {levelData?.label}
            </div>
            <div className="premium-level-sub">
              {isUp
                ? mode === "primaria"
                  ? "¡Tu alcancía crece!"
                  : "¡Tu patrimonio aumenta!"
                : mode === "primaria"
                  ? "¡Cuida tu alcancía!"
                  : "¡Recupera tu camino!"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
