"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  buildPendingDepositPayload,
  buildPendingWithdrawPayload,
} from "@/app/data/pendingTransactionMockData";
import type { PendingTransactionPayload } from "@/app/types/transaction";
import { PendingTransactionDialog } from "@/components/PendingTransactionDialog";

interface PendingTransactionContextValue {
  showPendingDeposit: (amount: number) => void;
  showPendingWithdraw: (amount: number) => void;
}

const PendingTransactionContext = createContext<PendingTransactionContextValue | null>(null);

/** เปิด dialog รายการรอดำเนินการ — เรียกจาก flow ฝาก/ถอน */
export function PendingTransactionProvider({ children }: { children: React.ReactNode }) {
  const [payload, setPayload] = useState<PendingTransactionPayload | null>(null);

  const showPendingDeposit = useCallback((amount: number) => {
    setPayload(buildPendingDepositPayload(amount));
  }, []);

  const showPendingWithdraw = useCallback((amount: number) => {
    setPayload(buildPendingWithdrawPayload(amount));
  }, []);

  const closePending = useCallback(() => setPayload(null), []);

  const value = useMemo(
    () => ({ showPendingDeposit, showPendingWithdraw }),
    [showPendingDeposit, showPendingWithdraw],
  );

  return (
    <PendingTransactionContext.Provider value={value}>
      {children}
      <PendingTransactionDialog payload={payload} onClose={closePending} />
    </PendingTransactionContext.Provider>
  );
}

export function usePendingTransaction(): PendingTransactionContextValue {
  const ctx = useContext(PendingTransactionContext);
  if (!ctx) {
    throw new Error("usePendingTransaction ต้องใช้ภายใน PendingTransactionProvider");
  }
  return ctx;
}
