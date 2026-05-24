import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  type CSSProperties,
} from "react";
import { BENI_SPRITES, type BeniAnimation } from "../constants/sprites";
import runningSprite from "../assets/animation/running.png";

interface Props {
  reaction: "run" | "celebrate" | "sad" | "curious" | "idle";
  isTransforming: boolean;
  showLevelUp: boolean;
  showLevelDown: boolean;
  level: 1 | 2 | 3;
  size?: string;
  /** En menús/intro: sin posición absoluta de gameplay */
  embedded?: boolean;
}

const REACTION_MAP: Record<Props["reaction"], BeniAnimation> = {
  run: "running",
  celebrate: "celebration",
  sad: "sadness",
  curious: "interesting",
  idle: "breathing",
};

const frameSizeCache: Record<string, number> = {};

function frameHeightKey(src: string): string {
  return `${src}_h`;
}

function wrapperStyle(embedded: boolean): CSSProperties {
  return {
    position: embedded ? "relative" : "absolute",
    bottom: embedded ? undefined : "18%",
    left: embedded ? undefined : "12%",
    zIndex: embedded ? undefined : 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
}

export default function MichiSprite({
  reaction,
  isTransforming,
  showLevelUp,
  showLevelDown,
  level,
  size = "var(--michi-size)",
  embedded = false,
}: Props) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [frameWidth, setFrameWidth] = useState<number | null>(null);
  const [frameHeight, setFrameHeight] = useState<number | null>(null);
  const [renderScale, setRenderScale] = useState(1);
  const intervalRef = useRef<number | null>(null);
  const frameRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  const animationKey: BeniAnimation = isTransforming
    ? showLevelUp
      ? "levelUp"
      : showLevelDown
        ? "dropLevel"
        : REACTION_MAP[reaction]
    : REACTION_MAP[reaction];

  const sprite = BENI_SPRITES[animationKey];

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      console.log("=== BENI SPRITE DIMENSIONS ===");
      console.log("running.png:");
      console.log("  naturalWidth:", img.naturalWidth);
      console.log("  naturalHeight:", img.naturalHeight);
      console.log("  frameWidth (÷4):", img.naturalWidth / 4);
      console.log("  frameHeight:", img.naturalHeight);
    };
    img.src = runningSprite;
  }, []);

  useEffect(() => {
    if (frameSizeCache[sprite.src] !== undefined) {
      setFrameWidth(frameSizeCache[sprite.src]);
      setFrameHeight(frameSizeCache[frameHeightKey(sprite.src)] ?? null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      const fw = Math.floor(img.naturalWidth / sprite.frames);
      const fh = img.naturalHeight;

      console.log(`Sprite: ${animationKey}`);
      console.log(`Total width: ${img.naturalWidth}`);
      console.log(`Frame width: ${fw}`);
      console.log(`Frame height: ${fh}`);

      frameSizeCache[sprite.src] = fw;
      frameSizeCache[frameHeightKey(sprite.src)] = fh;
      setFrameWidth(fw);
      setFrameHeight(fh);
    };
    img.onerror = () => {
      console.error(`Error cargando: ${sprite.src}`);
      frameSizeCache[sprite.src] = 64;
      frameSizeCache[frameHeightKey(sprite.src)] = 64;
      setFrameWidth(64);
      setFrameHeight(64);
    };
    img.src = sprite.src;
  }, [sprite.src, sprite.frames, animationKey]);

  useLayoutEffect(() => {
    if (!frameHeight || !viewportRef.current) return;
    const nextScale = viewportRef.current.clientHeight / frameHeight;
    setRenderScale(nextScale > 0 ? nextScale : 1);
  }, [frameHeight, size, frameWidth]);

  const startLoop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    frameRef.current = 0;
    setCurrentFrame(0);

    intervalRef.current = setInterval(() => {
      frameRef.current = (frameRef.current + 1) % sprite.frames;
      setCurrentFrame(frameRef.current);
    }, 1000 / sprite.fps) as unknown as number;
  }, [sprite.frames, sprite.fps]);

  useEffect(() => {
    startLoop();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [startLoop, animationKey]);

  const levelFilter =
    level === 1
      ? "brightness(0.7) grayscale(0.3)"
      : level === 3
        ? "drop-shadow(0 0 0.8vmin #fde047)"
        : "none";

  const activeFilter = isTransforming
    ? showLevelUp
      ? "drop-shadow(0 0 2vmin #fde047) brightness(1.3)"
      : "brightness(0.5) grayscale(0.5)"
    : levelFilter;

  const scaledFrameWidth = frameWidth ? frameWidth * renderScale : null;
  const scaledSheetWidth = scaledFrameWidth
    ? scaledFrameWidth * sprite.frames
    : null;

  return (
    <div style={wrapperStyle(embedded)}>
      {isTransforming && showLevelUp && (
        <>
          {[
            { top: "-30%", left: "10%", delay: "0s" },
            { top: "-30%", left: "60%", delay: "0.1s" },
            { top: "20%", left: "-20%", delay: "0.15s" },
            { top: "20%", left: "80%", delay: "0.2s" },
            { top: "60%", left: "5%", delay: "0.05s" },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: p.top,
                left: p.left,
                fontSize: "2vmin",
                animation: `starBurst 0.8s ease-out ${p.delay} forwards`,
                pointerEvents: "none",
              }}
            >
              ⭐
            </div>
          ))}
        </>
      )}

      {isTransforming && showLevelDown && (
        <>
          {[
            { top: "0%", left: "20%", delay: "0s" },
            { top: "0%", left: "50%", delay: "0.1s" },
            { top: "20%", left: "35%", delay: "0.15s" },
          ].map((p, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: p.top,
                left: p.left,
                fontSize: "1.8vmin",
                animation: `cloudPuff 0.8s ease-out ${p.delay} forwards`,
                pointerEvents: "none",
              }}
            >
              💨
            </div>
          ))}
        </>
      )}

      <div
        ref={viewportRef}
        key={animationKey}
        style={{
          width: size,
          height: size,
          overflow: "hidden",
          position: "relative",
          filter: activeFilter,
          willChange: "transform",
          flexShrink: 0,
        }}
      >
        <img
          src={sprite.src}
          alt="Beni"
          style={{
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            left: scaledFrameWidth
              ? `-${currentFrame * scaledFrameWidth}px`
              : `${-currentFrame * 100}%`,
            height: scaledFrameWidth && frameHeight ? `${frameHeight * renderScale}px` : "100%",
            width: scaledSheetWidth ? `${scaledSheetWidth}px` : `${sprite.frames * 100}%`,
            maxWidth: "none",
            imageRendering: "pixelated",
            userSelect: "none",
            pointerEvents: "none",
            willChange: "left",
          }}
          draggable={false}
        />
      </div>

      <div
        style={{
          width: "70%",
          height: "0.6vmin",
          background: "#000",
          opacity: 0.2,
          marginTop: "0.3vmin",
          borderRadius: 0,
          willChange: "transform",
          animation: "shadowPulse 0.4s steps(2) infinite",
        }}
      />
    </div>
  );
}
