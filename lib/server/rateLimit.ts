/**
 * rate limit แบบ fixed window ในหน่วยความจำ — สำหรับ mock server เท่านั้น
 * (หลาย instance / serverless ไม่แชร์กัน · backend จริงต้องใช้ store กลาง เช่น Redis หรือ gateway)
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const globalForLimits = globalThis as typeof globalThis & { __cosmicRateLimits?: Map<string, Bucket> };

function store(): Map<string, Bucket> {
  if (!globalForLimits.__cosmicRateLimits) globalForLimits.__cosmicRateLimits = new Map();
  return globalForLimits.__cosmicRateLimits;
}

export interface RateLimitResult {
  ok: boolean;
  /** วินาทีที่ต้องรอ (ใช้ตั้ง header Retry-After) */
  retryAfterSec: number;
}

/**
 * นับครั้งต่อ key ภายในช่วงเวลา — เกิน limit คืน ok:false
 * ใช้ใน POST /api/auth/login · /api/auth/register
 */
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): RateLimitResult {
  const buckets = store();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 10_000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    return { ok: true, retryAfterSec: 0 };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfterSec: 0 };
}
