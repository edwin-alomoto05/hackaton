import type { FeedbackType } from "../types/game";

interface ScreenFlashProps {
  feedback: FeedbackType;
}

export function ScreenFlash({ feedback }: ScreenFlashProps) {
  if (feedback === null) return null;

  const isGood = feedback === "good";
  const label = isGood ? "✓ BUENA DECISIÓN" : "✗ MALA DECISIÓN";

  return (
    <div
      className={`premium-screen-flash premium-screen-flash--${isGood ? "good" : "bad"}`}
    >
      <div className="premium-screen-flash-vignette" />
      <div className="premium-screen-flash-ring" />
      <div
        className={`premium-screen-flash-label premium-screen-flash-label--${isGood ? "good" : "bad"}`}
      >
        {label}
      </div>
    </div>
  );
}
