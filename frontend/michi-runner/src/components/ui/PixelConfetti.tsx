import { useMemo } from "react";

interface PixelConfettiProps {
  isActive: boolean;
  count?: number;
}

const CONFETTI_COLORS = [
  "#fde047",
  "#4ade80",
  "#f87171",
  "#60a5fa",
  "#a78bfa",
  "#fb923c",
  "#fff",
] as const;

interface ConfettiPiece {
  id: number;
  width: string;
  height: string;
  background: string;
  left: string;
  duration: string;
  steps: number;
  delay: string;
}

function buildPieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, id) => {
    const size = 0.4 + Math.random() * 0.8;
    const duration = 2 + Math.random() * 2;
    const stepCount = 8 + Math.floor(Math.random() * 9);
    return {
      id,
      width: `${size}vmin`,
      height: `${size}vmin`,
      background: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ?? "#fff",
      left: `${Math.random() * 100}%`,
      duration: `${duration}s`,
      steps: stepCount,
      delay: `${-(Math.random() * 2)}s`,
    };
  });
}

export function PixelConfetti({ isActive, count = 40 }: PixelConfettiProps) {
  const pieces = useMemo(() => buildPieces(count), [count]);

  if (!isActive) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 5,
      }}
    >
      {pieces.map((piece) => (
        <div
          key={piece.id}
          style={{
            position: "absolute",
            top: "-5%",
            left: piece.left,
            width: piece.width,
            height: piece.height,
            background: piece.background,
            border: "0.1vmin solid #000",
            animation: `confettiFall ${piece.duration} steps(${piece.steps}) infinite`,
            animationDelay: piece.delay,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
