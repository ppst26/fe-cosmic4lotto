import type { MessageKey } from "@/lib/i18n/messages";

/* ── จาก app/data/activitiesHubMockData.ts ── */

export type ActivityHubCategoryTab = "slots" | "casino";

/** แท็บหมวดกิจกรรม — labelKey แปลตอน render (namespace rewards) */
export interface ActivityHubCategoryTabItem {
  id: ActivityHubCategoryTab;
  labelKey: MessageKey<"rewards">;
}

export type ActivityTierClaimState = "locked" | "claimable" | "claimed";

export interface ActivityTierRow {
  rank: number;
  turnRequired: number;
  bonus: number;
  claimState: ActivityTierClaimState;
}

export type ActivityThumbTone =
  | "turn"
  | "xl-win"
  | "check-in"
  | "football"
  | "mascot"
  | "cashback";

export type ActivityDetailKind = "turn-tier" | "info";

export interface ActivityHubItem {
  id: string;
  title: string;
  /** รูปภาพจาก public เช่น /event/... */
  imageUrl?: string;
  thumbTone: ActivityThumbTone;
  detailKind: ActivityDetailKind;
  /** ข้อความใต้ชื่อในรายการ */
  listMeta?: string;
  /** ป้ายทับรูป (เช่น ยังไม่เปิด) */
  statusOverlay?: string;
  /** ระยะเวลากิจกรรม */
  period?: string;
  categoryTabs?: ActivityHubCategoryTab[];
  progress?: {
    currentTurn: number;
    rank1Target: number;
    bonusEarned: number;
    bonusCap: number;
  };
  tiersByCategory?: Partial<Record<ActivityHubCategoryTab, ActivityTierRow[]>>;
  infoSummary?: string;
  infoBullets?: string[];
  /** กติกาและเงื่อนไขของกิจกรรม */
  rules?: string[];
}
