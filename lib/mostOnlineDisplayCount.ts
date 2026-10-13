/**
 * จำนวนคนออนไลน์ที่แสดงบนการ์ด most-online — สุ่มจาก id ค่ายให้คงที่ต่อการ์ด (ไม่กระพริบทุก render)
 * ใช้ใน MostOnlineProviderCard.tsx · ค่า base จาก API/mock เป็นแกน ± variance
 */

export const MOST_ONLINE_DISPLAY_MIN = 1_200;
export const MOST_ONLINE_DISPLAY_MAX = 48_000;

/** hash สตริงเป็นจำนวนเต็มไม่ติดลบ — ใช้กระจายช่วง tick ต่อค่าย */
export function hashMostOnlineId(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** ช่วงสุ่มรอบค่า base สำหรับ animation ตัวเลข */
export function getMostOnlineFluctuationBounds(base: number): { min: number; max: number } {
  const spread = Math.max(180, Math.round(base * 0.09));
  return {
    min: Math.max(MOST_ONLINE_DISPLAY_MIN, base - spread),
    max: Math.min(MOST_ONLINE_DISPLAY_MAX, base + spread),
  };
}

/**
 * คืนจำนวนออนไลน์สำหรับแสดง — ถ้ามี onlineCount จาก API จะ jitter รอบค่านั้น ไม่มีจะสุ่มในช่วงมาตรฐาน
 */
export function getMostOnlineDisplayCount(item: { id: string; onlineCount: number }): number {
  const hash = hashMostOnlineId(item.id);
  const variance = 0.78 + (hash % 45) / 100;
  const bump = (hash % 97) * 17;

  let value: number;
  if (item.onlineCount > 0) {
    value = Math.round(item.onlineCount * variance + bump);
  } else {
    const span = MOST_ONLINE_DISPLAY_MAX - MOST_ONLINE_DISPLAY_MIN;
    value = MOST_ONLINE_DISPLAY_MIN + (hash % span);
  }

  return Math.min(MOST_ONLINE_DISPLAY_MAX, Math.max(MOST_ONLINE_DISPLAY_MIN, value));
}
