import { MICHI_LEVELS, MODE_CONFIG } from "../constants/runner";
import type { GameMode, LeaderboardEntry, LeaderboardFilter } from "../types/game";

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

const FILTER_OPTIONS: LeaderboardFilter[] = ["all", "single", "multi"];

function filterLabel(f: LeaderboardFilter): string {
  if (f === "all") return "🌐 TODOS";
  if (f === "single") return "🐱 SOLO";
  return "⚔️ VERSUS";
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

  return (
    <div
      style={{
        background: "#0f0f1a",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: '"Press Start 2P", monospace',
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "#1a1a2e",
          borderBottom: "0.4vmin solid #fde047",
          padding: "2vmin 3vmin",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1.5vmin" }}>
          <span style={{ fontSize: "4vmin" }}>🏆</span>
          <div>
            <div style={{ fontSize: "2.2vmin", color: "#fde047" }}>RANKING</div>
            <div style={{ fontSize: "1.1vmin", color: "#94a3b8", marginTop: "0.4vmin" }}>
              {mode === "primaria" ? "MODO PRIMARIA 🐣" : "MODO SECUNDARIA 🎒"}
            </div>
          </div>
        </div>
        <button
          type="button"
          className="px-btn"
          style={{ fontSize: "1.2vmin", padding: "1vmin 1.5vmin" }}
          onClick={onBack}
        >
          ← VOLVER
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1.5vmin",
          padding: "2vmin 3vmin",
          borderBottom: "0.3vmin solid #27272a",
          flexShrink: 0,
        }}
      >
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onFilterChange(f)}
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.2vmin",
              padding: "1vmin 2vmin",
              background: filter === f ? "#fde047" : "#1a1a2e",
              color: filter === f ? "#000" : "#94a3b8",
              border: filter === f ? "0.3vmin solid #000" : "0.3vmin solid #27272a",
              boxShadow: filter === f ? "0.3vmin 0.3vmin 0 #000" : "none",
              cursor: "pointer",
            }}
          >
            {filterLabel(f)}
          </button>
        ))}
      </div>

      {loading && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2vmin",
          }}
        >
          <div className="spinner" />
          <div style={{ fontSize: "1.4vmin", color: "#94a3b8" }}>CARGANDO RANKING...</div>
        </div>
      )}

      {!loading && error && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2vmin",
          }}
        >
          <div style={{ fontSize: "6vmin" }}>📡</div>
          <div style={{ fontSize: "1.4vmin", color: "#f87171" }}>{error}</div>
          <button type="button" className="px-btn" onClick={() => onFilterChange(filter)}>
            ↺ REINTENTAR
          </button>
        </div>
      )}

      {!loading && !error && (
        <div style={{ flex: 1, overflowY: "auto", padding: "2vmin 3vmin" }}>
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
            entries.map((entry, idx) => {
              const isMe =
                entry.player_name === myPlayerName && entry.final_balance === myFinalBalance;
              const rankColor =
                entry.rank === 1
                  ? "#fde047"
                  : entry.rank === 2
                    ? "#94a3b8"
                    : entry.rank === 3
                      ? "#fb923c"
                      : "#4a5568";
              const rankEmoji =
                entry.rank === 1
                  ? "🥇"
                  : entry.rank === 2
                    ? "🥈"
                    : entry.rank === 3
                      ? "🥉"
                      : `#${entry.rank}`;
              const michiEmoji =
                MICHI_LEVELS[mode].find((l) => l.level === entry.michi_level)?.emoji ?? "🐱";
              const goodPct =
                entry.total_choices > 0
                  ? (entry.good_choices / entry.total_choices) * 100
                  : 0;

              return (
                <div
                  key={`${entry.rank}-${entry.player_name}-${idx}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2vmin",
                    padding: "1.5vmin 2vmin",
                    marginBottom: "1vmin",
                    background: isMe ? "#1a2e1a" : "#1a1a2e",
                    border: isMe
                      ? "0.4vmin solid #4ade80"
                      : entry.rank <= 3
                        ? `0.4vmin solid ${rankColor}`
                        : "0.3vmin solid #27272a",
                    boxShadow: isMe
                      ? "0.3vmin 0.3vmin 0 #4ade80"
                      : entry.rank <= 3
                        ? `0.3vmin 0.3vmin 0 ${rankColor}`
                        : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: entry.rank <= 3 ? "3.5vmin" : "2vmin",
                      color: rankColor,
                      minWidth: "5vmin",
                      textAlign: "center",
                    }}
                  >
                    {rankEmoji}
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
                        <span
                          style={{
                            fontSize: "0.9vmin",
                            background: "#4ade80",
                            color: "#000",
                            padding: "0.2vmin 0.6vmin",
                          }}
                        >
                          TÚ
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: "0.9vmin",
                          background: entry.game_type === "single" ? "#1a1a2e" : "#1a1a3e",
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
                        {entry.good_choices}/{entry.total_choices} ✓
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: "2.2vmin", color: rankColor }}>
                      {unit}
                      {entry.final_balance.toLocaleString()}
                    </div>
                    <div style={{ fontSize: "0.9vmin", color: "#94a3b8", marginTop: "0.3vmin" }}>
                      {new Date(entry.played_at).toLocaleDateString("es-EC", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      <div
        style={{
          borderTop: "0.3vmin solid #27272a",
          padding: "2vmin 3vmin",
          display: "flex",
          gap: "2vmin",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <button type="button" className="px-btn" onClick={onPlayAgain}>
          ▶ JUGAR DE NUEVO
        </button>
      </div>
    </div>
  );
}
