import { END_MESSAGES, FINANCIAL_CONCEPTS, getMichiInfo, MODE_CONFIG } from "../constants/runner";
import type { Choice, GameMode, GameType, PlayerState, RunnerState } from "../types/game";
import { StarField } from "./StarField";

interface EndScreenProps {
  state: RunnerState;
  rival: PlayerState | null;
  gameType: GameType;
  onRestart: () => void;
  onViewLeaderboard: () => void;
}

function ScoreSavedBadge() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1vmin",
        marginTop: "2vmin",
        padding: "1vmin 2vmin",
        background: "#0f0f1a",
        border: "0.3vmin solid #4ade80",
      }}
    >
      <span style={{ fontSize: "2vmin" }}>✓</span>
      <span
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "1.2vmin",
          color: "#4ade80",
        }}
      >
        SCORE GUARDADO
      </span>
    </div>
  );
}

function EducationalSummary({
  choices,
  mode,
  balanceUnit,
}: {
  choices: Choice[];
  mode: GameMode;
  balanceUnit: string;
}) {
  const goodCount = choices.filter((c) => c.isGood).length;
  const badCount = choices.length - goodCount;
  const timeoutCount = choices.filter((c) => c.wasTimeout).length;
  const accuracy =
    choices.length > 0 ? Math.round((goodCount / choices.length) * 100) : 0;

  return (
    <div
      style={{
        background: "#0f0f1a",
        border: "0.4vmin solid #27272a",
        padding: "2vmin",
        marginBottom: "2vmin",
        maxWidth: 640,
        width: "100%",
        zIndex: 1,
      }}
    >
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "1.4vmin",
          color: "#fde047",
          marginBottom: "1.5vmin",
          display: "flex",
          alignItems: "center",
          gap: "1vmin",
        }}
      >
        📚 LO QUE APRENDISTE HOY
      </div>

      <div
        style={{
          display: "flex",
          gap: "1.5vmin",
          marginBottom: "2vmin",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: "12vmin",
            background: "#1a1a2e",
            border: "0.3vmin solid #27272a",
            padding: "1.2vmin",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3.5vmin",
              color: accuracy >= 60 ? "#4ade80" : "#f87171",
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            {accuracy}%
          </div>
          <div
            style={{
              fontSize: "0.9vmin",
              color: "#94a3b8",
              marginTop: "0.4vmin",
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            ACIERTOS
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "12vmin",
            background: "#0a1a0a",
            border: "0.3vmin solid #4ade80",
            padding: "1.2vmin",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3.5vmin",
              color: "#4ade80",
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            {goodCount}
          </div>
          <div
            style={{
              fontSize: "0.9vmin",
              color: "#4ade80",
              marginTop: "0.4vmin",
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            BUENAS ✓
          </div>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: "12vmin",
            background: "#1a0a0a",
            border: "0.3vmin solid #f87171",
            padding: "1.2vmin",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3.5vmin",
              color: "#f87171",
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            {badCount}
          </div>
          <div
            style={{
              fontSize: "0.9vmin",
              color: "#f87171",
              marginTop: "0.4vmin",
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            MALAS ✗
          </div>
        </div>

        {timeoutCount > 0 && (
          <div
            style={{
              flex: 1,
              minWidth: "12vmin",
              background: "#1a1a0a",
              border: "0.3vmin solid #fde047",
              padding: "1.2vmin",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "3.5vmin",
                color: "#fde047",
                fontFamily: '"Press Start 2P", monospace',
              }}
            >
              {timeoutCount}
            </div>
            <div
              style={{
                fontSize: "0.9vmin",
                color: "#fde047",
                marginTop: "0.4vmin",
                fontFamily: '"Press Start 2P", monospace',
              }}
            >
              SIN TIEMPO ⏰
            </div>
          </div>
        )}
      </div>

      {choices.map((choice, i) => {
        const concept = FINANCIAL_CONCEPTS[choice.id];
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
            }}
          >
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1.2vmin",
                color: "#444",
                flexShrink: 0,
                minWidth: "2vmin",
              }}
            >
              {i + 1}.
            </div>
            <div style={{ fontSize: "2.5vmin", flexShrink: 0 }}>{choice.emoji}</div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8vmin",
                  marginBottom: "0.5vmin",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "1.1vmin",
                    color: choice.isGood ? "#4ade80" : "#f87171",
                  }}
                >
                  {choice.label}
                </span>
                {choice.wasTimeout && (
                  <span
                    style={{
                      fontSize: "0.9vmin",
                      background: "#fde04722",
                      color: "#fde047",
                      border: "0.2vmin solid #fde047",
                      padding: "0.1vmin 0.5vmin",
                      fontFamily: '"Press Start 2P", monospace',
                    }}
                  >
                    ⏰ SIN TIEMPO
                  </span>
                )}
                {concept && (
                  <span
                    style={{
                      fontSize: "0.9vmin",
                      background: choice.isGood ? "#4ade8022" : "#f8717122",
                      color: choice.isGood ? "#4ade80" : "#f87171",
                      border: `0.2vmin solid ${choice.isGood ? "#4ade80" : "#f87171"}`,
                      padding: "0.1vmin 0.5vmin",
                      fontFamily: '"Press Start 2P", monospace',
                    }}
                  >
                    {concept.concept}
                  </span>
                )}
              </div>
              {concept && (
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "1vmin",
                    color: "#94a3b8",
                    lineHeight: 1.7,
                    marginBottom: "0.5vmin",
                  }}
                >
                  {concept.explanation[mode]}
                </div>
              )}
              {concept && (
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "0.9vmin",
                    color: choice.isGood ? "#4ade8088" : "#f8717188",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  {concept.tip}
                </div>
              )}
            </div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
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

      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "1.1vmin",
          color: "#f1f5f9",
          textAlign: "center",
          padding: "1.5vmin",
          background: "#1a1a2e",
          borderTop: "0.3vmin solid #27272a",
          lineHeight: 1.8,
          marginTop: "1vmin",
        }}
      >
        {accuracy >= 80
          ? mode === "primaria"
            ? "🌟 ¡Eres un genio del ahorro! Tu alcancía está muy feliz."
            : "🚀 ¡Excelente gestión financiera! Vas camino al éxito."
          : accuracy >= 50
            ? mode === "primaria"
              ? "👍 ¡Vas bien! Sigue aprendiendo a cuidar tu dinero."
              : "📈 Buen intento. Cada decisión es una lección valiosa."
            : mode === "primaria"
              ? "💪 ¡No te rindas! Practica y aprenderás a ahorrar mejor."
              : "🎯 Las malas decisiones de hoy son la sabiduría de mañana."}
      </div>
    </div>
  );
}

function EndButtons({
  onRestart,
  onViewLeaderboard,
}: {
  onRestart: () => void;
  onViewLeaderboard: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "2vmin",
        flexWrap: "wrap",
        justifyContent: "center",
        zIndex: 1,
      }}
    >
      <button type="button" className="px-btn" onClick={onRestart}>
        ↺ JUGAR DE NUEVO
      </button>
      <button
        type="button"
        className="px-btn"
        style={{ background: "#a78bfa" }}
        onClick={onViewLeaderboard}
      >
        🏆 VER RANKING
      </button>
    </div>
  );
}

function SingleEnd({
  state,
  onRestart,
  onViewLeaderboard,
}: {
  state: RunnerState;
  onRestart: () => void;
  onViewLeaderboard: () => void;
}) {
  const mode = state.mode;
  if (!mode) return null;

  const michiInfo = getMichiInfo(mode, state.michiLevel);
  const unit = MODE_CONFIG[mode].balanceUnit;
  const hearts = Math.floor(state.happiness / 20);

  let header = "😿 ¡SIGUE PRACTICANDO!";
  let headerColor = "#f87171";
  if (state.michiLevel === 3) {
    header = "🏆 ¡GANASTE!";
    headerColor = "#fde047";
  } else if (state.michiLevel === 2) {
    header = "🐱 ¡BIEN HECHO!";
    headerColor = "#4ade80";
  }

  const balanceColor =
    state.michiLevel >= 2 ? "#4ade80" : state.michiLevel === 1 ? "#f87171" : "#f1f5f9";

  return (
    <>
      <h2 style={{ color: headerColor, fontSize: 14, marginBottom: 24, zIndex: 1 }}>{header}</h2>

      <div className="px-card" style={{ minWidth: 220, textAlign: "center", marginBottom: 24, zIndex: 1 }}>
        <div style={{ fontSize: 64 }}>{michiInfo.emoji}</div>
        <p style={{ fontSize: 7, color: "#94a3b8", margin: "12px 0 8px" }}>{michiInfo.label}</p>
        <p style={{ fontSize: 16, color: balanceColor, margin: "0 0 16px" }}>
          {unit}
          {state.balance}
        </p>
        <div style={{ fontSize: 10, letterSpacing: 2, marginBottom: 8 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < hearts ? "❤️" : "🤍"}</span>
          ))}
        </div>
        <div className="px-bar" style={{ maxWidth: 200, margin: "0 auto" }}>
          <div
            style={{
              height: "100%",
              width: `${state.happiness}%`,
              background: state.happiness >= 50 ? "#4ade80" : "#f87171",
            }}
          />
        </div>
      </div>

      <div className="px-card" style={{ maxWidth: 400, textAlign: "center", marginBottom: 24, zIndex: 1 }}>
        <p style={{ color: "#f1f5f9", fontSize: 8, margin: 0, lineHeight: 1.8 }}>
          {END_MESSAGES[mode][state.michiLevel]}
        </p>
        <ScoreSavedBadge />
      </div>

      <EducationalSummary
        choices={state.choicesMade}
        mode={mode}
        balanceUnit={unit}
      />

      <EndButtons onRestart={onRestart} onViewLeaderboard={onViewLeaderboard} />
    </>
  );
}

function MultiEnd({
  state,
  rival,
  onRestart,
  onViewLeaderboard,
}: {
  state: RunnerState;
  rival: PlayerState | null;
  onRestart: () => void;
  onViewLeaderboard: () => void;
}) {
  const mode = state.mode;
  if (!mode) return null;

  const myBalance = state.balance;
  const rivalBalance = rival?.balance ?? 0;
  const won = myBalance > rivalBalance;
  const lost = myBalance < rivalBalance;

  const michiInfo = getMichiInfo(mode, state.michiLevel);
  const unit = MODE_CONFIG[mode].balanceUnit;

  let header = "🤝 EMPATE";
  let headerColor = "#94a3b8";
  if (won) {
    header = "🏆 ¡GANASTE!";
    headerColor = "#fde047";
  } else if (lost) {
    header = "😿 PERDISTE";
    headerColor = "#f87171";
  }

  return (
    <>
      <h2 style={{ color: headerColor, fontSize: 14, marginBottom: 24, zIndex: 1 }}>{header}</h2>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 24,
          zIndex: 1,
        }}
      >
        <div
          className="px-card"
          style={{
            minWidth: 180,
            borderColor: won ? "#a78bfa" : undefined,
            borderWidth: won ? 4 : undefined,
          }}
        >
          <p style={{ color: "#a78bfa", fontSize: 7, margin: "0 0 8px" }}>TÚ</p>
          <div style={{ fontSize: 48 }}>{michiInfo.emoji}</div>
          <p style={{ fontSize: 7, color: "#94a3b8", margin: "8px 0" }}>{michiInfo.label}</p>
          <p
            style={{
              fontSize: 16,
              color: state.michiLevel >= 2 ? "#4ade80" : "#f87171",
              margin: 0,
            }}
          >
            {unit}
            {myBalance}
          </p>
        </div>

        <div
          className="px-card"
          style={{
            minWidth: 180,
            borderColor: lost ? "#f87171" : undefined,
          }}
        >
          <p style={{ color: "#94a3b8", fontSize: 7, margin: "0 0 8px" }}>RIVAL</p>
          <div style={{ fontSize: 48 }}>🐱</div>
          <p style={{ fontSize: 7, color: "#94a3b8", margin: "8px 0" }}>
            {rival?.player_name ?? "---"}
          </p>
          <p style={{ fontSize: 16, color: "#a78bfa", margin: 0 }}>
            {unit}
            {rivalBalance}
          </p>
        </div>
      </div>

      <div className="px-card" style={{ maxWidth: 400, textAlign: "center", marginBottom: 24, zIndex: 1 }}>
        <p style={{ color: "#f1f5f9", fontSize: 8, margin: 0, lineHeight: 1.8 }}>
          {END_MESSAGES[mode][state.michiLevel]}
        </p>
        <ScoreSavedBadge />
      </div>

      <EducationalSummary
        choices={state.choicesMade}
        mode={mode}
        balanceUnit={unit}
      />

      <EndButtons onRestart={onRestart} onViewLeaderboard={onViewLeaderboard} />
    </>
  );
}

export function EndScreen({
  state,
  rival,
  gameType,
  onRestart,
  onViewLeaderboard,
}: EndScreenProps) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#0f0f1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <StarField />
      {gameType === "single" ? (
        <SingleEnd
          state={state}
          onRestart={onRestart}
          onViewLeaderboard={onViewLeaderboard}
        />
      ) : (
        <MultiEnd
          state={state}
          rival={rival}
          onRestart={onRestart}
          onViewLeaderboard={onViewLeaderboard}
        />
      )}
    </div>
  );
}
