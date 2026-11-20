import { createElement, type CSSProperties, type ReactNode } from "react";
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

/** key สำหรับรีเพลย์ stagger เมื่อลิสต์เปลี่ยน (ค้นหา · เปลี่ยนค่าย) */
export function gameCardEnterListKey(ids: string[]) {
  return ids.join("|");
}

/** ห่อการ์ด/เซลล์กริด — ใช้ทุกหมวดค่ายเกม */
export function GameCardStaggerShell({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: ReactNode;
}) {
  return createElement(
    "div",
    {
      className: gameCardEnterClassName(className),
      style: gameCardEnterStyle(index),
    },
    children,
  );
}
