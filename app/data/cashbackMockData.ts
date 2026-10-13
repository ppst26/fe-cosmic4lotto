/** ข้อมูล mock หน้าคืนยอด (/cashback) */

import { getMenuIconSrc } from "@/app/data/menuIconAssets";
import type { CashbackTabId, CashbackPanelMock, CashbackMessageKey } from "@/app/types/cashback";

export const CASHBACK_TABS: { id: CashbackTabId; labelKey: CashbackMessageKey }[] = [
  { id: "play", labelKey: "tabs.play" },
  { id: "loss", labelKey: "tabs.loss" },
];

/** ไอคอน hero ยอดคืนที่รับได้ — public/assets/3d/menuicon/cashback.avif */
export const CASHBACK_PAGE_ICON_SRC =
  getMenuIconSrc("cashback") ?? "/assets/3d/menuicon/cashback.avif";

/** แท็บคืนยอดเล่น — สถานะว่างตาม mock */
export const CASHBACK_PLAY_PANEL_MOCK: CashbackPanelMock = {
  titleKey: "tabs.play",
  subtitleKey: "panel.playSubtitle",
  claimableThb: 0,
  statusHintKey: "panel.nothingToClaim",
  ratePercent: 0.5,
  minThb: 50,
  maxPerClaimThb: 0,
  cycleLabelKey: "panel.cycleDaily",
  canClaim: false,
  claimButtonLabelKey: "panel.nothingToClaim",
};

/** แท็บคืนยอดเสีย — mock เริ่มต้นยังไม่มียอด (สลับ UI ได้เมื่อมี API) */
export const CASHBACK_LOSS_PANEL_MOCK: CashbackPanelMock = {
  titleKey: "tabs.loss",
  subtitleKey: "panel.lossSubtitle",
  claimableThb: 0,
  statusHintKey: "panel.nothingToClaim",
  ratePercent: 8,
  minThb: 50,
  maxPerClaimThb: 0,
  cycleLabelKey: "panel.cycleDaily",
  canClaim: false,
  claimButtonLabelKey: "panel.nothingToClaim",
};

