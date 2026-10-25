import { LotteryHubPage } from "@/components/lottery/hub/LotteryHubPage";
import { fetchLotteryHub } from "@/lib/api/lotteryContent";

/** ดึงข้อมูล hub บนเซิร์ฟเวอร์ — การ์ดอยู่ใน HTML แรก (LCP ไม่ต้องรอ hydrate + fetch ฝั่ง client) */
export default async function LotteryPage() {
  const result = await fetchLotteryHub();
  return <LotteryHubPage hub={result.ok ? result.data : undefined} />;
}
