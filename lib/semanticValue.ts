import type { TransactionStatus } from "@/app/types/transaction";
import { cn } from "@/lib/utils";

/** บทบาทสีของค่าตัวเลข — ดู design.md § Semantic values */
export type ValueRole =
  | "emphasis"
  | "neutral"
  | "muted"
  | "success"
  | "danger"
  | "warning"
  | "reward"
  | "accent";

const ROLE_CLASS: Record<ValueRole, string> = {
  emphasis: "cosmic-value--emphasis",
  neutral: "cosmic-value--neutral",
  muted: "cosmic-value--muted",
  success: "cosmic-value--success",
  danger: "cosmic-value--danger",
  warning: "cosmic-value--warning",
  reward: "cosmic-value--reward",
  accent: "cosmic-value--accent",
};

/** คืน class โทนค่า — ใส่คู่กับ `cosmic-value` */
export function valueRoleClass(role: ValueRole): string {
  return ROLE_CLASS[role];
}

export function valueClass(role: ValueRole, extra?: string): string {
  return cn("cosmic-value", valueRoleClass(role), extra);
}

export function transactionStatusValueRole(status: TransactionStatus): ValueRole {
  switch (status) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "danger";
  }
}

export function transactionStatusValueClass(status: TransactionStatus, extra?: string): string {
  return valueClass(transactionStatusValueRole(status), extra);
}

export function moneyDeltaRole(amount: number): ValueRole {
  if (amount > 0) return "success";
  if (amount < 0) return "danger";
  return "neutral";
}

export function signedMoneyValueClass(amount: number, extra?: string): string {
  return valueClass(moneyDeltaRole(amount), extra);
}

const MUTED_DISPLAY = new Set(["—", "-", "–", ""]);

/** สิทธิ VIP / ตารางเปรียบเทียบ */
export function vipBenefitDisplayRole(rowId: string, display: string): ValueRole {
  const normalized = display.trim();
  if (MUTED_DISPLAY.has(normalized)) return "muted";
  if (normalized.includes("✓") || normalized.includes("✔")) return "success";
  if (rowId === "diamond-deposit") return "accent";
  if (/%/.test(normalized) || rowId === "cashback" || rowId === "rolling") return "reward";
  return "emphasis";
}

export function vipBenefitValueClass(rowId: string, display: string, extra?: string): string {
  return valueClass(vipBenefitDisplayRole(rowId, display), extra);
}

/** วันคงเหลือรักษาระดับ VIP */
export function vipMaintainDaysRole(daysRemaining: number): ValueRole {
  if (daysRemaining <= 0) return "warning";
  return "emphasis";
}

export function vipMaintainDaysClass(daysRemaining: number, extra?: string): string {
  return valueClass(vipMaintainDaysRole(daysRemaining), extra);
}
