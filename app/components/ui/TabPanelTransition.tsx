"use client";

import React, { useState, type ElementType, type ReactNode } from "react";

interface TabPanelTransitionProps {
  /** id ของแท็บที่เลือก — เปลี่ยนเมื่อไหร่ เนื้อหาจะ fade + เลื่อนเข้า */
  tabKey: string;
  /** ลำดับแท็บ (ซ้าย→ขวา) — ใช้กำหนดทิศทางที่เนื้อหาเลื่อนเข้า */
  order?: readonly string[];
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/**
 * ห่อเนื้อหาที่เปลี่ยนตามแท็บ — ไม่ remount (state/วิดีโอข้างในคงอยู่)
 * สลับชื่อ animation (a/b) ทุกครั้งที่เปลี่ยนแท็บเพื่อให้ CSS เล่นซ้ำ — ดู .motion-tab-panel ใน motion.css
 * ครั้งแรกที่ mount ไม่เล่น animation
 */
export function TabPanelTransition({
  tabKey,
  order,
  as: Tag = "div",
  className,
  children,
}: TabPanelTransitionProps) {
  const [state, setState] = useState({ key: tabKey, flip: 0, dir: 0 });

  if (state.key !== tabKey) {
    const dir = order ? Math.sign(order.indexOf(tabKey) - order.indexOf(state.key)) : 0;
    setState({ key: tabKey, flip: state.flip === 1 ? 2 : 1, dir });
  }

  return (
    <Tag
      className={["motion-tab-panel", className].filter(Boolean).join(" ")}
      data-flip={state.flip === 0 ? undefined : state.flip}
      data-dir={state.dir}
    >
      {children}
    </Tag>
  );
}
