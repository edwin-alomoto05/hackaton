import type { CSSProperties } from "react";
import { getMichiInfo } from "../constants/runner";
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

const STAR_BURST_POSITIONS = [
  { tx: "-3vmin", ty: "-4vmin" },
  { tx: "3vmin", ty: "-4vmin" },
  { tx: "-4vmin", ty: "2vmin" },
  { tx: "4vmin", ty: "2vmin" },
  { tx: "0", ty: "-5vmin" },
] as const;

const CLOUD_PUFF_POSITIONS = [
  { tx: "-3vmin", ty: "-2vmin" },
  { tx: "3vmin", ty: "-2vmin" },
  { tx: "0", ty: "-4vmin" },
] as const;

export function MichiSprite({
  emoji,
  isRunning,
  level,
  reaction,
  mode,
  isTransforming,
  showLevelUp,
  showLevelDown,
}: MichiSpriteProps) {
  const displayEmoji = getMichiInfo(mode, level).emoji || emoji;

  let levelFilter = "none";
  if (!isTransforming) {
    if (level === 1) {
      levelFilter = "brightness(0.6) grayscale(0.3)";
    } else if (level === 3) {
      levelFilter = "drop-shadow(0 0 8px #fde047)";
    }
  }

  let reactionClass: string | undefined;
  if (!isTransforming) {
    if (reaction === "run" && isRunning) {
      reactionClass = "michi-run";
    } else if (reaction === "celebrate") {
      reactionClass = "michi-celebrate";
    } else if (reaction === "sad") {
      reactionClass = "michi-sad";
    } else if (reaction === "curious") {
      reactionClass = "michi-curious";
    }
  }

  const transformAnimation = isTransforming
    ? showLevelUp
      ? "michiLevelUp 1.5s ease-in-out forwards"
      : "michiLevelDown 1.5s ease-in-out forwards"
    : undefined;

  let emojiFilter: string | undefined = levelFilter;
  if (isTransforming && showLevelUp) {
    emojiFilter = "drop-shadow(0 0 2vmin #fde047)";
  } else if (isTransforming && showLevelDown) {
    emojiFilter = "drop-shadow(0 0 2vmin #f87171)";
  } else if (reaction === "sad") {
    emojiFilter = undefined;
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        ["--michi-size" as string]: "8vmin",
      }}
    >
      <div
        className={reactionClass}
        style={{
          position: "relative",
          width: "var(--michi-size)",
          height: "var(--michi-size)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: transformAnimation,
        }}
      >
        <div
          style={{
            fontSize: "var(--michi-size)",
            filter: emojiFilter,
            lineHeight: 1,
            transition: "filter 0.5s ease",
          }}
        >
          {displayEmoji}
        </div>

        {isTransforming && showLevelUp &&
          STAR_BURST_POSITIONS.map((pos, i) => (
            <div
              key={i}
              style={
                {
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  fontSize: "2.5vmin",
                  animation: `starBurst 0.8s ease-out ${i * 0.1}s forwards`,
                  "--tx": pos.tx,
                  "--ty": pos.ty,
                  pointerEvents: "none",
                } as CSSProperties
              }
            >
              ⭐
            </div>
          ))}

        {isTransforming && showLevelDown &&
          CLOUD_PUFF_POSITIONS.map((pos, i) => (
            <div
              key={i}
              style={
                {
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  fontSize: "2vmin",
                  animation: `cloudPuff 0.8s ease-out ${i * 0.1}s forwards`,
                  "--tx": pos.tx,
                  "--ty": pos.ty,
                  pointerEvents: "none",
                } as CSSProperties
              }
            >
              💨
            </div>
          ))}

        {!isTransforming && reaction === "celebrate" && (
          <>
            <span className="coin-particle" style={{ left: "-2vmin", top: "0" }}>
              🪙
            </span>
            <span
              className="coin-particle"
              style={{ left: "50%", top: "-1vmin", animationDelay: "0.15s" }}
            >
              🪙
            </span>
            <span
              className="coin-particle"
              style={{ right: "-2vmin", top: "0", animationDelay: "0.3s" }}
            >
              🪙
            </span>
          </>
        )}
        {!isTransforming && reaction === "sad" && (
          <>
            <span className="money-particle" style={{ left: "20%", top: "50%" }}>
              💸
            </span>
            <span
              className="money-particle"
              style={{ right: "20%", top: "50%", animationDelay: "0.2s" }}
            >
              💸
            </span>
          </>
        )}
      </div>
      <div
        style={{
          width: 80,
          height: 8,
          background: "#4ade80",
          border: "2px solid #000",
          margin: "4px auto 0",
        }}
      />
    </div>
  );
}
