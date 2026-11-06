import { LotteryPlayPage } from "@/components/lottery/LotteryPlayPage";

type PageProps = {
  params: Promise<{ roundId: string }>;
};

/**
 * รอบสร้างตามเวลา — ไม่ prerender ตอน build แต่ render ครั้งแรกแล้วแคชเป็นหน้า static
 * (เดิมเป็น dynamic → <Link> ไม่ prefetch กดรอบแล้วต้องรอ server render ทุกครั้ง)
 */
export function generateStaticParams() {
  return [];
}

export default async function Play({ params }: PageProps) {
  const { roundId } = await params;
  return <LotteryPlayPage marketId="yiki-15" roundId={roundId} />;
}
