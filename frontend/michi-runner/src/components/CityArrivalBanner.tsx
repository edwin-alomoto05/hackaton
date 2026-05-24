import { QUITO_PLACES } from "../constants/runner";
import type { GameMode } from "../types/game";

interface CityArrivalBannerProps {
  isVisible: boolean;
  cityIndex: number;
  mode: GameMode;
}

export function CityArrivalBanner({ isVisible, cityIndex, mode }: CityArrivalBannerProps) {
  if (!isVisible) return null;

  const safeIndex =
    ((cityIndex % QUITO_PLACES.length) + QUITO_PLACES.length) % QUITO_PLACES.length;
  const city = QUITO_PLACES[safeIndex];

  return (
    <div key={cityIndex} className="premium-arrival-banner" style={{ color: city.color }}>
      <div className="premium-arrival-card" style={{ borderColor: city.color, color: city.color }}>
        <div className="premium-arrival-header">
          <span className="premium-arrival-arrow">→</span>
          <div>
            <div className="premium-arrival-title">
              {city.emoji} {city.name}
            </div>
            <div className="premium-arrival-desc">{city.description}</div>
          </div>
        </div>
        <div className="premium-arrival-divider" style={{ background: city.color }} />
        <div className="premium-arrival-fact">{city.fact[mode]}</div>
      </div>
      <div className="premium-arrival-pin" style={{ color: city.color }} />
    </div>
  );
}
