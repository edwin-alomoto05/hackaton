import { CITIES } from "../constants/runner";
import type { GameMode, TransitionPhase } from "../types/game";

interface CityTransitionProps {
  transitionPhase: TransitionPhase;
  currentCityIndex: number;
  nextCityIndex: number | null;
  mode: GameMode;
}

export function CityTransition({
  transitionPhase,
  nextCityIndex,
  mode,
}: CityTransitionProps) {
  if (transitionPhase === null) return null;

  const destIndex = nextCityIndex ?? 0;
  const destCity = CITIES[destIndex] ?? CITIES[0];

  if (transitionPhase === "fadeOut") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#0f0f1a",
          animation: "cityFadeOut 0.5s ease-in forwards",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />
    );
  }

  if (transitionPhase === "flash") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: destCity.color,
          animation: "cityFlash 0.5s ease-out forwards",
          zIndex: 5,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "2vmin",
        }}
      >
        <div
          style={{
            fontSize: "15vmin",
            animation: "countPop 0.3s ease-out forwards",
          }}
        >
          {destCity.emoji}
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "5vmin",
            color: "#0f0f1a",
            animation: "countPop 0.4s ease-out forwards",
            textShadow: "0.3vmin 0.3vmin 0 rgba(0,0,0,0.3)",
          }}
        >
          {destCity.name}
        </div>
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "2vmin",
            color: "#0f0f1a",
            opacity: 0.7,
          }}
        >
          {destCity.altitude} s.n.m.
        </div>
        <div
          style={{
            width: "30vmin",
            height: "0.4vmin",
            background: "#0f0f1a",
            opacity: 0.4,
            margin: "1vmin 0",
          }}
        />
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1.6vmin",
            color: "#0f0f1a",
            opacity: 0.8,
            textAlign: "center",
            maxWidth: "50vmin",
            lineHeight: 1.8,
          }}
        >
          {destCity.fact[mode]}
        </div>
      </div>
    );
  }

  if (transitionPhase === "fadeIn") {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#0f0f1a",
          animation: "cityFadeIn 0.5s ease-out forwards",
          zIndex: 5,
          pointerEvents: "none",
        }}
      />
    );
  }

  return null;
}
