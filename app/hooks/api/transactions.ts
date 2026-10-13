"use client";

import { fetchTransactions } from "@/lib/api/transactions";
import type { TransactionKind } from "@/app/types/transaction";
import { useMemo } from "react";
import { useApi, usePrefetchApi, type PrefetchTarget } from "@/app/hooks/useApi";

/** รายการธุรกรรม — key แยกตามประเภท + ช่วงวันที่ (ใช้ใน TransactionsPageContent) */
export function useTransactions(kind: TransactionKind, from: Date, to: Date) {
  return useApi(
    ["transactions", kind, from.toISOString(), to.toISOString()],
    () => fetchTransactions({ kind, from, to }),
    { auth: true },
  );
}

const ALL_KINDS: readonly TransactionKind[] = ["deposit", "withdraw", "promotion", "bet"];

/**
 * โหลดประเภทธุรกรรมอื่นรอไว้ (ช่วงวันที่เดียวกัน) — กดสลับแท็บแล้วตารางขึ้นทันที
 * key ต้องตรงกับ useTransactions
 */
export function usePrefetchTransactionKinds(active: TransactionKind, from: Date, to: Date): void {
  const fromIso = from.toISOString();
  const toIso = to.toISOString();
  const targets = useMemo<readonly PrefetchTarget[]>(
    () =>
      ALL_KINDS.filter((kind) => kind !== active).map((kind) => ({
        key: ["transactions", kind, fromIso, toIso],
        load: () => fetchTransactions({ kind, from: new Date(fromIso), to: new Date(toIso) }),
        auth: true,
      })),
    [active, fromIso, toIso],
  );
  usePrefetchApi(targets);
}
