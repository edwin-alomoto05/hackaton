import { useEffect, useRef, useState } from "react";

interface SpriteSheetConfig {
  totalFrames: number;
  fps: number;
  loop?: boolean;
  onComplete?: () => void;
}

export function useSpriteSheet({
  totalFrames,
  fps,
  loop = true,
  onComplete,
}: SpriteSheetConfig) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef(0);

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    stop();
    frameRef.current = 0;
    setCurrentFrame(0);
  };

  const play = () => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      frameRef.current += 1;
      if (frameRef.current >= totalFrames) {
        if (loop) {
          frameRef.current = 0;
        } else {
          frameRef.current = totalFrames - 1;
          stop();
          onComplete?.();
        }
      }
      setCurrentFrame(frameRef.current);
    }, 1000 / fps);
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return { currentFrame, play, stop, reset };
}
