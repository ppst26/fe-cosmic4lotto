import { localizedRedirect } from "@/lib/i18n/server";

/** ปิดแลกพอยท์เป็นเงิน — ส่งกลับศูนย์รางวัล */
export default async function ExchangeMoneyPage() {
  await localizedRedirect("/reward");
}
