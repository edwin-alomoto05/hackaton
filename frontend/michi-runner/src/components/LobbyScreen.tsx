import { useEffect, useRef, useState } from "react";
import type { GameMode, JoinRoomError } from "../types/game";
import { MichiSprite } from "./MichiSprite";
import { MenuPageLayout, StepIndicator } from "./menu/MenuChrome";

const WAITING_SECONDS = 30;

interface LobbyScreenProps {
  mode: GameMode;
  roomCode: string;
  isWaiting: boolean;
  rivalJoined?: boolean;
  lobbyError: JoinRoomError | null;
  onClearError: () => void;
  onCreateRoom: () => void;
  onJoinRoom: (code: string, playerName: string) => Promise<void>;
}

const ERROR_MESSAGES: Record<
  JoinRoomError,
  { emoji: string; title: string; detail: string; color: string; animClass: string }
> = {
  room_not_found: {
    emoji: "🔍",
    title: "SALA NO ENCONTRADA",
    detail: "Verifica el código con tu amigo",
    color: "#f87171",
    animClass: "error-emoji-bounce",
  },
  room_full: {
    emoji: "🚫",
    title: "SALA LLENA",
    detail: "Esta sala ya tiene 2 jugadores",
    color: "#fb923c",
    animClass: "",
  },
  room_finished: {
    emoji: "🏁",
    title: "PARTIDA TERMINADA",
    detail: "Esta sala ya cerró",
    color: "#94a3b8",
    animClass: "",
  },
  room_playing: {
    emoji: "⚔️",
    title: "PARTIDA EN CURSO",
    detail: "Esta sala ya comenzó a jugar",
    color: "#fde047",
    animClass: "countdown-vs-pulse",
  },
  unknown_error: {
    emoji: "⚠️",
    title: "ERROR INESPERADO",
    detail: "Intenta de nuevo en un momento",
    color: "#f87171",
    animClass: "end-game-over-blink",
  },
};

function PixelCrown() {
  return (
    <div
      style={{
        position: "relative",
        width: "4vmin",
        height: "3vmin",
        margin: "0 auto 1.5vmin",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "3vmin",
          height: "1vmin",
          background: "#fde047",
          border: "0.2vmin solid #000",
        }}
      />
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: "1vmin",
            left: `${0.5 + i * 1.2}vmin`,
            width: "0.5vmin",
            height: "1vmin",
            background: "#fde047",
            border: "0.2vmin solid #000",
          }}
        />
      ))}
    </div>
  );
}

function CodeDigit({
  char,
  revealed,
}: {
  char: string;
  revealed: boolean;
}) {
  return (
    <div
      className={revealed ? "digit-reveal-slot" : undefined}
      style={{
        width: "4vmin",
        height: "5vmin",
        background: "#0f0f1a",
        border: `0.4vmin solid ${revealed ? "#fde047" : "#27272a"}`,
        boxShadow: revealed ? "0.4vmin 0.4vmin 0 #fde047" : "0.4vmin 0.4vmin 0 #000",
        fontFamily: '"Press Start 2P", monospace',
        fontSize: "3vmin",
        color: revealed ? "#fde047" : "#444",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {char}
    </div>
  );
}

function WaitingScene({
  mode,
  roomCode,
  rivalJoined,
  waitProgress,
}: {
  mode: GameMode;
  roomCode: string;
  rivalJoined: boolean;
  waitProgress: number;
}) {
  const barColor =
    waitProgress > 66 ? "#4ade80" : waitProgress > 33 ? "#fde047" : "#f87171";

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <div
        style={{
          position: "relative",
          height: "22vmin",
          marginBottom: "2vmin",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "absolute", left: "15%", bottom: 0, textAlign: "center" }}>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "0.9vmin",
              color: "#fff",
              background: "#a78bfa",
              border: "0.2vmin solid #000",
              padding: "0.4vmin 0.8vmin",
              marginBottom: "0.5vmin",
            }}
          >
            YO
          </div>
          <div style={{ transform: "scale(0.55)", transformOrigin: "bottom center" }}>
            <MichiSprite
              emoji=""
              isRunning={false}
              level={1}
              reaction="curious"
              mode={mode}
              isTransforming={false}
              showLevelUp={false}
              showLevelDown={false}
              previousLevel={1}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: "4vmin",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "0.8vmin",
            alignItems: "flex-end",
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={rivalJoined ? undefined : "lobby-dot-bounce"}
              style={{
                width: "1.2vmin",
                height: "1.2vmin",
                background: rivalJoined ? "#4ade80" : undefined,
                border: "0.2vmin solid #000",
                animationDelay: rivalJoined ? undefined : `${i * 0.26}s`,
              }}
            />
          ))}
        </div>

        <div style={{ position: "absolute", right: "15%", bottom: 0, textAlign: "center" }}>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "0.9vmin",
              color: "#94a3b8",
              background: "#27272a",
              border: "0.2vmin solid #000",
              padding: "0.4vmin 0.8vmin",
              marginBottom: "0.5vmin",
            }}
          >
            ???
          </div>
          <div
            className={rivalJoined ? "ghost-reveal-michi" : "ghost-pulse-michi"}
            style={{ transform: "scaleX(-1) scale(0.55)", transformOrigin: "bottom center" }}
          >
            <MichiSprite
              emoji=""
              isRunning={false}
              level={2}
              reaction="curious"
              mode={mode}
              isTransforming={false}
              showLevelUp={false}
              showLevelDown={false}
              previousLevel={2}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "2vmin",
          color: "#fde047",
          letterSpacing: "0.5vmin",
          marginBottom: "1vmin",
        }}
      >
        {roomCode}
      </div>

      <p
        className={rivalJoined ? undefined : "blink"}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "1.2vmin",
          color: "#94a3b8",
          margin: "0 0 2vmin",
        }}
      >
        {rivalJoined ? "¡Rival conectado!" : "Esperando rival..."}
      </p>

      <div style={{ width: "60%", margin: "0 auto" }}>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "0.9vmin",
            color: "#94a3b8",
            marginBottom: "0.5vmin",
          }}
        >
          {WAITING_SECONDS}s para que llegue tu rival
        </div>
        <div
          style={{
            height: "1.2vmin",
            background: "#1a1a2e",
            border: "0.3vmin solid #000",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${waitProgress}%`,
              background: barColor,
              transition: "width 1s steps(10), background 0.05s steps(1)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function LobbyScreen({
  mode,
  roomCode,
  isWaiting,
  rivalJoined = false,
  lobbyError,
  onClearError,
  onCreateRoom,
  onJoinRoom,
}: LobbyScreenProps) {
  const [playerName, setPlayerName] = useState("JUGADOR 2");
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [displayDigits, setDisplayDigits] = useState(["?", "?", "?", "?"]);
  const [revealedDigits, setRevealedDigits] = useState(0);
  const [copied, setCopied] = useState(false);
  const [waitProgress, setWaitProgress] = useState(100);
  const joinInputRef = useRef<HTMLInputElement>(null);

  const errorBorderColor = lobbyError ? ERROR_MESSAGES[lobbyError].color : undefined;
  const allDigitsRevealed = roomCode.length === 4 && revealedDigits >= 4;

  useEffect(() => {
    if (!roomCode || roomCode.length !== 4) {
      setDisplayDigits(["?", "?", "?", "?"]);
      setRevealedDigits(0);
      return;
    }

    setDisplayDigits(["?", "?", "?", "?"]);
    setRevealedDigits(0);
    const timers: number[] = [];

    for (let i = 0; i < 4; i++) {
      const timerId = window.setTimeout(() => {
        setDisplayDigits((prev) => {
          const next = [...prev];
          next[i] = roomCode[i] ?? "?";
          return next;
        });
        setRevealedDigits(i + 1);
      }, i * 300);
      timers.push(timerId);
    }

    return () => timers.forEach(window.clearTimeout);
  }, [roomCode]);

  useEffect(() => {
    if (!isWaiting) {
      setWaitProgress(100);
      return;
    }

    setWaitProgress(100);
    const start = Date.now();
    const intervalId = window.setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const remaining = Math.max(0, WAITING_SECONDS - elapsed);
      setWaitProgress((remaining / WAITING_SECONDS) * 100);
      if (remaining <= 0) window.clearInterval(intervalId);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isWaiting]);

  const handleCopyCode = async () => {
    if (!roomCode) return;
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleCodeChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    setJoinCode(digits);
    setLocalError(null);
    onClearError();
  };

  const handleJoinClick = async () => {
    if (!playerName.trim()) {
      setLocalError("Escribe tu nombre");
      return;
    }
    if (joinCode.length !== 4) {
      setLocalError("Código de 4 dígitos");
      return;
    }

    setLocalError(null);
    setIsJoining(true);
    try {
      await onJoinRoom(joinCode, playerName);
    } finally {
      setIsJoining(false);
    }
  };

  const joinDigits = joinCode.padEnd(4, " ").split("").slice(0, 4);

  return (
    <MenuPageLayout step={3}>
      <div
        style={{
          display: "flex",
          gap: "3vmin",
          flexWrap: "wrap",
          justifyContent: "center",
          zIndex: 2,
          maxWidth: "95vmin",
          width: "100%",
          padding: "2vmin 3vmin",
          flex: 1,
          alignItems: "flex-start",
        }}
      >
        <div
          className="px-card"
          style={{
            flex: "1 1 38vmin",
            minHeight: "45vmin",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: "#fde047",
              fontSize: "1.2vmin",
              margin: "0 0 2vmin",
              alignSelf: "flex-start",
            }}
          >
            CREAR SALA
          </h3>

          {!roomCode ? (
            <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <PixelCrown />
              <button type="button" className="px-btn lobby-create-btn" onClick={onCreateRoom}>
                CREAR SALA
              </button>
              <p
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1vmin",
                  color: "#94a3b8",
                  marginTop: "1.5vmin",
                }}
              >
                Serás el anfitrión
              </p>
            </div>
          ) : isWaiting ? (
            <WaitingScene
              mode={mode}
              roomCode={roomCode}
              rivalJoined={rivalJoined}
              waitProgress={waitProgress}
            />
          ) : (
            <div style={{ textAlign: "center", width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  gap: "1vmin",
                  justifyContent: "center",
                  marginBottom: "2vmin",
                }}
              >
                {displayDigits.map((digit, i) => (
                  <CodeDigit key={i} char={digit} revealed={i < revealedDigits} />
                ))}
              </div>

              <p
                className={allDigitsRevealed ? "blink" : undefined}
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1vmin",
                  color: "#94a3b8",
                  marginBottom: "1.5vmin",
                }}
              >
                COMPARTE ESTE CÓDIGO
              </p>

              <button
                type="button"
                className="px-btn"
                style={{ fontSize: "1vmin", padding: "0.8vmin 1.5vmin" }}
                onClick={() => void handleCopyCode()}
              >
                {copied ? "✓ COPIADO" : "COPIAR"}
              </button>
            </div>
          )}
        </div>

        <div className="px-card" style={{ flex: "1 1 38vmin" }}>
          <h3
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: "#60a5fa",
              fontSize: "1.2vmin",
              margin: "0 0 2vmin",
            }}
          >
            UNIRSE A SALA
          </h3>

          {lobbyError !== null && (
            <div
              key={lobbyError}
              className="hud-shake-panel"
              style={{
                background: "#1a0a0a",
                border: `0.4vmin solid ${ERROR_MESSAGES[lobbyError].color}`,
                boxShadow: "0.3vmin 0.3vmin 0 #000",
                padding: "1.5vmin 2vmin",
                marginBottom: "2vmin",
                display: "flex",
                alignItems: "center",
                gap: "1.5vmin",
              }}
            >
              <span
                className={ERROR_MESSAGES[lobbyError].animClass}
                style={{ fontSize: "6vmin", flexShrink: 0 }}
              >
                {ERROR_MESSAGES[lobbyError].emoji}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "1.4vmin",
                    color: ERROR_MESSAGES[lobbyError].color,
                    marginBottom: "0.5vmin",
                  }}
                >
                  {ERROR_MESSAGES[lobbyError].title}
                </div>
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: "1.2vmin",
                    color: "#94a3b8",
                  }}
                >
                  {ERROR_MESSAGES[lobbyError].detail}
                </div>
              </div>
              <button
                type="button"
                onClick={onClearError}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1.4vmin",
                  cursor: "pointer",
                  padding: "0.5vmin",
                }}
              >
                ✕
              </button>
            </div>
          )}

          {localError && (
            <p
              style={{
                color: "#f87171",
                fontSize: "1vmin",
                margin: "0 0 1.5vmin",
                fontFamily: '"Press Start 2P", monospace',
              }}
            >
              {localError}
            </p>
          )}

          <label
            style={{
              color: "#f1f5f9",
              fontSize: "1vmin",
              display: "block",
              marginBottom: "1vmin",
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            TU NOMBRE:
          </label>
          <div style={{ position: "relative", marginBottom: "2vmin" }}>
            <input
              className="px-input"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setLocalError(null);
              }}
              placeholder=""
              style={{ width: "100%" }}
            />
            {!playerName && (
              <div
                style={{
                  position: "absolute",
                  left: "1.5vmin",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1vmin",
                  color: "#444",
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                ESCRIBE TU NOMBRE
                <span className="blink" style={{ marginLeft: "0.2vmin" }}>
                  _
                </span>
              </div>
            )}
          </div>

          <label
            style={{
              color: "#f1f5f9",
              fontSize: "1vmin",
              display: "block",
              marginBottom: "1vmin",
              fontFamily: '"Press Start 2P", monospace',
            }}
          >
            CÓDIGO:
          </label>
          <div
            style={{ position: "relative", marginBottom: "2vmin" }}
            onClick={() => joinInputRef.current?.focus()}
          >
            <input
              ref={joinInputRef}
              value={joinCode}
              onChange={(e) => handleCodeChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key.length === 1 && !/\d/.test(e.key)) e.preventDefault();
              }}
              maxLength={4}
              inputMode="numeric"
              autoComplete="off"
              style={{
                position: "absolute",
                opacity: 0,
                width: "1px",
                height: "1px",
                pointerEvents: "none",
              }}
              aria-label="Código de sala de 4 dígitos"
            />
            <div
              style={{
                display: "flex",
                gap: "1vmin",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {joinDigits.map((digit, i) => {
                const filled = digit.trim() !== "";
                return (
                  <div
                    key={i}
                    className={filled ? "digit-reveal-slot" : undefined}
                    style={{
                      width: "3vmin",
                      height: "4vmin",
                      background: "#0f0f1a",
                      border: `0.4vmin solid ${filled ? "#fde047" : errorBorderColor ?? "#27272a"}`,
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: "2.5vmin",
                      color: "#fde047",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {filled ? digit : ""}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="px-btn px-btn-blue"
            onClick={() => void handleJoinClick()}
            disabled={isJoining}
            style={{ opacity: isJoining ? 0.7 : 1, width: "100%" }}
          >
            {isJoining ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "1vmin" }}>
                <span
                  className="spinner"
                  style={{ width: "2vmin", height: "2vmin", borderWidth: "0.25vmin" }}
                />
                BUSCANDO...
              </span>
            ) : (
              "UNIRSE"
            )}
          </button>
        </div>
      </div>

      <p
        style={{
          fontFamily: '"Press Start 2P", monospace',
          color: "#94a3b8",
          fontSize: "0.9vmin",
          zIndex: 2,
          marginTop: "1vmin",
        }}
      >
        Modo: {mode.toUpperCase()}
      </p>

      <div style={{ marginTop: "2vmin" }}>
        <StepIndicator activeStep={2} />
      </div>
    </MenuPageLayout>
  );
}
