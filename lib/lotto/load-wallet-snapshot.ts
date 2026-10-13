import { fetchWalletBalance } from "@/lib/api/profile";
import { getSessionUserId } from "@/lib/auth/session";

export type WalletSnapshot = { money: string; credit: string };

/** ยอดกระเป๋าของผู้ใช้ใน session (ฝั่ง server) — guest = 0.00 · glass มียอดเดียว จึง credit = 0.00 */
export async function loadSessionWallet(): Promise<WalletSnapshot> {
  const userId = await getSessionUserId();
  if (!userId) return { money: "0.00", credit: "0.00" };
  const res = await fetchWalletBalance();
  const amount = res.ok ? res.data.amount : 0;
  return { money: Number(amount).toFixed(2), credit: "0.00" };
}

/** ชื่อเดิมที่ LottoHomePage import — เหมือน loadSessionWallet */
export const loadWalletFromDump = loadSessionWallet;
