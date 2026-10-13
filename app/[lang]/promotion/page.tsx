import { localizedRedirect } from "@/lib/i18n/server";

/** เส้นทางเดิมของหน้าแรก lotto — ไปหน้า /promotions (ไม่ต้องแก้ component หน้าแรก) */
export default async function PromotionAlias() {
  await localizedRedirect("/promotions");
}
