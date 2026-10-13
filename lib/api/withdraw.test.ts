import assert from "node:assert/strict";
import test from "node:test";
import {
  WITHDRAW_AVAILABLE_BALANCE,
  WITHDRAW_DEFAULT_AMOUNT,
  WITHDRAW_QUICK_AMOUNTS,
  WITHDRAW_USER_BANK_MOCK,
} from "@/app/data/withdrawMockData";
import {
  fetchWithdrawAccount,
  fetchWithdrawBalance,
  fetchWithdrawQuickAmounts,
  submitWithdraw,
} from "./withdraw";

test("withdraw reads return the current mock as ApiResult", async () => {
  assert.deepEqual(await fetchWithdrawAccount(), { ok: true, status: 200, data: WITHDRAW_USER_BANK_MOCK });
  assert.deepEqual(await fetchWithdrawBalance(), { ok: true, status: 200, data: WITHDRAW_AVAILABLE_BALANCE });
  assert.deepEqual(await fetchWithdrawQuickAmounts(), {
    ok: true,
    status: 200,
    data: { amounts: WITHDRAW_QUICK_AMOUNTS, defaultAmount: WITHDRAW_DEFAULT_AMOUNT },
  });
});

test("submitWithdraw resolves ok after 500ms", async () => {
  const started = Date.now();
  assert.deepEqual(await submitWithdraw({ amount: 100 }), { ok: true });
  assert.ok(Date.now() - started >= 500);
});
