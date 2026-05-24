import breathingSprite from "../assets/animation/breathing.png";
import runningSprite from "../assets/animation/running.png";
import celebrationSprite from "../assets/animation/celebration.png";
import sadnessSprite from "../assets/animation/sadness.png";
import interestingSprite from "../assets/animation/interesting.png";
import levelUpSprite from "../assets/animation/level-up.png";
import dropLevelSprite from "../assets/animation/drop-in-level.png";

export const BENI_SPRITES = {
  breathing: { src: breathingSprite, frames: 4, fps: 6 },
  running: { src: runningSprite, frames: 4, fps: 10 },
  celebration: { src: celebrationSprite, frames: 4, fps: 8 },
  sadness: { src: sadnessSprite, frames: 4, fps: 6 },
  interesting: { src: interestingSprite, frames: 2, fps: 4 },
  levelUp: { src: levelUpSprite, frames: 4, fps: 8 },
  dropLevel: { src: dropLevelSprite, frames: 4, fps: 8 },
} as const;

export type BeniAnimation = keyof typeof BENI_SPRITES;

export function getFrameWidth(img: HTMLImageElement, totalFrames: number): number {
  return img.naturalWidth / totalFrames;
}
