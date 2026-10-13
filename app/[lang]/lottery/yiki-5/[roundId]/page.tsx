"use client";

import { use } from "react";
import { LotteryPlayPage } from "@/components/lottery/LotteryPlayPage";

type PageProps = {
  params: Promise<{ roundId: string }>;
};

export default function Yiki5PlayPage({ params }: PageProps) {
  const { roundId } = use(params);
  return <LotteryPlayPage marketId="yiki-5" roundId={roundId} />;
}
