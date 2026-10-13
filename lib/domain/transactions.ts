import type { TransactionItem } from "@/app/types/transaction";
import { endOfDay, isDateInRange, startOfDay } from "@/app/lib/transactionDateUtils";

/**
 * คำนวณสรุปรายการธุรกรรม — ใช้ใน TransactionsPageContent
 * ย้ายมาจาก app/data/transactionsMockData.ts · เมื่อ backend ส่งยอดสรุปมาเอง ให้ใช้ค่าจาก API แทน
 */

/** กรองตามวันที่สร้าง (รวมทั้งวันแรกและวันสุดท้าย) */
export function filterTransactionsByDateRange(
  items: TransactionItem[],
  from: Date,
  to: Date,
): TransactionItem[] {
  const start = startOfDay(from);
  const end = endOfDay(to);
  return items.filter((item) => isDateInRange(new Date(item.createdAt), start, end));
}

/** ยอดฝากที่สำเร็จ */
export function sumCompletedDepositAmount(items: TransactionItem[]): number {
  return items
    .filter((item) => item.kind === "deposit" && item.status === "completed")
    .reduce((sum, item) => sum + item.amount, 0);
}

/** ยอดถอนที่สำเร็จ */
export function sumCompletedWithdrawAmount(items: TransactionItem[]): number {
  return items
    .filter((item) => item.kind === "withdraw" && item.status === "completed")
    .reduce((sum, item) => sum + item.amount, 0);
}

/** จำนวนครั้งที่รับโปรโมชัน */
export function countPromotionClaims(items: TransactionItem[]): number {
  return items.filter((item) => item.kind === "promotion").length;
}

/** วิน/ลอสรวม — แถวผลลัพธ์บวก แถวเดิมพันลบ */
export function sumBetWinLossTotal(items: TransactionItem[]): number {
  return items
    .filter((item) => item.kind === "bet")
    .reduce((sum, item) => {
      if (item.betRowType === "result") return sum + item.amount;
      if (item.betRowType === "bet") return sum - Math.abs(item.amount);
      return sum;
    }, 0);
}

/** ยอดเดิมพันรวม */
export function sumBetStakeTotal(items: TransactionItem[]): number {
  return items
    .filter((item) => item.kind === "bet" && item.betRowType === "bet")
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);
}
