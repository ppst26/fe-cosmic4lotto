"use client";

import {
  fetchDepositBankAccount,
  fetchDepositMethods,
  fetchDepositQuickAmounts,
} from "@/lib/api/deposit";
import {
  fetchWithdrawAccount,
  fetchWithdrawBalance,
  fetchWithdrawQuickAmounts,
} from "@/lib/api/withdraw";
import { useApi } from "@/app/hooks/useApi";

/** ข้อมูลแผงฝาก — ใช้ใน DepositBottomSheet */
export const useDepositMethods = () => useApi(["deposit-methods"], fetchDepositMethods, { auth: true });
export const useDepositBankAccount = () =>
  useApi(["deposit-bank-account"], fetchDepositBankAccount, { auth: true });
export const useDepositQuickAmounts = () =>
  useApi(["deposit-quick-amounts"], fetchDepositQuickAmounts, { auth: true });

/** ข้อมูลแผงถอน — ใช้ใน WithdrawBottomSheet · refresh balance หลังถอนสำเร็จ */
export const useWithdrawAccount = () => useApi(["withdraw-account"], fetchWithdrawAccount, { auth: true });
export const useWithdrawBalance = () => useApi(["withdraw-balance"], fetchWithdrawBalance, { auth: true });
export const useWithdrawQuickAmounts = () =>
  useApi(["withdraw-quick-amounts"], fetchWithdrawQuickAmounts, { auth: true });
