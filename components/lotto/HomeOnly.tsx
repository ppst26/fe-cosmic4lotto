"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/lib/i18n/navigation";

/** แสดง children เฉพาะหน้าแรก (/) — หมวดอื่นใน lobby ซ่อน */
export function HomeOnly({ children }: { children: ReactNode }) {
  return usePathname() === "/" ? <>{children}</> : null;
}
