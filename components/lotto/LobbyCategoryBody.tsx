"use client";

import type { ReactNode } from "react";
import { LobbyProvidersView } from "@/app/components/lobby/LobbyProvidersView";
import { usePathname } from "@/lib/i18n/navigation";
import { resolveLobbyCategory } from "./lobby-category";

/**
 * เนื้อหาใต้เมนูหมวด — หมวดหวย (/) แสดงหน้าแรกเดิม · หมวดอื่นสลับเป็นรายการค่ายเกมตาม route
 * (โครงเดียวกับ LobbyCategoryProviders ของ glass: layout คงที่ เนื้อหาเปลี่ยนตาม pathname)
 */
export function LobbyCategoryBody({ home }: { home: ReactNode }) {
  const category = resolveLobbyCategory(usePathname());
  if (category === "lottery") return <>{home}</>;
  return <LobbyProvidersView key={category} categoryId={category} />;
}
