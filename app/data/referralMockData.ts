import type {
  ReferralStatsMock,
  ReferralCommissionTier,
  ReferralUserRow,
  ReferralEarningSummaryMock,
  ReferralEarningHistoryRow,
  ReferralEarningPeriodId,
  ReferralMessageKey,
} from "@/app/types/referral";

export const REFERRAL_MOCK_REF_CODE = "COSMIC88";

export const REFERRAL_STATS_MOCK: ReferralStatsMock = {
  friendsCount: 24,
  totalTurnoverThb: 128_500,
  totalEarningsThb: 642.5,
};

export const REFERRAL_COMMISSION_TIERS: ReferralCommissionTier[] = [
  {
    id: "tier-1",
    titleKey: "tiers.tier1.title",
    subtitleKey: "tiers.tier1.subtitle",
    rateLabel: "0.5%",
    rateHintKey: "tiers.rateHint",
  },
  {
    id: "tier-2",
    titleKey: "tiers.tier2.title",
    subtitleKey: "tiers.tier2.subtitle",
    rateLabel: "0.05%",
    rateHintKey: "tiers.rateHint",
  },
];

export const REFERRAL_FEATURE_CHECKS: ReferralMessageKey[] = [
  "checks.realtime",
  "checks.lifetimeCommission",
  "checks.minWithdraw",
];

export const REFERRAL_STEPS: { id: string; labelKey: ReferralMessageKey }[] = [
  { id: "copy", labelKey: "steps.copy" },
  { id: "share", labelKey: "steps.share" },
  { id: "earn", labelKey: "steps.earn" },
];

/** จำนวนแถว mock ให้ตรงกับ stats.friendsCount */
function buildReferralUsersMock(count: number): ReferralUserRow[] {
  const base = new Date("2026-09-14T18:42:00+07:00");
  return Array.from({ length: count }, (_, index) => {
    const userNum = String(count - index).padStart(3, "0");
    const registeredAt = new Date(base.getTime() - index * 5 * 60 * 60 * 1000);
    return {
      id: `ref-user-${userNum}`,
      username: `cosmic_${userNum}`,
      registeredAt: registeredAt.toISOString(),
    };
  });
}

export const REFERRAL_USERS_MOCK: ReferralUserRow[] = buildReferralUsersMock(
  REFERRAL_STATS_MOCK.friendsCount,
);

export const REFERRAL_EARNING_SUMMARY_MOCK: ReferralEarningSummaryMock = {
  bonusReceivedThb: 500,
  bonusClaimableThb: 142.5,
};

function buildReferralEarningHistoryMock(): ReferralEarningHistoryRow[] {
  const amounts = [120, 80, 65, 50, 45, 40, 35, 30, 25, 20, 18, 15, 12, 10];
  const base = new Date("2026-09-14T18:42:00+07:00");
  return amounts.map((amountThb, index) => ({
    id: `ref-earn-${index + 1}`,
    amountThb,
    occurredAt: new Date(base.getTime() - index * 6 * 60 * 60 * 1000).toISOString(),
  }));
}

export const REFERRAL_EARNING_HISTORY_MOCK: ReferralEarningHistoryRow[] =
  buildReferralEarningHistoryMock();

export const REFERRAL_EARNING_PERIOD_OPTIONS: { id: ReferralEarningPeriodId; labelKey: ReferralMessageKey }[] = [
  { id: "all", labelKey: "periods.all" },
  { id: "today", labelKey: "periods.today" },
  { id: "week", labelKey: "periods.lastWeek" },
  { id: "month", labelKey: "periods.lastMonth" },
];

