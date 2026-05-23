import { useEffect, useRef, useState } from "react";
import { QUITO_PLACES, getMichiInfo, MODE_CONFIG } from "../constants/runner";
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
  const safeIndex =
    ((cityIndex % QUITO_PLACES.length) + QUITO_PLACES.length) % QUITO_PLACES.length;
  const currentCity = QUITO_PLACES[safeIndex];
  const nextCity = QUITO_PLACES[(safeIndex + 1) % QUITO_PLACES.length];
  const initial = MODE_CONFIG[mode].initialBalance;
  const balanceColor = balance > initial ? "#4ade80" : balance < initial ? "#f87171" : "#f1f5f9";
  const barColor = balance >= initial ? "#4ade80" : "#f87171";
  const maxBalance = Math.max(initial * 2, 1);
  const barPct = Math.min(100, Math.max(0, (balance / maxBalance) * 100));
  const michiLabel = getMichiInfo(mode, michiLevel).label;
  const hearts = Math.floor(happiness / 20);

  const prevBalanceRef = useRef(balance);
  const [trailBalance, setTrailBalance] = useState(balance);

  useEffect(() => {
    if (balance < prevBalanceRef.current) {
      setTrailBalance(prevBalanceRef.current);
      const timer = window.setTimeout(() => setTrailBalance(balance), 800);
      prevBalanceRef.current = balance;
      return () => window.clearTimeout(timer);
    }
    setTrailBalance(balance);
    prevBalanceRef.current = balance;
  }, [balance]);

  const trailPct = Math.min(100, Math.max(0, (trailBalance / maxBalance) * 100));
  const isDamaged = balance < trailBalance;
  const urgentTimer = timeLeft <= 10;
  const criticalTimer = timeLeft <= 5;

  const comboBg =
    comboCount >= 4
      ? "rgba(253, 224, 71, 0.2)"
      : comboCount === 3
        ? "rgba(248, 113, 113, 0.2)"
        : "rgba(251, 146, 60, 0.2)";
  const comboBorder =
    comboCount >= 4 ? "#fde047" : comboCount === 3 ? "#f87171" : "#fb923c";

  return (
    <div
      style={{
        background: criticalTimer ? "rgba(248, 113, 113, 0.15)" : "#0f0f1a",
        borderBottom: urgentTimer ? "0.5vmin solid #f87171" : "0.5vmin solid #000",
        padding: "1vmin 1.5vmin",
        overflow: "hidden",
        animation: urgentTimer ? "hudShake 0.3s steps(3) infinite" : undefined,
        willChange: urgentTimer ? "transform" : undefined,
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1vmin", alignItems: "start" }}>
        <div>
          <div style={{ fontSize: "0.875vmin", color: "#94a3b8", marginBottom: "0.5vmin" }}>
            {michiEmoji} {michiLabel}
          </div>
          <div style={{ fontSize: "1.25vmin", color: balanceColor }}>
            {balanceUnit}
            {balance}
          </div>
          <div className="px-bar" style={{ marginTop: "0.75vmin", position: "relative" }}>
            {isDamaged && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  height: "100%",
                  width: `${trailPct}%`,
                  background: "#f87171",
                  transition: "width 0.8s steps(8)",
                  zIndex: 1,
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                inset: 0,
                height: "100%",
                width: `${barPct}%`,
                background: barColor,
                transition: "width 0.1s steps(2)",
                zIndex: 2,
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: "1vmin",
            flexWrap: "wrap",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className={criticalTimer ? "blink" : undefined}
              style={{ fontSize: "2vmin", color: urgentTimer ? "#f87171" : "#fde047" }}
            >
              {timeLeft}
            </div>
            <div style={{ fontSize: "0.875vmin", color: "#94a3b8" }}>SEG</div>
          </div>
          {comboCount >= 2 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5vmin",
                padding: "0.6vmin 1.2vmin",
                background: comboBg,
                border: `0.3vmin solid ${comboBorder}`,
              }}
            >
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1.8vmin",
                  willChange: "transform",
                }}
              >
                {comboCount >= 4 ? "MAX" : comboCount === 3 ? "++" : "+"}
              </div>
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1vmin",
                  color: comboBorder,
                  animation: "comboPulse 0.5s steps(2) infinite",
                  willChange: "transform",
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
            <div style={{ fontSize: "0.875vmin", color: "#94a3b8" }}>SOLO</div>
            <div style={{ fontSize: "3vmin", textAlign: "right", margin: "0.5vmin 0" }}>🐱</div>
            <div style={{ fontSize: "0.875vmin", color: "#4ade80" }}>¡Tú puedes!</div>
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
                  borderRadius: 0,
                  background: isRivalActive ? "#4ade80" : "#f87171",
                  animation: isRivalActive ? "pulse 1.5s steps(4) infinite" : "none",
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

      <div style={{ fontSize: "1.2vmin", marginTop: "1vmin", letterSpacing: "0.25vmin" }}>
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
            className="hud-mini-michi"
            style={{
              position: "absolute",
              top: "50%",
              left: `${cityProgress}%`,
              transform: "translate(-50%, -50%)",
              width: "1.5vmin",
              height: "1.5vmin",
              background: "#f4a460",
              border: "0.2vmin solid #000",
              transition: "left 0.3s linear",
              willChange: "transform",
            }}
          >
            <div style={{ position: "absolute", left: "0.25vmin", top: "0.35vmin", width: "0.35vmin", height: "0.35vmin", background: "#1a1a1a" }} />
            <div style={{ position: "absolute", right: "0.25vmin", top: "0.35vmin", width: "0.35vmin", height: "0.35vmin", background: "#1a1a1a" }} />
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
