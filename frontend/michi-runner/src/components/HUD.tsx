import { CITIES, getMichiInfo, MODE_CONFIG } from "../constants/runner";
import type { Choice, GameMode, GameType, PlayerState } from "../types/game";

interface HUDProps {
  balance: number;
  happiness: number;
  michiLevel: 1 | 2 | 3;
  michiEmoji: string;
  timeLeft: number;
  mode: GameMode;
  balanceUnit: string;
  gameType: GameType;
  cityIndex: number;
  cityProgress: number;
  rival: PlayerState | null;
  isRivalActive: boolean;
  myBalance: number;
  comboCount: number;
  choices: Choice[];
  showHistory: boolean;
  onToggleHistory: () => void;
}

export function HUD({
  balance,
  happiness,
  michiLevel,
  michiEmoji,
  timeLeft,
  mode,
  balanceUnit,
  gameType,
  cityIndex,
  cityProgress,
  rival,
  isRivalActive,
  myBalance,
  comboCount,
  choices,
  showHistory,
  onToggleHistory,
}: HUDProps) {
  const currentCity = CITIES[cityIndex] ?? CITIES[0];
  const nextCity = CITIES[(cityIndex + 1) % CITIES.length];
  const initial = MODE_CONFIG[mode].initialBalance;
  const balanceColor = balance > initial ? "#4ade80" : balance < initial ? "#f87171" : "#f1f5f9";
  const barColor = balance >= initial ? "#4ade80" : "#f87171";
  const barPct = Math.min(100, Math.max(0, (balance / Math.max(initial * 2, 1)) * 100));
  const michiLabel = getMichiInfo(mode, michiLevel).label;
  const hearts = Math.floor(happiness / 20);

  return (
    <div
      style={{
        background: "#0f0f1a",
        borderBottom: "4px solid #000",
        padding: "8px 12px",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 7, color: "#94a3b8", marginBottom: 4 }}>
            {michiEmoji} {michiLabel}
          </div>
          <div style={{ fontSize: 10, color: balanceColor }}>
            {balanceUnit}
            {balance}
          </div>
          <div className="px-bar" style={{ marginTop: 6 }}>
            <div style={{ height: "100%", width: `${barPct}%`, background: barColor }} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className={timeLeft < 10 ? "blink" : undefined}
              style={{ fontSize: 16, color: timeLeft < 10 ? "#f87171" : "#fde047" }}
            >
              {timeLeft}
            </div>
            <div style={{ fontSize: 7, color: "#94a3b8" }}>SEG</div>
          </div>
          {comboCount >= 2 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5vmin",
                padding: "0 1.5vmin",
              }}
            >
              <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: "1.8vmin" }}>
                {comboCount >= 4 ? "🔥🔥🔥" : comboCount === 3 ? "🔥🔥" : "🔥"}
              </div>
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1vmin",
                  color: comboCount >= 4 ? "#fde047" : comboCount === 3 ? "#f87171" : "#fb923c",
                  animation: "timerGlow 0.8s ease-in-out infinite",
                }}
              >
                x{comboCount}
              </div>
            </div>
          )}
          <button
            type="button"
            onClick={onToggleHistory}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1vmin",
              background: showHistory ? "#fde047" : "#1a1a2e",
              color: showHistory ? "#000" : "#94a3b8",
              border: "0.3vmin solid #27272a",
              padding: "0.6vmin 1vmin",
              cursor: "pointer",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            📋 {choices.length}
          </button>
        </div>

        {gameType === "single" ? (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 7, color: "#94a3b8" }}>SOLO</div>
            <div style={{ fontSize: 24, textAlign: "right", margin: "4px 0" }}>🐱</div>
            <div style={{ fontSize: 7, color: "#4ade80" }}>¡Tú puedes!</div>
          </div>
        ) : (
          <div style={{ textAlign: "right", minWidth: "18vmin" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "1vmin",
                marginBottom: "0.8vmin",
              }}
            >
              <div
                style={{
                  width: "1.2vmin",
                  height: "1.2vmin",
                  borderRadius: "50%",
                  background: isRivalActive ? "#4ade80" : "#f87171",
                  animation: isRivalActive ? "pulse 1.5s ease-in-out infinite" : "none",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1.2vmin",
                  color: "#94a3b8",
                  maxWidth: "12vmin",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {rival?.player_name ?? "RIVAL"}
              </span>
            </div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "2.2vmin",
                color: "#a78bfa",
                marginBottom: "0.5vmin",
              }}
            >
              {balanceUnit}
              {rival?.balance ?? "---"}
            </div>
            {(() => {
              const diff = (rival?.balance ?? 0) - myBalance;
              return (
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "1.1vmin",
                    color: diff > 0 ? "#f87171" : diff < 0 ? "#4ade80" : "#94a3b8",
                  }}
                >
                  {diff > 0
                    ? `▲ +${diff} rival`
                    : diff < 0
                      ? `▼ ${diff} tú ganas`
                      : "= EMPATE"}
                </div>
              );
            })()}
            <div
              style={{
                marginTop: "0.8vmin",
                height: "0.8vmin",
                background: "#1a1a2e",
                border: "0.2vmin solid #333",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${rival?.happiness ?? 50}%`,
                  background: "#a78bfa",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "0.9vmin",
                color: "#444",
                marginTop: "0.3vmin",
                textAlign: "right",
              }}
            >
              FELICIDAD RIVAL
            </div>
          </div>
        )}
      </div>

      <div style={{ fontSize: 10, marginTop: 8, letterSpacing: 2 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < hearts ? "❤️" : "🤍"}</span>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5vmin",
          padding: "0.8vmin 2vmin",
          background: "#09090b",
          borderTop: "0.3vmin solid #27272a",
          marginTop: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.8vmin", flexShrink: 0 }}>
          <span style={{ fontSize: "2.5vmin" }}>{currentCity.emoji}</span>
          <span
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.2vmin",
              color: currentCity.color,
            }}
          >
            {currentCity.name}
          </span>
        </div>
        <div
          style={{
            flex: 1,
            height: "1.5vmin",
            background: "#1a1a2e",
            border: "0.3vmin solid #000",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${cityProgress}%`,
              background: currentCity.color,
              transition: "width 0.3s linear",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: `${cityProgress}%`,
              transform: "translate(-50%, -50%)",
              fontSize: "1.8vmin",
              transition: "left 0.3s linear",
            }}
          >
            🐱
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8vmin", flexShrink: 0, opacity: 0.5 }}>
          <span style={{ fontSize: "2.5vmin" }}>{nextCity.emoji}</span>
          <span
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.2vmin",
              color: "#94a3b8",
            }}
          >
            {nextCity.name}
          </span>
        </div>
      </div>

      {showHistory && choices.length > 0 && (
        <div
          style={{
            background: "#09090b",
            borderTop: "0.3vmin solid #27272a",
            padding: "1vmin 2vmin",
            display: "flex",
            flexDirection: "column",
            gap: "0.8vmin",
          }}
        >
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1vmin",
              color: "#94a3b8",
              marginBottom: "0.3vmin",
            }}
          >
            ÚLTIMAS DECISIONES:
          </div>
          {choices
            .slice(-3)
            .reverse()
            .map((c, i) => (
              <div
                key={`${c.id}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1vmin",
                  padding: "0.5vmin 1vmin",
                  background: c.isGood ? "#0a1a0a" : "#1a0a0a",
                  borderLeft: `0.4vmin solid ${c.isGood ? "#4ade80" : "#f87171"}`,
                }}
              >
                <span style={{ fontSize: "1.8vmin" }}>{c.emoji}</span>
                <span
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "0.9vmin",
                    color: c.isGood ? "#4ade80" : "#f87171",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.label}
                </span>
                <span
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "1vmin",
                    color: c.isGood ? "#4ade80" : "#f87171",
                    flexShrink: 0,
                  }}
                >
                  {c.delta >= 0 ? "+" : ""}
                  {balanceUnit}
                  {c.delta}
                </span>
                {c.wasTimeout && (
                  <span style={{ fontSize: "1.2vmin" }} title="Sin tiempo">
                    ⏰
                  </span>
                )}
              </div>
            ))}
          {choices.length > 3 && (
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "0.8vmin",
                color: "#444",
                textAlign: "center",
              }}
            >
              +{choices.length - 3} decisiones más
            </div>
          )}
        </div>
      )}

      {showHistory && choices.length === 0 && (
        <div
          style={{
            background: "#09090b",
            borderTop: "0.3vmin solid #27272a",
            padding: "1.5vmin 2vmin",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1vmin",
            color: "#444",
            textAlign: "center",
          }}
        >
          AÚN NO HAY DECISIONES
        </div>
      )}
    </div>
  );
}
