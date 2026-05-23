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
  const questionSize = mode === "primaria" ? "1.2vmin" : "1vmin";
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

  const criticalTime = dilemmaTimeLeft <= 3;
  const urgentTime = dilemmaTimeLeft <= 5;

  const buttonAnimation = isUrgent
    ? "btnUrgency 0.4s ease-in-out infinite"
    : "btnFloat 2s ease-in-out infinite";

  function ChoiceButton({
    side,
    color,
    label,
    delta,
    iconColor,
  }: {
    side: "left" | "right";
    color: string;
    label: string;
    delta: number;
    iconColor: string;
  }) {
    const isSelected = selectedSide === side;
    const isOther = selectedSide !== null && selectedSide !== side;

    return (
      <div style={{ position: "relative", flex: 1 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
            transform: "translate(0.5vmin, 0.5vmin)",
          }}
        />
        <button
          type="button"
          className="px-btn"
          style={{
            position: "relative",
            width: "100%",
            background: color,
            padding: "1.5vmin 1vmin",
            pointerEvents: selectedSide ? "none" : "auto",
            opacity: isOther ? 0.2 : 1,
            filter: isOther ? "grayscale(1)" : undefined,
            transition: "all 0.1s steps(2)",
            animation: buttonAnimation,
            border: isSelected ? "0.6vmin solid #fff" : "0.5vmin solid #000",
            boxShadow: isSelected ? undefined : "0.5vmin 0.5vmin 0 #000",
            ...(isSelected ? { animation: "selectedPulse 0.3s steps(2) 3" } : {}),
          }}
          onClick={() => handleChoice(side === "left" ? dilemma.left : dilemma.right, side)}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "0.25vmin",
              background: "rgba(255,255,255,0.3)",
            }}
          />
          <div
            style={{
              width: "3.5vmin",
              height: "3.5vmin",
              margin: "0 auto 1vmin",
              background: iconColor,
              border: "0.3vmin solid #000",
            }}
          />
          <div style={{ fontSize: "1vmin", lineHeight: 1.5 }}>{label}</div>
          <div style={{ fontSize: "0.875vmin", color: "#000", marginTop: "1vmin", opacity: 0.8 }}>
            {delta >= 0 ? "+" : ""}
            {delta}
          </div>
        </button>
        {isSelected && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "4vmin",
              color: "#fff",
              pointerEvents: "none",
              animation: "checkAppear 0.2s steps(4) forwards",
              zIndex: 3,
            }}
          >
            ✓
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: criticalTime
          ? "rgba(248, 113, 113, 0.25)"
          : "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 6,
        animation: urgentTime ? "hudShake 0.2s steps(3) infinite" : undefined,
      }}
    >
      <div
        className={isClosingVisual ? undefined : "modal-entrance"}
        style={{
          position: "relative",
          maxWidth: "50vmin",
          width: "90%",
          background: "#1a1a2e",
          border: criticalTime ? "0.6vmin solid #f87171" : "0.5vmin solid #000",
          boxShadow: "0.75vmin 0.75vmin 0 #000",
          padding: "2.5vmin",
          animation: isClosingVisual ? "modalOut 0.35s ease-in forwards" : undefined,
          willChange: "transform",
        }}
      >
        <p style={{ color: "#fde047", fontSize: "1.2vmin", margin: "0 0 2vmin" }}>⚡ DECISIÓN</p>

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

        <p
          style={{
            color: "#f1f5f9",
            fontSize: questionSize,
            margin: "0 0 2.5vmin",
            lineHeight: 1.6,
          }}
        >
          {dilemma.question}
        </p>
        <div style={{ display: "flex", gap: "1.5vmin" }}>
          <ChoiceButton
            side="left"
            color="#4ade80"
            label={dilemma.left.label}
            delta={dilemma.left.delta}
            iconColor="#065f46"
          />
          <ChoiceButton
            side="right"
            color="#f87171"
            label={dilemma.right.label}
            delta={dilemma.right.delta}
            iconColor="#7f1d1d"
          />
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
