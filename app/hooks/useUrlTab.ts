"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * สถานะแท็บที่สะท้อนลง query string (?tab=…) แบบ "เปลี่ยนทันที"
 * - เปลี่ยนแท็บ = setState ทันที + อัปเดต URL ด้วย history.replaceState (Next sync กับ useSearchParams ให้)
 *   ไม่ผ่าน router.replace จึงไม่มี navigation / RSC round-trip ที่ต้องรอก่อนเนื้อหาเปลี่ยน
 * - URL เปลี่ยนจากข้างนอก (ลิงก์ · ปุ่มย้อนกลับ) → ซิงก์เข้า state ตามเดิม
 * ใช้กับหน้า standalone ที่มีหลายแท็บ (VIP · ธุรกรรม)
 *
 * @param key ชื่อ query param เช่น "tab" · "kind"
 * @param parse แปลงค่าใน URL → แท็บ (ค่าที่ไม่รู้จัก → แท็บเริ่มต้น)
 * @param defaultTab แท็บเริ่มต้น — เลือกแล้วจะลบ param ออกจาก URL (URL สั้น)
 */
export function useUrlTab<T extends string>(
  key: string,
  parse: (value: string | null) => T,
  defaultTab: T,
): readonly [T, (next: T) => void] {
  const searchParams = useSearchParams();
  const fromUrl = parse(searchParams.get(key));
  const [tab, setTab] = useState<T>(fromUrl);
  const [seenUrlTab, setSeenUrlTab] = useState<T>(fromUrl);

  /** URL เปลี่ยนจากข้างนอก → ซิงก์ระหว่าง render (ไม่ใช้ effect) */
  if (fromUrl !== seenUrlTab) {
    setSeenUrlTab(fromUrl);
    setTab(fromUrl);
  }

  const select = useCallback(
    (next: T) => {
      setTab(next);
      const url = new URL(window.location.href);
      if (next === defaultTab) url.searchParams.delete(key);
      else url.searchParams.set(key, next);
      window.history.replaceState(window.history.state, "", url);
    },
    [key, defaultTab],
  );

  return [tab, select] as const;
}
