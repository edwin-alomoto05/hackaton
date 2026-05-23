interface RivalUpdateProps {
  rivalName: string;
  lastChoice: string | null;
  isGood: boolean | null;
}

export function RivalUpdate({ rivalName, lastChoice, isGood }: RivalUpdateProps) {
  if (!lastChoice) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "22vh",
        right: "2vmin",
        zIndex: 7,
        animation: "bannerSlide 2s ease-in-out forwards",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "#0f0f1a",
          border: `0.3vmin solid ${isGood ? "#a78bfa" : "#94a3b8"}`,
          boxShadow: "0.3vmin 0.3vmin 0 #000",
          padding: "1vmin 1.5vmin",
          display: "flex",
          alignItems: "center",
          gap: "1vmin",
        }}
      >
        <span style={{ fontSize: "2vmin" }}>{isGood ? "😸" : "😿"}</span>
        <div>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1vmin",
              color: "#94a3b8",
              marginBottom: "0.3vmin",
            }}
          >
            {rivalName}
          </div>
          <div
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "1.1vmin",
              color: isGood ? "#a78bfa" : "#94a3b8",
            }}
          >
            {isGood ? "✓ buena decisión" : "✗ mala decisión"}
          </div>
        </div>
      </div>
    </div>
  );
}
