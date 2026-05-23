import type { CSSProperties } from "react";
import type { GameMode, TransitionPhase } from "../types/game";
import { QUITO_PLACES } from "../constants/runner";

import basilicaBg from "../assets/backgrounds/basilica.png";
import plazaGrandeBg from "../assets/backgrounds/plaza-grande.png";
import laRondaBg from "../assets/backgrounds/la-ronda.png";
import carolinaBg from "../assets/backgrounds/carolina.png";
import mercadoBg from "../assets/backgrounds/mercado-central.jpg";

const BACKGROUNDS = [
  basilicaBg,
  plazaGrandeBg,
  laRondaBg,
  carolinaBg,
  mercadoBg,
] as const;

const PARALLAX_CYCLE = 3840;

const STARS = [
  { top: "8%", left: "5%", size: "0.3vmin", delay: "0s" },
  { top: "15%", left: "18%", size: "0.4vmin", delay: "-0.5s" },
  { top: "5%", left: "32%", size: "0.25vmin", delay: "-1s" },
  { top: "12%", left: "48%", size: "0.35vmin", delay: "-1.5s" },
  { top: "7%", left: "62%", size: "0.3vmin", delay: "-0.3s" },
  { top: "18%", left: "75%", size: "0.4vmin", delay: "-0.8s" },
  { top: "9%", left: "88%", size: "0.25vmin", delay: "-1.2s" },
  { top: "14%", left: "95%", size: "0.3vmin", delay: "-0.6s" },
  { top: "3%", left: "22%", size: "0.2vmin", delay: "-1.8s" },
  { top: "20%", left: "55%", size: "0.35vmin", delay: "-0.4s" },
  { top: "6%", left: "70%", size: "0.3vmin", delay: "-1.1s" },
  { top: "16%", left: "40%", size: "0.25vmin", delay: "-0.9s" },
] as const;

interface ScrollingBackgroundProps {
  offset: number;
  isPaused: boolean;
  isTransitioning?: boolean;
  cityIndex?: number;
  mode?: GameMode;
  transitionPhase?: TransitionPhase;
}

export function ScrollingBackground({
  offset,
  isPaused,
  isTransitioning = false,
  cityIndex = 0,
  mode: _mode,
  transitionPhase: _transitionPhase,
}: ScrollingBackgroundProps) {
  void _mode;
  void _transitionPhase;

  const placeIndex =
    ((cityIndex % QUITO_PLACES.length) + QUITO_PLACES.length) % QUITO_PLACES.length;
  const currentBg = BACKGROUNDS[placeIndex];
  const place = QUITO_PLACES[placeIndex];

  const layer1Offset = isPaused || isTransitioning ? 0 : offset * 0.3;
  const layer2Offset = isPaused || isTransitioning ? 0 : offset * 1.0;
  const layer3Offset = isPaused || isTransitioning ? 0 : offset * 1.5;

  const layer1X = -(layer1Offset % PARALLAX_CYCLE);
  const layer2X = -(layer2Offset % PARALLAX_CYCLE);
  const layer3X = -(layer3Offset % PARALLAX_CYCLE);

  const layerBase: CSSProperties = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url(${currentBg})`,
    backgroundSize: "auto 100%",
    backgroundRepeat: "repeat-x",
    imageRendering: "pixelated",
    opacity: isTransitioning ? 0 : 1,
    transition: "opacity 0.3s steps(3)",
    willChange: "background-position",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#0a0a1a",
      }}
    >
      <div
        style={{
          ...layerBase,
          backgroundPosition: `${layer1X}px 0`,
          filter: "brightness(0.4)",
        }}
      />

      <div
        style={{
          ...layerBase,
          backgroundPosition: `${layer2X}px 0`,
        }}
      />

      <div
        style={{
          ...layerBase,
          bottom: 0,
          left: 0,
          right: 0,
          top: "auto",
          height: "25%",
          backgroundSize: "auto 400%",
          backgroundPosition: `${layer3X}px bottom`,
          opacity: isTransitioning ? 0 : 0.6,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(5, 5, 20, 0.25)",
          pointerEvents: "none",
        }}
      />

      {STARS.map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            background: "#ffffff",
            animation: `starTwinkleFast 1.5s steps(2) ${star.delay} infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          bottom: "27%",
          left: "2vmin",
          display: "flex",
          alignItems: "center",
          gap: "1vmin",
          pointerEvents: "none",
          opacity: 0.7,
        }}
      >
        <span style={{ fontSize: "2vmin" }}>{place.emoji}</span>
        <span
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "1vmin",
            color: place.color,
            textShadow: `0 0 0.5vmin ${place.color}`,
          }}
        >
          {place.name}
        </span>
      </div>
    </div>
  );
}

export default ScrollingBackground;
