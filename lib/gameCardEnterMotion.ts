import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** คลาสเฟดเข้าทีละใบ — นิยามใน styles/motion-glass.css */
export const GAME_CARD_ENTER_CLASS = "motion-game-card-enter";

/** delay stagger ตามลำดับในกริด (--game-card-stagger) */
export function gameCardEnterStyle(index: number): CSSProperties {
  return { "--i": index } as CSSProperties;
}

/** รวมคลาส enter กับ className เดิม */
export function gameCardEnterClassName(className?: string) {
  return cn(GAME_CARD_ENTER_CLASS, className);
}
