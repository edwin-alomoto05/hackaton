import type { CSSProperties } from "react";

const SPOTLIGHTS = [
  { left: "15%", delay: "0s" },
  { left: "30%", delay: "-0.5s" },
  { left: "65%", delay: "-1s" },
  { left: "80%", delay: "-1.5s" },
] as const;

function Curtain({ side }: { side: "left" | "right" }) {
  const stripes = Array.from({ length: 12 });
  const edgeStyle: CSSProperties =
    side === "left"
      ? { left: 0, borderRight: "0.4vmin solid #000" }
      : { right: 0, borderLeft: "0.4vmin solid #000" };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        width: "8vmin",
        height: "100%",
        background: "#cc0000",
        zIndex: 0,
        pointerEvents: "none",
        ...edgeStyle,
      }}
    >
      {stripes.map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: `${i * 3}vmin`,
            left: 0,
            width: "100%",
            height: "0.3vmin",
            background: "#aa0000",
          }}
        />
      ))}
    </div>
  );
}

export function StadiumDecor() {
  return (
    <>
      <Curtain side="left" />
      <Curtain side="right" />
      {SPOTLIGHTS.map((spot, i) => (
        <div key={i} style={{ position: "absolute", top: 0, left: spot.left, zIndex: 0, pointerEvents: "none" }}>
          <div
            className="stadium-spotlight"
            style={{
              width: "4vmin",
              height: "3vmin",
              background: "#fde047",
              opacity: 0.6,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              animationDelay: spot.delay,
              willChange: "opacity",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "3vmin",
              left: "50%",
              transform: "translateX(-50%)",
              width: "20vmin",
              height: "50vh",
              background: "#fde047",
              opacity: 0.05,
              clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)",
            }}
          />
        </div>
      ))}
    </>
  );
}
