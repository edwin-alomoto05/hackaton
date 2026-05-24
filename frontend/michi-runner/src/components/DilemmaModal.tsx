import { useEffect, useMemo, useState } from "react";
import { MODE_CONFIG } from "../constants/runner";
import type { Choice, Dilemma, GameMode } from "../types/game";
import { PremiumAmbient } from "./ui/PremiumAmbient";

interface DilemmaModalProps {
  dilemma: Dilemma;
  onChoice: (c: Choice) => void;
  onChoiceIntent?: () => void;
  mode: GameMode;
  isClosing?: boolean;
  dilemmaTimeLeft: number;
  dilemmaTimedOut: boolean;
}

const PARTICLE_POSITIONS = [
  { top: "8%", left: "12%" },
  { top: "15%", left: "88%" },
  { top: "78%", left: "8%" },
  { top: "82%", left: "92%" },
  { top: "45%", left: "3%" },
  { top: "50%", left: "96%" },
];

export function DilemmaModal({
  dilemma,
  onChoice,
  onChoiceIntent,
  mode,
  isClosing = false,
  dilemmaTimeLeft,
  dilemmaTimedOut,
}: DilemmaModalProps) {
  const [selectedSide, setSelectedSide] = useState<"left" | "right" | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isClosingVisual = selectedSide !== null || isClosing;
  const isUrgent = dilemmaTimeLeft <= 5;
  const balanceUnit = MODE_CONFIG[mode].balanceUnit;
  const buttonsLocked = !isReady || selectedSide !== null;

  const timerClass =
    dilemmaTimeLeft <= 3
      ? "premium-dilemma-timer-num--critical"
      : dilemmaTimeLeft <= 6
        ? "premium-dilemma-timer-num--warn"
        : "premium-dilemma-timer-num--safe";

  const timerColor =
    dilemmaTimeLeft <= 3 ? "#f87171" : dilemmaTimeLeft <= 6 ? "#fde047" : "#4ade80";

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleChoice = (choice: Choice, side: "left" | "right") => {
    if (!isReady || selectedSide !== null) return;
    onChoiceIntent?.();
    setSelectedSide(side);
    setTimeout(() => onChoice(choice), 400);
  };

  const particles = useMemo(() => PARTICLE_POSITIONS, []);

  const buttonDim = (side: "left" | "right") =>
    selectedSide !== null && selectedSide !== side
      ? { opacity: 0.25, filter: "grayscale(0.6)" as const }
      : { opacity: isReady ? 1 : 0.6 };

  return (
    <div
      className={`premium-dilemma-overlay${isUrgent ? " premium-dilemma-overlay--urgent" : ""}`}
    >
      <PremiumAmbient variant={isUrgent ? "danger" : "purple"} sparkleCount={8} />

      <div className="premium-dilemma-particles">
        {particles.map((p, i) => (
          <div
            key={i}
            className="premium-dilemma-particle"
            style={{ ...p, animationDelay: `${i * 0.6}s` }}
          />
        ))}
      </div>

      <div
        className={[
          "premium-dilemma-panel",
          isClosingVisual ? "premium-dilemma-panel--exit" : "premium-dilemma-panel--entrance",
        ].join(" ")}
        style={{
          width: "min(92vw, 680px)",
          maxWidth: "680px",
          padding: 0,
        }}
      >
        <div style={{ padding: "clamp(1rem, 2.5vmin, 2rem)" }}>
          <div className="premium-dilemma-badge">⚡ DECISIÓN FINANCIERA</div>

          <div className="premium-dilemma-timer-row">
            <div className={`premium-dilemma-timer-num ${timerClass}`}>{dilemmaTimeLeft}</div>
            <div className="premium-dilemma-timer-bar">
              <div
                className="premium-dilemma-timer-fill"
                style={{
                  width: `${(dilemmaTimeLeft / 10) * 100}%`,
                  background: timerColor,
                  color: timerColor,
                }}
              />
            </div>
            <span style={{ fontSize: "2vmin" }}>⏱</span>
          </div>

          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.6vmin",
              color: "#f1f5f9",
              textAlign: "center",
              lineHeight: 2,
              padding: "0 2vmin",
              marginBottom: "0.5vmin",
            }}
          >
            {dilemma.question}
          </div>

          {/* ── BOTONES DE DECISIÓN ── */}
          <div
            style={{
              display: "flex",
              gap: "2vmin",
              width: "100%",
              marginTop: "2vmin",
            }}
          >
            {/* ── BOTÓN VERDE — Buena decisión ── */}
            <button
              type="button"
              onClick={() => handleChoice(dilemma.left, "left")}
              disabled={buttonsLocked}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1vmin",
                padding: "2.5vmin 1.5vmin",
                background: "#16a34a",
                border: "0.5vmin solid #000",
                boxShadow: "0.6vmin 0.6vmin 0 #000",
                cursor: isReady ? "pointer" : "not-allowed",
                position: "relative",
                overflow: "hidden",
                animation: "btnPulseGreen 2s ease-in-out infinite",
                willChange: "transform, box-shadow",
                transition: "transform 0.05s steps(1)",
                ...buttonDim("left"),
              }}
              onMouseEnter={(e) => {
                if (buttonsLocked) return;
                e.currentTarget.style.transform = "translate(-0.4vmin, -0.4vmin)";
                e.currentTarget.style.boxShadow = "1vmin 1vmin 0 #000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0,0)";
                e.currentTarget.style.boxShadow = "0.6vmin 0.6vmin 0 #000";
              }}
              onMouseDown={(e) => {
                if (buttonsLocked) return;
                e.currentTarget.style.transform = "translate(0.5vmin, 0.5vmin)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "0.5vmin",
                  background: "#4ade80",
                }}
              />
              <div
                style={{
                  fontSize: "6vmin",
                  color: "#fff",
                  fontWeight: "bold",
                  textShadow:
                    "0 0.3vmin 0 #000, 0.3vmin 0 0 #000, -0.3vmin 0 0 #000, 0 -0.3vmin 0 #000",
                  lineHeight: 1,
                }}
              >
                ✓
              </div>
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1.3vmin",
                  color: "#fff",
                  textAlign: "center",
                  textShadow: "0.1vmin 0.1vmin 0 #000",
                  lineHeight: 1.6,
                  maxWidth: "90%",
                }}
              >
                {dilemma.left.label}
              </div>
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1.8vmin",
                  color: "#fde047",
                  textShadow: "0.2vmin 0.2vmin 0 #000",
                  background: "rgba(0,0,0,0.3)",
                  padding: "0.4vmin 1.2vmin",
                  border: "0.2vmin solid rgba(255,255,255,0.2)",
                }}
              >
                {dilemma.left.delta >= 0 ? "+" : ""}
                {balanceUnit}
                {dilemma.left.delta}
              </div>
            </button>

            {/* ── BOTÓN ROJO — Mala decisión ── */}
            <button
              type="button"
              onClick={() => handleChoice(dilemma.right, "right")}
              disabled={buttonsLocked}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1vmin",
                padding: "2.5vmin 1.5vmin",
                background: "#dc2626",
                border: "0.5vmin solid #000",
                boxShadow: "0.6vmin 0.6vmin 0 #000",
                cursor: isReady ? "pointer" : "not-allowed",
                position: "relative",
                overflow: "hidden",
                animation: "btnPulseRed 2s ease-in-out 0.5s infinite",
                willChange: "transform, box-shadow",
                transition: "transform 0.05s steps(1)",
                ...buttonDim("right"),
              }}
              onMouseEnter={(e) => {
                if (buttonsLocked) return;
                e.currentTarget.style.transform = "translate(-0.4vmin, -0.4vmin)";
                e.currentTarget.style.boxShadow = "1vmin 1vmin 0 #000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translate(0,0)";
                e.currentTarget.style.boxShadow = "0.6vmin 0.6vmin 0 #000";
              }}
              onMouseDown={(e) => {
                if (buttonsLocked) return;
                e.currentTarget.style.transform = "translate(0.5vmin, 0.5vmin)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "0.5vmin",
                  background: "#f87171",
                }}
              />
              <div
                style={{
                  fontSize: "6vmin",
                  color: "#fff",
                  fontWeight: "bold",
                  textShadow:
                    "0 0.3vmin 0 #000, 0.3vmin 0 0 #000, -0.3vmin 0 0 #000, 0 -0.3vmin 0 #000",
                  lineHeight: 1,
                }}
              >
                ✗
              </div>
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1.3vmin",
                  color: "#fff",
                  textAlign: "center",
                  textShadow: "0.1vmin 0.1vmin 0 #000",
                  lineHeight: 1.6,
                  maxWidth: "90%",
                }}
              >
                {dilemma.right.label}
              </div>
              <div
                style={{
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: "1.8vmin",
                  color: "#fde047",
                  textShadow: "0.2vmin 0.2vmin 0 #000",
                  background: "rgba(0,0,0,0.3)",
                  padding: "0.4vmin 1.2vmin",
                  border: "0.2vmin solid rgba(255,255,255,0.2)",
                }}
              >
                {dilemma.right.delta >= 0 ? "+" : ""}
                {balanceUnit}
                {dilemma.right.delta}
              </div>
            </button>
          </div>
        </div>

        {dilemmaTimedOut && (
          <div className="premium-dilemma-timeout">
            <div style={{ fontSize: "8vmin" }}>⏰</div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "2.5vmin",
                color: "#fff",
              }}
            >
              ¡TIEMPO!
            </div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1.1vmin",
                color: "#fff",
                opacity: 0.9,
                textAlign: "center",
                maxWidth: "35vmin",
                lineHeight: 1.8,
              }}
            >
              No decidir también tiene consecuencias...
            </div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "0.95vmin",
                color: "#fff",
                opacity: 0.7,
              }}
            >
              Se aplicó la peor opción automáticamente
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
