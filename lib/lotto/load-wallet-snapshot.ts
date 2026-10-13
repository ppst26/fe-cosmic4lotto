import fs from "fs";
import path from "path";

export type WalletSnapshot = { money: string; credit: string };

export function loadWalletFromDump(): WalletSnapshot {
  const file = path.join(
    process.cwd(),
    "../dump/bblotto.iltx.cc/_api/api-0028.json",
  );
  if (!fs.existsSync(file)) {
    return { money: "0.00", credit: "0.00" };
  }
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as { body: string };
  const body = JSON.parse(raw.body) as {
    data?: { money?: number; credit?: number; score?: number };
  };
  const d = body.data;
  const money = Number(d?.money ?? 0).toFixed(2);
  const credit = Number(d?.credit ?? d?.score ?? 0).toFixed(2);
  return { money, credit };
}
