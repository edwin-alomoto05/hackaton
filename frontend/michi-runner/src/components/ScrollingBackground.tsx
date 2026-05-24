import type { GameMode, TransitionPhase } from "../types/game";
import { QUITO_PLACES } from "../constants/runner";

import basilicaBg from "../assets/backgrounds/basilica.png";
import plazaGrandeBg from "../assets/backgrounds/plaza-grande.png";
import laRondaBg from "../assets/backgrounds/la-ronda.png";
import carolinaBg from "../assets/backgrounds/carolina.png";
import mercadoBg from "../assets/backgrounds/mercado-central.jpg";
import cobblestonesBg from "../assets/backgrounds/cobblestones.png";

const BACKGROUNDS = [
  basilicaBg,
  plazaGrandeBg,
  laRondaBg,
  carolinaBg,
  mercadoBg,
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
  isPaused: _isPaused,
  isTransitioning = false,
  cityIndex = 0,
  mode: _mode,
  transitionPhase: _transitionPhase,
}: ScrollingBackgroundProps) {
  void _isPaused;
  void _mode;
  void _transitionPhase;

  const placeIndex =
    ((cityIndex % QUITO_PLACES.length) + QUITO_PLACES.length) % QUITO_PLACES.length;
  const currentBg = BACKGROUNDS[placeIndex];
  const place = QUITO_PLACES[placeIndex];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#0a0a1a",
      }}
    >

      {[
        { top: "6%", left: "3%", s: "0.3vmin", d: "0s" },
        { top: "12%", left: "15%", s: "0.4vmin", d: "-0.5s" },
        { top: "4%", left: "30%", s: "0.25vmin", d: "-1s" },
        { top: "9%", left: "48%", s: "0.35vmin", d: "-1.5s" },
        { top: "5%", left: "63%", s: "0.3vmin", d: "-0.3s" },
        { top: "14%", left: "77%", s: "0.4vmin", d: "-0.8s" },
        { top: "8%", left: "89%", s: "0.25vmin", d: "-1.2s" },
        { top: "16%", left: "95%", s: "0.3vmin", d: "-0.6s" },
      ].map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: s.s,
            height: s.s,
            background: "#ffffff",
            animation: `starTwinkleFast 1.5s steps(2) ${s.d} infinite`,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: "18%",
          overflow: "hidden",
          zIndex: 2,
          opacity: isTransitioning ? 0 : 0.45,
          transition: "opacity 0.3s steps(3)",
          filter: "brightness(0.5)",
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: "-30%",
            backgroundImage: `url(${currentBg})`,
            backgroundSize: "auto 133%",
            backgroundRepeat: "repeat-x",
            backgroundPosition: `${-(offset * 0.3)}px 0`,
            imageRendering: "pixelated",
            willChange: "background-position",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: "18%",
          overflow: "hidden",
          zIndex: 3,
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 0.3s steps(3)",
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: "-30%",
            backgroundImage: `url(${currentBg})`,
            backgroundSize: "auto 133%",
            backgroundRepeat: "repeat-x",
            backgroundPosition: `${-(offset * 1.0)}px 0`,
            imageRendering: "pixelated",
            willChange: "background-position",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: "18%",
          background: "rgba(5,5,20,0.15)",
          pointerEvents: "none",
          zIndex: 4,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "17.8%",
          left: 0,
          right: 0,
          height: "0.5vmin",
          background: "rgba(0,0,0,0.8)",
          zIndex: 5,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "18%",
          backgroundImage: `url(${cobblestonesBg})`,
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
          backgroundPosition: `${-(offset * 1.2)}px 0`,
          imageRendering: "pixelated",
          zIndex: 6,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "2vmin",
          display: "flex",
          alignItems: "center",
          gap: "0.8vmin",
          pointerEvents: "none",
          opacity: 0.7,
          zIndex: 7,
        }}
      >
        <span style={{ fontSize: "1.8vmin" }}>{place.emoji}</span>
        <span
          style={{
            fontFamily: "Press Start 2P",
            fontSize: "0.9vmin",
            color: place.color,
            textShadow: "0.1vmin 0.1vmin 0 #000",
          }}
        >
          {place.name}
        </span>
      </div>
    </div>
  );
}

export default ScrollingBackground;
