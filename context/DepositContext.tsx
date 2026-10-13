"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { WalletModal, type WalletActionTab } from "@/components/WalletModal";
import { useAuth } from "@/app/components/auth/AuthProvider";
import { useOverlayLayer } from "@/app/hooks/useOverlayLayer";
import { useAuthUI } from "@/context/AuthUIContext";
import { usePendingTransaction } from "@/context/PendingTransactionContext";

interface DepositContextValue {
  openDeposit: () => void;
  closeDeposit: () => void;
  openWithdraw: () => void;
  closeWithdraw: () => void;
  isOpen: boolean;
}

const DepositContext = createContext<DepositContextValue | null>(null);

/**
 * กระเป๋าเงิน (ฝาก / ถอน) — sync ?layer=deposit|withdraw กับ URL (เหมือน glass)
 * ยังไม่ล็อกอิน → ปิด layer แล้วเปิด login
 */
export function DepositProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { openLogin } = useAuthUI();
  const { showPendingDeposit, showPendingWithdraw } = usePendingTransaction();
  const deposit = useOverlayLayer("deposit");
  const withdraw = useOverlayLayer("withdraw");

  const { close: closeDepositLayer, open: openDepositLayer } = deposit;
  const { close: closeWithdrawLayer, open: openWithdrawLayer } = withdraw;
  const requested = deposit.isOpen || withdraw.isOpen;

  /** ?layer=deposit|withdraw โดยไม่ล็อกอิน → ปิดแล้วเปิด login */
  useEffect(() => {
    if (!requested || isLoading || isAuthenticated) return;
    if (deposit.isOpen) closeDepositLayer();
    else closeWithdrawLayer();
    openLogin();
  }, [requested, isLoading, isAuthenticated, deposit.isOpen, closeDepositLayer, closeWithdrawLayer, openLogin]);

  const guard = useCallback(() => {
    if (isLoading) return false;
    if (!isAuthenticated) {
      openLogin();
      return false;
    }
    return true;
  }, [isAuthenticated, isLoading, openLogin]);

  const openDeposit = useCallback(() => {
    if (guard()) openDepositLayer();
  }, [guard, openDepositLayer]);

  const openWithdraw = useCallback(() => {
    if (guard()) openWithdrawLayer();
  }, [guard, openWithdrawLayer]);

  const closeDeposit = useCallback(() => {
    if (deposit.isOpen) closeDepositLayer();
    else if (withdraw.isOpen) closeWithdrawLayer();
  }, [deposit.isOpen, withdraw.isOpen, closeDepositLayer, closeWithdrawLayer]);

  const modalOpen = requested && isAuthenticated;
  const tab: WalletActionTab = withdraw.isOpen ? "withdraw" : "deposit";

  const value = useMemo(
    () => ({
      openDeposit,
      closeDeposit,
      openWithdraw,
      closeWithdraw: closeDeposit,
      isOpen: modalOpen,
    }),
    [modalOpen, openDeposit, closeDeposit, openWithdraw],
  );

  return (
    <DepositContext.Provider value={value}>
      {children}
      <WalletModal
        isOpen={modalOpen}
        onClose={closeDeposit}
        tab={tab}
        onTabChange={(next) => (next === "withdraw" ? openWithdraw() : openDeposit())}
        onDepositCompleted={showPendingDeposit}
        onWithdrawCompleted={showPendingWithdraw}
      />
    </DepositContext.Provider>
  );
}

export function useDeposit(): DepositContextValue {
  const ctx = useContext(DepositContext);
  if (!ctx) {
    throw new Error("useDeposit ต้องใช้ภายใน DepositProvider");
  }
  return ctx;
}
