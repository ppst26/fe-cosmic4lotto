"use client";

import { useMemo } from "react";
import { getThaiLottoDrawByRoundId } from "@/app/data/lotteryRoundsMockData";
import { useThaiLottoBoard } from "@/app/hooks/api/lottery";
import { useThaiGovernmentBetSubmit } from "@/app/hooks/useLotteryBetSubmit";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { LotteryBetResultDialog } from "@/app/components/lottery/LotteryBetResultDialog";
import { EmptyState, LoadingState } from "@/app/components/ui/StatusState";
import { ThaiLottoBetBoard } from "@/components/lottery/thai/ThaiLottoBetBoard";

type ThaiGovernmentPlayScreenProps = {
  roundId: string;
  onStepChange?: (step: "pick" | "price") => void;
};

/** Step 3 — แทงหวยรัฐบาลไทยตามรอบที่เลือก (ส่งโพยผ่าน useThaiGovernmentBetSubmit → /api/lottery/bets) */
export function ThaiGovernmentPlayScreen({ roundId, onStepChange }: ThaiGovernmentPlayScreenProps) {
  const { t, roundLabel } = useLotteryI18n();
  const thaiBoard = useThaiLottoBoard().data;
  const draw = useMemo(() => getThaiLottoDrawByRoundId(roundId), [roundId]);
  const betMeta = draw
    ? {
        drawLabel: roundLabel(draw.drawLabel),
        drawCloseAt: draw.closeAt,
        continuePlayHref: `/lottery/thai-government/${roundId}`,
      }
    : null;
  const { onSubmit, dialog, closeDialog, isSubmitting } = useThaiGovernmentBetSubmit(
    roundId,
    betMeta ?? { drawLabel: "", drawCloseAt: "", continuePlayHref: "/lottery/thai-government" },
  );

  if (!draw) {
    return (
      <EmptyState
        className="mt-4"
        title={t("board.roundNotFoundTitle")}
        description={t("board.roundNotFoundOther")}
        primaryAction={{ label: t("board.viewAllRounds"), href: "/lottery/thai-government" }}
      />
    );
  }

  if (!thaiBoard) {
    return <LoadingState label={t("board.loading")} />;
  }

  return (
    <div className="lottery-thai-theme flex flex-col gap-2">
      <ThaiLottoBetBoard
        draw={draw}
        groups={thaiBoard.groups}
        betTypes={thaiBoard.betTypes}
        backHref="/lottery/thai-government"
        onStepChange={onStepChange}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
      <LotteryBetResultDialog state={dialog} onClose={closeDialog} />
    </div>
  );
}
