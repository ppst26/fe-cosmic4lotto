import assert from "node:assert/strict";
import test from "node:test";
import { CASHBACK_PLAY_PANEL_MOCK } from "@/app/data/cashbackMockData";
import { claimCashback } from "./cashback";
import { claimCheckInDay, claimCheckInMilestone } from "./checkIn";
import { redeemGemsPackage } from "./gemsStore";
import { fetchNotifications } from "./notifications";
import { claimReferralEarnings } from "./referral";
import { spinWheel } from "./wheel";

test("claimCashback resets the claimable amount and echoes what was claimed", async () => {
  const res = await claimCashback({ kind: "play" });
  assert.ok(res.ok);
  assert.equal(res.data.claimedThb, CASHBACK_PLAY_PANEL_MOCK.claimableThb);
  assert.equal(res.data.panel.claimableThb, 0);
  assert.equal(res.data.panel.canClaim, false);
});

test("check-in, gems, referral claims return what the UI applies", async () => {
  const day = await claimCheckInDay({ day: 1, credits: 5 });
  assert.ok(day.ok && day.data.day === 1 && day.data.credits === 5);
  const ms = await claimCheckInMilestone({ milestoneDay: 7, gemsReward: 20 });
  assert.ok(ms.ok && ms.data.gemsReward === 20);
  const gems = await redeemGemsPackage({ packageId: "p1", gemsCost: 1000, credits: 50 });
  assert.ok(gems.ok && gems.data.gemsSpent === 1000 && gems.data.credits === 50);
  const ref = await claimReferralEarnings({ claimableThb: 142.5 });
  assert.ok(ref.ok && ref.data.claimedThb === 142.5);
});

test("spinWheel picks a segment inside the wheel", async () => {
  for (let i = 0; i < 20; i += 1) {
    const res = await spinWheel({ method: "gems", segmentCount: 8 });
    assert.ok(res.ok);
    assert.ok(res.data.segmentIndex >= 0 && res.data.segmentIndex < 8);
  }
});

test("notifications mock is empty with zero unread", async () => {
  const res = await fetchNotifications();
  assert.ok(res.ok && res.data.unreadCount === 0 && res.data.items.length === 0);
});
