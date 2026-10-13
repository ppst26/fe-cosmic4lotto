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
