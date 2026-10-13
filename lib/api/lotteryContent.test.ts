import assert from "node:assert/strict";
import test from "node:test";
import { LOTTERY_CATALOG_ENTRIES } from "@/app/data/lotteryCatalogMockData";
import { LOTTERY_FEATURED_ITEMS } from "@/app/data/lotteryHubMockData";
import { getLotteryPlayRounds } from "@/app/data/lotteryRoundsMockData";
import { fetchLotteryCatalog, fetchLotteryHub, fetchLotteryPlayRounds } from "./lotteryContent";

test("lottery content readers resolve the current mocks", async () => {
  const catalog = await fetchLotteryCatalog();
  assert.ok(catalog.ok && catalog.data === LOTTERY_CATALOG_ENTRIES);
  const hub = await fetchLotteryHub();
  assert.ok(hub.ok && hub.data.featured === LOTTERY_FEATURED_ITEMS);
  const from = new Date("2026-10-01T00:00:00.000Z");
  const rounds = await fetchLotteryPlayRounds("thai-government", from);
  assert.ok(rounds.ok);
  if (rounds.ok) assert.deepEqual(rounds.data, getLotteryPlayRounds("thai-government", from));
});
