import type { GameMode } from "../types/game";

interface Props {
  x: number;
  npcType: number;
  isVisible: boolean;
  approachProgress?: number;
  mode?: GameMode;
}

const NPC_CONFIGS = [
  { name: "Vendedor", bg: "#2255aa", hat: "#1a1a2e", item: "📰" },
  { name: "Frutero", bg: "#ff6b35", hat: "#ffd700", item: "🍎" },
  { name: "Artesana", bg: "#cc3300", hat: "#8b6914", item: "🧶" },
  { name: "Pescador", bg: "#1a4a8a", hat: "#ffd700", item: "🎣" },
  { name: "Músico", bg: "#7b2fff", hat: "#1a1a2e", item: "🎶" },
] as const;

export default function NpcCharacter({
  x,
  npcType,
  isVisible,
  approachProgress = 0,
}: Props) {
  if (!isVisible) return null;

  const npc = NPC_CONFIGS[npcType % NPC_CONFIGS.length];

  const bubbleText =
    approachProgress >= 1 ? "!!!" : approachProgress >= 0.7 ? "?!" : "?";

  const bubbleColor =
    approachProgress >= 1 ? "#f87171" : approachProgress >= 0.7 ? "#fb923c" : "#fde047";

  const bubbleAnim =
    approachProgress >= 1
      ? "bubbleUrgent 0.3s steps(2) infinite"
      : approachProgress >= 0.7
        ? "bubblePulse 0.5s steps(2) infinite"
        : "bubbleFloat 1s steps(2) infinite";

  return (
    <div
      style={{
        position: "absolute",
        bottom: "18%",
        left: `${x}vw`,
        zIndex: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: "scaleX(-1)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          transform: "scaleX(-1)",
          marginBottom: "0.5vmin",
          position: "relative",
          animation: bubbleAnim,
        }}
      >
        <div
          style={{
            background: bubbleColor,
            border: "0.3vmin solid #000",
            boxShadow: "0.3vmin 0.3vmin 0 #000",
            padding: "0.4vmin 0.8vmin",
            fontFamily: "Press Start 2P",
            fontSize: "1.2vmin",
            color: "#000",
            whiteSpace: "nowrap",
          }}
        >
          {bubbleText}
        </div>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: "0.6vmin solid transparent",
            borderRight: "0.6vmin solid transparent",
            borderTop: `0.8vmin solid ${bubbleColor}`,
            margin: "0 auto",
          }}
        />
      </div>

      <div
        style={{
          width: "var(--npc-size, 10vmin)",
          height: "var(--npc-size, 10vmin)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "25%",
            width: "50%",
            height: "35%",
            background: "#f4c499",
            border: "0.3vmin solid #000",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "25%",
              left: "15%",
              width: "25%",
              height: "30%",
              background: "#1a1a2e",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "25%",
              right: "15%",
              width: "25%",
              height: "30%",
              background: "#1a1a2e",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              left: "30%",
              width: "40%",
              height: "15%",
              background: "#c0392b",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: "0%",
            left: "20%",
            width: "60%",
            height: "12%",
            background: npc.hat,
            border: "0.2vmin solid #000",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "20%",
            width: "60%",
            height: "38%",
            background: npc.bg,
            border: "0.3vmin solid #000",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "42%",
            left: "-10%",
            fontSize: "2.5vmin",
            transform: "scaleX(-1)",
          }}
        >
          {npc.item}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "0%",
            left: "22%",
            width: "22%",
            height: "26%",
            background: "#333",
            border: "0.2vmin solid #000",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "0%",
            right: "22%",
            width: "22%",
            height: "26%",
            background: "#333",
            border: "0.2vmin solid #000",
          }}
        />
      </div>

      <div
        style={{
          width: "70%",
          height: "0.5vmin",
          background: "#000",
          opacity: 0.2,
          marginTop: "0.2vmin",
        }}
      />
    </div>
  );
}

export { NpcCharacter };
