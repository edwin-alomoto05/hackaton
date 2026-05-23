import { useEffect, useState, type ReactNode } from "react";
import type { GameMode, TransitionPhase } from "../types/game";

const PARALLAX_CYCLE = 800;

interface ParallaxOffsets {
  layer1Offset: number;
  layer2Offset: number;
  layer3Offset: number;
}

function ParallaxStrip({
  offset,
  children,
  style,
  cycle = PARALLAX_CYCLE,
}: {
  offset: number;
  children: ReactNode;
  style?: React.CSSProperties;
  cycle?: number;
}) {
  const x = -(offset % cycle);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          width: cycle * 2,
          transform: `translateX(${x}px)`,
          willChange: "transform",
        }}
      >
        <div style={{ width: cycle, position: "relative", flexShrink: 0 }}>{children}</div>
        <div style={{ width: cycle, position: "relative", flexShrink: 0 }}>{children}</div>
      </div>
    </div>
  );
}

function PixelCloud({
  top,
  left,
  delay,
  scale = 1,
}: {
  top: string;
  left: string;
  delay: string;
  scale?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: "10vmin",
        height: "4vmin",
        transform: `scale(${scale})`,
        animation: "cloudDrift 25s steps(50) infinite linear",
        animationDelay: delay,
        willChange: "transform",
      }}
    >
      <div style={{ position: "absolute", left: "2vmin", top: "1vmin", width: "5vmin", height: "2vmin", background: "#fff" }} />
      <div style={{ position: "absolute", left: 0, top: "1.5vmin", width: "2.5vmin", height: "1.2vmin", background: "#fff" }} />
      <div style={{ position: "absolute", right: 0, top: "1.5vmin", width: "2.5vmin", height: "1.2vmin", background: "#fff" }} />
    </div>
  );
}

function QuitoSkyAnim() {
  return (
    <>
      <PixelCloud top="8%" left="5%" delay="0s" />
      <PixelCloud top="15%" left="35%" delay="-6s" scale={0.8} />
      <PixelCloud top="6%" left="60%" delay="-12s" />
      <PixelCloud top="20%" left="80%" delay="-18s" scale={1.2} />
    </>
  );
}

function GuayaquilSun() {
  return (
    <div
      style={{
        position: "absolute",
        top: "8%",
        right: "15%",
        width: "4vmin",
        height: "4vmin",
        background: "#ffd700",
        border: "0.4vmin solid #000",
        animation: "sunPulse 3s steps(2) infinite",
        willChange: "transform",
      }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "0.5vmin",
            height: "1.5vmin",
            background: "#ffd700",
            transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-2.5vmin)`,
            transformOrigin: "center center",
          }}
        />
      ))}
    </div>
  );
}

function SalinasSkyWaves() {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: "55%", pointerEvents: "none" }}>
      {[
        { h: "0.75vmin", bg: "#00bcd4", delay: "0s" },
        { h: "0.5vmin", bg: "#26c6da", delay: "0.5s" },
        { h: "0.5vmin", bg: "#4dd0e1", delay: "1s" },
      ].map((w, i) => (
        <div
          key={i}
          style={{
            width: "100%",
            height: w.h,
            background: w.bg,
            animation: "waveShift 1.5s steps(3) infinite",
            animationDelay: w.delay,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

function OtavaloStars() {
  const stars = [
    { top: "8%", left: "12%", delay: "-0.2s" },
    { top: "15%", left: "28%", delay: "-0.7s" },
    { top: "6%", left: "45%", delay: "-0.4s" },
    { top: "18%", left: "62%", delay: "-0.9s" },
    { top: "10%", left: "78%", delay: "-0.1s" },
    { top: "22%", left: "8%", delay: "-0.5s" },
    { top: "12%", left: "88%", delay: "-0.8s" },
    { top: "5%", left: "55%", delay: "-0.3s" },
    { top: "20%", left: "38%", delay: "-0.6s" },
    { top: "14%", left: "72%", delay: "-0.15s" },
    { top: "9%", left: "20%", delay: "-0.55s" },
    { top: "17%", left: "50%", delay: "-0.35s" },
    { top: "11%", left: "33%", delay: "-0.75s" },
    { top: "7%", left: "65%", delay: "-0.45s" },
    { top: "19%", left: "92%", delay: "-0.25s" },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: s.top,
            left: s.left,
            width: "0.25vmin",
            height: "0.25vmin",
            background: "#fff",
            animation: "starTwinkle 1s steps(2) infinite",
            animationDelay: s.delay,
          }}
        />
      ))}
    </>
  );
}

interface ScrollingBackgroundProps {
  offset: number;
  isPaused: boolean;
  mode: GameMode;
  cityIndex?: number;
  isTransitioning?: boolean;
  transitionPhase?: TransitionPhase;
}

function SkyLayers({
  top,
  mid,
  bottom,
}: {
  top: string;
  mid: string;
  bottom: string;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "30%",
          background: top,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: 0,
          right: 0,
          height: "40%",
          background: mid,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "70%",
          left: 0,
          right: 0,
          height: "30%",
          background: bottom,
        }}
      />
    </div>
  );
}

// --------------------------------------------------
// CITY 0: QUITO
// --------------------------------------------------
function QuitoFarBg() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 60,
          bottom: 0,
          width: "15vw",
          height: "12vh",
          background: "#3a6b1a",
          clipPath: "polygon(15% 100%, 50% 0%, 85% 100%)",
        }}
      >
        <div style={{ position: "absolute", left: "48%", top: 0, width: "0.4vmin", height: "2.5vmin", background: "#c8c8c8" }} />
      </div>
      {[120, 320, 520].map((left) => (
        <div
          key={left}
          style={{
            position: "absolute",
            left,
            bottom: 0,
            width: "20vw",
            height: "8vh",
            background: "#2a4a8a",
            opacity: 0.4,
            clipPath: "polygon(0% 100%, 30% 20%, 70% 40%, 100% 100%)",
          }}
        />
      ))}
    </>
  );
}

function QuitoForeground() {
  return (
    <>
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i * 10,
            bottom: 35,
            width: "3vmin",
            height: "1vmin",
            background: "#c8b896",
            borderRight: "0.1vmin solid #a89876",
          }}
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={`lamp-${i}`} style={{ position: "absolute", left: i * 120 + 40, bottom: 35 }}>
          <div style={{ width: "0.4vmin", height: "4vmin", background: "#8b6914" }} />
          <div style={{ width: "1vmin", height: "1vmin", background: "#ffd700", marginTop: "-0.5vmin", marginLeft: "-0.3vmin" }} />
        </div>
      ))}
    </>
  );
}

function QuitoScene({ layer1Offset, layer2Offset, layer3Offset }: ParallaxOffsets) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#4a9eff" }}>
      <SkyLayers top="#1a6bc4" mid="#4a9eff" bottom="#87ceeb" />
      <QuitoSkyAnim />

      <ParallaxStrip offset={layer1Offset} style={{ bottom: 65, height: "35vh" }}>
        <QuitoFarBg />
      </ParallaxStrip>

      <ParallaxStrip offset={layer2Offset} style={{ bottom: 0, height: 245 }}>
      {/* Buildings Layer (bottom: 65px) */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 65, height: 180 }}>
        {/* Panecillo (colina) */}
        <div style={{ position: "absolute", left: 80, bottom: 0, width: 120, height: 60, background: "#5a8a3a", clipPath: "polygon(10% 100%, 50% 0%, 90% 100%)" }}>
          {/* Virgen encima */}
          <div style={{ position: "absolute", left: 58, bottom: 60, width: 4, height: 20, background: "#c0c0c0" }} />
        </div>

        {/* Basílica */}
        <div style={{ position: "absolute", left: 240, bottom: 0, width: 100, height: 180 }}>
          {/* Base */}
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 100, height: 40, background: "#5a4530" }} />
          {/* Left tower */}
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 30, height: 180, background: "#4a3520" }}>
            <OjivalWindow style={{ left: 11, bottom: 120 }} />
            <OjivalWindow style={{ left: 11, bottom: 70 }} />
          </div>
          {/* Right tower */}
          <div style={{ position: "absolute", right: 0, bottom: 0, width: 30, height: 180, background: "#4a3520" }}>
            <OjivalWindow style={{ left: 11, bottom: 120 }} />
            <OjivalWindow style={{ left: 11, bottom: 70 }} />
          </div>
          {/* Entre torres */}
          <div style={{ position: "absolute", left: 30, bottom: 40, width: 40, height: 60, background: "#4a3520" }}>
            <OjivalWindow style={{ left: 16, bottom: 25 }} />
          </div>
        </div>

        {/* Casa colonial 1 */}
        <div style={{ position: "absolute", left: 400, bottom: 0, width: 80, height: 70, background: "#e8d5b0" }}>
          {/* Techo */}
          <div style={{ position: "absolute", top: -20, left: 0, width: 0, height: 0, borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderBottom: "20px solid #cc4444" }} />
          {/* Ventanas */}
          <div style={{ position: "absolute", left: 12, top: 15, width: 14, height: 18, background: "#87ceeb", border: "2px solid #4a3520" }} />
          <div style={{ position: "absolute", right: 12, top: 15, width: 14, height: 18, background: "#87ceeb", border: "2px solid #4a3520" }} />
          {/* Puerta */}
          <div style={{ position: "absolute", left: 31, bottom: 0, width: 18, height: 28, background: "#8b4513" }} />
        </div>

        {/* Árbol andino */}
        <QuitoTree style={{ left: 520, bottom: 0 }} />

        {/* Casa colonial 2 */}
        <div style={{ position: "absolute", left: 620, bottom: 0, width: 60, height: 60, background: "#f0e0c0" }}>
          {/* Techo */}
          <div style={{ position: "absolute", top: -15, left: 0, width: 0, height: 0, borderLeft: "30px solid transparent", borderRight: "30px solid transparent", borderBottom: "15px solid #aa3333" }} />
          {/* Ventana */}
          <div style={{ position: "absolute", left: 23, top: 10, width: 14, height: 18, background: "#87ceeb", border: "2px solid #4a3520" }} />
          {/* Puerta */}
          <div style={{ position: "absolute", left: 23, bottom: 0, width: 14, height: 22, background: "#6b3410" }} />
        </div>

        {/* Árbol andino */}
        <QuitoTree style={{ left: 710, bottom: 0 }} />

        {/* Trolebús */}
        <div style={{ position: "absolute", left: 800, bottom: -53, width: 70, height: 28, background: "#cc0000", border: "2px solid #000", zIndex: 10 }}>
          {/* Ventanas */}
          <div style={{ position: "absolute", left: 6, top: 4, display: "flex", gap: 4 }}>
            <div style={{ width: 10, height: 10, background: "#87ceeb" }} />
            <div style={{ width: 10, height: 10, background: "#87ceeb" }} />
            <div style={{ width: 10, height: 10, background: "#87ceeb" }} />
            <div style={{ width: 10, height: 10, background: "#87ceeb" }} />
          </div>
          {/* Ruedas */}
          <div style={{ position: "absolute", left: 10, bottom: -5, width: 10, height: 10, background: "#333", borderRadius: "50%", border: "1px solid #000" }} />
          <div style={{ position: "absolute", right: 10, bottom: -5, width: 10, height: 10, background: "#333", borderRadius: "50%", border: "1px solid #000" }} />
          {/* Antena */}
          <div style={{ position: "absolute", left: 34, top: -15, width: 2, height: 15, background: "#333" }} />
        </div>

        {/* Casa colonial 1 copy */}
        <div style={{ position: "absolute", left: 950, bottom: 0, width: 80, height: 70, background: "#e8d5b0" }}>
          {/* Techo */}
          <div style={{ position: "absolute", top: -20, left: 0, width: 0, height: 0, borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderBottom: "20px solid #cc4444" }} />
          {/* Ventanas */}
          <div style={{ position: "absolute", left: 12, top: 15, width: 14, height: 18, background: "#87ceeb", border: "2px solid #4a3520" }} />
          <div style={{ position: "absolute", right: 12, top: 15, width: 14, height: 18, background: "#87ceeb", border: "2px solid #4a3520" }} />
          {/* Puerta */}
          <div style={{ position: "absolute", left: 31, bottom: 0, width: 18, height: 28, background: "#8b4513" }} />
        </div>

        {/* Árbol andino copy */}
        <QuitoTree style={{ left: 1070, bottom: 0 }} />
      </div>

      {/* Ground Layer (bottom: 0) */}
      {/* Vereda */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 35,
        height: 30,
        background: "#c8b896"
      }}>
        {Array.from({ length: 120 }).map((_, idx) => (
          <div key={idx} style={{
            position: "absolute",
            left: idx * 20,
            top: 0,
            width: 1,
            height: "100%",
            background: "#a89876"
          }} />
        ))}
      </div>
      {/* Calle */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 35,
        background: "#555555"
      }}>
        {/* Yellow dashed line */}
        <div style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 15,
          height: 5,
          display: "flex",
          gap: 40,
          overflow: "hidden"
        }}>
          {Array.from({ length: 40 }).map((_, idx) => (
            <div key={idx} style={{
              width: 40,
              height: 5,
              background: "#ffd700",
              flexShrink: 0
            }} />
          ))}
        </div>
      </div>
      </ParallaxStrip>

      <ParallaxStrip offset={layer3Offset} style={{ bottom: 0, height: 100, zIndex: 3 }}>
        <QuitoForeground />
      </ParallaxStrip>
    </div>
  );
}

function QuitoTree({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 40, height: 60, ...style }}>
      {/* Tronco */}
      <div style={{ position: "absolute", left: 16, bottom: 0, width: 8, height: 20, background: "#5a3a1a" }} />
      {/* Copa (3 overlapping rects) */}
      <div style={{ position: "absolute", left: 5, bottom: 20, width: 30, height: 14, background: "#2d6a2d" }} />
      <div style={{ position: "absolute", left: 0, bottom: 30, width: 40, height: 14, background: "#3d8a3d" }} />
      <div style={{ position: "absolute", left: 5, bottom: 40, width: 30, height: 14, background: "#2d6a2d" }} />
    </div>
  );
}

function OjivalWindow({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 8, height: 20, ...style }}>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        borderLeft: "4px solid transparent",
        borderRight: "4px solid transparent",
        borderBottom: "4px solid #ffd700"
      }} />
      <div style={{
        position: "absolute",
        top: 4,
        left: 0,
        width: 8,
        height: 16,
        background: "#ffd700"
      }} />
    </div>
  );
}

// --------------------------------------------------
// CITY 1: GUAYAQUIL
// --------------------------------------------------
function GuayaquilFarBg() {
  return (
  <>
    {[80, 200, 340, 480, 600].map((left, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left,
          bottom: 0,
          width: 50 + (i % 3) * 20,
          height: 60 + (i % 2) * 40,
          background: "#0a2a5a",
          opacity: 0.5,
        }}
      />
    ))}
  </>
  );
}

function GuayaquilForeground() {
  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: i * 16, bottom: 35, width: "4vmin", height: "1.5vmin", background: "#c8a855", border: "0.1vmin solid #b09840" }} />
      ))}
      {[100, 280, 460, 640].map((left) => (
        <div key={left} style={{ position: "absolute", left, bottom: 35 }}>
          <div style={{ width: "0.8vmin", height: "6vmin", background: "#8b6914", transform: "rotate(5deg)", transformOrigin: "bottom center" }} />
          {[0, 45, 90, 135].map((deg) => (
            <div key={deg} style={{ position: "absolute", top: 0, left: "0.4vmin", width: "3vmin", height: "0.6vmin", background: "#2d8a2d", transform: `rotate(${deg}deg)`, transformOrigin: "left center" }} />
          ))}
        </div>
      ))}
    </>
  );
}

function GuayaquilScene({
  isPaused,
  layer1Offset,
  layer2Offset,
  layer3Offset,
}: { isPaused: boolean } & ParallaxOffsets) {
  const animStyle = isPaused ? { animationPlayState: "paused" } : {};
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#ff9f43" }}>
      <SkyLayers top="#ff6b35" mid="#ff9f43" bottom="#ffd700" />
      <GuayaquilSun />

      <ParallaxStrip offset={layer1Offset} style={{ bottom: 65, height: "30vh" }}>
        <GuayaquilFarBg />
      </ParallaxStrip>

      <ParallaxStrip offset={layer2Offset} style={{ bottom: 0, height: 280 }}>
      {/* Río Guayas */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 65,
        height: 15,
        background: "#1a4a8a",
        overflow: "hidden"
      }}>
        <div
          style={{
            width: "200%",
            height: "100%",
            display: "flex",
            animation: "wave-flow 2s steps(4) infinite",
            willChange: "transform",
            ...animStyle,
          }}
        >
          {Array.from({ length: 150 }).map((_, idx) => (
            <div key={idx} style={{
              width: 15,
              height: "100%",
              background: idx % 2 === 0 ? "transparent" : "#4a9eff",
              flexShrink: 0
            }} />
          ))}
        </div>
      </div>

      {/* Buildings Layer */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 65, height: 180 }}>
        {/* Malecón horizontal bar */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 20, background: "#8b6914", zIndex: 5 }} />

        {/* Postes de luz */}
        {Array.from({ length: 15 }).map((_, idx) => (
          <div key={idx} style={{ position: "absolute", left: idx * 80 + 40, bottom: 20, width: 4, height: 30, background: "#c0a020", zIndex: 6 }}>
            <div style={{ position: "absolute", top: -8, left: -3, width: 10, height: 10, background: "#ffd700", border: "1px solid #000" }} />
          </div>
        ))}

        {/* Torre moderna 1 */}
        <div style={{ position: "absolute", left: 80, bottom: 20, width: 60, height: 160, background: "#1a4a7a" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 8px)", gap: "10px 4px", padding: "12px 7px" }}>
            {Array.from({ length: 32 }).map((_, idx) => (
              <div key={idx} style={{ width: 8, height: 10, background: "#87ceeb" }} />
            ))}
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", pointerEvents: "none" }}>
            <div style={{ width: 15, height: "100%", background: "rgba(255, 255, 255, 0.1)", marginLeft: 4 }} />
            <div style={{ width: 15, height: "100%", background: "rgba(255, 255, 255, 0.1)", marginLeft: 4 }} />
            <div style={{ width: 15, height: "100%", background: "rgba(255, 255, 255, 0.1)", marginLeft: 4 }} />
          </div>
        </div>

        {/* Palmera */}
        <Palmera style={{ left: 160, bottom: 20, zIndex: 7 }} />

        {/* Puente arco pixel */}
        <div style={{ position: "absolute", left: 240, bottom: 20, width: 120, height: 80 }}>
          <div style={{ position: "absolute", left: 10, bottom: 0, width: 10, height: 60, background: "#888" }} />
          <div style={{ position: "absolute", right: 10, bottom: 0, width: 10, height: 60, background: "#888" }} />
          <div style={{ position: "absolute", left: 10, bottom: 10, width: 100, height: 50, borderTop: "8px solid #888" }} />
          <div style={{ position: "absolute", left: 30, bottom: 10, width: 1, height: 25, background: "#666" }} />
          <div style={{ position: "absolute", left: 45, bottom: 10, width: 1, height: 38, background: "#666" }} />
          <div style={{ position: "absolute", left: 60, bottom: 10, width: 1, height: 42, background: "#666" }} />
          <div style={{ position: "absolute", left: 75, bottom: 10, width: 1, height: 38, background: "#666" }} />
          <div style={{ position: "absolute", left: 90, bottom: 10, width: 1, height: 25, background: "#666" }} />
        </div>

        {/* Torre moderna 2 */}
        <div style={{ position: "absolute", left: 420, bottom: 20, width: 50, height: 130, background: "#0a3a6a" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 8px)", gap: "8px 4px", padding: "10px 7px" }}>
            {Array.from({ length: 21 }).map((_, idx) => (
              <div key={idx} style={{ width: 8, height: 10, background: "#b0d4ff" }} />
            ))}
          </div>
        </div>

        {/* Palmera */}
        <Palmera style={{ left: 520, bottom: 20, zIndex: 7 }} />

        {/* Torre moderna 1 copy */}
        <div style={{ position: "absolute", left: 620, bottom: 20, width: 60, height: 160, background: "#1a4a7a" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 8px)", gap: "10px 4px", padding: "12px 7px" }}>
            {Array.from({ length: 32 }).map((_, idx) => (
              <div key={idx} style={{ width: 8, height: 10, background: "#87ceeb" }} />
            ))}
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", pointerEvents: "none" }}>
            <div style={{ width: 15, height: "100%", background: "rgba(255, 255, 255, 0.1)", marginLeft: 4 }} />
            <div style={{ width: 15, height: "100%", background: "rgba(255, 255, 255, 0.1)", marginLeft: 4 }} />
            <div style={{ width: 15, height: "100%", background: "rgba(255, 255, 255, 0.1)", marginLeft: 4 }} />
          </div>
        </div>

        {/* Palmera */}
        <Palmera style={{ left: 740, bottom: 20, zIndex: 7 }} />

        {/* Torre moderna 2 copy */}
        <div style={{ position: "absolute", left: 840, bottom: 20, width: 50, height: 130, background: "#0a3a6a" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 8px)", gap: "8px 4px", padding: "10px 7px" }}>
            {Array.from({ length: 21 }).map((_, idx) => (
              <div key={idx} style={{ width: 8, height: 10, background: "#b0d4ff" }} />
            ))}
          </div>
        </div>

        {/* Palmera */}
        <Palmera style={{ left: 950, bottom: 20, zIndex: 7 }} />

        {/* Iguanas */}
        <Iguana style={{ left: 200, bottom: -20, zIndex: 12 }} />
        <Iguana style={{ left: 700, bottom: -20, zIndex: 12 }} />
      </div>

      {/* Ground Layer */}
      {/* Vereda malecón */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 35,
        height: 30,
        background: "#c8a855",
        borderBottom: "2px solid #a88835"
      }} />
      {/* Calle */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 35,
        background: "#444"
      }} />
      </ParallaxStrip>

      <ParallaxStrip offset={layer3Offset} style={{ bottom: 0, height: 100, zIndex: 3 }}>
        <GuayaquilForeground />
      </ParallaxStrip>
    </div>
  );
}

function Palmera({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 60, height: 75, ...style }}>
      {/* Trunk */}
      <div style={{
        position: "absolute",
        left: 20,
        bottom: 0,
        width: 8,
        height: 50,
        background: "#8b6914",
        transform: "rotate(5deg)",
        transformOrigin: "bottom center"
      }}>
        {/* Leaves */}
        <div style={{ position: "absolute", top: 0, left: 4 }}>
          <div style={{ position: "absolute", width: 30, height: 6, background: "#2d8a2d", transform: "rotate(0deg)", transformOrigin: "left center" }} />
          <div style={{ position: "absolute", width: 30, height: 6, background: "#2d8a2d", transform: "rotate(45deg)", transformOrigin: "left center" }} />
          <div style={{ position: "absolute", width: 30, height: 6, background: "#2d8a2d", transform: "rotate(90deg)", transformOrigin: "left center" }} />
          <div style={{ position: "absolute", width: 30, height: 6, background: "#2d8a2d", transform: "rotate(135deg)", transformOrigin: "left center" }} />
        </div>
      </div>
    </div>
  );
}

function Iguana({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 24, height: 10, ...style }}>
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 3, height: 2, background: "#4a8a2a" }} />
      <div style={{ position: "absolute", left: 3, bottom: 0, width: 3, height: 4, background: "#4a8a2a" }} />
      <div style={{ position: "absolute", left: 6, bottom: 0, width: 3, height: 6, background: "#4a8a2a" }} />
      <div style={{ position: "absolute", left: 9, bottom: 0, width: 10, height: 8, background: "#4a8a2a" }} />
      <div style={{ position: "absolute", left: 17, bottom: 2, width: 7, height: 7, background: "#3d7222" }} />
    </div>
  );
}

// --------------------------------------------------
// CITY 2: CUENCA
// --------------------------------------------------
function CuencaFarBg() {
  return (
    <>
      {[100, 350].map((left) => (
        <div key={left} style={{ position: "absolute", left, bottom: 0, width: "25vw", height: "15vh", background: "#1a4a1a", opacity: 0.4, clipPath: "polygon(0% 100%, 40% 30%, 100% 100%)" }} />
      ))}
    </>
  );
}

function CuencaForeground() {
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 35, height: "2vmin", background: "#4a9eff", animation: "waveShift 1.5s steps(3) infinite", willChange: "transform" }} />
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: i * 12, bottom: 35, width: "3vmin", height: "1vmin", background: "#d4c090", borderRight: "0.1vmin solid #b4a070" }} />
      ))}
    </>
  );
}

function CuencaScene({
  isPaused,
  layer1Offset,
  layer2Offset,
  layer3Offset,
}: { isPaused: boolean } & ParallaxOffsets) {
  const animStyle = isPaused ? { animationPlayState: "paused" } : {};
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#87ceeb" }}>
      <SkyLayers top="#87ceeb" mid="#b0e0ff" bottom="#e0f4ff" />

      <ParallaxStrip offset={layer1Offset} style={{ bottom: 65, height: "28vh" }}>
        <CuencaFarBg />
      </ParallaxStrip>

      <ParallaxStrip offset={layer2Offset} style={{ bottom: 0, height: 280 }}>
      {/* Río Tomebamba */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 65,
        height: 15,
        background: "#4a9eff",
        overflow: "hidden"
      }}>
        <div
          style={{
            width: "200%",
            height: "100%",
            display: "flex",
            animation: "wave-flow 2s steps(4) infinite",
            willChange: "transform",
            ...animStyle,
          }}
        >
          {Array.from({ length: 150 }).map((_, idx) => (
            <div key={idx} style={{
              width: 15,
              height: "100%",
              background: idx % 2 === 0 ? "transparent" : "#87ceeb",
              flexShrink: 0
            }} />
          ))}
        </div>
      </div>

      {/* Buildings Layer */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 65, height: 180 }}>
        {/* Catedral Inmaculada */}
        <div style={{ position: "absolute", left: 80, bottom: 0, width: 120, height: 160 }}>
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 20, height: 140, background: "#d4c090" }} />
          <div style={{ position: "absolute", right: 0, bottom: 0, width: 20, height: 140, background: "#d4c090" }} />
          <div style={{ position: "absolute", left: 20, bottom: 0, width: 80, height: 100, background: "#e8d5b0" }}>
            <div style={{ position: "absolute", left: 30, bottom: 50, width: 20, height: 20, background: "#87ceeb", border: "3px solid #ffd700" }} />
            <div style={{ position: "absolute", left: 30, bottom: 0, width: 20, height: 30, background: "#8b4513" }} />
            <div style={{ position: "absolute", left: 30, bottom: 30, width: 20, height: 10, background: "#8b4513" }} />
          </div>
          <div style={{ position: "absolute", left: 20, bottom: 100, width: 24, height: 16, background: "#4a7abf", border: "2px solid #ffd700", borderBottom: "none", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
          <div style={{ position: "absolute", left: 45, bottom: 100, width: 30, height: 20, background: "#4a7abf", border: "3px solid #ffd700", borderBottom: "none", zIndex: 2, clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
          <div style={{ position: "absolute", left: 76, bottom: 100, width: 24, height: 16, background: "#4a7abf", border: "2px solid #ffd700", borderBottom: "none", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
        </div>

        {/* Casa colonial balcón */}
        <div style={{ position: "absolute", left: 240, bottom: 0, width: 70, height: 80, background: "#f5e6c8" }}>
          {/* Techo */}
          <div style={{ position: "absolute", top: -18, left: 0, width: 0, height: 0, borderLeft: "35px solid transparent", borderRight: "35px solid transparent", borderBottom: "18px solid #bb3333" }} />
          {/* Balcón */}
          <div style={{ position: "absolute", left: 10, bottom: 30, width: 50, height: 10, background: "#8b6914" }}>
            <div style={{ position: "absolute", left: 4, bottom: 10, width: 4, height: 12, background: "#8b6914" }} />
            <div style={{ position: "absolute", left: 16, bottom: 10, width: 4, height: 12, background: "#8b6914" }} />
            <div style={{ position: "absolute", left: 28, bottom: 10, width: 4, height: 12, background: "#8b6914" }} />
            <div style={{ position: "absolute", left: 40, bottom: 10, width: 4, height: 12, background: "#8b6914" }} />
            <div style={{ position: "absolute", left: 8, bottom: 22, width: 6, height: 6, background: "#ff6b9d" }} />
            <div style={{ position: "absolute", left: 22, bottom: 22, width: 6, height: 6, background: "#ff4444" }} />
            <div style={{ position: "absolute", left: 34, bottom: 22, width: 6, height: 6, background: "#ffaa00" }} />
          </div>
        </div>

        {/* Puente colonial */}
        <div style={{ position: "absolute", left: 340, bottom: 0, width: 80, height: 20, background: "#c8a855" }}>
          <div style={{ position: "absolute", left: 0, top: -6, width: 80, height: 6, background: "#c8a855" }} />
          <div style={{ position: "absolute", left: 5, bottom: -10, width: 20, height: 10, borderTop: "4px solid #a08840" }} />
          <div style={{ position: "absolute", left: 30, bottom: -10, width: 20, height: 10, borderTop: "4px solid #a08840" }} />
          <div style={{ position: "absolute", left: 55, bottom: -10, width: 20, height: 10, borderTop: "4px solid #a08840" }} />
        </div>

        {/* Tranvía */}
        <div style={{ position: "absolute", left: 460, bottom: -53, width: 80, height: 30, background: "#cc6600", zIndex: 10 }}>
          {/* Franjas */}
          <div style={{ position: "absolute", left: 0, top: 20, width: 80, height: 2, background: "#ffd700" }} />
          <div style={{ position: "absolute", left: 0, top: 24, width: 80, height: 2, background: "#ffd700" }} />
          {/* Ventanas */}
          <div style={{ position: "absolute", left: 6, top: 4, display: "flex", gap: 4 }}>
            <div style={{ width: 10, height: 12, background: "#87ceeb" }} />
            <div style={{ width: 10, height: 12, background: "#87ceeb" }} />
            <div style={{ width: 10, height: 12, background: "#87ceeb" }} />
            <div style={{ width: 10, height: 12, background: "#87ceeb" }} />
            <div style={{ width: 10, height: 12, background: "#87ceeb" }} />
          </div>
          {/* Ruedas */}
          <div style={{ position: "absolute", left: 15, bottom: -5, width: 10, height: 10, background: "#333", borderRadius: "50%" }} />
          <div style={{ position: "absolute", right: 15, bottom: -5, width: 10, height: 10, background: "#333", borderRadius: "50%" }} />
          {/* Pantógrafo */}
          <div style={{ position: "absolute", left: 38, top: -10, width: 15, height: 1, background: "#333", transform: "rotate(-30deg)", transformOrigin: "left center" }} />
          <div style={{ position: "absolute", left: 43, top: -17, width: 10, height: 1, background: "#333" }} />
        </div>

        {/* Catedral Inmaculada copy */}
        <div style={{ position: "absolute", left: 580, bottom: 0, width: 120, height: 160 }}>
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 20, height: 140, background: "#d4c090" }} />
          <div style={{ position: "absolute", right: 0, bottom: 0, width: 20, height: 140, background: "#d4c090" }} />
          <div style={{ position: "absolute", left: 20, bottom: 0, width: 80, height: 100, background: "#e8d5b0" }}>
            <div style={{ position: "absolute", left: 30, bottom: 50, width: 20, height: 20, background: "#87ceeb", border: "3px solid #ffd700" }} />
            <div style={{ position: "absolute", left: 30, bottom: 0, width: 20, height: 30, background: "#8b4513" }} />
            <div style={{ position: "absolute", left: 30, bottom: 30, width: 20, height: 10, background: "#8b4513" }} />
          </div>
          <div style={{ position: "absolute", left: 20, bottom: 100, width: 24, height: 16, background: "#4a7abf", border: "2px solid #ffd700", borderBottom: "none", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
          <div style={{ position: "absolute", left: 45, bottom: 100, width: 30, height: 20, background: "#4a7abf", border: "3px solid #ffd700", borderBottom: "none", zIndex: 2, clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
          <div style={{ position: "absolute", left: 76, bottom: 100, width: 24, height: 16, background: "#4a7abf", border: "2px solid #ffd700", borderBottom: "none", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
        </div>

        {/* Casa colonial balcón copy */}
        <div style={{ position: "absolute", left: 740, bottom: 0, width: 70, height: 80, background: "#f5e6c8" }}>
          <div style={{ position: "absolute", top: -18, left: 0, width: 0, height: 0, borderLeft: "35px solid transparent", borderRight: "35px solid transparent", borderBottom: "18px solid #bb3333" }} />
          <div style={{ position: "absolute", left: 10, bottom: 30, width: 50, height: 10, background: "#8b6914" }}>
            <div style={{ position: "absolute", left: 4, bottom: 10, width: 4, height: 12, background: "#8b6914" }} />
            <div style={{ position: "absolute", left: 16, bottom: 10, width: 4, height: 12, background: "#8b6914" }} />
            <div style={{ position: "absolute", left: 28, bottom: 10, width: 4, height: 12, background: "#8b6914" }} />
            <div style={{ position: "absolute", left: 40, bottom: 10, width: 4, height: 12, background: "#8b6914" }} />
            <div style={{ position: "absolute", left: 8, bottom: 22, width: 6, height: 6, background: "#ff6b9d" }} />
            <div style={{ position: "absolute", left: 22, bottom: 22, width: 6, height: 6, background: "#ff4444" }} />
            <div style={{ position: "absolute", left: 34, bottom: 22, width: 6, height: 6, background: "#ffaa00" }} />
          </div>
        </div>

        {/* Casa colonial balcón copy 2 */}
        <div style={{ position: "absolute", left: 850, bottom: 0, width: 70, height: 80, background: "#f5e6c8" }}>
          <div style={{ position: "absolute", top: -18, left: 0, width: 0, height: 0, borderLeft: "35px solid transparent", borderRight: "35px solid transparent", borderBottom: "18px solid #bb3333" }} />
          <div style={{ position: "absolute", left: 10, bottom: 30, width: 50, height: 10, background: "#8b6914" }}>
            <div style={{ position: "absolute", left: 4, bottom: 10, width: 4, height: 12, background: "#8b6914" }} />
            <div style={{ position: "absolute", left: 16, bottom: 10, width: 4, height: 12, background: "#8b6914" }} />
            <div style={{ position: "absolute", left: 28, bottom: 10, width: 4, height: 12, background: "#8b6914" }} />
            <div style={{ position: "absolute", left: 40, bottom: 10, width: 4, height: 12, background: "#8b6914" }} />
            <div style={{ position: "absolute", left: 8, bottom: 22, width: 6, height: 6, background: "#ff6b9d" }} />
            <div style={{ position: "absolute", left: 22, bottom: 22, width: 6, height: 6, background: "#ff4444" }} />
            <div style={{ position: "absolute", left: 34, bottom: 22, width: 6, height: 6, background: "#ffaa00" }} />
          </div>
        </div>

        {/* Puente colonial copy */}
        <div style={{ position: "absolute", left: 960, bottom: 0, width: 80, height: 20, background: "#c8a855" }}>
          <div style={{ position: "absolute", left: 0, top: -6, width: 80, height: 6, background: "#c8a855" }} />
          <div style={{ position: "absolute", left: 5, bottom: -10, width: 20, height: 10, borderTop: "4px solid #a08840" }} />
          <div style={{ position: "absolute", left: 30, bottom: -10, width: 20, height: 10, borderTop: "4px solid #a08840" }} />
          <div style={{ position: "absolute", left: 55, bottom: -10, width: 20, height: 10, borderTop: "4px solid #a08840" }} />
        </div>
      </div>

      {/* Ground Layer */}
      {/* Vereda */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 35,
        height: 30,
        background: "#d4c090",
        borderBottom: "2px solid #b4a070"
      }} />
      {/* Calle */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 35,
        background: "#666"
      }}>
        {/* Tranvía track lines */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 12, height: 2, background: "#888" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 20, height: 2, background: "#888" }} />
      </div>
      </ParallaxStrip>

      <ParallaxStrip offset={layer3Offset} style={{ bottom: 0, height: 80, zIndex: 3 }}>
        <CuencaForeground />
      </ParallaxStrip>
    </div>
  );
}

// --------------------------------------------------
// CITY 3: SALINAS
// --------------------------------------------------
function SalinasFarBg() {
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: "55%", height: "0.4vmin", background: "#0097a7" }} />
      {[120, 400, 650].map((left) => (
        <div key={left} style={{ position: "absolute", left, top: "52%", width: "5vmin", height: "2vmin", background: "#1a3a6a" }} />
      ))}
    </>
  );
}

function SalinasForeground() {
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "4vmin", background: "#f5deb3" }}>
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: i * 10, top: "50%", width: "0.4vmin", height: "0.4vmin", background: "#e8c89a" }} />
        ))}
      </div>
      {[80, 200, 350, 520].map((left) => (
        <div key={left} style={{ position: "absolute", left, bottom: "1vmin", width: "0.5vmin", height: "0.3vmin", background: "#fff" }} />
      ))}
    </>
  );
}

function SalinasScene({
  isPaused,
  layer1Offset,
  layer2Offset,
  layer3Offset,
}: { isPaused: boolean } & ParallaxOffsets) {
  const animStyle = isPaused ? { animationPlayState: "paused" } : {};
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#4dd0e1" }}>
      <SkyLayers top="#00bcd4" mid="#4dd0e1" bottom="#b2ebf2" />
      <SalinasSkyWaves />

      <ParallaxStrip offset={layer1Offset} style={{ bottom: 65, height: "30vh" }}>
        <SalinasFarBg />
      </ParallaxStrip>

      <ParallaxStrip offset={layer2Offset} style={{ bottom: 0, height: 300 }}>
      {/* Olas pixel art — rectángulos escalonados */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 65,
          height: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          zIndex: 1,
          overflow: "hidden",
        }}
      >
        {[0, 4, 8].map((offsetX) => (
          <div
            key={offsetX}
            style={{
              display: "flex",
              height: 4,
              transform: `translateX(${offsetX}px)`,
              animation: "wave-flow 2s steps(4) infinite",
              willChange: "transform",
              ...animStyle,
            }}
          >
            {Array.from({ length: 80 }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: 12,
                  height: 4,
                  background: idx % 2 === 0 ? "#4dd0e1" : "#00bcd4",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Buildings Layer */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 65, height: 180 }}>
        {/* Barco pesquero */}
        <Barco style={{ left: 80, bottom: 0, zIndex: 1 }} />

        {/* Edificio apartamentos 1 */}
        <div style={{ position: "absolute", left: 200, bottom: 0, width: 70, height: 150, background: "#e8e0d0" }}>
          {Array.from({ length: 5 }).map((_, f) => {
            const floorBottom = f * 28 + 10;
            return (
              <div key={f} style={{ position: "absolute", left: 0, right: 0, bottom: floorBottom, height: 25 }}>
                <div style={{ position: "absolute", left: 10, bottom: 6, width: 16, height: 16, background: "#87ceeb" }} />
                <div style={{ position: "absolute", right: 10, bottom: 6, width: 16, height: 16, background: "#87ceeb" }} />
                <div style={{ position: "absolute", left: 5, bottom: 0, width: 60, height: 8, background: "#c0b890", zIndex: 2 }}>
                  <div style={{ position: "absolute", left: 8, top: -4, width: 4, height: 4, background: "#2d8a2d" }} />
                  <div style={{ position: "absolute", right: 12, top: -4, width: 4, height: 4, background: "#2d8a2d" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Palmera playa */}
        <PalmeraSalinas style={{ left: 300, bottom: 0, zIndex: 5 }} />

        {/* Kiosko ceviche */}
        <div style={{ position: "absolute", left: 400, bottom: 0, width: 60, height: 40 }}>
          <div style={{ position: "absolute", left: 0, bottom: 0, width: 60, height: 15, background: "#8b6914" }} />
          <div style={{ position: "absolute", left: 10, bottom: 15, width: 40, height: 12, background: "#ff4444", border: "1px solid #fff", color: "#fff", fontSize: "6px", fontFamily: "monospace", display: "flex", alignItems: "center", justifyContent: "center" }}>
            CEVICHE
          </div>
          <div style={{ position: "absolute", left: -10, bottom: 30, width: 80, height: 25, background: "#ff6b35", clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
        </div>

        {/* Edificio apartamentos 2 */}
        <div style={{ position: "absolute", left: 520, bottom: 0, width: 55, height: 110, background: "#f0ead0" }}>
          {Array.from({ length: 4 }).map((_, f) => {
            const floorBottom = f * 24 + 8;
            return (
              <div key={f} style={{ position: "absolute", left: 0, right: 0, bottom: floorBottom, height: 20 }}>
                <div style={{ position: "absolute", left: 8, bottom: 5, width: 12, height: 12, background: "#87ceeb" }} />
                <div style={{ position: "absolute", right: 8, bottom: 5, width: 12, height: 12, background: "#87ceeb" }} />
                <div style={{ position: "absolute", left: 5, bottom: 0, width: 45, height: 6, background: "#c0b890", zIndex: 2 }}>
                  <div style={{ position: "absolute", left: 6, top: -3, width: 3, height: 3, background: "#2d8a2d" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Barco pesquero copy */}
        <Barco style={{ left: 640, bottom: 0, zIndex: 1 }} />

        {/* Palmera playa */}
        <PalmeraSalinas style={{ left: 760, bottom: 0, zIndex: 5 }} />

        {/* Edificio apartamentos 1 copy */}
        <div style={{ position: "absolute", left: 860, bottom: 0, width: 70, height: 150, background: "#e8e0d0" }}>
          {Array.from({ length: 5 }).map((_, f) => {
            const floorBottom = f * 28 + 10;
            return (
              <div key={f} style={{ position: "absolute", left: 0, right: 0, bottom: floorBottom, height: 25 }}>
                <div style={{ position: "absolute", left: 10, bottom: 6, width: 16, height: 16, background: "#87ceeb" }} />
                <div style={{ position: "absolute", right: 10, bottom: 6, width: 16, height: 16, background: "#87ceeb" }} />
                <div style={{ position: "absolute", left: 5, bottom: 0, width: 60, height: 8, background: "#c0b890", zIndex: 2 }}>
                  <div style={{ position: "absolute", left: 8, top: -4, width: 4, height: 4, background: "#2d8a2d" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Palmera playa */}
        <PalmeraSalinas style={{ left: 980, bottom: 0, zIndex: 5 }} />
      </div>

      {/* Ground Layer */}
      {/* Arena */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 35,
        background: "#f5deb3"
      }}>
        {/* Sand lines */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          gap: 14
        }}>
          {Array.from({ length: 150 }).map((_, idx) => (
            <div key={idx} style={{
              width: 1,
              height: "100%",
              background: "#e8c89a",
              flexShrink: 0
            }} />
          ))}
        </div>
        
        {/* Mar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            background: "#00bcd4",
            animation: "tide 3s steps(4) infinite alternate",
            ...animStyle,
          }}
        />
      </div>
      </ParallaxStrip>

      <ParallaxStrip offset={layer3Offset} style={{ bottom: 0, height: 80, zIndex: 4 }}>
        <SalinasForeground />
      </ParallaxStrip>
    </div>
  );
}

function PalmeraSalinas({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 60, height: 75, ...style }}>
      <div style={{
        position: "absolute",
        left: 20,
        bottom: 0,
        width: 8,
        height: 50,
        background: "#8b6914",
        transform: "rotate(15deg)",
        transformOrigin: "bottom center"
      }}>
        <div style={{ position: "absolute", top: 0, left: 4 }}>
          <div style={{ position: "absolute", width: 30, height: 6, background: "#2d8a2d", transform: "rotate(0deg)", transformOrigin: "left center" }} />
          <div style={{ position: "absolute", width: 30, height: 6, background: "#2d8a2d", transform: "rotate(45deg)", transformOrigin: "left center" }} />
          <div style={{ position: "absolute", width: 30, height: 6, background: "#2d8a2d", transform: "rotate(90deg)", transformOrigin: "left center" }} />
          <div style={{ position: "absolute", width: 30, height: 6, background: "#2d8a2d", transform: "rotate(135deg)", transformOrigin: "left center" }} />
        </div>
      </div>
    </div>
  );
}

function Barco({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 80, height: 75, ...style }}>
      {/* Flag */}
      <div style={{ position: "absolute", left: 10, top: 5, width: 15, height: 18 }}>
        <div style={{ width: 15, height: 6, background: "#ffd700" }} />
        <div style={{ width: 15, height: 6, background: "#1a3a8a" }} />
        <div style={{ width: 15, height: 6, background: "#cc0000" }} />
      </div>
      {/* Mast */}
      <div style={{ position: "absolute", left: 25, bottom: 25, width: 3, height: 35, background: "#8b6914" }} />
      {/* Cabin */}
      <div style={{ position: "absolute", left: 35, bottom: 25, width: 25, height: 20, background: "#ffffff", border: "1px solid #333" }}>
        <div style={{ position: "absolute", left: 5, top: 4, width: 8, height: 8, background: "#87ceeb" }} />
      </div>
      {/* Hull */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 80,
          height: 30,
          background: "#1a3a6a",
          clipPath: "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
        }}
      />
    </div>
  );
}

// --------------------------------------------------
// CITY 4: OTAVALO
// --------------------------------------------------
function OtavaloFarBg() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: "10%",
          bottom: 0,
          width: "30vw",
          height: "25vh",
          background: "#1a2a1a",
          clipPath: "polygon(20% 100%, 50% 5%, 80% 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "55%",
          bottom: 0,
          width: "28vw",
          height: "22vh",
          background: "#1a2a1a",
          clipPath: "polygon(20% 100%, 50% 5%, 80% 100%)",
          opacity: 0.85,
        }}
      />
    </>
  );
}

function OtavaloForeground() {
  return (
    <>
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: i * 20 + (i % 3) * 5,
            bottom: 35 + (i % 2) * 4,
            width: "0.3vmin",
            height: "0.8vmin",
            background: "#2d8a2d",
          }}
        />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`stone-${i}`}
          style={{
            position: "absolute",
            left: i * 50 + 20,
            bottom: 32,
            width: "0.8vmin",
            height: "0.8vmin",
            background: "#5a4a2a",
          }}
        />
      ))}
    </>
  );
}

function OtavaloScene({ layer1Offset, layer2Offset, layer3Offset }: ParallaxOffsets) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#c44dff" }}>
      <SkyLayers top="#ff6b9d" mid="#c44dff" bottom="#7b2fff" />
      <OtavaloStars />

      <ParallaxStrip offset={layer1Offset} style={{ bottom: 65, height: "35vh" }}>
        <OtavaloFarBg />
      </ParallaxStrip>

      <ParallaxStrip offset={layer2Offset} style={{ bottom: 0, height: 280 }}>
      {/* Volcán Imbabura 1 */}
      <div style={{ position: "absolute", left: 100, bottom: 65, width: 200, height: 120, zIndex: 0 }}>
        <div style={{
          width: 0,
          height: 0,
          borderLeft: "100px solid transparent",
          borderRight: "100px solid transparent",
          borderBottom: "120px solid #2d4a1a"
        }} />
        <div style={{
          position: "absolute",
          left: 80,
          top: 0,
          width: 0,
          height: 0,
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderBottom: "20px solid #f0f0f0"
        }} />
      </div>

      {/* Volcán Imbabura 2 */}
      <div style={{ position: "absolute", left: 600, bottom: 65, width: 200, height: 120, zIndex: 0 }}>
        <div style={{
          width: 0,
          height: 0,
          borderLeft: "100px solid transparent",
          borderRight: "100px solid transparent",
          borderBottom: "120px solid #2d4a1a"
        }} />
        <div style={{
          position: "absolute",
          left: 80,
          top: 0,
          width: 0,
          height: 0,
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderBottom: "20px solid #f0f0f0"
        }} />
      </div>

      {/* Lago San Pablo */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 65,
        height: 25,
        background: "#1a4a8a",
        opacity: 0.8,
        zIndex: 1
      }}>
        <div style={{
          width: "100%",
          height: "100%",
          background: "rgba(123, 47, 255, 0.3)"
        }} />
      </div>

      {/* Buildings Layer */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 65, height: 180, zIndex: 2 }}>
        {/* Plaza de Ponchos toldo 1 */}
        <Toldo1 style={{ left: 80, bottom: 0 }} />

        {/* Vendedor poncho */}
        <VendedorPoncho style={{ left: 175, bottom: -10, zIndex: 10 }} />

        {/* Casa andina */}
        <div style={{ position: "absolute", left: 240, bottom: 0, width: 65, height: 65, background: "#d4a870" }}>
          <div style={{
            position: "absolute",
            top: -18,
            left: 0,
            width: 0,
            height: 0,
            borderLeft: "32.5px solid transparent",
            borderRight: "32.5px solid transparent",
            borderBottom: "18px solid #8b4513"
          }} />
          <div style={{ position: "absolute", left: 24.5, top: 15, width: 16, height: 16, background: "#87ceeb", border: "1px solid #5a3a1a" }}>
            <div style={{ position: "absolute", left: -4, top: 4, width: 5, height: 5, background: "#ff6b9d" }} />
            <div style={{ position: "absolute", right: -4, top: 4, width: 5, height: 5, background: "#ff6b9d" }} />
            <div style={{ position: "absolute", left: 5, top: -4, width: 5, height: 5, background: "#ff6b9d" }} />
          </div>
        </div>

        {/* Toldo 2 */}
        <Toldo2 style={{ left: 350, bottom: 0 }} />

        {/* Toldo 3 */}
        <Toldo3 style={{ left: 480, bottom: 0 }} />

        {/* Toldo 1 copy */}
        <Toldo1 style={{ left: 700, bottom: 0 }} />

        {/* Vendedor poncho copy */}
        <VendedorPoncho style={{ left: 795, bottom: -10, zIndex: 10 }} />

        {/* Casa andina copy */}
        <div style={{ position: "absolute", left: 860, bottom: 0, width: 65, height: 65, background: "#d4a870" }}>
          <div style={{
            position: "absolute",
            top: -18,
            left: 0,
            width: 0,
            height: 0,
            borderLeft: "32.5px solid transparent",
            borderRight: "32.5px solid transparent",
            borderBottom: "18px solid #8b4513"
          }} />
          <div style={{ position: "absolute", left: 24.5, top: 15, width: 16, height: 16, background: "#87ceeb", border: "1px solid #5a3a1a" }}>
            <div style={{ position: "absolute", left: -4, top: 4, width: 5, height: 5, background: "#ff6b9d" }} />
            <div style={{ position: "absolute", right: -4, top: 4, width: 5, height: 5, background: "#ff6b9d" }} />
          </div>
        </div>

        {/* Toldo 3 copy */}
        <Toldo3 style={{ left: 980, bottom: 0 }} />
      </div>

      {/* Ground Layer */}
      {/* Tierra andina */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 35,
        height: 30,
        background: "#8b6914",
        overflow: "hidden"
      }}>
        {Array.from({ length: 15 }).map((_, g) => (
          <div key={g} style={{
            position: "absolute",
            left: g * 80 + (g % 2 ? 15 : 45),
            bottom: (g % 3) * 6,
            width: 3,
            height: 6,
            background: "#2d8a2d"
          }} />
        ))}
      </div>

      {/* Calle empedrada */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 35,
        background: "#6b5a3a"
      }}>
        {Array.from({ length: 20 }).map((_, s) => (
          <div key={s} style={{
            position: "absolute",
            left: s * 60 + (s % 2 ? 10 : 30),
            top: (s % 3) * 8 + 4,
            width: 8,
            height: 8,
            background: "#5a4a2a"
          }} />
        ))}
      </div>
      </ParallaxStrip>

      <ParallaxStrip offset={layer3Offset} style={{ bottom: 0, height: 80, zIndex: 3 }}>
        <OtavaloForeground />
      </ParallaxStrip>
    </div>
  );
}

function Toldo1({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 80, height: 45, ...style }}>
      <div style={{ position: "absolute", left: 10, bottom: 0, width: 5, height: 30, background: "#8b6914" }} />
      <div style={{ position: "absolute", left: 65, bottom: 0, width: 5, height: 30, background: "#8b6914" }} />
      <div style={{ position: "absolute", left: 18, bottom: 0, display: "flex", gap: 3 }}>
        <div style={{ width: 12, height: 10, background: "#ff6b9d" }} />
        <div style={{ width: 12, height: 10, background: "#ffd700" }} />
        <div style={{ width: 12, height: 10, background: "#4a9eff" }} />
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 30, width: 80, height: 15, background: "#ff6b35" }} />
    </div>
  );
}

function Toldo2({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 70, height: 45, ...style }}>
      <div style={{ position: "absolute", left: 8, bottom: 0, width: 5, height: 30, background: "#8b6914" }} />
      <div style={{ position: "absolute", left: 57, bottom: 0, width: 5, height: 30, background: "#8b6914" }} />
      <div style={{ position: "absolute", left: 16, bottom: 0, display: "flex", gap: 3 }}>
        <div style={{ width: 11, height: 10, background: "#ffd700" }} />
        <div style={{ width: 11, height: 10, background: "#4a9eff" }} />
        <div style={{ width: 11, height: 10, background: "#ff6b9d" }} />
      </div>
      <div style={{ position: "absolute", left: 0, bottom: 30, width: 70, height: 15, background: "#cc0000" }} />
    </div>
  );
}

function Toldo3({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 90, height: 45, ...style }}>
      <div style={{ position: "absolute", left: 12, bottom: 0, width: 5, height: 30, background: "#8b6914" }} />
      <div style={{ position: "absolute", left: 73, bottom: 0, width: 5, height: 30, background: "#8b6914" }} />
      <div style={{ position: "absolute", left: 22, bottom: 0, display: "flex", gap: 4 }}>
        <div style={{ width: 13, height: 10, background: "#ff6b9d" }} />
        <div style={{ width: 13, height: 10, background: "#ffd700" }} />
        <div style={{ width: 13, height: 10, background: "#4a9eff" }} />
      </div>
      <div style={{
        position: "absolute",
        left: 0,
        bottom: 30,
        width: 90,
        height: 15,
        display: "flex",
        overflow: "hidden"
      }}>
        {Array.from({ length: 9 }).map((_, idx) => (
          <div key={idx} style={{
            width: 10,
            height: 15,
            background: idx % 2 === 0 ? "#ffd700" : "#cc0000",
            flexShrink: 0
          }} />
        ))}
      </div>
    </div>
  );
}

function VendedorPoncho({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{ position: "absolute", width: 28, height: 35, ...style }}>
      <div style={{ position: "absolute", left: 8, top: 10, width: 12, height: 8, background: "#1a1a1a" }} />
      <div style={{ position: "absolute", left: 6, bottom: 0, width: 16, height: 20, background: "#cc3300" }}>
        <div style={{ position: "absolute", left: 0, top: 8, width: 16, height: 4, background: "#ffd700" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 6, width: 28, height: 4, background: "#8b6914" }} />
      <div style={{ position: "absolute", left: 4, top: 0, width: 20, height: 6, background: "#8b6914" }} />
    </div>
  );
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------
export default function ScrollingBackground({
  offset,
  isPaused,
  mode,
  cityIndex = 0,
  isTransitioning = false,
  transitionPhase = null,
}: ScrollingBackgroundProps) {
  void mode;
  const [showBanner, setShowBanner] = useState(true);
  const [innerWidth, setInnerWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setInnerWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setShowBanner(true);
    const timer = setTimeout(() => {
      setShowBanner(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [cityIndex]);

  const layer1Offset = offset * 0.3;
  const layer2Offset = offset * 1.0;
  const layer3Offset = offset * 1.5;
  const x = -(layer2Offset % innerWidth);

  const parallax: ParallaxOffsets = { layer1Offset, layer2Offset, layer3Offset };

  function getCityText(index: number) {
    switch (index) {
      case 0: return "→ QUITO  2850m";
      case 1: return "→ GUAYAQUIL  0m";
      case 2: return "→ CUENCA  2560m";
      case 3: return "→ SALINAS  2m";
      case 4: return "→ OTAVALO  2530m";
      default: return "";
    }
  }

  function renderCity(index: number) {
    switch (index) {
      case 0:
        return <QuitoScene {...parallax} />;
      case 1:
        return <GuayaquilScene isPaused={isPaused} {...parallax} />;
      case 2:
        return <CuencaScene isPaused={isPaused} {...parallax} />;
      case 3:
        return <SalinasScene isPaused={isPaused} {...parallax} />;
      case 4:
        return <OtavaloScene {...parallax} />;
      default:
        return <QuitoScene {...parallax} />;
    }
  }

  const hiddenDuringFlash = isTransitioning && transitionPhase === "flash";

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        opacity: hiddenDuringFlash ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        @keyframes signIn {
          0% { opacity: 0; transform: translateX(100px); }
          20% { opacity: 1; transform: translateX(0); }
          80% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-100px); }
        }
        @keyframes wave-flow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-20px); }
        }
        @keyframes tide {
          0% { height: 10px; }
          100% { height: 18px; }
        }
      `}</style>

      {/* Scrolling container */}
      <div
        style={{
          display: "flex",
          width: "200vw",
          height: "100%",
          transform: `translateX(${x}px)`,
          transition: "none",
          willChange: "transform",
        }}
      >
        <div style={{ width: "100vw", height: "100%", flexShrink: 0, position: "relative" }}>
          {renderCity(cityIndex)}
        </div>
        <div style={{ width: "100vw", height: "100%", flexShrink: 0, position: "relative" }}>
          {renderCity(cityIndex)}
        </div>
      </div>

      {/* Transition Banner */}
      {showBanner && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          pointerEvents: "none"
        }}>
          <div style={{
            background: "#0f0f1a",
            border: "4px solid #ffd700",
            boxShadow: "4px 4px 0 #000",
            padding: "12px 20px",
            fontFamily: "'Press Start 2P', monospace",
            color: "#ffd700",
            fontSize: "10px",
            whiteSpace: "nowrap",
            animation: "signIn 2s ease-in-out forwards"
          }}>
            {getCityText(cityIndex)}
          </div>
        </div>
      )}
    </div>
  );
}

export { ScrollingBackground };
