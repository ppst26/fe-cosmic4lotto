"use client";

import type { ReactNode } from "react";

export function LotteryPriceStepCard({
  children,
  controls,
}: {
  children: ReactNode;
  controls: ReactNode;
}) {
  return (
    <div className="thai-lotto-panel lottery-price-step-card flex flex-col gap-3 p-3 sm:gap-4 sm:p-4 md:p-5">
      <div className="lottery-price-step-card__scroll">{children}</div>
      <div className="lottery-price-step-card__dock">{controls}</div>
    </div>
  );
}
