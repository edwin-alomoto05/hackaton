import type { FloatingNumber as FloatingNumberItem } from "../types/game";

interface FloatingNumbersProps {
  items: FloatingNumberItem[];
}

export function FloatingNumbers({ items }: FloatingNumbersProps) {
  return (
    <>
      {items.map((item) => {
        const isGood = item.value >= 0;
        return (
          <div
            key={item.id}
            className={`premium-float-num premium-float-num--${isGood ? "good" : "bad"}`}
            style={{ left: `${item.x}vw`, top: `${item.y}vh` }}
          >
            <div className="premium-float-num-inner">
              {item.value >= 0 ? "+" : ""}
              {item.value}
              <div className="premium-float-num-trail" />
            </div>
          </div>
        );
      })}
    </>
  );
}
