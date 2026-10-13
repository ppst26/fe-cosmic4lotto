"use client";

import { useCallback, useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import Link from "@/lib/i18n/navigation";
import type { LotteryFlagTone, LotteryMessageKey, ThaiLottoBetTypeId } from "@/app/types/lottery";
import type {
  YikiBetEntry,
  YikiBetType,
  YikiDigitGroup,
  YikiRound,
  YikiSettlementTypeId,
  YikiSettlementType,
} from "@/app/types/yiki";
import { mapYikiBetTypesForPicker } from "@/lib/lottery/yikiToThaiBetTypes";
import { uniquePermutations } from "@/app/components/lottery/lotteryUtils";
import { useLotteryI18n } from "@/app/components/lottery/useLotteryI18n";
import { LotteryDrawCard } from "@/components/lottery/play/LotteryDrawCard";
import { ThaiLottoBetTypePicker } from "@/components/lottery/thai/ThaiLottoBetTypePicker";
import { LotteryNumberPad } from "@/components/lottery/play/LotteryNumberPad";
import { LotteryNumberGrid } from "@/components/lottery/play/LotteryNumberGrid";
import {
  LotteryInputModeTabs,
  type LotteryInputMode,
} from "@/components/lottery/play/LotteryInputModeTabs";
import { LotteryPriceStepCard } from "@/components/lottery/play/LotteryPriceStepCard";
import type { LotteryPriceSlipHandle } from "@/components/lottery/play/LotteryPriceSlipPanel";
import { YikiSlip } from "./YikiSlip";
import { YikiPricePanel } from "./YikiPricePanel";
import { YikiPriceControls } from "./YikiPriceControls";

/** แท็บวิธีใส่เลข — ป้ายแปลตอน render (lottery.inputMode.*) */
const INPUT_MODE_IDS: LotteryInputMode[] = ["manual", "grid"];

interface YikiBetBoardProps {
  round: YikiRound;
  groups: { id: YikiDigitGroup; labelKey: LotteryMessageKey }[];
  betTypes: YikiBetType[];
  settlementTypes: Record<YikiSettlementTypeId, YikiSettlementType>;
  /** กลับหน้าก่อนหน้า — รายการรอบของยี่กี หรือหน้าเลือกหวยของตลาดที่ไม่มีรายการรอบ */
  backHref: string;
  /** ชื่อตลาดบนการ์ดหัวงวด */
  marketTitle: string;
  /** ตราตลาด — ค่าเริ่มต้นเป็นยี่กี (YK/gold) ตลาดหวยหุ้นอื่นส่งธงของตัวเองมาแทน */
  flagLabel?: string;
  flagTone?: LotteryFlagTone;
  /** slug ตลาด — การ์ดหัวงวดลิงก์ไปหน้ากติกา */
  marketSlug?: string;
  /** ส่งโพย+ราคาไป API — คืน true เมื่อสำเร็จเพื่อล้างโพย */
  onSubmit?: (entries: YikiBetEntry[]) => void | Promise<boolean>;
  isSubmitting?: boolean;
  /** แจ้ง shell เมื่อเปลี่ยนขั้น (เลือกเลข / ใส่ราคา) */
  onStepChange?: (step: "pick" | "price") => void;
}

/** เป้าหมายของ keydown เป็นช่องพิมพ์หรือไม่ — กันไม่ให้แป้นพิมพ์ไปแย่งช่องราคา */
function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
  );
}

/**
 * กระดานแทงหวยแบบ "โพยซ้าย/ใส่เลขขวา" — ถือ state ทั้งหมด (ประเภท · เลขที่กด · โพย · ขั้นใส่ราคา)
 * ใช้ร่วมกันทั้งยี่กี (5/15/30 นาที) และตลาดหวยหุ้นอื่น — ต่างกันแค่ round/flag ที่ส่งเข้ามา
 */
export function YikiBetBoard({
  round,
  groups,
  betTypes,
  settlementTypes,
  backHref,
  marketTitle,
  flagLabel = "YK",
  flagTone = "gold",
  marketSlug,
  onSubmit,
  onStepChange,
  isSubmitting = false,
}: YikiBetBoardProps) {
  const { t, roundLabel } = useLotteryI18n();
  const inputModes = INPUT_MODE_IDS.map((id) => ({ id, label: t(`inputMode.${id}`) }));
  const firstTypeOf = useCallback(
    (group: YikiDigitGroup) => betTypes.find((type) => type.group === group)?.id,
    [betTypes],
  );

  const [activeGroup, setActiveGroup] = useState<YikiDigitGroup>(groups[0].id);
  const [selectedTypeId, setSelectedTypeId] = useState<string>(() => firstTypeOf(groups[0].id) ?? "");
  const [inputMode, setInputMode] = useState<LotteryInputMode>("manual");
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<YikiBetEntry[]>([]);
  const [lastAddedIds, setLastAddedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [remainingMs, setRemainingMs] = useState<number | null>(null);
  const [step, setStep] = useState<"pick" | "price">("pick");
  // ขั้นใส่ราคา: เลือก 1 รายการ (หรือติ๊ก "ราคาเท่ากันทั้งหมด") แล้วกดชิปราคา — ใส่ราคาทันทีที่กด
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [sameForAll, setSameForAll] = useState(false);
  const priceSlipRef = useRef<LotteryPriceSlipHandle>(null);
  const entryCounter = useRef(0);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  // นับถอยหลังหลัง mount เท่านั้น เพื่อให้ markup จาก server ตรงกับ client
  useEffect(() => {
    const closeAt = new Date(round.closeAt).getTime();
    const tick = () => setRemainingMs(closeAt - Date.now());
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [round.closeAt]);

  const isClosed = remainingMs !== null && remainingMs <= 0;
  const activeType = betTypes.find((type) => type.id === selectedTypeId);
  const digits = activeType?.digits ?? 3;

  /** เพิ่มเลขที่กรอกครบลงโพยตามประเภทที่เลือก (+ กลับเลขถ้าประเภทนั้นเป็น "กลับ") ข้ามรายการที่ซ้ำ */
  const addToSlip = (number: string) => {
    if (!activeType) return;
    const numbers = activeType.reverse ? uniquePermutations(number) : [number];
    const candidates = activeType.settlementTypeIds.flatMap((settlementTypeId) =>
      numbers.map((value) => ({ settlementTypeId, number: value })),
    );
    const fresh = candidates.filter(
      (candidate) =>
        !entries.some(
          (entry) => entry.settlementTypeId === candidate.settlementTypeId && entry.number === candidate.number,
        ),
    );

    if (fresh.length === 0) {
      setFeedback(t("feedback.duplicate", { number }));
      return;
    }

    const added = fresh.map((candidate) => {
      entryCounter.current += 1;
      return { id: `yiki-${entryCounter.current}`, ...candidate, amount: null };
    });
    setEntries((prev) => [...added, ...prev]);
    setLastAddedIds(added.map((entry) => entry.id));
    setFeedback(t("feedback.added", { number, count: fresh.length }));
  };

  const handleDigit = (digit: string) => {
    if (!activeType) return;
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
    // ให้ช่องแสดงเลขครบก่อนล้าง (โดยเฉพาะหลักสุดท้าย / วิ่ง 1 ตัว)
    if (digits === 1) {
      window.setTimeout(pushSlip, 150);
    } else {
      requestAnimationFrame(() => requestAnimationFrame(pushSlip));
    }
  };

  const handleBackspace = () => setInput((prev) => prev.slice(0, -1));

  /** เลขในโพยของประเภทที่เลือกอยู่ — ใช้ไฮไลต์ปุ่มในแผงเลข */
  const selectedNumbers = new Set(
    activeType
      ? entries
          .filter(
            (entry) => activeType.settlementTypeIds.includes(entry.settlementTypeId) && entry.number.length === digits,
          )
          .map((entry) => entry.number)
      : [],
  );

  /** แผงเลข: กดเลขที่ยังไม่มี = เพิ่มลงโพย · กดเลขที่มีแล้ว = เอาออก (เฉพาะประเภทที่เลือกอยู่) */
  const handleGridToggle = (number: string) => {
    if (isClosed || !activeType) return;
    if (!selectedNumbers.has(number)) {
      addToSlip(number);
      return;
    }
    setEntries((prev) =>
      prev.filter(
        (entry) => !(entry.number === number && activeType.settlementTypeIds.includes(entry.settlementTypeId)),
      ),
    );
    setFeedback(t("feedback.removed", { number }));
  };

  const handleInputModeChange = (mode: LotteryInputMode) => {
    setInputMode(mode);
    setInput("");
    setFeedback("");
  };

  // รองรับแป้นพิมพ์จริงบนจอใหญ่ (เฉพาะแท็บกรอกเลขเอง ขั้นเลือกเลข) — useEffectEvent อ่าน state ล่าสุดโดยไม่ต้องผูก listener ใหม่
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (step !== "pick" || inputMode !== "manual") return;
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

  const handleGroupChange = (group: YikiDigitGroup) => {
    if (group === activeGroup) return;
    setActiveGroup(group);
    setSelectedTypeId(firstTypeOf(group) ?? "");
    setInput("");
    setFeedback("");
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedTypeId(typeId);
    setInput("");
    setFeedback("");
  };

  const handleUndo = () => {
    setEntries((prev) => prev.filter((entry) => !lastAddedIds.includes(entry.id)));
    setLastAddedIds([]);
  };

  const handleClearAll = () => {
    setEntries([]);
    setLastAddedIds([]);
    setFeedback("");
  };

  const handleGoToPrice = () => {
    if (entries.length === 0 || isClosed) return;
    // เข้าขั้นใส่ราคาแบบว่างเปล่าเสมอ — เลือกรายการแรกไว้ก่อนให้เริ่มใส่ราคาได้ทันที
    setSelectedEntryId(entries[0]?.id ?? null);
    setSameForAll(false);
    setStep("price");
  };

  /** กดชิปราคา — ใส่ราคาทันทีกับรายการที่เลือก (หรือทุกรายการถ้าติ๊ก "ราคาเท่ากันทั้งหมด") แล้วย้ายไปช่องถัดไป */
  const handleQuickAmount = (amount: number) => {
    setEntries((prev) =>
      prev.map((entry) => (sameForAll || entry.id === selectedEntryId ? { ...entry, amount } : entry)),
    );
    if (!sameForAll && selectedEntryId) priceSlipRef.current?.focusNextAfter(selectedEntryId);
  };

  const pickerBetTypes = useMemo(
    () => mapYikiBetTypesForPicker(betTypes, settlementTypes),
    [betTypes, settlementTypes],
  );
  const selectedTypeIdsForPicker = selectedTypeId ? [selectedTypeId as ThaiLottoBetTypeId] : [];

  const canConfirm =
    Boolean(onSubmit) &&
    !isSubmitting &&
    !isClosed &&
    entries.length > 0 &&
    entries.every((entry) => (entry.amount ?? 0) > 0);
  const priceTotal = entries.reduce((sum, entry) => sum + (entry.amount ?? 0), 0);
  const selectedEntry = entries.find((entry) => entry.id === selectedEntryId) ?? null;

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
          <LotteryDrawCard
            title={marketTitle}
            drawLabel={roundLabel(round.label)}
            remainingMs={remainingMs}
            flagLabel={flagLabel}
            flagTone={flagTone}
            marketSlug={marketSlug}
          />
        </div>
      ) : null}

      <div className="thai-lotto-layout__slip">
        {step === "pick" ? (
          <YikiSlip
            entries={entries}
            settlementTypes={settlementTypes}
            canUndo={lastAddedIds.length > 0}
            onRemove={(entryId) => setEntries((prev) => prev.filter((entry) => entry.id !== entryId))}
            onUndo={handleUndo}
            onClearAll={handleClearAll}
          />
        ) : (
          <LotteryPriceStepCard
            controls={
              <YikiPriceControls
                selectedEntry={selectedEntry}
                sameForAll={sameForAll}
                onToggleSameForAll={setSameForAll}
                onQuickAmount={handleQuickAmount}
                onBack={() => setStep("pick")}
                onSubmit={() => void handleSubmitSlip()}
                submitDisabled={!canConfirm}
                isSubmitting={isSubmitting}
                total={priceTotal}
              />
            }
          >
            <YikiPricePanel
              handleRef={priceSlipRef}
              entries={entries}
              settlementTypes={settlementTypes}
              selectedEntryId={selectedEntryId}
              onSelectEntry={setSelectedEntryId}
              onAmountChange={(entryId, amount) =>
                setEntries((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, amount } : entry)))
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
              betTypes={pickerBetTypes}
              activeGroup={activeGroup}
              selectedTypeIds={selectedTypeIdsForPicker}
              onGroupChange={handleGroupChange}
              onToggleType={(typeId) => handleTypeSelect(typeId)}
              selectionMode="single"
            />

            <LotteryInputModeTabs
              modes={inputModes}
              activeMode={inputMode}
              onChange={handleInputModeChange}
              panelId="yiki-input-panel"
            />

            <div id="yiki-input-panel" role="tabpanel">
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
            <Link
              href={backHref}
              className="thai-lotto-pick-actions__back soft-btn-outline min-h-11 text-center text-sm font-semibold"
            >
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
