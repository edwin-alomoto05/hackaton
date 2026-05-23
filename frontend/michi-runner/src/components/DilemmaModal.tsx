import { useState } from "react";
import type { Choice, Dilemma, GameMode } from "../types/game";

interface DilemmaModalProps {
  dilemma: Dilemma;
  onChoice: (c: Choice) => void;
  onChoiceIntent?: () => void;
  mode: GameMode;
  isClosing?: boolean;
  dilemmaTimeLeft: number;
  dilemmaTimedOut: boolean;
}

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
  const questionSize = mode === "primaria" ? 10 : 8;
  const isClosingVisual = selectedSide !== null || isClosing;
  const isUrgent = dilemmaTimeLeft <= 3;

  const handleChoice = (choice: Choice, side: "left" | "right") => {
    if (selectedSide !== null) return;
    onChoiceIntent?.();
    setSelectedSide(side);
    setTimeout(() => {
      onChoice(choice);
    }, 400);
  };

  const leftHighlight =
    selectedSide === "left"
      ? { borderColor: "#fff", boxShadow: "0 0 20px #4ade80" }
      : undefined;
  const rightHighlight =
    selectedSide === "right"
      ? { borderColor: "#fff", boxShadow: "0 0 20px #f87171" }
      : undefined;

  const buttonAnimation = isUrgent
    ? "btnUrgency 0.4s ease-in-out infinite"
    : "btnFloat 2s ease-in-out infinite";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 6,
      }}
    >
      <div
        className={isClosingVisual ? undefined : "modal-in"}
        style={{
          position: "relative",
          maxWidth: 400,
          width: "90%",
          background: "#1a1a2e",
          border: "4px solid #000",
          boxShadow: "6px 6px 0px #000",
          padding: 20,
          animation: isClosingVisual
            ? "modalOut 0.35s ease-in forwards"
            : "modalIn 0.18s ease-out forwards",
          opacity: isClosingVisual ? undefined : 1,
          transform: isClosingVisual ? undefined : "scale(1)",
        }}
      >
        <p style={{ color: "#fde047", fontSize: 10, margin: "0 0 16px" }}>⚡ DECISIÓN</p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5vmin",
            marginBottom: "2vmin",
          }}
        >
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "3.5vmin",
              color:
                dilemmaTimeLeft <= 3
                  ? "#f87171"
                  : dilemmaTimeLeft <= 6
                    ? "#fde047"
                    : "#4ade80",
              animation: dilemmaTimeLeft <= 3 ? "blink 0.5s step-end infinite" : "none",
              minWidth: "3vmin",
              textAlign: "center",
            }}
          >
            {dilemmaTimeLeft}
          </div>
          <div
            style={{
              flex: 1,
              height: "1.5vmin",
              background: "#1a1a2e",
              border: "0.3vmin solid #000",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(dilemmaTimeLeft / 10) * 100}%`,
                background:
                  dilemmaTimeLeft <= 3
                    ? "#f87171"
                    : dilemmaTimeLeft <= 6
                      ? "#fde047"
                      : "#4ade80",
                transition: "width 0.9s linear, background 0.3s ease",
              }}
            />
          </div>
          <div
            style={{
              fontSize: "2.5vmin",
              animation: dilemmaTimeLeft <= 3 ? "comboShake 0.3s ease-in-out infinite" : "none",
            }}
          >
            ⏱️
          </div>
        </div>

        <p style={{ color: "#f1f5f9", fontSize: questionSize, margin: "0 0 20px", lineHeight: 1.6 }}>
          {dilemma.question}
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            className="px-btn"
            style={{
              background: "#4ade80",
              flex: 1,
              padding: "12px 8px",
              pointerEvents: selectedSide ? "none" : "auto",
              opacity: selectedSide === "right" ? 0.3 : 1,
              animation: buttonAnimation,
              ...leftHighlight,
            }}
            onClick={() => handleChoice(dilemma.left, "left")}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{dilemma.left.emoji}</div>
            <div style={{ fontSize: 8, lineHeight: 1.5 }}>{dilemma.left.label}</div>
            <div style={{ fontSize: 7, color: "#065f46", marginTop: 8 }}>
              {dilemma.left.delta >= 0 ? "+" : ""}
              {dilemma.left.delta}
            </div>
          </button>
          <button
            type="button"
            className="px-btn px-btn-red"
            style={{
              flex: 1,
              padding: "12px 8px",
              pointerEvents: selectedSide ? "none" : "auto",
              opacity: selectedSide === "left" ? 0.3 : 1,
              animation: buttonAnimation,
              ...rightHighlight,
            }}
            onClick={() => handleChoice(dilemma.right, "right")}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{dilemma.right.emoji}</div>
            <div style={{ fontSize: 8, lineHeight: 1.5 }}>{dilemma.right.label}</div>
            <div style={{ fontSize: 7, color: "#7f1d1d", marginTop: 8 }}>
              {dilemma.right.delta >= 0 ? "+" : ""}
              {dilemma.right.delta}
            </div>
          </button>
        </div>

        {dilemmaTimedOut && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(248, 113, 113, 0.92)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2vmin",
              zIndex: 2,
              animation: "modalIn 0.2s ease-out forwards",
            }}
          >
            <div style={{ fontSize: "8vmin" }}>⏰</div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "2.5vmin",
                color: "#fff",
                textAlign: "center",
              }}
            >
              ¡TIEMPO!
            </div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1.3vmin",
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
                fontSize: "1.1vmin",
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
