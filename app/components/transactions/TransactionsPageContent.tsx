"use client";

import React, { useMemo, useState } from "react";
import type { TransactionKind } from "@/app/types/transaction";
import { TRANSACTION_KIND_TABS } from "@/app/data/transactionsMockData";
import { usePrefetchTransactionKinds, useTransactions } from "@/app/hooks/api/transactions";
import { useUrlTab } from "@/app/hooks/useUrlTab";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { toneClass } from "@/app/components/ui/valueTone";
import { getDefaultTransactionDateRange } from "@/app/lib/transactionDateUtils";
import { TransactionKindTabs } from "./TransactionKindTabs";
import { TransactionDateFilter } from "./TransactionDateFilter";
import { TransactionHistoryTable } from "./TransactionHistoryTable";
import { TransactionHistoryPagination } from "./TransactionHistoryPagination";
import { moneyDeltaRole } from "@/lib/semanticValue";
import {
  countPromotionClaims,
  sumBetStakeTotal,
  sumBetWinLossTotal,
  sumCompletedDepositAmount,
  sumCompletedWithdrawAmount,
} from "@/lib/domain/transactions";
import { TRANSACTION_BET_PAGE_SIZE } from "@/lib/uiConstants";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";

/** อ่านประเภทรายการจาก ?kind= (ค่าที่ไม่รู้จัก → ฝาก) */
function kindFromSearchParam(value: string | null): TransactionKind {
  if (value === "withdraw" || value === "promotion" || value === "bet") {
    return value;
  }
  return "deposit";
}

interface TransactionsPageContentProps {
  /** ใน hub modal — แท็บเป็น state ในเครื่อง ไม่เขียน URL และไม่มีกรอบการ์ดของหน้า */
  embedded?: boolean;
  /** แท็บเริ่มต้นของโหมด embedded */
  initialKind?: TransactionKind;
}

/**
 * เนื้อหาหน้ารายการธุรกรรม — แท็บ · ฟิลเตอร์วันที่ · ตาราง ( /transactions · hub )
 */
export function TransactionsPageContent({ embedded = false, initialKind = "deposit" }: TransactionsPageContentProps) {
  const [urlKind, selectUrlKind] = useUrlTab<TransactionKind>("kind", kindFromSearchParam, "deposit");
  const [localKind, setLocalKind] = useState<TransactionKind>(initialKind);
  const activeKind = embedded ? localKind : urlKind;
  const onSelectKind = embedded ? setLocalKind : selectUrlKind;

  const t = useT("transactions");
  const defaultRange = useMemo(() => getDefaultTransactionDateRange(), []);

  const [draftFrom, setDraftFrom] = useState(defaultRange.from);
  const [draftTo, setDraftTo] = useState(defaultRange.to);
  const [appliedFrom, setAppliedFrom] = useState(defaultRange.from);
  const [appliedTo, setAppliedTo] = useState(defaultRange.to);
  const [betPage, setBetPage] = useState(1);

  /** server กรองตามประเภท + ช่วงวันที่ (mock กรองใน lib/api) */
  const transactions = useTransactions(activeKind, appliedFrom, appliedTo);
  usePrefetchTransactionKinds(activeKind, appliedFrom, appliedTo);
  const items = useMemo(() => transactions.data ?? [], [transactions.data]);

  /** เปลี่ยนแท็บหรือช่วงวันที่ → กลับหน้า 1 (ปรับ state ระหว่าง render แทน effect) */
  const pageResetKey = `${activeKind}|${appliedFrom.getTime()}|${appliedTo.getTime()}`;
  const [prevPageResetKey, setPrevPageResetKey] = useState(pageResetKey);
  if (prevPageResetKey !== pageResetKey) {
    setPrevPageResetKey(pageResetKey);
    setBetPage(1);
  }

  const betTotalPages = Math.max(1, Math.ceil(items.length / TRANSACTION_BET_PAGE_SIZE));
  const betPageSafe = Math.min(Math.max(1, betPage), betTotalPages);

  const tableItems = useMemo(() => {
    if (activeKind !== "bet") return items;
    const start = (betPageSafe - 1) * TRANSACTION_BET_PAGE_SIZE;
    return items.slice(start, start + TRANSACTION_BET_PAGE_SIZE);
  }, [activeKind, items, betPageSafe]);

  const handleClear = () => {
    const next = getDefaultTransactionDateRange();
    setDraftFrom(next.from);
    setDraftTo(next.to);
    setAppliedFrom(next.from);
    setAppliedTo(next.to);
  };

  const handleSearch = () => {
    setAppliedFrom(draftFrom);
    setAppliedTo(draftTo);
  };

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const summaryRow = "flex items-center justify-between gap-3 rounded-[var(--radius-soft-sm)] bg-[var(--soft-card-elevated)] px-3 py-2.5 text-sm text-[var(--text-on-light)]";

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <section className={cn("flex flex-col gap-4", !embedded && "soft-panel p-3.5 sm:p-4")}>
        <TransactionKindTabs tabs={TRANSACTION_KIND_TABS} activeKind={activeKind} onSelect={onSelectKind} />

        <TransactionDateFilter
          draftFrom={draftFrom}
          draftTo={draftTo}
          onDraftChange={(from, to) => {
            setDraftFrom(from);
            setDraftTo(to);
          }}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        <ResourceGate resource={transactions} loadingLabel={t("loading")} errorTitle={t("loadError")}>
          {() => (
            <div key={activeKind} className="flex animate-fade-in flex-col gap-4">
              <TransactionHistoryTable kind={activeKind} items={tableItems} />

              {activeKind === "bet" ? (
                <TransactionHistoryPagination
                  page={betPageSafe}
                  totalPages={betTotalPages}
                  onPageChange={setBetPage}
                />
              ) : null}

              {activeKind === "deposit" ? (
                <div className={summaryRow}>
                  <span>{t("summary.depositTotal")}</span>
                  <span className={toneClass("success", "font-semibold")}>
                    {formatMoney(sumCompletedDepositAmount(items))} ฿
                  </span>
                </div>
              ) : null}

              {activeKind === "withdraw" ? (
                <div className={summaryRow}>
                  <span>{t("summary.withdrawTotal")}</span>
                  <span className={toneClass("success", "font-semibold")}>
                    {formatMoney(sumCompletedWithdrawAmount(items))} ฿
                  </span>
                </div>
              ) : null}

              {activeKind === "promotion" ? (
                <div className={summaryRow}>
                  <span>{t("summary.promotionClaims")}</span>
                  <span className={toneClass("emphasis")}>{countPromotionClaims(items)}</span>
                </div>
              ) : null}

              {activeKind === "bet" ? (
                <div className="flex flex-col gap-2 pt-1">
                  <div className={summaryRow}>
                    <span>{t("summary.winLossTotal")}</span>
                    <span className={toneClass(moneyDeltaRole(sumBetWinLossTotal(items)), "font-semibold")}>
                      {formatMoney(sumBetWinLossTotal(items))} ฿
                    </span>
                  </div>
                  <div className={summaryRow}>
                    <span>{t("summary.stakeTotal")}</span>
                    <span className={toneClass("neutral", "font-semibold")}>
                      {formatMoney(sumBetStakeTotal(items))} ฿
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </ResourceGate>
      </section>
    </div>
  );
}
