import { useEffect, useState, type CSSProperties } from "react";

interface TypeWriterProps {
  text: string;
  delay: number;
  startDelay?: number;
  color?: string;
  fontSize?: string;
  onComplete?: () => void;
  showCursor?: boolean;
  style?: CSSProperties;
}

export function TypeWriter({
  text,
  delay,
  startDelay = 0,
  color = "#f1f5f9",
  fontSize = "1.2vmin",
  onComplete,
  showCursor = false,
  style,
}: TypeWriterProps) {
  const [visibleChars, setVisibleChars] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setVisibleChars(0);
    setStarted(false);
    const startTimer = window.setTimeout(() => {
      setStarted(true);
    }, startDelay);

    return () => window.clearTimeout(startTimer);
  }, [text, startDelay]);

  useEffect(() => {
    if (!started) return;

    const intervalId = window.setInterval(() => {
      setVisibleChars((prev) => {
        const next = prev + 1;
        if (next >= text.length) {
          window.clearInterval(intervalId);
          onComplete?.();
          return text.length;
        }
        return next;
      });
    }, delay);

    return () => window.clearInterval(intervalId);
  }, [started, text, delay, onComplete]);

  const isTyping = started && visibleChars < text.length;

  return (
    <span
      style={{
        fontFamily: '"Press Start 2P", monospace',
        color,
        fontSize,
        lineHeight: 1.6,
        ...style,
      }}
    >
      {text.split("").map((char, i) => (
        <span
          key={`${char}-${i}`}
          style={{
            opacity: i < visibleChars ? 1 : 0,
            display: "inline-block",
            transition: "none",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      {showCursor && isTyping && (
        <span
          style={{
            display: "inline-block",
            width: "0.5vmin",
            height: "3vmin",
            background: color,
            marginLeft: "0.3vmin",
            verticalAlign: "middle",
            animation: "blink 0.5s steps(1) infinite",
          }}
        />
      )}
    </span>
  );
}
