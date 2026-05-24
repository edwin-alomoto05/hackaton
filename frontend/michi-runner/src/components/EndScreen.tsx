import { useEffect, useState } from "react";
import { END_MESSAGES, FINANCIAL_CONCEPTS, MICHI_LEVELS } from "../constants/runner";
import type { Choice, GameMode, GameType, PlayerState, RunnerState } from "../types/game";
import { PixelConfetti } from "./ui/PixelConfetti";

interface EndScreenProps {
  state: RunnerState;
  rival?: PlayerState | null;
  gameType: GameType;
  onRestart: () => void;
  onViewLeaderboard: () => void;
  mode: GameMode;
  balanceUnit: string;
  choices: Choice[];
}

export function EndScreen({
  state,
  rival = null,
  gameType,
  onRestart,
  onViewLeaderboard,
  mode,
  balanceUnit,
  choices,
}: EndScreenProps) {
  const [visibleRows, setVisibleRows] = useState(0);
  const [showButtons, setShowButtons] = useState(false);

  const isWinner =
    gameType === "single"
      ? state.michiLevel === 3
      : (state.balance ?? 0) > (rival?.balance ?? 0);

  const isDraw = gameType === "multi" && state.balance === rival?.balance;

  const levelData = MICHI_LEVELS[mode].find((l) => l.level === state.michiLevel);

  const goodCount = choices.filter((c) => c.isGood).length;
  const badCount = choices.length - goodCount;
  const accuracy =
    choices.length > 0 ? Math.round((goodCount / choices.length) * 100) : 0;

  useEffect(() => {
    setVisibleRows(0);
    setShowButtons(false);

    if (choices.length === 0) {
      const t = window.setTimeout(() => setShowButtons(true), 500);
      return () => window.clearTimeout(t);
    }

    const interval = window.setInterval(() => {
      setVisibleRows((prev) => {
        if (prev >= choices.length) {
          window.clearInterval(interval);
          window.setTimeout(() => setShowButtons(true), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 250);

    return () => window.clearInterval(interval);
  }, [choices.length]);

  const headerBg =
    isWinner && !isDraw ? "#0a1a0a" : isDraw ? "#1a1a0a" : "#1a0a0a";
  const headerBorder =
    isWinner && !isDraw ? "#fde047" : isDraw ? "#fde047" : "#f87171";
  const resultColor =
    isWinner && !isDraw ? "#fde047" : isDraw ? "#fde047" : "#f87171";
  const resultLabel =
    isWinner && !isDraw ? "¡GANASTE!" : isDraw ? "¡EMPATE!" : "PERDISTE";
  const resultEmoji = isWinner && !isDraw ? "🏆" : isDraw ? "🤝" : "😿";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0f0f1a",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        fontFamily: '"Press Start 2P", monospace',
      }}
    >
      {isWinner && !isDraw && <PixelConfetti isActive count={40} />}

      <div
        style={{
          background: headerBg,
          borderBottom: `0.5vmin solid ${headerBorder}`,
          padding: "2.5vmin 3vmin",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "2vmin" }}>
          <div
            style={{
              fontSize: "6vmin",
              animation: "trophyBounce 1s steps(4) infinite",
            }}
          >
            {resultEmoji}
          </div>
          <div>
            <div
              style={{
                fontSize: "2.5vmin",
                color: resultColor,
                animation: "countPop 0.5s steps(8) forwards",
                textShadow: "0.2vmin 0.2vmin 0 #000",
              }}
            >
              {resultLabel}
            </div>
            <div
              style={{
                fontSize: "1.1vmin",
                color: "#94a3b8",
                marginTop: "0.5vmin",
              }}
            >
              {levelData?.emoji} {levelData?.label}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "1vmin", color: "#94a3b8" }}>BALANCE FINAL</div>
          <div
            style={{
              fontSize: "3.5vmin",
              color: isWinner ? "#4ade80" : "#f87171",
              marginTop: "0.5vmin",
            }}
          >
            {balanceUnit}
            {state.balance.toLocaleString()}
          </div>
          {gameType === "multi" && rival && (
            <div
              style={{
                fontSize: "1vmin",
                color: "#a78bfa",
                marginTop: "0.3vmin",
              }}
            >
              RIVAL: {balanceUnit}
              {rival.balance.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1vmin",
          padding: "1.5vmin 3vmin",
          background: "#09090b",
          borderBottom: "0.3vmin solid #27272a",
          flexShrink: 0,
        }}
      >
        {[
          {
            label: "ACIERTOS",
            value: `${accuracy}%`,
            color: accuracy >= 60 ? "#4ade80" : "#f87171",
          },
          { label: "BUENAS", value: `${goodCount} ✓`, color: "#4ade80" },
          { label: "MALAS", value: `${badCount} ✗`, color: "#f87171" },
          { label: "DECISIONES", value: String(choices.length), color: "#fde047" },
        ].map((stat, i) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              background: "#1a1a2e",
              border: `0.3vmin solid ${stat.color}44`,
              padding: "1vmin",
              textAlign: "center",
              animation: `rowReveal 0.2s steps(4) ${i * 0.1}s forwards`,
              opacity: 0,
            }}
          >
            <div style={{ fontSize: "2.5vmin", color: stat.color }}>{stat.value}</div>
            <div
              style={{
                fontSize: "0.8vmin",
                color: "#94a3b8",
                marginTop: "0.4vmin",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "1.5vmin 3vmin" }}>
        <div
          style={{
            fontSize: "1.1vmin",
            color: "#fde047",
            marginBottom: "1.5vmin",
          }}
        >
          📚 LO QUE APRENDISTE
        </div>

        {choices.map((choice, i) => {
          const concept = FINANCIAL_CONCEPTS[choice.id];
          if (i >= visibleRows) return null;

          return (
            <div
              key={`${choice.id}-${i}`}
              style={{
                display: "flex",
                gap: "1.5vmin",
                padding: "1.2vmin",
                marginBottom: "0.8vmin",
                background: choice.isGood ? "#0a1a0a" : "#1a0a0a",
                borderLeft: `0.5vmin solid ${choice.isGood ? "#4ade80" : "#f87171"}`,
                animation: "rowReveal 0.2s steps(4) forwards",
              }}
            >
              <span style={{ fontSize: "2.5vmin", flexShrink: 0 }}>{choice.emoji}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8vmin",
                    flexWrap: "wrap",
                    marginBottom: "0.4vmin",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.1vmin",
                      color: choice.isGood ? "#4ade80" : "#f87171",
                    }}
                  >
                    {choice.label}
                  </span>
                  {concept && (
                    <span
                      style={{
                        fontSize: "0.9vmin",
                        background: choice.isGood ? "#4ade8022" : "#f8717122",
                        color: choice.isGood ? "#4ade80" : "#f87171",
                        border: `0.2vmin solid ${choice.isGood ? "#4ade80" : "#f87171"}`,
                        padding: "0.1vmin 0.5vmin",
                      }}
                    >
                      {concept.concept}
                    </span>
                  )}
                  {choice.wasTimeout && (
                    <span
                      style={{
                        fontSize: "0.9vmin",
                        color: "#fde047",
                        border: "0.2vmin solid #fde047",
                        padding: "0.1vmin 0.5vmin",
                      }}
                    >
                      ⏰ SIN TIEMPO
                    </span>
                  )}
                </div>
                {concept && (
                  <div
                    style={{
                      fontSize: "0.9vmin",
                      color: "#94a3b8",
                      lineHeight: 1.7,
                    }}
                  >
                    {concept.tip}
                  </div>
                )}
              </div>
              <div
                style={{
                  fontSize: "1.4vmin",
                  color: choice.isGood ? "#4ade80" : "#f87171",
                  flexShrink: 0,
                  alignSelf: "center",
                }}
              >
                {choice.delta >= 0 ? "+" : ""}
                {balanceUnit}
                {choice.delta}
              </div>
            </div>
          );
        })}
      </div>

      {showButtons && (
        <div
          style={{
            padding: "1.5vmin 3vmin",
            background: "#1a1a2e",
            borderTop: "0.3vmin solid #27272a",
            textAlign: "center",
            animation: "rowReveal 0.3s steps(4) forwards",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: "1.1vmin",
              color:
                accuracy >= 80 ? "#4ade80" : accuracy >= 50 ? "#fde047" : "#94a3b8",
              lineHeight: 2,
            }}
          >
            {END_MESSAGES[mode][state.michiLevel]}
          </div>
        </div>
      )}

      {showButtons && (
        <div
          style={{
            display: "flex",
            gap: "1.5vmin",
            padding: "2vmin 3vmin",
            background: "#0f0f1a",
            borderTop: "0.3vmin solid #27272a",
            justifyContent: "center",
            flexShrink: 0,
            animation: "rowReveal 0.3s steps(4) forwards",
          }}
        >
          <button
            type="button"
            className="px-btn"
            onClick={onRestart}
            style={{ fontSize: "1.4vmin", padding: "1.2vmin 3vmin" }}
          >
            ↺ JUGAR DE NUEVO
          </button>
          <button
            type="button"
            className="px-btn"
            onClick={onViewLeaderboard}
            style={{
              fontSize: "1.4vmin",
              padding: "1.2vmin 3vmin",
              background: "#a78bfa",
            }}
          >
            🏆 RANKING
          </button>
        </div>
      )}

      {showButtons && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1vmin",
            padding: "1vmin",
            background: "#09090b",
            borderTop: "0.2vmin solid #27272a",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "1.5vmin" }}>✓</span>
          <span style={{ fontSize: "0.9vmin", color: "#4ade80" }}>SCORE GUARDADO</span>
        </div>
      )}
    </div>
  );
}
