import assert from "node:assert/strict";
import test from "node:test";
import { VIP_PLAYER_MOCK } from "@/app/data/vipMockData";
import { REFERRAL_MOCK_REF_CODE } from "@/app/data/referralMockData";
import { CASHBACK_PLAY_PANEL_MOCK } from "@/app/data/cashbackMockData";
import { DAILY_CHECKIN_INITIAL } from "@/app/data/dailyCheckInMockData";
import { GEMS_STORE_BALANCE_MOCK } from "@/app/data/gemsStoreMockData";
import { ACTIVITIES_HUB_ITEMS } from "@/app/data/activitiesHubMockData";
import { PROFILE_HUB_STATS_MOCK } from "@/app/data/profileHubMockData";
import { MOCK_MAIN_WALLET_BALANCE } from "@/app/data/walletMockData";
import { MENU_DIALOG_TICKET_COUNT_MOCK } from "@/app/data/menuMockData";
import type { ApiResult } from "./http";
import { fetchVipPlayer } from "./vip";
import { fetchReferralOverview } from "./referral";
import { fetchCashbackPanels } from "./cashback";
import { fetchCheckIn } from "./checkIn";
import { fetchGemsStore } from "./gemsStore";
import { fetchWheel } from "./wheel";
import { fetchActivities } from "./activities";
import { fetchMenuTicketCount, fetchProfileHubStats, fetchWalletBalance } from "./profile";

/** ดึง data จาก ApiResult ที่ต้องสำเร็จ */
async function ok<T>(promise: Promise<ApiResult<T>>): Promise<T> {
  const res = await promise;
  assert.ok(res.ok, "expected ok result");
  return (res as { ok: true; data: T }).data;
}

test("member readers resolve the current mocks as ApiResult", async () => {
  assert.equal(await ok(fetchVipPlayer()), VIP_PLAYER_MOCK);
  assert.equal((await ok(fetchReferralOverview())).refCode, REFERRAL_MOCK_REF_CODE);
  assert.equal((await ok(fetchCashbackPanels())).play, CASHBACK_PLAY_PANEL_MOCK);
  assert.equal((await ok(fetchCheckIn())).days, DAILY_CHECKIN_INITIAL);
  assert.equal((await ok(fetchGemsStore())).balance, GEMS_STORE_BALANCE_MOCK);
  assert.equal(await ok(fetchActivities()), ACTIVITIES_HUB_ITEMS);
  assert.equal(await ok(fetchProfileHubStats()), PROFILE_HUB_STATS_MOCK);
  assert.equal((await ok(fetchWalletBalance())).amount, MOCK_MAIN_WALLET_BALANCE);
  assert.equal(await ok(fetchMenuTicketCount()), MENU_DIALOG_TICKET_COUNT_MOCK);
  assert.ok(await ok(fetchWheel()));
});
