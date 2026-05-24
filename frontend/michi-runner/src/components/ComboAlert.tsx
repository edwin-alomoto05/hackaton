import { getComboConfig } from "../constants/runner";
import type { GameMode } from "../types/game";

interface ComboAlertProps {
  isVisible: boolean;
  comboCount: number;
  comboBonus: number;
  mode: GameMode;
  balanceUnit: string;
}

export function ComboAlert({
  isVisible,
  comboCount,
  comboBonus,
  mode,
  balanceUnit,
}: ComboAlertProps) {
  if (!isVisible || comboCount < 2) return null;

  const conf = getComboConfig(comboCount);
  if (!conf) return null;

  return (
    <div className="premium-combo-wrap">
      <div key={comboCount} className="premium-combo-panel">
        <div className="premium-combo-fires">{conf.fires}</div>
        <div className="premium-combo-label" style={{ color: conf.color, textShadow: `0 0 15px ${conf.color}88` }}>
          {conf.label}
        </div>
        <div className="premium-combo-bonus">
          +{balanceUnit}
          {comboBonus} BONUS
        </div>
        <div className="premium-combo-sub">
          {mode === "primaria" ? "¡Muy bien! ¡Sigue así!" : "¡Excelente gestión financiera!"}
        </div>
      </div>
    </div>
  );
}
