import type { ThaiLottoDraw } from "@/app/types/lottery";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { LotteryDrawCard } from "@/components/lottery/play/LotteryDrawCard";

export function ThaiLottoDrawCard({
  draw,
  remainingMs,
}: {
  draw: ThaiLottoDraw;
  remainingMs: number | null;
}) {
  const { t, roundLabel } = useLotteryI18n();
  return (
    <LotteryDrawCard
      title={t("markets.thaiGovernment")}
      drawLabel={roundLabel(draw.drawLabel)}
      remainingMs={remainingMs}
      flagLabel="TH"
      flagTone="th"
      marketSlug="thai-government"
    />
  );
}
