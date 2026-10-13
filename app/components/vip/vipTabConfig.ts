import type { VipModalTabId } from "@/app/types/vip";
import type { MessageKey } from "@/lib/i18n/messages";

/** แท็บหลักหน้า VIP — ใช้ร่วม VipTabList · VipPageContent */
export const VIP_PAGE_TABS: { id: VipModalTabId; labelKey: MessageKey<"vip"> }[] = [
  { id: "my-level", labelKey: "tabs.myLevel" },
  { id: "rank", labelKey: "tabs.rank" },
  { id: "benefits", labelKey: "tabs.benefits" },
];
