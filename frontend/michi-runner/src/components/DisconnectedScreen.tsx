import { StarField } from "./StarField";

interface DisconnectedScreenProps {
  reason: "rival_left" | "waiting_timeout";
  onRetry: () => void;
  onExit: () => void;
  rivalName?: string;
}

export function DisconnectedScreen({
  reason,
  onRetry,
  onExit,
  rivalName,
}: DisconnectedScreenProps) {
  const isRivalLeft = reason === "rival_left";

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        background: "#0f0f1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        overflow: "hidden",
      }}
    >
      <StarField />
      <div className="px-card" style={{ zIndex: 1, maxWidth: 420, textAlign: "center" }}>
        <div style={{ fontSize: "10vmin", marginBottom: "2vmin" }}>
          {isRivalLeft ? "📡" : "⏳"}
        </div>

        <div
          style={{
            height: 2,
            background: "#fde047",
            width: "60%",
            margin: "0 auto 2vmin",
          }}
        />

        <h2
          style={{
            color: isRivalLeft ? "#f87171" : "#fde047",
            fontSize: "2.5vmin",
            fontFamily: '"Press Start 2P", monospace',
            margin: "0 0 1.5vmin",
            lineHeight: 1.6,
          }}
        >
          {isRivalLeft ? "RIVAL DESCONECTADO" : "NADIE LLEGÓ"}
        </h2>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "1.6vmin",
            fontFamily: '"Press Start 2P", monospace',
            margin: "0 0 1.5vmin",
            lineHeight: 1.8,
          }}
        >
          {isRivalLeft
            ? `${rivalName ?? "El rival"} abandonó la partida`
            : "Esperaste 30 segundos sin rival"}
        </p>

        <p
          style={{
            color: "#4ade80",
            fontSize: "1.4vmin",
            fontFamily: '"Press Start 2P", monospace',
            margin: "0 0 3vmin",
            lineHeight: 1.8,
          }}
        >
          {isRivalLeft ? "Tu progreso fue guardado" : "Puedes jugar solo o crear otra sala"}
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button type="button" className="px-btn" onClick={onRetry}>
            {isRivalLeft ? "↺ REVANCHA" : "▶ JUGAR SOLO"}
          </button>
          <button type="button" className="px-btn px-btn-red" onClick={onExit}>
            ⌂ INICIO
          </button>
        </div>
      </div>
    </div>
  );
}
