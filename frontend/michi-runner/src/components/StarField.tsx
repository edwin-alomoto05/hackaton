import { STAR_POSITIONS } from "../constants/runner";

export function StarField() {
  return (
    <>
      {STAR_POSITIONS.map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            width: 4,
            height: 4,
            background: "#fff",
            opacity: 0.4,
          }}
        />
      ))}
    </>
  );
}
