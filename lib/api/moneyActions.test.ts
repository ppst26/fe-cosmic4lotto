import assert from "node:assert/strict";
import test from "node:test";
import { toCouponResult } from "./coupon";
import { toMoneySubmitResult } from "./deposit";
import type { ApiResult } from "./http";

const fail = (message: string): ApiResult<never> => ({
  ok: false,
  error: { code: "HTTP", status: 422, message },
});

test("deposit/withdraw result maps ok and server error text", () => {
  assert.deepEqual(toMoneySubmitResult({ ok: true, status: 200, data: null }), { ok: true });
  assert.deepEqual(toMoneySubmitResult(fail("ยอดต่ำกว่าขั้นต่ำ")), { ok: false, error: "ยอดต่ำกว่าขั้นต่ำ" });
});

test("coupon result uses the server message, else a default", () => {
  assert.deepEqual(toCouponResult({ ok: true, status: 200, data: { message: " ได้รับ 100 " } }), {
    ok: true,
    message: "ได้รับ 100",
  });
  assert.equal(toCouponResult({ ok: true, status: 204, data: null }).ok, true);
  assert.deepEqual(toCouponResult(fail("หมดอายุ")), { ok: false, error: "หมดอายุ" });
});
