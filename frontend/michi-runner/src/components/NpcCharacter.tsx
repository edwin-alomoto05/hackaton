import { useEffect, useState } from "react";

interface NpcCharacterProps {
  cityIndex: number;
  bgOffset: number;
  slot: number;
}

const BUBBLE_TEXT: Record<number, string> = {
  0: "?",
  1: "?",
  2: "?",
  3: "?",
  4: "?",
};

const BUBBLE_LABEL: Record<number, string> = {
  0: "NEWS",
  1: "FRUTA",
  2: "TEJIDO",
  3: "PESCA",
  4: "MUSICA",
};

function NpcVendorNews() {
  return (
    <div style={{ position: "relative", width: "5vmin", height: "8vmin" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "3vmin",
          transform: "translateX(-50%)",
          width: "2.5vmin",
          height: "3vmin",
          background: "#2255aa",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "5.8vmin",
          transform: "translateX(-50%)",
          width: "2vmin",
          height: "2vmin",
          background: "#f4a460",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "7.5vmin",
          transform: "translateX(-50%)",
          width: "2.5vmin",
          height: "0.5vmin",
          background: "#1a1a2e",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "7.8vmin",
          transform: "translateX(-50%)",
          width: "3vmin",
          height: "0.3vmin",
          background: "#1a1a2e",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: "-1vmin",
          bottom: "4vmin",
          width: "1.5vmin",
          height: "2vmin",
          background: "#f1f5f9",
          border: "0.2vmin solid #000",
        }}
      >
        <div style={{ position: "absolute", top: "0.4vmin", left: 0, right: 0, height: "0.1vmin", background: "#333" }} />
        <div style={{ position: "absolute", top: "0.9vmin", left: 0, right: 0, height: "0.1vmin", background: "#333" }} />
        <div style={{ position: "absolute", top: "1.4vmin", left: 0, right: 0, height: "0.1vmin", background: "#333" }} />
      </div>
      <div
        className="npc-legs"
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          transform: "translateX(-50%)",
          width: "2vmin",
          height: "0.5vmin",
          borderBottom: "0.8vmin solid #f4a460",
          borderLeft: "0.8vmin solid transparent",
          borderRight: "0.3vmin solid transparent",
        }}
      />
    </div>
  );
}

function NpcFruitVendor() {
  return (
    <div style={{ position: "relative", width: "5vmin", height: "9vmin" }}>
      <div style={{ position: "absolute", left: "50%", bottom: "3vmin", transform: "translateX(-50%)", width: "2.5vmin", height: "3vmin", background: "#ff6b35" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "5.8vmin", transform: "translateX(-50%)", width: "2vmin", height: "2vmin", background: "#8b6347" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "7.5vmin", transform: "translateX(-50%)", width: "2.5vmin", height: "0.4vmin", background: "#ffd700" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "8.2vmin", transform: "translateX(-50%)", width: "2vmin", height: "1.2vmin", background: "#8b6914" }}>
        <div style={{ position: "absolute", left: "0.2vmin", top: "0.2vmin", width: "0.6vmin", height: "0.6vmin", background: "#ff4444" }} />
        <div style={{ position: "absolute", left: "0.8vmin", top: "0.2vmin", width: "0.6vmin", height: "0.6vmin", background: "#ffd700" }} />
        <div style={{ position: "absolute", left: "1.4vmin", top: "0.2vmin", width: "0.6vmin", height: "0.6vmin", background: "#4ade80" }} />
      </div>
      <div className="npc-legs" style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)", width: "2vmin", height: "0.5vmin", borderBottom: "0.8vmin solid #8b6347", borderLeft: "0.8vmin solid transparent", borderRight: "0.3vmin solid transparent" }} />
    </div>
  );
}

function NpcArtisan() {
  return (
    <div style={{ position: "relative", width: "5vmin", height: "9vmin" }}>
      <div style={{ position: "absolute", left: "50%", bottom: "3vmin", transform: "translateX(-50%)", width: "2.5vmin", height: "3.5vmin", background: "#cc3300" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "4.5vmin", transform: "translateX(-50%)", width: "2.5vmin", height: "0.5vmin", background: "#ffd700" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "6.5vmin", transform: "translateX(-50%)", width: "2vmin", height: "2vmin", background: "#8b6347" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "8vmin", transform: "translateX(-50%)", width: "2.5vmin", height: "0.5vmin", background: "#8b6914" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "8.4vmin", transform: "translateX(-50%)", width: "3.5vmin", height: "0.3vmin", background: "#8b6914" }} />
      <div style={{ position: "absolute", right: "-1vmin", bottom: "4vmin", width: "1.5vmin", height: "1vmin", background: "#ffd700", border: "0.1vmin solid #cc3300" }} />
      <div className="npc-legs" style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)", width: "2vmin", height: "0.5vmin", borderBottom: "0.8vmin solid #8b6347", borderLeft: "0.8vmin solid transparent", borderRight: "0.3vmin solid transparent" }} />
    </div>
  );
}

function NpcFisher() {
  return (
    <div style={{ position: "relative", width: "6vmin", height: "9vmin" }}>
      <div style={{ position: "absolute", left: "50%", bottom: "3vmin", transform: "translateX(-50%)", width: "2.5vmin", height: "3vmin", background: "#1a4a8a" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "5.8vmin", transform: "translateX(-50%)", width: "2vmin", height: "2vmin", background: "#8b6347" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "7.5vmin", transform: "translateX(-50%)", width: "2.5vmin", height: "0.4vmin", background: "#ffd700" }} />
      <div style={{ position: "absolute", left: "1vmin", bottom: "5vmin", width: "0.2vmin", height: "4vmin", background: "#8b6914", transform: "rotateZ(-30deg)", transformOrigin: "bottom center" }} />
      <div style={{ position: "absolute", left: "0.5vmin", bottom: "8.5vmin", width: "0.1vmin", height: "2vmin", background: "#fff" }} />
      <div className="npc-legs" style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)", width: "2vmin", height: "0.5vmin", borderBottom: "0.8vmin solid #8b6347", borderLeft: "0.8vmin solid transparent", borderRight: "0.3vmin solid transparent" }} />
    </div>
  );
}

function NpcMusician() {
  const heights = ["1.4vmin", "1.2vmin", "1vmin", "0.8vmin", "0.6vmin"];
  return (
    <div style={{ position: "relative", width: "6vmin", height: "9vmin" }}>
      <div style={{ position: "absolute", left: "50%", bottom: "3vmin", transform: "translateX(-50%)", width: "2.5vmin", height: "3vmin", background: "#7b2fff" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "4.8vmin", transform: "translateX(-50%)", width: "2.5vmin", height: "0.4vmin", background: "#ffd700" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "5.8vmin", transform: "translateX(-50%)", width: "2vmin", height: "2vmin", background: "#8b6347" }} />
      <div style={{ position: "absolute", left: "50%", bottom: "7.5vmin", transform: "translateX(-50%)", width: "2.5vmin", height: "0.8vmin", background: "#1a1a2e" }} />
      <div style={{ position: "absolute", right: "-0.5vmin", bottom: "4vmin", display: "flex", alignItems: "flex-end", gap: "0.15vmin" }}>
        {heights.map((h, i) => (
          <div key={i} style={{ width: "0.3vmin", height: h, background: "#8b6914", border: "0.1vmin solid #000" }} />
        ))}
      </div>
      <div className="npc-legs" style={{ position: "absolute", left: "50%", bottom: 0, transform: "translateX(-50%)", width: "2vmin", height: "0.5vmin", borderBottom: "0.8vmin solid #8b6347", borderLeft: "0.8vmin solid transparent", borderRight: "0.3vmin solid transparent" }} />
    </div>
  );
}

function NpcBody({ npcType }: { npcType: number }) {
  switch (npcType % 5) {
    case 0:
      return <NpcVendorNews />;
    case 1:
      return <NpcFruitVendor />;
    case 2:
      return <NpcArtisan />;
    case 3:
      return <NpcFisher />;
    default:
      return <NpcMusician />;
  }
}

export function NpcCharacter({ cityIndex, bgOffset, slot }: NpcCharacterProps) {
  const [innerWidth, setInnerWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const onResize = () => setInnerWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const npcType = cityIndex % 5; // 5 tipos de NPC
  const worldX = 400 + slot * 550 + cityIndex * 100;
  const screenPx = ((worldX - bgOffset * 1) % (innerWidth + 400)) - 50;
  const screenVw = (screenPx / innerWidth) * 100;
  const michiVw = 15;
  const distance = Math.abs(screenVw - michiVw);

  let bubbleAnim = "bubbleFloat 1s steps(2) infinite";
  let bubbleBg = "#1a1a2e";
  let bubbleBorder = "#fde047";
  let bubbleText = BUBBLE_TEXT[npcType] ?? "?";
  let bubbleSize = "1.8vmin";

  if (distance < 25) {
    bubbleAnim = "bubbleUrgent 0.3s steps(2) infinite";
    bubbleBg = "#f87171";
    bubbleBorder = "#fff";
    bubbleText = "!!!";
    bubbleSize = "2.2vmin";
  } else if (distance < 40) {
    bubbleAnim = "bubblePulse 0.5s steps(2) infinite";
    bubbleBg = "#f8717122";
    bubbleBorder = "#f87171";
    bubbleText = "?!";
    bubbleSize = "2vmin";
  }

  if (screenVw < -5 || screenVw > 105) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: `${screenVw}vw`,
        bottom: "18%",
        zIndex: 5,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: "100%",
          transform: "translateX(-50%)",
          marginBottom: "1vmin",
          background: bubbleBg,
          border: `0.3vmin solid ${bubbleBorder}`,
          padding: "0.5vmin 1vmin",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: bubbleSize,
          color: "#fff",
          whiteSpace: "nowrap",
          animation: bubbleAnim,
          willChange: "transform",
        }}
      >
        {bubbleText}
      </div>
      <div
        className="npc-walk"
        style={{
          position: "relative",
          willChange: "transform",
        }}
      >
        <NpcBody npcType={npcType} />
      </div>
      <div
        style={{
          width: "6vmin",
          height: "0.8vmin",
          background: "#000",
          opacity: 0.25,
          margin: "0.3vmin auto 0",
          animation: "shadowPulse 0.5s steps(2) infinite",
          willChange: "transform",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: '"Press Start 2P", monospace',
          fontSize: "0.7vmin",
          color: "#94a3b8",
          marginTop: "0.3vmin",
          opacity: 0.6,
        }}
      >
        {BUBBLE_LABEL[npcType]}
      </div>
    </div>
  );
}
