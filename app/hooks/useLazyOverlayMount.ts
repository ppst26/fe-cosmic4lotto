"use client";

import { useEffect, useState } from "react";

/**
 * หน่วง mount overlay ไว้จนเปิดครั้งแรก แล้วคามันไว้ตลอด
 * ใช้คู่กับ next/dynamic ใน provider ระดับ root (ฝาก/ถอน/คูปอง/แจ้งเตือน/login/สมัคร)
 * — ก่อนเปิดครั้งแรก: chunk ไม่ถูกโหลด bundle หน้าแรกจึงไม่แบกน้ำหนัก overlay ที่ยังไม่ได้ใช้
 * — หลังเปิดครั้งแรก: ยัง mount อยู่ Radix จึงเล่น exit animation (data-[state=closed]) ได้ปกติ
 */
export function useLazyOverlayMount(isOpen: boolean): boolean {
  const [shouldMount, setShouldMount] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldMount(true);
  }, [isOpen]);

  return shouldMount;
}
