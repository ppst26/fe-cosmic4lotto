"use client";

import { use } from "react";
import { LotteryMarketRoundsPage } from "@/components/lottery/rounds/LotteryMarketRoundsPage";

type PageProps = {
  params: Promise<{ marketId: string }>;
};

export default function LotteryMarketPage({ params }: PageProps) {
  const { marketId } = use(params);
  return <LotteryMarketRoundsPage marketSlug={marketId} />;
}
