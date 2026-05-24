import { useEffect, useState } from "react";
import { MICHI_LEVELS, MODE_CONFIG } from "../constants/runner";
import type { GameMode, LeaderboardEntry, LeaderboardFilter } from "../types/game";
import { PodiumTop3 } from "./leaderboard/PodiumTop3";
import { StadiumDecor } from "./leaderboard/StadiumDecor";
import MichiSprite from "./MichiSprite";
import { PixelConfetti } from "./ui/PixelConfetti";
import { TypeWriter } from "./ui/TypeWriter";

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  mode: GameMode;
  filter: LeaderboardFilter;
  myPlayerName: string;
  myFinalBalance: number;
  onFilterChange: (f: LeaderboardFilter) => void;
  onPlayAgain: () => void;
  onBack: () => void;
}

const FILTER_OPTIONS: { id: LeaderboardFilter; icon: string; label: string }[] = [
  { id: "all", icon: "🌐", label: "TODOS" },
  { id: "single", icon: "🐱", label: "SOLO" },
  { id: "multi", icon: "⚔️", label: "VERSUS" },
];

function HeaderTrophy() {
  return (
    <div
      className="trophy-bounce"
      style={{
        position: "relative",
        width: "5vmin",
        height: "5vmin",
        flexShrink: 0,
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "0.5vmin",
          width: "3.6vmin",
          height: "2.4vmin",
          background: "#ffd700",
          border: "0.25vmin solid #cc8800",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "2.5vmin",
          width: "2.4vmin",
          height: "0.6vmin",
          background: "#ffd700",
          border: "0.2vmin solid #cc8800",
        }}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2vmin",
        zIndex: 2,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "8vmin",
          height: "8vmin",
          border: "0.4vmin dashed #27272a",
        }}
      >
        <div className="michi-orbit-runner">
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
      </div>
      <TypeWriter
        key="loading-rank"
        text="CARGANDO RANKING..."
        delay={100}
        color="#94a3b8"
        fontSize="1.4vmin"
      />
    </div>
  );
}

function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2vmin",
        padding: "3vmin",
        zIndex: 2,
      }}
    >
      <span className="signal-lost-emoji" style={{ fontSize: "6vmin" }}>
        📡
      </span>
      <TypeWriter text={error} delay={60} color="#f87171" fontSize="1.4vmin" />
      <button type="button" className="px-btn lobby-create-btn" onClick={onRetry}>
        ↺ REINTENTAR
      </button>
    </div>
  );
}

export function LeaderboardScreen({
  entries,
  loading,
  error,
  mode,
  filter,
  myPlayerName,
  myFinalBalance,
  onFilterChange,
  onPlayAgain,
  onBack,
}: LeaderboardScreenProps) {
  const unit = MODE_CONFIG[mode].balanceUnit;
  const restEntries = entries.slice(3);
  const [visibleEntries, setVisibleEntries] = useState(0);

  useEffect(() => {
    if (loading || restEntries.length === 0) {
      setVisibleEntries(0);
      return;
    }
    setVisibleEntries(0);
    const intervalId = window.setInterval(() => {
      setVisibleEntries((prev) => {
        if (prev >= restEntries.length) {
          window.clearInterval(intervalId);
          return prev;
        }
        return prev + 1;
      });
    }, 150);
    return () => window.clearInterval(intervalId);
  }, [entries, loading, restEntries.length]);

  const filterLabel =
    filter === "all" ? "TODOS" : filter === "single" ? "SOLO" : "VERSUS";

  return (
    <div
      style={{
        position: "relative",
        background: "#0f0f1a",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Press Start 2P", monospace',
        overflow: "hidden",
      }}
    >
      <StadiumDecor />

      <header
        className="menu-header-slide"
        style={{
          background: "#1a1a2e",
          borderBottom: "0.5vmin solid #fde047",
          padding: "2vmin 3vmin",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5vmin" }}>
          <HeaderTrophy />
          <div>
            <div style={{ fontSize: "2.5vmin", color: "#fde047" }}>🏆 RANKING MUNDIAL</div>
            <div style={{ fontSize: "1vmin", color: "#94a3b8", marginTop: "0.5vmin" }}>
              {mode === "primaria" ? "MODO PRIMARIA 🐣" : "MODO SECUNDARIA 🎒"}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="px-btn"
          style={{
            fontSize: "1.2vmin",
            padding: "1vmin 1.5vmin",
            background: "transparent",
            color: "#94a3b8",
            border: "0.3vmin solid #27272a",
            boxShadow: "0.3vmin 0.3vmin 0 #000",
          }}
          onClick={onBack}
        >
          ← VOLVER
        </button>
      </header>

      <div
        style={{
          display: "flex",
          padding: "0 3vmin",
          borderBottom: "0.3vmin solid #27272a",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onFilterChange(f.id)}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.1vmin",
              padding: "1.2vmin 2vmin",
              background: filter === f.id ? "#1a1a2e" : "transparent",
              color: filter === f.id ? "#fde047" : "#94a3b8",
              border: "none",
              borderBottom:
                filter === f.id ? "0.3vmin solid #fde047" : "0.3vmin solid transparent",
              cursor: "pointer",
              transition: "all 0.05s steps(1)",
              display: "flex",
              alignItems: "center",
              gap: "0.8vmin",
            }}
          >
            <span style={{ fontSize: "1.8vmin" }}>{f.icon}</span>
            {f.label}
          </button>
        ))}
      </div>

      {loading && <LoadingState />}

      {!loading && error && (
        <ErrorState error={error} onRetry={() => onFilterChange(filter)} />
      )}

      {!loading && !error && (
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          {entries.length >= 1 && (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.6,
                  pointerEvents: "none",
                  overflow: "hidden",
                }}
              >
                <PixelConfetti isActive count={15} />
              </div>
              <PodiumTop3 entries={entries} mode={mode} />
            </div>
          )}

          <div style={{ flex: 1, padding: "2vmin 3vmin", zIndex: 2 }}>
            {entries.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "5vmin",
                  color: "#94a3b8",
                  fontSize: "1.4vmin",
                }}
              >
                <div style={{ fontSize: "6vmin", marginBottom: "2vmin" }}>🐱</div>
                AÚN NO HAY SCORES
                <div style={{ fontSize: "1.1vmin", marginTop: "1vmin", opacity: 0.7 }}>
                  ¡Sé el primero en jugar!
                </div>
              </div>
            ) : (
              restEntries.map((entry, listIndex) => {
                if (listIndex >= visibleEntries) return null;
                const isMe =
                  entry.player_name === myPlayerName &&
                  entry.final_balance === myFinalBalance;
                const michiEmoji =
                  MICHI_LEVELS[mode].find((l) => l.level === entry.michi_level)?.emoji ?? "🐱";
                const goodPct =
                  entry.total_choices > 0
                    ? (entry.good_choices / entry.total_choices) * 100
                    : 0;

                return (
                  <div
                    key={`${entry.rank}-${entry.player_name}-${listIndex}`}
                    className="end-row-reveal"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2vmin",
                      padding: "1.5vmin 2vmin",
                      marginBottom: "1vmin",
                      background: isMe ? "#0a1a0a" : "#1a1a2e",
                      border: isMe ? "0.4vmin solid #4ade80" : "0.3vmin solid #27272a",
                      boxShadow: isMe ? "0.3vmin 0.3vmin 0 #4ade80" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2vmin",
                        color: "#4a5568",
                        minWidth: "5vmin",
                        textAlign: "center",
                      }}
                    >
                      #{entry.rank}
                    </div>
                    <div style={{ fontSize: "3vmin" }}>{michiEmoji}</div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1vmin",
                          marginBottom: "0.5vmin",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "1.4vmin",
                            color: isMe ? "#4ade80" : "#f1f5f9",
                          }}
                        >
                          {entry.player_name}
                        </span>
                        {isMe && (
                          <span className="lobby-recommended-badge" style={{
                            fontSize: "0.9vmin",
                            background: "#4ade80",
                            color: "#000",
                            padding: "0.2vmin 0.6vmin",
                            border: "0.2vmin solid #000",
                          }}>
                            TÚ
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: "0.9vmin",
                            color: entry.game_type === "single" ? "#94a3b8" : "#60a5fa",
                            border: "0.2vmin solid #27272a",
                            padding: "0.2vmin 0.6vmin",
                          }}
                        >
                          {entry.game_type === "single" ? "SOLO" : "VERSUS"}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1vmin" }}>
                        <div
                          style={{
                            flex: 1,
                            height: "0.8vmin",
                            background: "#27272a",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${goodPct}%`,
                              background: "#4ade80",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "0.9vmin", color: "#4ade80" }}>
                          {entry.good_choices}/{entry.total_choices}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: "2.2vmin", color: "#f1f5f9" }}>
                        {unit}
                        {entry.final_balance.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      <footer
        style={{
          borderTop: "0.3vmin solid #27272a",
          padding: "2vmin 3vmin",
          display: "flex",
          gap: "2vmin",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#0a0a14",
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: "1vmin", color: "#444" }}>
          TOP 5 · {mode.toUpperCase()} · {filterLabel}
        </div>
        <button
          type="button"
          className="px-btn"
          style={{ fontSize: "1.2vmin", padding: "1.2vmin 2vmin" }}
          onClick={onPlayAgain}
        >
          ▶ JUGAR DE NUEVO
        </button>
      </footer>
    </div>
  );
}
