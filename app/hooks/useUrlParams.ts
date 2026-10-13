"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";

/**
 * ตัวกรองหลาย query param ที่สะท้อนลง URL แบบ "เปลี่ยนทันที" (ต่อยอดแนวคิดเดียวกับ useUrlTab)
 * - แก้ค่า = setState ทันที + history.replaceState (ไม่รอ navigation) · ค่าที่เท่า default ไม่ใส่ใน URL
 * - URL เปลี่ยนจากข้างนอก (ลิงก์ · ปุ่มย้อนกลับ) → ซิงก์เข้า state
 *
 * @param defaults ค่าเริ่มต้นของทุก key (กำหนดรายการ key ที่ hook ดูแล)
 * @param sanitize คืนค่าที่ใช้ได้ (ค่าไม่รู้จัก → default) — ใช้กัน ?market=… ที่แต่งมา
 */
export function useUrlParams<K extends string>(
  defaults: Readonly<Record<K, string>>,
  sanitize?: (key: K, raw: string) => string,
): readonly [Record<K, string>, (patch: Partial<Record<K, string>>) => void] {
  const searchParams = useSearchParams();
  const keys = Object.keys(defaults) as K[];

  const readUrl = (): Record<K, string> => {
    const out = {} as Record<K, string>;
    for (const key of keys) {
      const raw = searchParams.get(key);
      out[key] = raw === null ? defaults[key] : (sanitize ? sanitize(key, raw) : raw);
    }
    return out;
  };

  const fromUrl = readUrl();
  const signature = keys.map((key) => fromUrl[key]).join("\u0001");
  const [values, setValues] = useState<Record<K, string>>(fromUrl);
  const [seenSignature, setSeenSignature] = useState(signature);

  /** URL เปลี่ยนจากข้างนอก → ซิงก์ระหว่าง render (ไม่ใช้ effect) */
  if (signature !== seenSignature) {
    setSeenSignature(signature);
    setValues(fromUrl);
  }

  const update = useCallback(
    (patch: Partial<Record<K, string>>) => {
      const next = { ...values, ...patch } as Record<K, string>;
      setValues(next);
      const url = new URL(window.location.href);
      for (const key of keys) {
        if (next[key] === defaults[key]) url.searchParams.delete(key);
        else url.searchParams.set(key, next[key]);
      }
      window.history.replaceState(window.history.state, "", url);
    },
    // keys/defaults เป็นค่าคงที่ของผู้เรียก (ประกาศนอก component)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values],
  );

  return [values, update] as const;
}
