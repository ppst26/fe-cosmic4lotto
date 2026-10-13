"use client";

import { use } from "react";
import { LotteryPlayPage } from "@/components/lottery/LotteryPlayPage";

type PageProps = {
  params: Promise<{ marketId: string; roundId: string }>;
};

export default function LotteryMarketPlayPage({ params }: PageProps) {
  const { marketId, roundId } = use(params);
  return <LotteryPlayPage marketId={marketId} roundId={roundId} />;
}
