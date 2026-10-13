import type {
  SubmitLotteryBetRequest,
  SubmitLotteryBetResponse,
} from "@/app/types/lotteryBetApi";
import { apiFetch } from "@/lib/api/http";

/**
 * ส่งโพยหวย — ใช้จากหน้าแทง step 3 (useLotteryBetSubmit)
 */
export async function submitLotteryBetSlip(
  body: SubmitLotteryBetRequest,
): Promise<SubmitLotteryBetResponse> {
  const res = await apiFetch<SubmitLotteryBetResponse>("/api/lottery/bets", {
    method: "POST",
    body,
  });
  return res.ok ? res.data : { ok: false, error: res.error.message };
}
