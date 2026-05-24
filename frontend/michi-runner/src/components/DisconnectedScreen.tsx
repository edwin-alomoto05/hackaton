import MichiSprite from "./MichiSprite";
import { TypeWriter } from "./ui/TypeWriter";

interface DisconnectedScreenProps {
  reason: "rival_left" | "waiting_timeout";
  onRetry: () => void;
  onExit: () => void;
  rivalName?: string;
}

const STATIC_STARS = [
  { top: "10%", left: "12%" },
  { top: "20%", left: "85%" },
  { top: "35%", left: "25%" },
  { top: "50%", left: "70%" },
  { top: "65%", left: "15%" },
  { top: "75%", left: "80%" },
  { top: "85%", left: "40%" },
  { top: "15%", left: "55%" },
];

function StaticStars() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {STATIC_STARS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: "0.4vmin",
            height: "0.4vmin",
            background: "#ffffff",
            opacity: 0.5,
          }}
        />
      ))}
    </div>
  );
}

function AntennaIcon() {
  return (
    <div
      style={{
        position: "relative",
        width: "10vmin",
        height: "8vmin",
        margin: "0 auto",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="signal-wave-arc"
          style={{
            position: "absolute",
            top: `${0.5 + i * 1.2}vmin`,
            left: "50%",
            transform: "translateX(-50%)",
            width: `${4 + i * 2}vmin`,
            height: `${2 + i}vmin`,
            borderTop: "0.3vmin solid #f87171",
            borderLeft: "0.3vmin solid transparent",
            borderRight: "0.3vmin solid transparent",
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
      <div
        className="dish-sway"
        style={{
          position: "absolute",
          top: "3vmin",
          right: "1vmin",
          width: "6vmin",
          height: "1vmin",
          background: "#94a3b8",
          border: "0.3vmin solid #000",
          transformOrigin: "right center",
          willChange: "transform",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "0.5vmin",
          height: "3vmin",
          background: "#94a3b8",
          border: "0.2vmin solid #000",
        }}
      />
    </div>
  );
}

function HourglassIcon() {
  return (
    <div
      style={{
        position: "relative",
        width: "5vmin",
        height: "7vmin",
        margin: "0 auto",
        background: "#1a1a2e",
        border: "0.4vmin solid #fde047",
      }}
    >
      <div
        className="sand-fall-top"
        style={{
          position: "absolute",
          top: "0.8vmin",
          left: "50%",
          transform: "translateX(-50%)",
          width: "4vmin",
          height: "2.5vmin",
          background: "#fde047",
          clipPath: "polygon(10% 0%, 90% 0%, 60% 100%, 40% 100%)",
          willChange: "clip-path",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "0.8vmin",
          left: "50%",
          transform: "translateX(-50%)",
          width: "4vmin",
          height: "2vmin",
          background: "#fde047",
          clipPath: "polygon(40% 0%, 60% 0%, 90% 100%, 10% 100%)",
        }}
      />
    </div>
  );
}

function PixelSeparator() {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.5vmin",
        justifyContent: "center",
        margin: "2vmin 0",
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`disconnect-sep-${i % 2}`}
          style={{
            width: "0.8vmin",
            height: "0.8vmin",
            border: "0.15vmin solid #000",
          }}
        />
      ))}
    </div>
  );
}

export function DisconnectedScreen({
  reason,
  onRetry,
  onExit,
  rivalName,
}: DisconnectedScreenProps) {
  const isRivalLeft = reason === "rival_left";
  const subtitle = isRivalLeft
    ? `${rivalName ?? "Tu rival"} abandonó la partida`
    : "Esperaste 30 segundos sin rival";

  const timeoutTips = [
    { icon: "🐱", text: "Practica solo primero" },
    { icon: "📱", text: "Comparte el código con un amigo" },
    { icon: "🔄", text: "Crea una nueva sala" },
  ];

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
        padding: "3vmin",
        overflow: "hidden",
      }}
    >
      <StaticStars />
      {isRivalLeft && <div className="disconnect-scanlines" />}

      <div
        className="px-card"
        style={{
          zIndex: 2,
          maxWidth: "55vmin",
          width: "100%",
          textAlign: "center",
          padding: "3vmin",
        }}
      >
        <div style={{ marginBottom: "2vmin" }}>
          {isRivalLeft ? <AntennaIcon /> : <HourglassIcon />}
        </div>

        <div
          className="michi-sad-slow"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2vmin",
            height: "12vmin",
            overflow: "hidden",
          }}
        >
          <MichiSprite
          reaction="sad"
          isTransforming={false}
          showLevelUp={false}
          showLevelDown={false}
          level={1}
          size="12vmin"
          embedded
        />
        </div>

        <h2
          className="number-impact"
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

        <TypeWriter
          text={subtitle}
          delay={60}
          startDelay={500}
          color="#94a3b8"
          fontSize="1.4vmin"
        />

        {isRivalLeft ? (
          <>
            <div
              className="disconnect-score-saved"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1vmin",
                padding: "1.2vmin 2vmin",
                background: "#0a1a0a",
                border: "0.3vmin solid #4ade80",
                marginTop: "1.5vmin",
                opacity: 0,
              }}
            >
              <span style={{ fontSize: "2vmin", color: "#4ade80" }}>✓</span>
              <span
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1.1vmin",
                  color: "#4ade80",
                }}
              >
                TU SCORE FUE GUARDADO
              </span>
            </div>
            <p
              className="disconnect-motivation"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1.1vmin",
                color: "#94a3b8",
                marginTop: "1vmin",
                opacity: 0,
              }}
            >
              ¡Tu progreso fue registrado!
            </p>
          </>
        ) : (
          <div style={{ marginTop: "1.5vmin", textAlign: "left" }}>
            <p
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1.1vmin",
                color: "#94a3b8",
                textAlign: "center",
                marginBottom: "1vmin",
              }}
            >
              ¿Qué puedes hacer?
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1vmin" }}>
              {timeoutTips.map((opt, i) => (
                <div
                  key={opt.text}
                  className="end-row-reveal"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.5vmin",
                    padding: "0.8vmin 1.5vmin",
                    background: "#1a1a2e",
                    border: "0.2vmin solid #27272a",
                    animationDelay: `${0.8 + i * 0.2}s`,
                    opacity: 0,
                  }}
                >
                  <span style={{ fontSize: "2vmin" }}>{opt.icon}</span>
                  <span
                    style={{
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: "1vmin",
                      color: "#94a3b8",
                    }}
                  >
                    {opt.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <PixelSeparator />

        <div
          style={{
            display: "flex",
            gap: "2vmin",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            className="px-btn disconnect-btn-primary"
            style={{
              background: isRivalLeft ? "#fde047" : "#4ade80",
              color: "#000",
            }}
            onClick={onRetry}
          >
            {isRivalLeft ? "↺ REVANCHA" : "▶ JUGAR SOLO"}
          </button>
          <button
            type="button"
            className="px-btn px-btn-red disconnect-btn-secondary"
            onClick={onExit}
          >
            ⌂ INICIO
          </button>
        </div>
      </div>
    </div>
  );
}
