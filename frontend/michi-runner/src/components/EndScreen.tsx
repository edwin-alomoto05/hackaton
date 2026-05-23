import { useEffect, useState } from "react";
import { END_MESSAGES, FINANCIAL_CONCEPTS, getMichiInfo, MODE_CONFIG } from "../constants/runner";
import type { Choice, GameMode, GameType, PlayerState, RunnerState } from "../types/game";
import { MichiSprite } from "./MichiSprite";
import { PixelConfetti } from "./ui/PixelConfetti";
import { TypeWriter } from "./ui/TypeWriter";

interface EndScreenProps {
  state: RunnerState;
  rival: PlayerState | null;
  gameType: GameType;
  onRestart: () => void;
  onViewLeaderboard: () => void;
}

const NUMBER_SHADOW =
  "-0.5vmin -0.5vmin 0 #000, 0.5vmin -0.5vmin 0 #000, -0.5vmin 0.5vmin 0 #000, 0.5vmin 0.5vmin 0 #000";

function PixelTrophy() {
  return (
    <div
      className="trophy-bounce"
      style={{
        position: "relative",
        width: "8vmin",
        height: "8vmin",
        margin: "0 auto 2vmin",
        willChange: "transform",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 0,
          width: "6vmin",
          height: "4vmin",
          background: "#ffd700",
          border: "0.4vmin solid #cc8800",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "3.5vmin",
          width: "4vmin",
          height: "1vmin",
          background: "#ffd700",
          border: "0.3vmin solid #cc8800",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: "4.2vmin",
          width: "2vmin",
          height: "1.5vmin",
          background: "#ffd700",
          border: "0.3vmin solid #cc8800",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "0.5vmin",
          top: "1vmin",
          width: "1.5vmin",
          height: "2vmin",
          border: "0.4vmin solid #cc8800",
          borderRight: "none",
          borderRadius: "50% 0 0 50%",
          background: "transparent",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "0.5vmin",
          top: "1vmin",
          width: "1.5vmin",
          height: "2vmin",
          border: "0.4vmin solid #cc8800",
          borderLeft: "none",
          borderRadius: "0 50% 50% 0",
          background: "transparent",
        }}
      />
    </div>
  );
}

function MiniMichi({
  level,
  mode,
  reaction,
  mirror,
  className,
}: {
  level: 1 | 2 | 3;
  mode: GameMode;
  reaction: "run" | "sad" | "celebrate";
  mirror?: boolean;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        transform: mirror ? "scaleX(-1)" : undefined,
        height: "10vmin",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div style={{ transform: "scale(0.5)", transformOrigin: "center" }}>
        <MichiSprite
          emoji=""
          isRunning={reaction === "run"}
          level={level}
          reaction={reaction}
          mode={mode}
          isTransforming={false}
          showLevelUp={false}
          showLevelDown={false}
          previousLevel={level}
        />
      </div>
    </div>
  );
}

function getClosingMessage(accuracy: number, mode: GameMode): string {
  if (accuracy >= 80) {
    return mode === "primaria"
      ? "¡Eres un genio del ahorro! Tu alcancía está muy feliz."
      : "¡Excelente gestión financiera! Vas camino al éxito.";
  }
  if (accuracy >= 50) {
    return mode === "primaria"
      ? "¡Vas bien! Sigue aprendiendo a cuidar tu dinero."
      : "Buen intento. Cada decisión es una lección valiosa.";
  }
  return mode === "primaria"
    ? "¡No te rindas! Practica y aprenderás a ahorrar mejor."
    : "Las malas decisiones de hoy son la sabiduría de mañana.";
}

function EducationalSummary({
  choices,
  mode,
  balanceUnit,
  onButtonsReady,
}: {
  choices: Choice[];
  mode: GameMode;
  balanceUnit: string;
  onButtonsReady: () => void;
}) {
  const [visibleRows, setVisibleRows] = useState(0);

  const goodCount = choices.filter((c) => c.isGood).length;
  const badCount = choices.length - goodCount;
  const timeoutCount = choices.filter((c) => c.wasTimeout).length;
  const accuracy =
    choices.length > 0 ? Math.round((goodCount / choices.length) * 100) : 0;

  useEffect(() => {
    if (choices.length === 0) {
      const t = window.setTimeout(() => onButtonsReady(), 800);
      return () => window.clearTimeout(t);
    }
    setVisibleRows(0);
    const intervalId = window.setInterval(() => {
      setVisibleRows((prev) => {
        if (prev >= choices.length) {
          window.clearInterval(intervalId);
          return prev;
        }
        return prev + 1;
      });
    }, 300);
    return () => window.clearInterval(intervalId);
  }, [choices.length, onButtonsReady]);

  const closingColor =
    accuracy >= 80 ? "#4ade80" : accuracy >= 50 ? "#fde047" : "#94a3b8";

  const [showClosingMsg, setShowClosingMsg] = useState(false);

  useEffect(() => {
    if (visibleRows < choices.length) return;
    const timerId = window.setTimeout(() => setShowClosingMsg(true), 500);
    return () => window.clearTimeout(timerId);
  }, [visibleRows, choices.length]);

  return (
    <div
      style={{
        background: "#0f0f1a",
        border: "0.4vmin solid #27272a",
        padding: "2vmin",
        marginBottom: "2vmin",
        maxWidth: "80vmin",
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
        }}
      >
        LO QUE APRENDISTE HOY
      </div>

      <div
        style={{
          display: "flex",
          gap: "1.5vmin",
          marginBottom: "2vmin",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "ACIERTOS", value: `${accuracy}%`, color: accuracy >= 60 ? "#4ade80" : "#f87171", bg: "#1a1a2e", border: "#27272a", delay: "0.1s" },
          { label: "BUENAS", value: String(goodCount), color: "#4ade80", bg: "#0a1a0a", border: "#4ade80", delay: "0.2s" },
          { label: "MALAS", value: String(badCount), color: "#f87171", bg: "#1a0a0a", border: "#f87171", delay: "0.3s" },
          ...(timeoutCount > 0
            ? [{ label: "SIN TIEMPO", value: String(timeoutCount), color: "#fde047", bg: "#1a1a0a", border: "#fde047", delay: "0.4s" }]
            : []),
        ].map((stat) => (
          <div
            key={stat.label}
            className="end-stat-reveal"
            style={{
              flex: 1,
              minWidth: "12vmin",
              background: stat.bg,
              border: `0.3vmin solid ${stat.border}`,
              padding: "1.2vmin",
              textAlign: "center",
              animationDelay: stat.delay,
            }}
          >
            <div
              style={{
                fontSize: "3.5vmin",
                color: stat.color,
                fontFamily: '"Press Start 2P", monospace',
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "0.9vmin",
                color: stat.color,
                marginTop: "0.4vmin",
                fontFamily: '"Press Start 2P", monospace',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {choices.map((choice, i) => {
        if (i >= visibleRows) return null;
        const concept = FINANCIAL_CONCEPTS[choice.id];
        return (
          <div
            key={`${choice.id}-${i}`}
            className="end-row-reveal"
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
                      color: "#fde047",
                      border: "0.2vmin solid #fde047",
                      padding: "0.1vmin 0.5vmin",
                      fontFamily: '"Press Start 2P", monospace',
                    }}
                  >
                    SIN TIEMPO
                  </span>
                )}
                {concept && (
                  <span
                    style={{
                      fontSize: "0.9vmin",
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

      {showClosingMsg && (
        <div
          style={{
            textAlign: "center",
            padding: "1.5vmin",
            background: "#1a1a2e",
            borderTop: "0.3vmin solid #27272a",
            marginTop: "1vmin",
            minHeight: "4vmin",
          }}
        >
          <TypeWriter
            text={getClosingMessage(accuracy, mode)}
            delay={40}
            color={closingColor}
            fontSize="1.1vmin"
            onComplete={onButtonsReady}
          />
        </div>
      )}
    </div>
  );
}

function EndButtons({
  visible,
  onRestart,
  onViewLeaderboard,
}: {
  visible: boolean;
  onRestart: () => void;
  onViewLeaderboard: () => void;
}) {
  if (!visible) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2vmin",
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "2vmin",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button type="button" className="px-btn end-btn-reveal-1" onClick={onRestart}>
          ↺ JUGAR DE NUEVO
        </button>
        <button
          type="button"
          className="px-btn end-btn-reveal-2"
          style={{ background: "#a78bfa" }}
          onClick={onViewLeaderboard}
        >
          VER RANKING
        </button>
      </div>
      <div className="end-score-badge">
        <span style={{ fontSize: "2vmin", color: "#4ade80" }}>✓</span>
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
    </div>
  );
}

function ResultCard({
  title,
  name,
  balance,
  unit,
  level,
  mode,
  isWinner,
  isLoser,
  slideClass,
  happiness,
}: {
  title: string;
  name: string;
  balance: number;
  unit: string;
  level: 1 | 2 | 3;
  mode: GameMode;
  isWinner: boolean;
  isLoser: boolean;
  slideClass: string;
  happiness: number;
}) {
  const michiInfo = getMichiInfo(mode, level);
  const hearts = Math.floor(happiness / 20);

  return (
    <div
      className={slideClass || undefined}
      style={{
        minWidth: "22vmin",
        background: isLoser ? "#1a0a0a" : isWinner ? "#0a1a0a" : "#1a1a2e",
        border: isWinner
          ? "0.5vmin solid #fde047"
          : isLoser
            ? "0.4vmin solid #27272a"
            : "0.4vmin solid #27272a",
        boxShadow: isWinner ? "0.5vmin 0.5vmin 0 #fde047" : "0.4vmin 0.4vmin 0 #000",
        padding: "2vmin",
        textAlign: "center",
        opacity: isLoser ? 0.85 : 1,
        position: "relative",
      }}
    >
      {isWinner && (
        <div
          style={{
            position: "absolute",
            top: "-0.5vmin",
            right: "1vmin",
            background: "#fde047",
            color: "#000",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "0.9vmin",
            padding: "0.4vmin 0.8vmin",
            border: "0.2vmin solid #000",
          }}
        >
          GANADOR
        </div>
      )}
      <p
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "1.4vmin",
          color: title === "TÚ" ? "#a78bfa" : "#60a5fa",
          margin: "0 0 1vmin",
        }}
      >
        {title}
      </p>
      <MiniMichi level={level} mode={mode} reaction={isWinner ? "celebrate" : "run"} />
      <p
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "1vmin",
          color: "#94a3b8",
          margin: "0.5vmin 0",
        }}
      >
        {name}
      </p>
      <p
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "3vmin",
          color: isWinner ? "#fde047" : isLoser ? "#f87171" : "#f1f5f9",
          margin: "0.5vmin 0",
        }}
      >
        {unit}
        {balance}
      </p>
      <p
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "1vmin",
          color: "#94a3b8",
          margin: "0 0 1vmin",
        }}
      >
        {michiInfo.label}
      </p>
      <div style={{ fontSize: "1vmin", marginBottom: "0.5vmin" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ color: i < hearts ? "#f87171" : "#333" }}>
            {i < hearts ? "♥" : "♡"}
          </span>
        ))}
      </div>
      <div
        style={{
          height: "1vmin",
          background: "#1a1a2e",
          border: "0.2vmin solid #000",
          maxWidth: "20vmin",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${happiness}%`,
            background: happiness >= 50 ? "#4ade80" : "#f87171",
          }}
        />
      </div>
    </div>
  );
}

function EndHeader({
  variant,
  mode,
  michiLevel,
}: {
  variant: "win" | "lose" | "tie" | "single-win" | "single-practice";
  mode: GameMode;
  michiLevel: 1 | 2 | 3;
}) {
  if (variant === "win" || variant === "single-win") {
    return (
      <header
        style={{
          width: "100%",
          maxWidth: "90vmin",
          background: "#0a1a0a",
          borderBottom: "0.5vmin solid #fde047",
          padding: "3vmin",
          textAlign: "center",
          marginBottom: "3vmin",
          zIndex: 2,
        }}
      >
        <PixelTrophy />
        <h1
          className="number-impact"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "4vmin",
            color: "#fde047",
            textShadow: NUMBER_SHADOW,
            margin: "0 0 1vmin",
          }}
        >
          ¡GANASTE!
        </h1>
        <p
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1.6vmin",
            color: "#4ade80",
            margin: 0,
          }}
        >
          {mode === "primaria"
            ? "¡Tu alcancía está llena!"
            : "¡Decisiones financieras perfectas!"}
        </p>
      </header>
    );
  }

  if (variant === "lose") {
    return (
      <header
        style={{
          width: "100%",
          maxWidth: "90vmin",
          background: "#1a0a0a",
          borderBottom: "0.5vmin solid #f87171",
          padding: "3vmin",
          textAlign: "center",
          marginBottom: "3vmin",
          zIndex: 2,
        }}
      >
        <div className="michi-sad-sprite" style={{ display: "flex", justifyContent: "center" }}>
          <MiniMichi level={1} mode={mode} reaction="sad" />
        </div>
        <h1
          className="end-game-over-blink"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "3.5vmin",
            color: "#f87171",
            textShadow: NUMBER_SHADOW,
            margin: "1vmin 0",
          }}
        >
          GAME OVER
        </h1>
        <p
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1.4vmin",
            color: "#94a3b8",
            margin: 0,
          }}
        >
          ¡La próxima lo harás mejor!
        </p>
      </header>
    );
  }

  if (variant === "tie") {
    return (
      <header
        style={{
          width: "100%",
          maxWidth: "90vmin",
          background: "#1a1a0a",
          borderBottom: "0.5vmin solid #fde047",
          padding: "3vmin",
          textAlign: "center",
          marginBottom: "3vmin",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2vmin",
            alignItems: "flex-end",
          }}
        >
          <div className="handshake-michi">
            <MiniMichi level={michiLevel} mode={mode} reaction="run" />
          </div>
          <div className="handshake-michi" style={{ transform: "scaleX(-1)" }}>
            <MiniMichi level={michiLevel} mode={mode} reaction="run" />
          </div>
        </div>
        <h1
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "3vmin",
            color: "#fde047",
            textShadow: NUMBER_SHADOW,
            margin: "1vmin 0 0",
          }}
        >
          EMPATE
        </h1>
      </header>
    );
  }

  return (
    <header
      style={{
        width: "100%",
        maxWidth: "90vmin",
        background: "#1a0a0a",
        borderBottom: "0.5vmin solid #f87171",
        padding: "3vmin",
        textAlign: "center",
        marginBottom: "3vmin",
        zIndex: 2,
      }}
    >
      <MiniMichi level={michiLevel} mode={mode} reaction="sad" />
      <h1
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "3vmin",
          color: michiLevel >= 2 ? "#4ade80" : "#f87171",
          textShadow: NUMBER_SHADOW,
          margin: "1vmin 0",
        }}
      >
        {michiLevel >= 2 ? "¡BIEN HECHO!" : "¡SIGUE PRACTICANDO!"}
      </h1>
    </header>
  );
}

export function EndScreen({
  state,
  rival,
  gameType,
  onRestart,
  onViewLeaderboard,
}: EndScreenProps) {
  const mode = state.mode;
  const [buttonsVisible, setButtonsVisible] = useState(false);

  if (!mode) return null;

  const unit = MODE_CONFIG[mode].balanceUnit;
  const isMulti = gameType === "multi";
  const myBalance = state.balance;
  const rivalBalance = rival?.balance ?? 0;
  const won = isMulti && myBalance > rivalBalance;
  const lost = isMulti && myBalance < rivalBalance;
  const singleWin = !isMulti && state.michiLevel === 3;
  const isWinner = isMulti ? won : singleWin;
  const showConfetti = isWinner;
  const showScanlines = isMulti && lost;

  let headerVariant: "win" | "lose" | "tie" | "single-win" | "single-practice";
  if (isMulti) {
    if (won) headerVariant = "win";
    else if (lost) headerVariant = "lose";
    else headerVariant = "tie";
  } else {
    headerVariant = singleWin ? "single-win" : "single-practice";
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#0f0f1a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "3vmin",
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <PixelConfetti isActive={showConfetti} />

      {showScanlines && <div className="end-scanlines" />}

      <EndHeader variant={headerVariant} mode={mode} michiLevel={state.michiLevel} />

      {isMulti && rival ? (
        <div
          style={{
            display: "flex",
            gap: "2vmin",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "3vmin",
            zIndex: 2,
            width: "100%",
            maxWidth: "80vmin",
          }}
        >
          <ResultCard
            title="TÚ"
            name={state.playerName || "TÚ"}
            balance={myBalance}
            unit={unit}
            level={state.michiLevel}
            mode={mode}
            isWinner={won}
            isLoser={lost}
            slideClass="end-slide-left"
            happiness={state.happiness}
          />
          <ResultCard
            title="RIVAL"
            name={rival.player_name ?? "---"}
            balance={rivalBalance}
            unit={unit}
            level={2}
            mode={mode}
            isWinner={lost}
            isLoser={won}
            slideClass="end-slide-right"
            happiness={50}
          />
        </div>
      ) : (
        <div
          className="end-slide-left"
          style={{
            zIndex: 2,
            marginBottom: "3vmin",
            width: "100%",
            maxWidth: "40vmin",
          }}
        >
          <ResultCard
            title="TÚ"
            name={state.playerName || "JUGADOR"}
            balance={myBalance}
            unit={unit}
            level={state.michiLevel}
            mode={mode}
            isWinner={singleWin}
            isLoser={!singleWin && state.michiLevel === 1}
            slideClass=""
            happiness={state.happiness}
          />
        </div>
      )}

      <div
        className="px-card"
        style={{
          maxWidth: "50vmin",
          textAlign: "center",
          marginBottom: "3vmin",
          zIndex: 2,
        }}
      >
        <p
          style={{
            color: "#f1f5f9",
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1vmin",
            margin: 0,
            lineHeight: 1.8,
          }}
        >
          {END_MESSAGES[mode][state.michiLevel]}
        </p>
      </div>

      <EducationalSummary
        choices={state.choicesMade}
        mode={mode}
        balanceUnit={unit}
        onButtonsReady={() => setButtonsVisible(true)}
      />

      <EndButtons
        visible={buttonsVisible}
        onRestart={onRestart}
        onViewLeaderboard={onViewLeaderboard}
      />
    </div>
  );
}
