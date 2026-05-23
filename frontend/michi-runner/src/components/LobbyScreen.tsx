import { useState } from "react";
import type { GameMode, JoinRoomError } from "../types/game";
import { StarField } from "./StarField";

interface LobbyScreenProps {
  mode: GameMode;
  roomCode: string;
  isWaiting: boolean;
  lobbyError: JoinRoomError | null;
  onClearError: () => void;
  onCreateRoom: () => void;
  onJoinRoom: (code: string, playerName: string) => Promise<void>;
}

const ERROR_MESSAGES: Record<
  JoinRoomError,
  { emoji: string; title: string; detail: string; color: string }
> = {
  room_not_found: {
    emoji: "🔍",
    title: "SALA NO ENCONTRADA",
    detail: "Verifica el código con tu amigo",
    color: "#f87171",
  },
  room_full: {
    emoji: "🚫",
    title: "SALA LLENA",
    detail: "Esta sala ya tiene 2 jugadores",
    color: "#fb923c",
  },
  room_finished: {
    emoji: "🏁",
    title: "PARTIDA TERMINADA",
    detail: "Esta sala ya cerró",
    color: "#94a3b8",
  },
  room_playing: {
    emoji: "⚔️",
    title: "PARTIDA EN CURSO",
    detail: "Esta sala ya comenzó a jugar",
    color: "#fde047",
  },
  unknown_error: {
    emoji: "⚠️",
    title: "ERROR INESPERADO",
    detail: "Intenta de nuevo en un momento",
    color: "#f87171",
  },
};

export function LobbyScreen({
  mode,
  roomCode,
  isWaiting,
  lobbyError,
  onClearError,
  onCreateRoom,
  onJoinRoom,
}: LobbyScreenProps) {
  const [playerName, setPlayerName] = useState("JUGADOR 2");
  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const errorBorderColor = lobbyError ? ERROR_MESSAGES[lobbyError].color : undefined;

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

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#0f0f1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        overflow: "hidden",
      }}
    >
      <StarField />
      <div
        style={{
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          justifyContent: "center",
          zIndex: 1,
          maxWidth: 720,
        }}
      >
        <div className="px-card" style={{ flex: "1 1 280px" }}>
          <h3 style={{ color: "#fde047", fontSize: 10, margin: "0 0 16px" }}>CREAR SALA</h3>
          {!roomCode ? (
            <button type="button" className="px-btn" onClick={onCreateRoom}>
              CREAR SALA
            </button>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div className="px-code">{roomCode}</div>
              <p style={{ color: "#94a3b8", fontSize: 8, marginTop: 16 }}>
                Comparte este código
              </p>
              {isWaiting && (
                <div
                  style={{
                    marginTop: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div className="spinner" />
                  <p className="blink" style={{ color: "#f1f5f9", fontSize: 8, margin: 0 }}>
                    Esperando rival... 🐱
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-card" style={{ flex: "1 1 280px" }}>
          <h3 style={{ color: "#60a5fa", fontSize: 10, margin: "0 0 16px" }}>UNIRSE A SALA</h3>

          {lobbyError !== null && (
            <div
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
              <span style={{ fontSize: "4vmin" }}>{ERROR_MESSAGES[lobbyError].emoji}</span>
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
                fontSize: 8,
                margin: "0 0 12px",
                fontFamily: '"Press Start 2P", monospace',
              }}
            >
              {localError}
            </p>
          )}

          <label style={{ color: "#f1f5f9", fontSize: 8, display: "block", marginBottom: 8 }}>
            TU NOMBRE:
          </label>
          <input
            className="px-input"
            value={playerName}
            onChange={(e) => {
              setPlayerName(e.target.value);
              setLocalError(null);
            }}
            placeholder="JUGADOR 2"
            style={{ marginBottom: 16 }}
          />
          <label style={{ color: "#f1f5f9", fontSize: 8, display: "block", marginBottom: 8 }}>
            CÓDIGO:
          </label>
          <input
            className="px-input"
            value={joinCode}
            onChange={(e) => handleCodeChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key.length === 1 && !/\d/.test(e.key)) {
                e.preventDefault();
              }
            }}
            maxLength={4}
            placeholder="0000"
            style={{
              marginBottom: 16,
              borderColor: errorBorderColor ?? undefined,
            }}
          />
          <button
            type="button"
            className="px-btn px-btn-blue"
            onClick={() => void handleJoinClick()}
            disabled={isJoining}
            style={{ opacity: isJoining ? 0.7 : 1 }}
          >
            {isJoining ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span
                  className="spinner"
                  style={{ width: 16, height: 16, borderWidth: 2 }}
                />
                BUSCANDO...
              </span>
            ) : (
              "UNIRSE"
            )}
          </button>
        </div>
      </div>
      <p style={{ position: "absolute", top: 16, color: "#94a3b8", fontSize: 7, zIndex: 2 }}>
        Modo: {mode.toUpperCase()}
      </p>
    </div>
  );
}
