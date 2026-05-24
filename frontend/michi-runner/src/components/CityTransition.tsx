import { QUITO_PLACES } from "../constants/runner";
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
  const safeIndex =
    ((destIndex % QUITO_PLACES.length) + QUITO_PLACES.length) % QUITO_PLACES.length;
  const destCity = QUITO_PLACES[safeIndex];

  if (transitionPhase === "fadeOut") {
    return <div className="premium-city-fade premium-city-fade--out" />;
  }

  if (transitionPhase === "flash") {
    return (
      <div className="premium-city-flash" style={{ background: destCity.color }}>
        <div className="premium-city-flash-speedlines" />
        <div className="premium-city-flash-glow" />
        <div className="premium-city-flash-wave" />
        <div className="premium-city-flash-content">
          <div className="premium-city-flash-emoji">{destCity.emoji}</div>
          <div className="premium-city-flash-name">{destCity.name}</div>
          <div className="premium-city-flash-desc">{destCity.description}</div>
          <div className="premium-city-flash-fact">{destCity.fact[mode]}</div>
        </div>
      </div>
    );
  }

  if (transitionPhase === "fadeIn") {
    return <div className="premium-city-fade premium-city-fade--in" />;
  }

  return null;
}
