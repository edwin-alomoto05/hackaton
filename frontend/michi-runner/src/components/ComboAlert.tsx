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
    <div
      style={{
        position: "absolute",
        top: "15vh",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 8,
        pointerEvents: "none",
      }}
    >
      <div
        key={comboCount}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1vmin",
          animation: "comboAppear 0.4s ease-out forwards",
        }}
      >
        <div
          style={{
            fontSize: "6vmin",
            animation: "comboShake 0.3s ease-in-out 3",
          }}
        >
          {conf.fires}
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "3.5vmin",
            color: conf.color,
            textShadow: `0 0 15px ${conf.color}88`,
            animation: "comboPulse 0.5s ease-in-out infinite",
            whiteSpace: "nowrap",
          }}
        >
          {conf.label}
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "2vmin",
            color: "#4ade80",
            background: "#0f0f1a",
            border: "0.3vmin solid #4ade80",
            boxShadow: "0.3vmin 0.3vmin 0 #000",
            padding: "0.8vmin 1.5vmin",
            whiteSpace: "nowrap",
          }}
        >
          +{balanceUnit}
          {comboBonus} BONUS
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1.2vmin",
            color: "#94a3b8",
            marginTop: "0.5vmin",
          }}
        >
          {mode === "primaria" ? "¡Muy bien! ¡Sigue así!" : "¡Excelente gestión financiera!"}
        </div>
      </div>
    </div>
  );
}
