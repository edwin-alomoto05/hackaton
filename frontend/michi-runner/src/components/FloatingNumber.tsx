import type { FloatingNumber as FloatingNumberItem } from "../types/game";

interface FloatingNumbersProps {
  items: FloatingNumberItem[];
}

export function FloatingNumbers({ items }: FloatingNumbersProps) {
  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            position: "absolute",
            left: `${item.x}vw`,
            top: `${item.y}vh`,
            fontFamily: '"Press Start 2P", monospace',
            fontSize: "3.5vmin",
            color: item.value >= 0 ? "#4ade80" : "#f87171",
            animation: "floatUp 1.2s ease-out forwards",
            pointerEvents: "none",
            zIndex: 9,
            textShadow: item.value >= 0 ? "0 0 10px #4ade8088" : "0 0 10px #f8717188",
            whiteSpace: "nowrap",
          }}
        >
          {item.value >= 0 ? "+" : ""}
          {item.value}
        </div>
      ))}
    </>
  );
}
