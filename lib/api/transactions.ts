import {
  MOCK_BET_TRANSACTIONS,
  MOCK_DEPOSIT_TRANSACTIONS,
  MOCK_PROMOTION_TRANSACTIONS,
  MOCK_WITHDRAW_TRANSACTIONS,
} from "@/app/data/transactionsMockData";
import type { TransactionItem, TransactionKind } from "@/app/types/transaction";
import { filterTransactionsByDateRange } from "@/lib/domain/transactions";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

export interface TransactionQuery {
  kind: TransactionKind;
  from: Date;
  to: Date;
}

const MOCK_BY_KIND: Record<TransactionKind, TransactionItem[]> = {
  deposit: MOCK_DEPOSIT_TRANSACTIONS,
  withdraw: MOCK_WITHDRAW_TRANSACTIONS,
  promotion: MOCK_PROMOTION_TRANSACTIONS,
  bet: MOCK_BET_TRANSACTIONS,
};

/**
 * รายการธุรกรรมตามประเภทและช่วงวันที่ — GET /api/transactions?kind=&from=&to=
 * mock กรองวันที่ฝั่ง client · ต่อ backend: apiFetch(path, { query: { kind, from: from.toISOString(), to: to.toISOString() } })
 * (เมื่อ backend แบ่งหน้าเอง ให้เพิ่ม page / pageSize และคืน total)
 */
export function fetchTransactions(query: TransactionQuery): Promise<ApiResult<TransactionItem[]>> {
  return mockResult(filterTransactionsByDateRange(MOCK_BY_KIND[query.kind] ?? [], query.from, query.to));
}
