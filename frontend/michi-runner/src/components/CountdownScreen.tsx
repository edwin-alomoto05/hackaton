import type { GameMode, GameType } from "../types/game";

interface CountdownScreenProps {
  value: number | null;
  gameType: GameType;
  rivalName?: string;
  mode: GameMode;
}

export function CountdownScreen({ value, gameType, rivalName, mode }: CountdownScreenProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.72)",
      }}
    >
      {gameType === "multi" && value !== null && (
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "2vmin",
            color: "#94a3b8",
            marginBottom: "3vmin",
            textAlign: "center",
          }}
        >
          VS {rivalName ?? "RIVAL"}
        </div>
      )}

      {gameType === "single" && (
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "2vmin",
            color: "#4ade80",
            marginBottom: "3vmin",
          }}
        >
          {mode === "primaria" ? "¡PREPÁRATE! 🐣" : "¡PREPÁRATE! 🎒"}
        </div>
      )}

      {value !== null ? (
        <div
          key={value}
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "30vmin",
            lineHeight: 1,
            color: value === 3 ? "#f87171" : value === 2 ? "#fde047" : "#4ade80",
            animation: "countPop 0.4s ease-out forwards",
            textShadow:
              value === 3
                ? "0 0 20px #f8717166"
                : value === 2
                  ? "0 0 20px #fde04766"
                  : "0 0 20px #4ade8066",
          }}
        >
          {value}
        </div>
      ) : (
        <div
          key="go"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "10vmin",
            color: "#4ade80",
            animation: "goFlash 0.3s ease-out forwards",
            textAlign: "center",
            textShadow: "0 0 30px #4ade8099",
          }}
        >
          ¡CORRE! 🐱
        </div>
      )}

      {value !== null && (
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1.6vmin",
            color: "#94a3b8",
            marginTop: "4vmin",
            textAlign: "center",
          }}
        >
          {mode === "primaria"
            ? "¡ATRAPA LAS BUENAS DECISIONES!"
            : "¡DEMUESTRA TU INTELIGENCIA FINANCIERA!"}
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "1vmin",
          marginTop: "3vmin",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "8vmin",
              height: "1.5vmin",
              background: i === 0 ? "#f87171" : i === 1 ? "#fde047" : "#4ade80",
              border: "0.3vmin solid #000",
              animation: `barBlink ${0.6 + i * 0.2}s step-end infinite`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
