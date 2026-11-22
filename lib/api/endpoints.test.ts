import assert from "node:assert/strict";
import test from "node:test";
import { ENDPOINTS } from "./endpoints";

test("endpoint map lists the deposit contract", () => {
  assert.deepEqual(ENDPOINTS.fetchDepositMethods, {
    method: "GET",
    path: "/api/deposit/methods",
    auth: true,
    client: "fetchDepositMethods",
  });
  assert.equal(ENDPOINTS.submitCoupon.method, "POST");
  assert.equal(ENDPOINTS.submitCoupon.path, "/api/coupons/redeem");
});

test("endpoint map lists the action and game/notification contracts", () => {
  assert.equal(ENDPOINTS.claimCashback.method, "POST");
  assert.equal(ENDPOINTS.claimCashback.path, "/api/cashback/claim");
  assert.equal(ENDPOINTS.spinWheel.path, "/api/wheel/spin");
  assert.equal(ENDPOINTS.redeemGemsPackage.path, "/api/gems-store/redeem");
  assert.equal(ENDPOINTS.fetchNotifications.path, "/api/notifications");
  assert.equal(ENDPOINTS.fetchLotteryResults.path, "/api/lottery/results");
  assert.equal(ENDPOINTS.submitWithdraw.method, "POST");
});
