"use client";

import { useMemo } from "react";
import { EmptyState, LoadingState } from "@/app/components/ui/StatusState";
import { useYikiBoard } from "@/app/hooks/api/lottery";
import { useYikiStyleBetSubmit } from "@/app/hooks/useLotteryBetSubmit";
import { lotteryPlayMarketMeta, resolveLotteryPlayRound } from "@/lib/lottery/resolvePlayRound";
import { YikiBetBoard } from "./yiki/YikiBetBoard";
import { LotteryBetResultDialog } from "./LotteryBetResultDialog";
import { useLotteryI18n } from "./useLotteryI18n";

interface LotteryYikiPlayBoardProps {
  marketSlug: string;
  roundId: string;
  backHref: string;
  onStepChange?: (step: "pick" | "price") => void;
}

/**
 * กระดานแทงยี่กี/หวยหุ้น — UI เดียวกับหวยรัฐบาล · resolve รอบจาก slug+id
 * ส่งโพยผ่าน useYikiStyleBetSubmit → /api/lottery/bets
 */
export function LotteryYikiPlayBoard({
  marketSlug,
  roundId,
  backHref,
  onStepChange,
}: LotteryYikiPlayBoardProps) {
  const { t, roundLabel } = useLotteryI18n();
  const yikiBoard = useYikiBoard().data;
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
        primaryAction={{ label: t("board.viewAllRounds"), href: backHref }}
      />
    );
  }

  if (!yikiBoard) {
    return <LoadingState label={t("board.loading")} />;
  }

  return (
    <div className="lottery-thai-theme flex flex-col gap-2">
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
    </div>
  );
}
