import type { FloatingNumber as FloatingNumberItem } from "../types/game";

interface FloatingNumbersProps {
  items: FloatingNumberItem[];
}

const TEXT_OUTLINE =
  "-0.15vmin -0.15vmin 0 #000, 0.15vmin -0.15vmin 0 #000, -0.15vmin 0.15vmin 0 #000, 0.15vmin 0.15vmin 0 #000";

export function FloatingNumbers({ items }: FloatingNumbersProps) {
  return (
    <>
      {items.map((item) => {
        const color = item.value >= 0 ? "#4ade80" : "#f87171";
        return (
          <div
            key={item.id}
            style={{
              position: "absolute",
              left: `${item.x}vw`,
              top: `${item.y}vh`,
              fontFamily: '"Press Start 2P", monospace',
              fontSize: "3.5vmin",
              color,
              animation: "floatUpPixel 1.2s steps(5) forwards",
              pointerEvents: "none",
              zIndex: 9,
              textShadow: TEXT_OUTLINE,
              whiteSpace: "nowrap",
              background: "rgba(0,0,0,0.5)",
              padding: "0.3vmin 0.8vmin",
              border: `0.2vmin solid ${color}`,
              willChange: "transform",
            }}
          >
            {item.value >= 0 ? "+" : ""}
            {item.value}
          </div>
        );
      })}
    </>
  );
}
