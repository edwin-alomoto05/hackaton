import { MODE_CONFIG } from "../../constants/runner";
import type { GameMode, LeaderboardEntry } from "../../types/game";
import { MichiSprite } from "../MichiSprite";

function truncateName(name: string, max = 10): string {
  return name.length > max ? `${name.slice(0, max)}…` : name;
}

function PodiumMichi({
  level,
  mode,
  scale,
  bounce,
}: {
  level: 1 | 2 | 3;
  mode: GameMode;
  scale: number;
  bounce?: boolean;
}) {
  return (
    <div
      className={bounce ? "trophy-bounce" : undefined}
      style={{
        height: `${8 * scale}vmin`,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        marginBottom: "0.5vmin",
        willChange: bounce ? "transform" : undefined,
      }}
    >
      <div style={{ transform: `scale(${scale})`, transformOrigin: "bottom center" }}>
        <MichiSprite
          emoji=""
          isRunning={false}
          level={level}
          reaction="celebrate"
          mode={mode}
          isTransforming={false}
          showLevelUp={false}
          showLevelDown={false}
          previousLevel={level}
        />
      </div>
    </div>
  );
}

function PodiumCrown() {
  return (
    <div
      style={{
        position: "relative",
        width: "4vmin",
        height: "2vmin",
        background: "#fde047",
        border: "0.3vmin solid #000",
        marginBottom: "0.5vmin",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "-1vmin",
            left: i === 0 ? "0.2vmin" : i === 1 ? "50%" : undefined,
            right: i === 2 ? "0.2vmin" : undefined,
            transform: i === 1 ? "translateX(-50%)" : undefined,
            width: "0.8vmin",
            height: "1vmin",
            background: "#fde047",
            border: "0.2vmin solid #000",
          }}
        />
      ))}
    </div>
  );
}

function FirstPlaceRays() {
  return (
    <div
      className="podium-rays"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "16vmin",
        height: "16vmin",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        willChange: "transform",
      }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "0.3vmin",
            height: "2vmin",
            background: "#fde047",
            transformOrigin: "center bottom",
            transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
          }}
        />
      ))}
    </div>
  );
}

function PodiumSlot({
  entry,
  mode,
  place,
  delay,
}: {
  entry: LeaderboardEntry;
  mode: GameMode;
  place: 1 | 2 | 3;
  delay: string;
}) {
  const unit = MODE_CONFIG[mode].balanceUnit;
  const configs = {
    1: {
      scale: 0.75,
      platformW: "14vmin",
      platformH: "8vmin",
      platformBg: "#ffd700",
      medal: "🥇",
      medalSize: "3vmin",
      nameColor: "#fde047",
      balanceColor: "#fde047",
      nameSize: "1.1vmin",
      balanceSize: "1.6vmin",
    },
    2: {
      scale: 0.5,
      platformW: "12vmin",
      platformH: "5vmin",
      platformBg: "#94a3b8",
      medal: "🥈",
      medalSize: "2.5vmin",
      nameColor: "#f1f5f9",
      balanceColor: "#94a3b8",
      nameSize: "1vmin",
      balanceSize: "1.4vmin",
    },
    3: {
      scale: 0.42,
      platformW: "11vmin",
      platformH: "3.5vmin",
      platformBg: "#fb923c",
      medal: "🥉",
      medalSize: "2vmin",
      nameColor: "#f1f5f9",
      balanceColor: "#fb923c",
      nameSize: "0.9vmin",
      balanceSize: "1.2vmin",
    },
  }[place];

  return (
    <div
      className={`podium-rise ${place === 1 ? "podium-rise-first" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        animationDelay: delay,
        position: "relative",
      }}
    >
      {place === 1 && (
        <>
          <FirstPlaceRays />
          <PodiumCrown />
        </>
      )}
      <PodiumMichi
        level={entry.michi_level}
        mode={mode}
        scale={configs.scale}
        bounce={place === 1}
      />
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: configs.nameSize,
          color: configs.nameColor,
          maxWidth: "10vmin",
          textAlign: "center",
          marginBottom: "0.4vmin",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {truncateName(entry.player_name)}
      </div>
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: configs.balanceSize,
          color: configs.balanceColor,
          marginBottom: "0.8vmin",
        }}
      >
        {unit}
        {entry.final_balance.toLocaleString()}
      </div>
      <div
        style={{
          width: configs.platformW,
          height: configs.platformH,
          background: configs.platformBg,
          border: place === 1 ? "0.5vmin solid #000" : "0.4vmin solid #000",
          boxShadow: place === 1 ? "0.5vmin 0.5vmin 0 #000" : "0.4vmin 0.4vmin 0 #000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: configs.medalSize }}>
          {configs.medal}
        </span>
      </div>
    </div>
  );
}

export function PodiumTop3({ entries, mode }: { entries: LeaderboardEntry[]; mode: GameMode }) {
  if (entries.length === 0) return null;

  const first = entries[0];
  const second = entries[1];
  const third = entries[2];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: "1vmin",
        padding: "3vmin 2vmin 0",
        position: "relative",
        zIndex: 2,
        overflow: "hidden",
      }}
    >
      {second ? (
        <PodiumSlot entry={second} mode={mode} place={2} delay="0.3s" />
      ) : (
        <div style={{ width: "12vmin" }} />
      )}
      {first && <PodiumSlot entry={first} mode={mode} place={1} delay="0.1s" />}
      {third ? (
        <PodiumSlot entry={third} mode={mode} place={3} delay="0.5s" />
      ) : (
        <div style={{ width: "11vmin" }} />
      )}
    </div>
  );
}
