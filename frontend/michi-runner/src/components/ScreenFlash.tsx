import type { FeedbackType } from "../types/game";

interface ScreenFlashProps {
  feedback: FeedbackType;
}

export function ScreenFlash({ feedback }: ScreenFlashProps) {
  if (feedback === null) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 8,
        pointerEvents: "none",
        background:
          feedback === "good" ? "rgba(74, 222, 128, 0.25)" : "rgba(248, 113, 113, 0.25)",
        animation: "screenFlash 0.6s ease-out forwards",
        border: feedback === "good" ? "0.5vmin solid #4ade80" : "0.5vmin solid #f87171",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "5vmin",
          color: feedback === "good" ? "#4ade80" : "#f87171",
          animation: "countPop 0.4s ease-out forwards",
          textShadow: feedback === "good" ? "0 0 20px #4ade80" : "0 0 20px #f87171",
          pointerEvents: "none",
        }}
      >
        {feedback === "good" ? "✓ BUENA DECISIÓN" : "✗ MALA DECISIÓN"}
      </div>
    </div>
  );
}
