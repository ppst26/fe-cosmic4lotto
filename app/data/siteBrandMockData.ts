import type { SiteBrand } from "@/lib/api/siteBrand";

/**
 * ข้อมูลแบรนด์ของเว็บ (mock) — ใช้เป็นทั้งค่าจาก fetchSiteBrand() ตอนยังไม่มี backend
 * และค่าสำรองเมื่อ API ล้มเหลว / ส่งค่าไม่ครบ (ดู lib/api/siteBrand.ts)
 * ค่าตั้งต้นตรงกับของเดิมก่อนมี API (title จาก meta.json · favicon.ico · apple-touch-icon)
 */
export const SITE_BRAND_MOCK: SiteBrand = {
  title: "หวยออนไลน์เจ้าใหญ่ ให้เรทสูง จ่ายไว ได้ชัวร์ - CM-SaturnLotto",
  faviconUrl: "/favicon.ico",
  appleTouchIconUrl: "/pwa/apple-touch-icon.png",
};
