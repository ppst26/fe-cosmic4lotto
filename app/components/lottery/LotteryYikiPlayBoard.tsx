"use client";

import React, { useMemo } from "react";
import { EmptyState } from "@/app/components/ui/StatusState";
import { YikiBetBoard } from "@/app/components/lottery/yiki/YikiBetBoard";
import { LotteryBetResultDialog } from "@/app/components/lottery/LotteryBetResultDialog";
import { useYikiBoard } from "@/app/hooks/api/lottery";
import { LoadingState } from "@/app/components/ui/StatusState";
import { lotteryPlayMarketMeta, resolveLotteryPlayRound } from "@/lib/lottery/resolvePlayRound";
import { useYikiStyleBetSubmit } from "@/app/hooks/useLotteryBetSubmit";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";

interface LotteryYikiPlayBoardProps {
  marketSlug: string;
  roundId: string;
  backHref: string;
  onStepChange: (step: "pick" | "price") => void;
}

/**
 * กระดานแทงยี่กี/หวยหุ้น — UI เดียวกับหวยรัฐบาล · resolve รอบจาก slug+id
 */
export function LotteryYikiPlayBoard({
  marketSlug,
  roundId,
  backHref,
  onStepChange,
}: LotteryYikiPlayBoardProps) {
  const { t, roundLabel } = useLotteryI18n();
  const yikiBoardResource = useYikiBoard();
  const yikiBoard = yikiBoardResource.data;
  const playRound = useMemo(
    () => resolveLotteryPlayRound(marketSlug, roundId),
    [marketSlug, roundId],
  );
  const marketMeta = useMemo(() => lotteryPlayMarketMeta(marketSlug), [marketSlug]);
  const round = playRound
    ? { id: playRound.id, label: playRound.label, closeAt: playRound.closeAt }
    : null;

  const betMeta = playRound
    ? {
        drawLabel: roundLabel(playRound.label),
        drawCloseAt: playRound.closeAt,
        continuePlayHref: `${backHref}/${roundId}`,
      }
    : { drawLabel: "", drawCloseAt: "", continuePlayHref: backHref };

  const { onSubmit, dialog, closeDialog, isSubmitting } = useYikiStyleBetSubmit(
    marketSlug,
    roundId,
    betMeta,
  );

  if (!round) {
    return (
      <EmptyState
        className="mt-4"
        title={t("board.roundNotFoundTitle")}
        description={t("board.roundNotFoundNext")}
      />
    );
  }

  if (!yikiBoard) {
    return <LoadingState label={t("board.loading")} />;
  }

  return (
    <>
      <YikiBetBoard
        round={round}
        groups={yikiBoard.groups}
        betTypes={yikiBoard.betTypes}
        settlementTypes={yikiBoard.settlement}
        backHref={backHref}
        marketTitle={t(marketMeta.titleKey)}
        flagLabel={marketMeta.flagLabel}
        flagTone={marketMeta.flagTone}
        marketSlug={marketSlug}
        onStepChange={onStepChange}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
      <LotteryBetResultDialog state={dialog} onClose={closeDialog} />
    </>
  );
}
