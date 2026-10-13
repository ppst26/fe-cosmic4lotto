import { localizedPermanentRedirect } from "@/lib/i18n/server";

/**
 * path เก่า — รวมเนื้อหาไว้ที่ /cashback แท็บคืนยอดเสีย
 */
export default async function LossRebateLegacyRedirect() {
  await localizedPermanentRedirect("/cashback?tab=loss");
}
