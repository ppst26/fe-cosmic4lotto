"use client";

import { use } from "react";
import { LotteryPlayPage } from "@/components/lottery/LotteryPlayPage";

type PageProps = {
  params: Promise<{ roundId: string }>;
};

export default function Yiki15PlayPage({ params }: PageProps) {
  const { roundId } = use(params);
  return <LotteryPlayPage marketId="yiki-15" roundId={roundId} />;
}
