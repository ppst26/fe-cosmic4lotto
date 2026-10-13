"use client";

import { fetchActivities } from "@/lib/api/activities";
import { fetchCashbackPanels, fetchLossRebate } from "@/lib/api/cashback";
import { fetchCheckIn } from "@/lib/api/checkIn";
import { fetchGemsStore } from "@/lib/api/gemsStore";
import { fetchMenuTicketCount, fetchProfileHubStats, fetchSignUpOptions } from "@/lib/api/profile";
import { fetchReferralEarnings, fetchReferralOverview, fetchReferralUsers } from "@/lib/api/referral";
import {
  fetchExchangeMoney,
  fetchFreespins,
  fetchLuckyBox,
  fetchRandomCard,
  fetchRewardHub,
} from "@/lib/api/rewardFeatures";
import { fetchVipBenefits, fetchVipPlayer, fetchVipRanks } from "@/lib/api/vip";
import { fetchWheel } from "@/lib/api/wheel";
import { useApi, usePrefetchApi, type PrefetchTarget } from "@/app/hooks/useApi";

/**
 * hook ข้อมูลสมาชิก / รางวัล / VIP — component เรียกผ่านที่นี่ (SWR dedupe ข้ามหน้า)
 * auth = ข้อมูลของผู้ใช้ (ยังไม่ login → idle) · ไม่มี auth = เนื้อหาสาธารณะ
 */

/* ── บัญชี ── */
export const useProfileHubStats = () => useApi(["profile-hub-stats"], fetchProfileHubStats, { auth: true });
export const useMenuTicketCount = () => useApi(["menu-ticket-count"], fetchMenuTicketCount, { auth: true });
export const useSignUpOptions = () => useApi(["sign-up-options"], fetchSignUpOptions);

/* ── VIP ── */
export const useVipPlayer = () => useApi(["vip-player"], fetchVipPlayer, { auth: true });
export const useVipRanks = () => useApi(["vip-ranks"], fetchVipRanks);
export const useVipBenefits = () => useApi(["vip-benefits"], fetchVipBenefits);

/* ── แนะนำเพื่อน ── */
export const useReferralOverview = () => useApi(["referral-overview"], fetchReferralOverview, { auth: true });
export const useReferralUsers = () => useApi(["referral-users"], fetchReferralUsers, { auth: true });
export const useReferralEarnings = () => useApi(["referral-earnings"], fetchReferralEarnings, { auth: true });

/* ── cashback / เช็คอิน ── */
export const useCashbackPanels = () => useApi(["cashback-panels"], fetchCashbackPanels, { auth: true });
export const useLossRebate = () => useApi(["loss-rebate"], fetchLossRebate, { auth: true });
export const useCheckIn = () => useApi(["check-in"], fetchCheckIn, { auth: true });

/* ── รางวัล / เพชร / วงล้อ ── */
export const useGemsStore = () => useApi(["gems-store"], fetchGemsStore, { auth: true });
export const useWheel = () => useApi(["wheel"], fetchWheel, { auth: true });
export const useRewardHub = () => useApi(["reward-hub"], fetchRewardHub, { auth: true });
export const useLuckyBox = () => useApi(["lucky-box"], fetchLuckyBox);
export const useRandomCard = () => useApi(["random-card"], fetchRandomCard);
export const useExchangeMoney = () => useApi(["exchange-money"], fetchExchangeMoney);
export const useFreespins = () => useApi(["freespins"], fetchFreespins);

/* ── กิจกรรม ── */
export const useActivities = () => useApi(["activities"], fetchActivities);

/* ── อุ่น cache ข้อมูลแท็บข้างเคียง (หน้า standalone ที่มีหลายแท็บ) — key/load ต้องตรงกับ hook ด้านบน ── */
const VIP_TAB_TARGETS: readonly PrefetchTarget[] = [{ key: ["vip-benefits"], load: fetchVipBenefits }];
const REFERRAL_TAB_TARGETS: readonly PrefetchTarget[] = [
  { key: ["referral-users"], load: fetchReferralUsers, auth: true },
  { key: ["referral-earnings"], load: fetchReferralEarnings, auth: true },
];
const CASHBACK_TAB_TARGETS: readonly PrefetchTarget[] = [{ key: ["loss-rebate"], load: fetchLossRebate, auth: true }];

/** หน้า VIP — โหลดตารางสิทธิประโยชน์รอไว้ก่อนกดแท็บ */
export const usePrefetchVipTabs = () => usePrefetchApi(VIP_TAB_TARGETS);
/** หน้าแนะนำเพื่อน — โหลดรายชื่อเพื่อน + รายได้รอไว้ */
export const usePrefetchReferralTabs = () => usePrefetchApi(REFERRAL_TAB_TARGETS);
/** หน้าคืนยอด — โหลดแท็บคืนยอดเสียรอไว้ */
export const usePrefetchCashbackTabs = () => usePrefetchApi(CASHBACK_TAB_TARGETS);
