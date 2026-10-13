/**
 * คืนเลขกลับทุกแบบ (permutation ไม่ซ้ำ) เช่น "123" → 123,132,213,231,312,321
 * ใช้ตอนเปิด "กลับเลข" ใน ThaiLottoBetBoard / YikiBetBoard
 */
export function uniquePermutations(value: string): string[] {
  if (value.length <= 1) return [value];
  const result = new Set<string>();
  for (let i = 0; i < value.length; i += 1) {
    const rest = value.slice(0, i) + value.slice(i + 1);
    for (const tail of uniquePermutations(rest)) {
      result.add(value[i] + tail);
    }
  }
  return [...result];
}

/** แสดงเลขโพยแบบมีช่องว่างระหว่างหลัก — อ่านง่ายในแถบสรุป (เช่น 655 → 6 5 5) */
export function formatLotteryDigitsDisplay(value: string): string {
  return value.replace(/\s/g, "").split("").join(" ");
}

/** แปลงยอดเงินเป็นรูปแบบ 1,234.50 — ใช้ในโพยและสรุปยอด */
export function formatBaht(value: number): string {
  return value.toLocaleString("th-TH", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/** วันเวลาแบบสรุปโพย / countdown ที่ขึ้นกับภาษา — ใช้ผ่าน useLotteryI18n (lib/lottery/labels.ts) */

export {
  BANGKOK_OFFSET_MS,
  dateFromBangkokWall,
  formatBangkokTimeHHmm,
  getBangkokWallParts,
} from "@/app/lib/bangkokTime";
