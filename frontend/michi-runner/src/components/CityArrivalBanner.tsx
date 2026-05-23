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
    <div
      key={cityIndex}
      style={{
        position: "absolute",
        top: "25%",
        right: "3vmin",
        zIndex: 7,
        animation: "bannerSlide 2.5s ease-in-out forwards",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "#0f0f1a",
          border: `0.5vmin solid ${city.color}`,
          boxShadow: "0.5vmin 0.5vmin 0 #000",
          padding: "1.5vmin 2.5vmin",
          minWidth: "25vmin",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5vmin",
            marginBottom: "1vmin",
          }}
        >
          <span
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "2.5vmin",
              color: city.color,
            }}
          >
            →
          </span>
          <div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1.8vmin",
                color: city.color,
              }}
            >
              {city.emoji} {city.name}
            </div>
            <div
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: "1.1vmin",
                color: "#94a3b8",
                marginTop: "0.5vmin",
              }}
            >
              {city.description}
            </div>
          </div>
        </div>
        <div
          style={{
            height: "0.3vmin",
            background: city.color,
            opacity: 0.4,
            marginBottom: "1vmin",
          }}
        />
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1.1vmin",
            color: "#f1f5f9",
            lineHeight: 1.6,
            maxWidth: "28vmin",
          }}
        >
          {city.fact[mode]}
        </div>
      </div>
      <div
        style={{
          width: "0.5vmin",
          height: "4vmin",
          background: "#94a3b8",
          margin: "0 auto",
        }}
      />
    </div>
  );
}
