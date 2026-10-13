import { FALLBACK_CHAIN, type Locale } from "./config";
import { deepMerge, type MessageTree, type NestedKey } from "./translate";
import type thMessages from "./messages/th";

/**
 * โครงของ dictionary ยึด th เป็นต้นแบบ
 * th / en = โฟลเดอร์ หนึ่งไฟล์ต่อ namespace · ภาษาที่ยังไม่แปล = <code>.json ไฟล์เดียว (ว่างได้ → ใช้ fallback)
 */
export type Messages = typeof thMessages;
export type Namespace = keyof Messages;

/** key ภายใน namespace — ใช้กับ data ที่เก็บ labelKey แล้วแปลตอน render: useT(ns)(item.labelKey) */
export type MessageKey<N extends Namespace> = NestedKey<Messages[N]>;

export const NAMESPACES = [
  "meta",
  "common",
  "nav",
  "auth",
  "errors",
  "home",
  "games",
  "lottery",
  "wallet",
  "transactions",
  "profile",
  "vip",
  "referral",
  "cashback",
  "rewards",
  "promotions",
] as const satisfies readonly Namespace[];

const LOADERS: Record<Locale, () => Promise<MessageTree>> = {
  th: () => import("./messages/th").then((m) => m.default),
  en: () => import("./messages/en").then((m) => m.default),
  lo: () => import("./messages/lo.json").then((m) => m.default),
  my: () => import("./messages/my.json").then((m) => m.default),
  vi: () => import("./messages/vi.json").then((m) => m.default),
  zh: () => import("./messages/zh.json").then((m) => m.default),
  id: () => import("./messages/id.json").then((m) => m.default),
  fil: () => import("./messages/fil.json").then((m) => m.default),
  km: () => import("./messages/km.json").then((m) => m.default),
};

/** dictionary ของภาษา merge กับ fallback chain (ท้าย chain = th อยู่ล่างสุด) */
export async function loadMessages(locale: Locale): Promise<MessageTree> {
  const chain = [locale, ...FALLBACK_CHAIN[locale]].reverse();
  const trees = await Promise.all(chain.map((code) => LOADERS[code]()));
  return deepMerge(...trees);
}

export function pickNamespaces(messages: MessageTree, namespaces: readonly Namespace[]): MessageTree {
  return Object.fromEntries(namespaces.filter((ns) => ns in messages).map((ns) => [ns, messages[ns]]));
}
