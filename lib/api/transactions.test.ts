import assert from "node:assert/strict";
import test from "node:test";
import { MOCK_DEPOSIT_TRANSACTIONS } from "@/app/data/transactionsMockData";
import { fetchTransactions } from "./transactions";

test("fetchTransactions filters by kind and date range", async () => {
  const all = await fetchTransactions({ kind: "deposit", from: new Date(2000, 0, 1), to: new Date(2100, 0, 1) });
  assert.ok(all.ok);
  if (all.ok) assert.equal(all.data.length, MOCK_DEPOSIT_TRANSACTIONS.length);

  const none = await fetchTransactions({ kind: "deposit", from: new Date(1990, 0, 1), to: new Date(1990, 0, 2) });
  assert.ok(none.ok);
  if (none.ok) assert.equal(none.data.length, 0);
});
