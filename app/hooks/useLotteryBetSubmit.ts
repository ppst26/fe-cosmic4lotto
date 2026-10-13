"use client";

import { useCallback, useState } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { useT } from "@/lib/i18n/I18nProvider";
import { submitLotteryBetSlip } from "@/lib/lottery/submitBetSlip";
import type { SubmitLotteryBetRequest } from "@/app/types/lotteryBetApi";

export type LotteryBetDialogState = { kind: "error"; message: string };

export interface LotteryBetRoundMeta {
  drawLabel: string;
  drawCloseAt: string;
  continuePlayHref: string;
}

/**
 * ส่งโพย mock — สำเร็จแล้วไปหน้าสรุปโพย · ผิดพลาดเปิด dialog
 */
export function useLotteryBetSubmit(continuePlayHref?: string) {
  const router = useRouter();
  const t = useT("lottery");
  const [dialog, setDialog] = useState<LotteryBetDialogState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const closeDialog = useCallback(() => setDialog(null), []);

  const submit = useCallback(
    async (payload: SubmitLotteryBetRequest): Promise<boolean> => {
      setIsSubmitting(true);
      try {
        const result = await submitLotteryBetSlip({
          ...payload,
          continuePlayHref: payload.continuePlayHref ?? continuePlayHref,
        });
        if (result.ok) {
          const playHref = encodeURIComponent(
            payload.continuePlayHref ?? continuePlayHref ?? "/lottery",
          );
          router.push(`/lottery/slips/${result.slipId}?continue=${playHref}`);
          return true;
        }
        setDialog({ kind: "error", message: result.error });
        return false;
      } catch {
        setDialog({ kind: "error", message: t("submit.networkError") });
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [continuePlayHref, router, t],
  );

  return { submit, dialog, closeDialog, isSubmitting };
}

/** ผูกส่งโพยหวยรัฐบาลไทยกับ roundId จาก URL */
export function useThaiGovernmentBetSubmit(roundId: string, meta: LotteryBetRoundMeta) {
  const { submit, dialog, closeDialog, isSubmitting } = useLotteryBetSubmit(meta.continuePlayHref);

  const onSubmit = useCallback(
    async (entries: { typeId: string; number: string; amount: number }[]) => {
      return submit({
        market: "thai-government",
        roundId,
        drawLabel: meta.drawLabel,
        drawCloseAt: meta.drawCloseAt,
        continuePlayHref: meta.continuePlayHref,
        /** ส่งแค่ประเภท · เลข · ยอด — ป้ายชื่อและอัตราจ่าย server เป็นคนกำหนด */
        lines: entries.map((entry) => ({
          typeKey: entry.typeId,
          number: entry.number,
          amount: entry.amount,
        })),
      });
    },
    [meta.continuePlayHref, meta.drawCloseAt, meta.drawLabel, roundId, submit],
  );

  return { onSubmit, dialog, closeDialog, isSubmitting };
}

/** ผูกส่งโพยยี่กี/ตลาดหวยที่ใช้ YikiBetBoard */
export function useYikiStyleBetSubmit(market: string, roundId: string, meta: LotteryBetRoundMeta) {
  const { submit, dialog, closeDialog, isSubmitting } = useLotteryBetSubmit(meta.continuePlayHref);

  const onSubmit = useCallback(
    async (entries: { settlementTypeId: string; number: string; amount: number | null }[]) => {
      return submit({
        market,
        roundId,
        drawLabel: meta.drawLabel,
        drawCloseAt: meta.drawCloseAt,
        continuePlayHref: meta.continuePlayHref,
        lines: entries.map((entry) => ({
          typeKey: entry.settlementTypeId,
          number: entry.number,
          amount: entry.amount ?? 0,
        })),
      });
    },
    [market, meta.continuePlayHref, meta.drawCloseAt, meta.drawLabel, roundId, submit],
  );

  return { onSubmit, dialog, closeDialog, isSubmitting };
}
