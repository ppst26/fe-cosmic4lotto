import { SITE_BRAND_MOCK } from "@/app/data/siteBrandMockData";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

/**
 * แบรนด์ของเว็บที่ backend เปลี่ยนได้โดยไม่ต้อง deploy ใหม่ — title ของแท็บ + ไอคอนแท็บ
 * ใช้ใน generateMetadata() ของ app/[lang]/layout.tsx (server)
 */
export interface SiteBrand {
  /** ข้อความบนแท็บเบราว์เซอร์ (ใช้กับทุกภาษา) */
  title: string;
  /** favicon — path ในเว็บ ("/brand/favicon.png") หรือ URL เต็มบน CDN (https://…) แนะนำ PNG สี่เหลี่ยมจัตุรัส ≥ 64px */
  faviconUrl: string;
  /** ไอคอนตอนเพิ่มลงหน้าจอหลัก iOS — PNG จัตุรัส 180×180 ไม่โปร่งใส */
  appleTouchIconUrl: string;
}

/** ค่าที่ใช้เมื่อ API ล้มเหลวหรือไม่ส่งฟิลด์ใดฟิลด์หนึ่ง */
export const DEFAULT_SITE_BRAND: SiteBrand = SITE_BRAND_MOCK;

/**
 * ข้อมูลแบรนด์ — GET /api/site/brand
 * ต่อ backend: แทน mockResult ด้วย apiFetch<Partial<SiteBrand>>(ENDPOINTS.fetchSiteBrand.path)
 * (เรียกจาก server — ต้องตั้ง NEXT_PUBLIC_API_BASE_URL แบบ absolute · แนะนำให้ backend ตั้ง Cache-Control เพราะค่านี้เปลี่ยนไม่บ่อย)
 */
export function fetchSiteBrand(): Promise<ApiResult<Partial<SiteBrand>>> {
  return mockResult(SITE_BRAND_MOCK);
}

/** รับเฉพาะ path ในเว็บ ("/…" ไม่ใช่ "//host") หรือ https:// เท่านั้น */
export function isSafeIconUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const url = value.trim();
  if (!url) return false;
  if (url.startsWith("//")) return false;
  return url.startsWith("/") || /^https:\/\//i.test(url);
}

/** ตรวจค่าจาก API ทีละฟิลด์ — ฟิลด์ที่ว่าง/ผิดรูปใช้ค่าเริ่มต้นแทน (ไม่ทำให้แท็บว่างหรือไอคอนหาย) */
export function resolveSiteBrand(input: Partial<SiteBrand> | null | undefined): SiteBrand {
  const title = typeof input?.title === "string" ? input.title.trim() : "";
  return {
    title: title || DEFAULT_SITE_BRAND.title,
    faviconUrl: isSafeIconUrl(input?.faviconUrl) ? input.faviconUrl.trim() : DEFAULT_SITE_BRAND.faviconUrl,
    appleTouchIconUrl: isSafeIconUrl(input?.appleTouchIconUrl)
      ? input.appleTouchIconUrl.trim()
      : DEFAULT_SITE_BRAND.appleTouchIconUrl,
  };
}

/**
 * โหลดแบรนด์สำหรับ metadata — ไม่ throw: พลาดแล้วใช้ค่าเริ่มต้น (หน้าไม่พังเพราะ API นี้)
 */
export async function loadSiteBrand(): Promise<SiteBrand> {
  try {
    const res = await fetchSiteBrand();
    if (res.ok) return resolveSiteBrand(res.data);
    console.error("[site-brand] โหลดแบรนด์ไม่สำเร็จ:", res.error.message);
  } catch (error) {
    console.error("[site-brand] โหลดแบรนด์ไม่สำเร็จ:", error);
  }
  return DEFAULT_SITE_BRAND;
}
