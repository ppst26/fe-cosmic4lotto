import type { VipModalTabId } from "@/app/types/vip";

/** query บนหน้า /vip — แท็บระดับ / แร็งค์ / สิทธิประโยชน์ */
export const VIP_PAGE_TAB_QUERY_KEY = "tab";

/**
 * อ่านแท็บจาก ?tab= บนหน้า VIP
 */
export function parseVipPageTab(value: string | null): VipModalTabId {
  if (value === "rank" || value === "benefits") return value;
  return "my-level";
}

/**
 * href หน้า VIP — default ไม่ใส่ query เมื่อเป็นระดับของฉัน
 */
export function vipPageHref(tab: VipModalTabId = "my-level"): string {
  if (tab === "my-level") return "/vip";
  return `/vip?${VIP_PAGE_TAB_QUERY_KEY}=${tab}`;
}
