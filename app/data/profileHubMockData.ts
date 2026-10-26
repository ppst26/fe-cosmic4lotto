import type { ProfileHubStats } from "@/app/types/profile";
import { getVipRankDisplayNumber, VIP_PLAYER_MOCK } from "./vipMockData";

const VIP_LEVEL = getVipRankDisplayNumber(VIP_PLAYER_MOCK.currentRankId);

export const PROFILE_HUB_STATS_MOCK: ProfileHubStats = {
  vipLevel: VIP_LEVEL,
  vipLabel: `VIP ${VIP_LEVEL}`,
  diamonds: 1250,
  lossBonusThb: 350,
  affiliateBalanceThb: 2450,
  activePromotionLabel: "โบนัสสมาชิกใหม่",
};
