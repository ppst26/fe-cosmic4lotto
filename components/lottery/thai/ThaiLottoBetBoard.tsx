"use client";

import Link from "@/lib/i18n/navigation";
import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { uniquePermutations } from "@/app/components/lottery/lotteryUtils";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import type {
  LotteryMessageKey,
  ThaiLottoBetEntry,
  ThaiLottoBetType,
  ThaiLottoBetTypeId,
  ThaiLottoDigitGroup,
  ThaiLottoDraw,
} from "@/app/types/lottery";
import { ThaiLottoDrawCard } from "./ThaiLottoDrawCard";
import { ThaiLottoBetTypePicker } from "./ThaiLottoBetTypePicker";
import { ThaiLottoBetSlip } from "./ThaiLottoBetSlip";
import { ThaiLottoPricePanel } from "./ThaiLottoPricePanel";
import { LotteryNumberPad } from "@/components/lottery/play/LotteryNumberPad";
import { LotteryNumberGrid } from "@/components/lottery/play/LotteryNumberGrid";
import { LotteryInputModeTabs, type LotteryInputMode } from "@/components/lottery/play/LotteryInputModeTabs";
import { LotteryPriceControls } from "@/components/lottery/play/LotteryPriceControls";
import { LotteryPriceStepCard } from "@/components/lottery/play/LotteryPriceStepCard";
import type { LotteryPriceSlipHandle } from "@/components/lottery/play/LotteryPriceSlipPanel";

/** แท็บวิธีใส่เลข — ป้ายแปลตอน render (lottery.inputMode.*) */
const INPUT_MODE_IDS: LotteryInputMode[] = ["manual", "grid"];

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
  );
}

type ThaiLottoBetBoardProps = {
  draw: ThaiLottoDraw;
  groups: { id: ThaiLottoDigitGroup; labelKey: LotteryMessageKey }[];
  betTypes: ThaiLottoBetType[];
  backHref: string;
  onSubmit?: (entries: ThaiLottoBetEntry[]) => void | Promise<boolean>;
  isSubmitting?: boolean;
  onStepChange?: (step: "pick" | "price") => void;
};

export function ThaiLottoBetBoard({
  draw,
  groups,
  betTypes,
  backHref,
  onSubmit,
  onStepChange,
  isSubmitting = false,
}: ThaiLottoBetBoardProps) {
  const { t } = useLotteryI18n();
  const inputModes = INPUT_MODE_IDS.map((id) => ({ id, label: t(`inputMode.${id}`) }));
  const firstTypeOf = useCallback(
    (group: ThaiLottoDigitGroup) => betTypes.find((type) => type.group === group)?.id,
    [betTypes],
  );

  const [activeGroup, setActiveGroup] = useState<ThaiLottoDigitGroup>(groups[0].id);
  const [selectedTypeIds, setSelectedTypeIds] = useState<ThaiLottoBetTypeId[]>(() => {
    const first = betTypes.find((type) => type.group === groups[0].id);
    return first ? [first.id] : [];
  });
  const [inputMode, setInputMode] = useState<LotteryInputMode>("manual");
  const [input, setInput] = useState("");
  const [isReverse, setIsReverse] = useState(false);
  const [entries, setEntries] = useState<ThaiLottoBetEntry[]>([]);
  const [lastAddedIds, setLastAddedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [step, setStep] = useState<"pick" | "price">("pick");
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [sameForAll, setSameForAll] = useState(false);
  const priceSlipRef = useRef<LotteryPriceSlipHandle>(null);
  const entryCounter = useRef(0);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  useEffect(() => {
    const closeAt = new Date(draw.closeAt).getTime();
    const tick = () => setRemainingMs(closeAt - Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [draw.closeAt]);

  const isClosed = remainingMs !== null && remainingMs <= 0;
  const digits = betTypes.find((type) => type.group === activeGroup)?.digits ?? 3;
  const canReverse = digits > 1;

  const addToSlip = (number: string) => {
    const reversed = isReverse && canReverse ? uniquePermutations(number) : [number];
    const candidates = selectedTypeIds.flatMap((typeId) =>
      (typeId === "three_tod" ? [number] : reversed).map((value) => ({ typeId, number: value })),
    );
    const fresh = candidates.filter(
      (candidate) =>
        !entries.some((entry) => entry.typeId === candidate.typeId && entry.number === candidate.number),
    );

    if (fresh.length === 0) {
      setFeedback(t("feedback.duplicate", { number }));
      return;
    }

    const added = fresh.map((candidate) => {
      entryCounter.current += 1;
      return { id: `bet-${entryCounter.current}`, ...candidate, amount: 0 };
    });
    setEntries((prev) => [...added, ...prev]);
    setLastAddedIds(added.map((entry) => entry.id));
    setFeedback(t("feedback.added", { number, count: fresh.length }));
  };

  const handleUndoLastAdd = () => {
    if (lastAddedIds.length === 0) return;
    setEntries((prev) => prev.filter((entry) => !lastAddedIds.includes(entry.id)));
    setLastAddedIds([]);
    setFeedback(t("feedback.undone"));
  };

  const handleDigit = (digit: string) => {
    if (selectedTypeIds.length === 0) return;
    const next = input + digit;
    if (next.length > digits) return;

    setInput(next);
    setFeedback("");

    if (next.length < digits) return;

    if (isClosed) {
      setFeedback(t("feedback.closed"));
      return;
    }

    const number = next;
    const pushSlip = () => {
      addToSlip(number);
      setInput("");
    };
    if (digits === 1) {
      window.setTimeout(pushSlip, 150);
    } else {
      requestAnimationFrame(() => requestAnimationFrame(pushSlip));
    }
  };

  const handleBackspace = () => setInput((prev) => prev.slice(0, -1));

  const selectedNumbers = new Set(
    entries
      .filter((entry) => selectedTypeIds.includes(entry.typeId) && entry.number.length === digits)
      .map((entry) => entry.number),
  );

  const handleGridToggle = (number: string) => {
    if (isClosed || selectedTypeIds.length === 0) return;
    if (!selectedNumbers.has(number)) {
      addToSlip(number);
      return;
    }
    setEntries((prev) =>
      prev.filter((entry) => !(entry.number === number && selectedTypeIds.includes(entry.typeId))),
    );
    setFeedback(t("feedback.removed", { number }));
  };

  const handleInputModeChange = (mode: LotteryInputMode) => {
    setInputMode(mode);
    setInput("");
    setFeedback("");
  };

  // รองรับแป้นพิมพ์จริงบนจอใหญ่ (เฉพาะแท็บกรอกเลขเอง) — useEffectEvent อ่าน state ล่าสุดโดยไม่ต้องผูก listener ใหม่
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (inputMode !== "manual") return;
    if (isTypingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
    if (/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      handleDigit(event.key);
    } else if (event.key === "Backspace") {
      event.preventDefault();
      handleBackspace();
    }
  });
  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleGroupChange = (group: ThaiLottoDigitGroup) => {
    if (group === activeGroup) return;
    setActiveGroup(group);
    const first = firstTypeOf(group);
    setSelectedTypeIds(first ? [first] : []);
    setInput("");
    setFeedback("");
  };

  const handleToggleType = (typeId: ThaiLottoBetTypeId) => {
    setSelectedTypeIds((prev) => {
      if (!prev.includes(typeId)) return [...prev, typeId];
      return prev.length > 1 ? prev.filter((id) => id !== typeId) : prev;
    });
  };

  const handleGoToPrice = () => {
    if (entries.length === 0 || isClosed) return;
    setSelectedEntryId(entries[0]?.id ?? null);
    setSameForAll(false);
    setStep("price");
  };

  const handleQuickAmount = (amount: number) => {
    const clamped = Math.min(draw.maxBet, Math.max(draw.minBet, amount));
    setEntries((prev) =>
      prev.map((entry) =>
        sameForAll || entry.id === selectedEntryId ? { ...entry, amount: clamped } : entry,
      ),
    );
    if (!sameForAll && selectedEntryId) priceSlipRef.current?.focusNextAfter(selectedEntryId);
  };

  const isAmountValid = (amount: number) => amount >= draw.minBet && amount <= draw.maxBet;
  const priceTotal = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId) ?? null;
  const canConfirm =
    Boolean(onSubmit) &&
    !isSubmitting &&
    !isClosed &&
    entries.length > 0 &&
    entries.every((entry) => isAmountValid(entry.amount));

  const resetSlipAfterSuccess = () => {
    setEntries([]);
    setLastAddedIds([]);
    setSelectedEntryId(null);
    setSameForAll(false);
    setInput("");
    setFeedback("");
    setStep("pick");
  };

  const handleSubmitSlip = async () => {
    if (!onSubmit || !canConfirm) return;
    const ok = await onSubmit(entries);
    if (ok) resetSlipAfterSuccess();
  };

  return (
    <div className={`thai-lotto-layout${step === "price" ? " thai-lotto-layout--price" : ""}`}>
      {step === "pick" ? (
        <div className="thai-lotto-layout__draw">
          <ThaiLottoDrawCard draw={draw} remainingMs={remainingMs} />
        </div>
      ) : null}

      <div className="thai-lotto-layout__slip">
        {step === "pick" ? (
          <ThaiLottoBetSlip
            entries={entries}
            betTypes={betTypes}
            onRemove={(entryId) => setEntries((prev) => prev.filter((entry) => entry.id !== entryId))}
            onClearAll={() => {
              setEntries([]);
              setLastAddedIds([]);
              setFeedback("");
            }}
            canUndo={lastAddedIds.length > 0}
            onUndo={handleUndoLastAdd}
          />
        ) : (
          <LotteryPriceStepCard
            controls={
              <LotteryPriceControls
                sameForAll={sameForAll}
                onToggleSameForAll={setSameForAll}
                onBack={() => setStep("pick")}
                onQuickAmount={handleQuickAmount}
                onSubmit={() => void handleSubmitSlip()}
                submitDisabled={!canConfirm}
                isSubmitting={isSubmitting}
                total={priceTotal}
                selectedAmount={selectedEntry?.amount ?? null}
              />
            }
          >
            <ThaiLottoPricePanel
              handleRef={priceSlipRef}
              entries={entries}
              betTypes={betTypes}
              selectedEntryId={selectedEntryId}
              onSelectEntry={setSelectedEntryId}
              onAmountChange={(entryId, amount) =>
                setEntries((prev) =>
                  prev.map((entry) => (entry.id === entryId ? { ...entry, amount } : entry)),
                )
              }
              onRemove={(entryId) => setEntries((prev) => prev.filter((entry) => entry.id !== entryId))}
            />
          </LotteryPriceStepCard>
        )}
      </div>

      {step === "pick" ? (
        <section
          className="thai-lotto-panel thai-lotto-layout__input flex h-full min-h-0 flex-col gap-0 overflow-hidden px-1.5 py-2 sm:gap-4 sm:p-4 md:p-5"
          aria-label={t("board.pickAria")}
        >
          <div className="thai-lotto-layout__input-body flex min-h-0 flex-1 flex-col gap-2">
            <ThaiLottoBetTypePicker
              groups={groups}
              betTypes={betTypes}
              activeGroup={activeGroup}
              selectedTypeIds={selectedTypeIds}
              onGroupChange={handleGroupChange}
              onToggleType={handleToggleType}
            />

            {canReverse ? (
              <button
                type="button"
                aria-pressed={isReverse}
                onClick={() => setIsReverse((prev) => !prev)}
                className={`thai-lotto-toggle inline-flex items-center gap-2 self-start min-h-8${isReverse ? " is-active" : ""}`}
              >
                <span className="thai-lotto-toggle__track relative h-5 w-9" aria-hidden="true">
                  <span className="thai-lotto-toggle__thumb absolute top-0.5 left-0.5 h-4 w-4 rounded-full" />
                </span>
                {t("board.reverse")}
              </button>
            ) : null}

            <LotteryInputModeTabs
              modes={inputModes}
              activeMode={inputMode}
              onChange={handleInputModeChange}
              panelId="thai-lotto-input-panel"
            />

            <div id="thai-lotto-input-panel" role="tabpanel">
              {inputMode === "manual" ? (
                <LotteryNumberPad
                  digits={digits}
                  value={input}
                  onDigit={handleDigit}
                  onBackspace={handleBackspace}
                  onClear={() => setInput("")}
                />
              ) : (
                <LotteryNumberGrid
                  digits={digits}
                  selectedNumbers={selectedNumbers}
                  disabled={isClosed}
                  onToggle={handleGridToggle}
                />
              )}
            </div>

            {feedback ? (
              <p className="thai-lotto-feedback" aria-live="polite">
                {feedback}
              </p>
            ) : null}
          </div>

          <div className="thai-lotto-pick-actions grid shrink-0 gap-2 pt-1.5" aria-label={t("board.actionsAria")}>
            <Link href={backHref} className="thai-lotto-pick-actions__back soft-btn-outline min-h-11 text-center text-sm font-semibold">
              {t("board.back")}
            </Link>
            <button
              type="button"
              className="soft-btn-primary min-h-11 w-full text-sm font-semibold disabled:opacity-50"
              disabled={entries.length === 0 || isClosed}
              onClick={handleGoToPrice}
            >
              {t("board.enterPrice")}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
