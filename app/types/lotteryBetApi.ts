/** ตลาดหวยที่รองรับ mock ส่งโพย */
export type LotteryBetMarketId =
  | "thai-government"
  | "yiki-5"
  | "yiki-15"
  | "yiki-30"
  | (string & {});

export interface LotteryBetLineInput {
  typeKey: string;
  /** @deprecated server ไม่ใช้ — ป้ายชื่อมาจากกติกาฝั่ง server */
  typeLabel?: string;
  number: string;
  amount: number;
  /** @deprecated server ไม่ใช้ — อัตราจ่ายมาจากกติกาฝั่ง server */
  payoutRate?: number;
}

export interface SubmitLotteryBetRequest {
  market: LotteryBetMarketId;
  roundId: string;
  drawLabel?: string;
  drawCloseAt?: string;
  continuePlayHref?: string;
  note?: string | null;
  lines: LotteryBetLineInput[];
}

export interface SubmitLotteryBetSuccess {
  ok: true;
  slipId: string;
  reference: string;
  totalAmount: number;
  lineCount: number;
  submittedAt: string;
}

export interface SubmitLotteryBetFailure {
  ok: false;
  error: string;
}

export type SubmitLotteryBetResponse = SubmitLotteryBetSuccess | SubmitLotteryBetFailure;
