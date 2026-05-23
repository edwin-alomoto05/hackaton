import type { FeedbackType } from "../types/game";

interface ScreenFlashProps {
  feedback: FeedbackType;
}

const TEXT_SHADOW =
  "-0.2vmin -0.2vmin 0 #000, 0.2vmin -0.2vmin 0 #000, -0.2vmin 0.2vmin 0 #000, 0.2vmin 0.2vmin 0 #000";

export function ScreenFlash({ feedback }: ScreenFlashProps) {
  if (feedback === null) return null;

  const color = feedback === "good" ? "#4ade80" : "#f87171";
  const label = feedback === "good" ? "✓ BUENA DECISIÓN" : "✗ MALA DECISIÓN";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 8,
        pointerEvents: "none",
        background:
          feedback === "good" ? "rgba(74, 222, 128, 0.35)" : "rgba(248, 113, 113, 0.35)",
        animation: "screenFlashImpact 0.6s steps(6) forwards",
        border: `0.6vmin solid ${color}`,
        boxShadow: `inset 0 0 8vmin ${color}44`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "4vmin",
          color,
          animation: "countPop 0.4s steps(4) forwards",
          textShadow: TEXT_SHADOW,
          pointerEvents: "none",
          willChange: "transform",
        }}
      >
        {label}
      </div>
    </div>
  );
}
