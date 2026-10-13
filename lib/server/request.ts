/**
 * helper อ่าน/ตรวจ request ฝั่ง route handler (mock server ใน app/api)
 * ไม่พึ่ง library — ตรวจชนิดข้อมูลก่อนใช้ทุก field (body จาก client เชื่อไม่ได้)
 */

/** ขนาด body สูงสุดที่ยอมรับ (ไบต์) */
const MAX_JSON_BODY_BYTES = 16 * 1024;

/**
 * อ่าน JSON body ที่เป็น object — null ถ้าไม่ใช่ JSON, ไม่ใช่ object หรือใหญ่เกิน
 */
export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_JSON_BODY_BYTES) return null;
  let text: string;
  try {
    text = await request.text();
  } catch {
    return null;
  }
  if (text.length > MAX_JSON_BODY_BYTES) return null;
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** string ที่ trim แล้ว ยาวไม่เกิน max — ไม่ใช่ string / ยาวเกิน → null */
export function readString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length <= max ? trimmed : null;
}

/** ตัวเลขจำนวนเต็มในช่วง [min, max] — อย่างอื่น → null */
export function readInt(value: unknown, min: number, max: number): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isInteger(n) && n >= min && n <= max ? n : null;
}

/** path ภายในเว็บเท่านั้น (กัน open redirect) — อย่างอื่น → null */
export function readInternalPath(value: unknown, max = 200): string | null {
  const path = readString(value, max);
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return null;
  return path;
}

/** IP ของผู้เรียก — ใช้เป็น key ของ rate limit (หลัง proxy/CDN อ่านจาก x-forwarded-for) */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "local";
}
