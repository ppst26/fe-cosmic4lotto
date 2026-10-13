import assert from "node:assert/strict";
import test from "node:test";
import { submitCoupon } from "./coupon";

test("known coupon codes succeed with the existing message", async () => {
  const result = await submitCoupon("COSMIC100");
  assert.deepEqual(result, {
    ok: true,
    message: "แลกเครดิตฟรีสำเร็จ — ยอดจะเข้ากระเป๋าในไม่กี่นาที (mock)",
  });
});

test("unknown coupon codes fail with the existing message", async () => {
  const result = await submitCoupon("NOPE");
  assert.deepEqual(result, {
    ok: false,
    error: "รหัสคูปองไม่ถูกต้องหรือหมดอายุแล้ว",
  });
});
