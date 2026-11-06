import { LotteryPlayPage } from "@/components/lottery/LotteryPlayPage";

type PageProps = {
  params: Promise<{ marketId: string; roundId: string }>;
};

/**
 * รอบสร้างตามเวลา — ไม่ prerender ตอน build แต่ render ครั้งแรกแล้วแคชเป็นหน้า static
 * (เดิมเป็น dynamic → <Link> ไม่ prefetch กดรอบแล้วต้องรอ server render ทุกครั้ง)
 */
export function generateStaticParams() {
  return [];
}

export default async function LotteryMarketPlayPage({ params }: PageProps) {
  const { marketId, roundId } = await params;
  return <LotteryPlayPage marketId={marketId} roundId={roundId} />;
}
