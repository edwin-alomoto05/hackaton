import type { CSSProperties } from "react";
import type { GameMode, MichiReaction } from "../types/game";

interface MichiSpriteProps {
  emoji: string;
  isRunning: boolean;
  level: 1 | 2 | 3;
  reaction: MichiReaction;
  mode: GameMode;
  isTransforming: boolean;
  showLevelUp: boolean;
  showLevelDown: boolean;
  previousLevel: 1 | 2 | 3;
}

const PX = "1.2vmin";

function Block({
  style,
  className,
}: {
  style: CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        boxSizing: "border-box",
        ...style,
      }}
    />
  );
}

function MichiHead({ curious, sad }: { curious?: boolean; sad?: boolean }) {
  const headRotate = curious ? "15deg" : sad ? "-15deg" : "0deg";
  return (
    <div
      style={{
        position: "relative",
        width: `calc(${PX} * 8)`,
        height: `calc(${PX} * 7)`,
        transform: `rotateZ(${headRotate})`,
        transformOrigin: "bottom center",
      }}
    >
      <Block
        style={{
          left: `calc(${PX} * 2)`,
          top: 0,
          width: `calc(${PX} * 2)`,
          height: `calc(${PX} * 2)`,
          background: "#f4a460",
        }}
      />
      <Block
        style={{
          right: `calc(${PX} * 2)`,
          top: 0,
          width: `calc(${PX} * 2)`,
          height: `calc(${PX} * 2)`,
          background: "#f4a460",
        }}
      />
      <Block
        style={{
          left: `calc(${PX} * 2.5)`,
          top: `calc(${PX} * 0.5)`,
          width: PX,
          height: PX,
          background: "#ff8c69",
        }}
      />
      <Block
        style={{
          right: `calc(${PX} * 2.5)`,
          top: `calc(${PX} * 0.5)`,
          width: PX,
          height: PX,
          background: "#ff8c69",
        }}
      />
      <Block
        style={{
          left: 0,
          top: `calc(${PX} * 2)`,
          width: `calc(${PX} * 8)`,
          height: `calc(${PX} * 5)`,
          background: "#f4a460",
        }}
      />
      {!sad && (
        <>
          <Block
            style={{
              left: `calc(${PX} * 2)`,
              top: `calc(${PX} * 3)`,
              width: curious ? `calc(${PX} * 2)` : `calc(${PX} * 2)`,
              height: curious ? `calc(${PX} * 3)` : `calc(${PX} * 2)`,
              background: "#1a1a1a",
            }}
          />
          <Block
            style={{
              left: `calc(${PX} * 2.8)`,
              top: `calc(${PX} * 3.2)`,
              width: PX,
              height: PX,
              background: "#fff",
            }}
          />
          <Block
            style={{
              right: `calc(${PX} * 2)`,
              top: `calc(${PX} * 3)`,
              width: `calc(${PX} * 2)`,
              height: curious ? `calc(${PX} * 3)` : `calc(${PX} * 2)`,
              background: "#1a1a1a",
            }}
          />
          <Block
            style={{
              right: `calc(${PX} * 2.8)`,
              top: `calc(${PX} * 3.2)`,
              width: PX,
              height: PX,
              background: "#fff",
            }}
          />
        </>
      )}
      {sad && (
        <>
          <Block
            style={{
              left: `calc(${PX} * 2)`,
              top: `calc(${PX} * 3.5)`,
              width: `calc(${PX} * 2)`,
              height: PX,
              background: "#1a1a1a",
            }}
          />
          <Block
            style={{
              right: `calc(${PX} * 2)`,
              top: `calc(${PX} * 3.5)`,
              width: `calc(${PX} * 2)`,
              height: PX,
              background: "#1a1a1a",
            }}
          />
          <Block
            style={{
              left: `calc(${PX} * 3)`,
              top: `calc(${PX} * 5)`,
              width: `calc(${PX} * 2)`,
              height: PX,
              background: "#8b4513",
            }}
          />
        </>
      )}
      {!sad && (
        <Block
          style={{
            left: `calc(${PX} * 3)`,
            top: `calc(${PX} * 5)`,
            width: `calc(${PX} * 2)`,
            height: PX,
            background: "#ff8c69",
          }}
        />
      )}
      <Block
        style={{
          left: 0,
          top: `calc(${PX} * 4)`,
          width: `calc(${PX} * 3)`,
          height: PX,
          background: "#f4a460",
        }}
      />
      <Block
        style={{
          right: 0,
          top: `calc(${PX} * 4)`,
          width: `calc(${PX} * 3)`,
          height: PX,
          background: "#f4a460",
        }}
      />
    </div>
  );
}

function MichiBody({ level }: { level: 1 | 2 | 3 }) {
  if (level === 1) {
    return (
      <div style={{ position: "relative", width: `calc(${PX} * 6)`, height: `calc(${PX} * 5)` }}>
        <Block
          style={{
            inset: 0,
            width: `calc(${PX} * 6)`,
            height: `calc(${PX} * 5)`,
            background: "#d4843a",
          }}
        />
        <Block
          style={{
            left: `calc(${PX} * 2)`,
            top: `calc(${PX} * 1.5)`,
            width: `calc(${PX} * 2)`,
            height: `calc(${PX} * 2)`,
            background: "#888",
          }}
        />
        <Block
          style={{
            right: `calc(${PX} * 1)`,
            top: 0,
            width: `calc(${PX} * 2)`,
            height: PX,
            background: "#d4843a",
          }}
        />
        <Block
          style={{
            right: `calc(${PX} * 1.5)`,
            top: `calc(${PX} * 1.5)`,
            width: `calc(${PX} * 2)`,
            height: PX,
            background: "#1a1a1a",
          }}
        />
      </div>
    );
  }
  if (level === 3) {
    return (
      <div style={{ position: "relative", width: `calc(${PX} * 6)`, height: `calc(${PX} * 5)` }}>
        <Block
          style={{
            left: 0,
            top: `calc(${PX} * 2)`,
            width: `calc(${PX} * 6)`,
            height: `calc(${PX} * 3)`,
            background: "#1a1a2e",
          }}
        />
        <Block
          style={{
            left: 0,
            top: 0,
            width: `calc(${PX} * 6)`,
            height: `calc(${PX} * 2)`,
            background: "#f4a460",
          }}
        />
        <Block
          style={{
            left: `calc(${PX} * 2.5)`,
            top: `calc(${PX} * 2)`,
            width: PX,
            height: `calc(${PX} * 2)`,
            background: "#cc0000",
          }}
        />
        <Block
          style={{
            left: PX,
            top: PX,
            width: PX,
            height: PX,
            background: "#ffd700",
          }}
        />
      </div>
    );
  }
  return (
    <div style={{ position: "relative", width: `calc(${PX} * 6)`, height: `calc(${PX} * 5)` }}>
      <Block
        style={{
          inset: 0,
          width: `calc(${PX} * 6)`,
          height: `calc(${PX} * 5)`,
          background: "#f4a460",
        }}
      />
      <Block
        style={{
          left: 0,
          bottom: 0,
          width: `calc(${PX} * 6)`,
          height: `calc(${PX} * 2)`,
          background: "#2255aa",
        }}
      />
      <Block
        style={{
          left: `calc(${PX} * 2.5)`,
          bottom: `calc(${PX} * 0.5)`,
          width: PX,
          height: PX,
          background: "#1a3a8a",
        }}
      />
    </div>
  );
}

const STAR_POSITIONS = [
  { left: "-3vmin", top: "-2vmin" },
  { left: "3vmin", top: "-3vmin" },
  { right: "-3vmin", top: "-2vmin" },
  { left: "0", top: "-4vmin" },
] as const;

export function MichiSprite({
  emoji: _emoji,
  isRunning,
  level,
  reaction,
  mode: _mode,
  isTransforming,
  showLevelUp,
  showLevelDown,
  previousLevel: _previousLevel,
}: MichiSpriteProps) {
  void _emoji;
  void _mode;
  void _previousLevel;
  void showLevelUp;
  void showLevelDown;

  const curious = reaction === "curious";
  const sad = reaction === "sad";
  const celebrate = reaction === "celebrate";
  const running = reaction === "run" && isRunning && !isTransforming;

  let containerClass = "";
  if (isTransforming) {
    containerClass = showLevelUp ? "michi-level-up" : "michi-level-down";
  } else if (running) {
    containerClass = "michi-run-sprite";
  } else if (celebrate) {
    containerClass = "michi-celebrate-sprite";
  } else if (sad) {
    containerClass = "michi-sad-sprite";
  } else if (curious) {
    containerClass = "michi-curious-sprite";
  }

  let levelFilter = "none";
  if (!isTransforming) {
    if (level === 1) levelFilter = "brightness(0.75) saturate(0.9)";
    if (level === 3) levelFilter = "drop-shadow(0 0 0.8vmin #fde047)";
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        className={containerClass}
        style={{
          position: "relative",
          filter: sad ? "brightness(0.7) grayscale(0.4)" : levelFilter,
          willChange: "transform",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <MichiHead curious={curious} sad={sad} />
          <div style={{ marginTop: `calc(${PX} * -0.5)` }}>
            <MichiBody level={level} />
          </div>
          <div
            className={running ? "michi-legs-run" : undefined}
            style={{
              position: "relative",
              width: `calc(${PX} * 6)`,
              height: `calc(${PX} * 3)`,
              marginTop: `calc(${PX} * -0.5)`,
            }}
          >
            <Block
              className="michi-leg-left"
              style={{
                left: `calc(${PX} * 1)`,
                bottom: 0,
                width: PX,
                height: `calc(${PX} * 3)`,
                background: "#f4a460",
                transformOrigin: "top center",
              }}
            />
            <Block
              className="michi-leg-right"
              style={{
                right: `calc(${PX} * 1)`,
                bottom: 0,
                width: PX,
                height: `calc(${PX} * 3)`,
                background: "#f4a460",
                transformOrigin: "top center",
              }}
            />
          </div>
          <div
            className="michi-tail"
            style={{
              position: "absolute",
              right: `calc(${PX} * -1)`,
              bottom: `calc(${PX} * 2)`,
              width: PX,
              height: `calc(${PX} * 4)`,
              background: "#f4a460",
              transformOrigin: "bottom center",
              transform: curious
                ? "rotateZ(-45deg)"
                : sad
                  ? "rotateZ(70deg)"
                  : undefined,
              willChange: "transform",
            }}
          />
        </div>

        {celebrate &&
          STAR_POSITIONS.map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "left" in pos ? pos.left : undefined,
                right: "right" in pos ? pos.right : undefined,
                top: pos.top,
                width: "1.5vmin",
                height: "1.5vmin",
                background: "#ffd700",
                border: "0.15vmin solid #000",
                animation: `starBurst 0.8s steps(4) ${i * 0.1}s forwards`,
                willChange: "transform",
                ["--tx" as string]: "left" in pos ? pos.left : pos.right,
                ["--ty" as string]: pos.top,
              }}
            />
          ))}
      </div>

      <div
        className="michi-shadow"
        style={{
          width: "8vmin",
          height: "1vmin",
          background: "#000",
          opacity: 0.3,
          marginTop: "0.5vmin",
          willChange: "transform",
        }}
      />
      <div
        style={{
          width: "10vmin",
          height: "1vmin",
          background: "#4ade80",
          borderTop: "0.3vmin solid #000",
          marginTop: "0.2vmin",
        }}
      />
    </div>
  );
}
