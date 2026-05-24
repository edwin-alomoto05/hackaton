import type { CSSProperties } from "react";

const PX = "2vmin";

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

function MichiHeadLogo() {
  return (
    <div
      style={{
        position: "relative",
        width: `calc(${PX} * 8)`,
        height: `calc(${PX} * 7)`,
      }}
    >
      <Block style={{ left: `calc(${PX} * 2)`, top: 0, width: `calc(${PX} * 2)`, height: `calc(${PX} * 2)`, background: "#f4a460" }} />
      <Block style={{ right: `calc(${PX} * 2)`, top: 0, width: `calc(${PX} * 2)`, height: `calc(${PX} * 2)`, background: "#f4a460" }} />
      <Block style={{ left: `calc(${PX} * 2.5)`, top: `calc(${PX} * 0.5)`, width: PX, height: PX, background: "#ff8c69" }} />
      <Block style={{ right: `calc(${PX} * 2.5)`, top: `calc(${PX} * 0.5)`, width: PX, height: PX, background: "#ff8c69" }} />
      <Block style={{ left: 0, top: `calc(${PX} * 2)`, width: `calc(${PX} * 8)`, height: `calc(${PX} * 5)`, background: "#f4a460" }} />
      <Block style={{ left: `calc(${PX} * 2)`, top: `calc(${PX} * 3)`, width: `calc(${PX} * 2)`, height: `calc(${PX} * 2)`, background: "#1a1a1a" }} />
      <Block style={{ left: `calc(${PX} * 2.8)`, top: `calc(${PX} * 3.2)`, width: PX, height: PX, background: "#fff" }} />
      <Block style={{ right: `calc(${PX} * 2)`, top: `calc(${PX} * 3)`, width: `calc(${PX} * 2)`, height: `calc(${PX} * 2)`, background: "#1a1a1a" }} />
      <Block style={{ right: `calc(${PX} * 2.8)`, top: `calc(${PX} * 3.2)`, width: PX, height: PX, background: "#fff" }} />
      <Block style={{ left: `calc(${PX} * 3)`, top: `calc(${PX} * 5)`, width: `calc(${PX} * 2)`, height: PX, background: "#ff8c69" }} />
      <Block style={{ left: 0, top: `calc(${PX} * 4)`, width: `calc(${PX} * 3)`, height: PX, background: "#f4a460" }} />
      <Block style={{ right: 0, top: `calc(${PX} * 4)`, width: `calc(${PX} * 3)`, height: PX, background: "#f4a460" }} />
    </div>
  );
}

function MichiBodyLogo() {
  return (
    <div style={{ position: "relative", width: `calc(${PX} * 6)`, height: `calc(${PX} * 5)` }}>
      <Block style={{ left: 0, top: `calc(${PX} * 2)`, width: `calc(${PX} * 6)`, height: `calc(${PX} * 3)`, background: "#1a1a2e" }} />
      <Block style={{ left: 0, top: 0, width: `calc(${PX} * 6)`, height: `calc(${PX} * 2)`, background: "#f4a460" }} />
      <Block style={{ left: `calc(${PX} * 2.5)`, top: `calc(${PX} * 2)`, width: PX, height: `calc(${PX} * 2)`, background: "#cc0000" }} />
      <Block style={{ left: PX, top: PX, width: PX, height: PX, background: "#ffd700" }} />
    </div>
  );
}

interface MichiLogoSpriteProps {
  className?: string;
}

export function MichiLogoSprite({ className }: MichiLogoSpriteProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        filter: "drop-shadow(0 0 1.2vmin #fde047)",
        willChange: "transform",
      }}
    >
      <MichiHeadLogo />
      <div style={{ marginTop: `calc(${PX} * -0.5)` }}>
        <MichiBodyLogo />
      </div>
      <div
        style={{
          position: "relative",
          width: `calc(${PX} * 6)`,
          height: `calc(${PX} * 2)`,
          marginTop: `calc(${PX} * -0.3)`,
        }}
      >
        <Block style={{ left: `calc(${PX} * 1)`, bottom: 0, width: PX, height: `calc(${PX} * 2)`, background: "#f4a460" }} />
        <Block style={{ right: `calc(${PX} * 1)`, bottom: 0, width: PX, height: `calc(${PX} * 2)`, background: "#f4a460" }} />
      </div>
    </div>
  );
}
