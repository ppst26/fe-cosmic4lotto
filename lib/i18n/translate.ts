import type { Locale } from "./config";

export type MessageTree = { [key: string]: string | MessageTree };

/** dot-path ของ leaf ทั้งหมด — object ที่มี "other" ถือเป็น plural leaf */
export type NestedKey<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends { other: string }
      ? K
      : `${K}.${NestedKey<T[K]>}`;
}[keyof T & string];

export type MessageVars = Record<string, string | number>;

export function lookup(tree: MessageTree, key: string): string | MessageTree | undefined {
  let node: string | MessageTree | undefined = tree;
  for (const part of key.split(".")) {
    if (node === undefined || typeof node === "string") return undefined;
    node = node[part];
  }
  return node;
}

/** แทน {name} ด้วยค่าใน vars — ตัวที่ไม่มีค่าคงไว้ตามเดิมเพื่อให้เห็นว่าลืมส่ง */
export function formatMessage(template: string, vars?: MessageVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}

/**
 * t("lottery.betSlip.title", { amount }) — key ไม่พบคืน key เอง (เห็นชัดบนจอ)
 * plural: value เป็น { one, other } แล้วส่ง vars.count
 */
export function createTranslator(tree: MessageTree, locale: Locale) {
  const plural = new Intl.PluralRules(locale);
  return (key: string, vars?: MessageVars): string => {
    const value = lookup(tree, key);
    if (typeof value === "string") return formatMessage(value, vars);
    if (value && typeof vars?.count === "number") {
      const form = value[plural.select(vars.count)] ?? value.other;
      if (typeof form === "string") return formatMessage(form, vars);
    }
    if (process.env.NODE_ENV !== "production") console.warn(`[i18n] missing key "${key}" (${locale})`);
    return key;
  };
}

/** merge ซ้อนชั้น — ตัวหลังทับตัวหน้า ใช้รวม fallback chain */
export function deepMerge(...trees: MessageTree[]): MessageTree {
  const out: MessageTree = {};
  for (const tree of trees) {
    for (const [key, value] of Object.entries(tree)) {
      const prev = out[key];
      out[key] = typeof value === "object" && typeof prev === "object" ? deepMerge(prev, value) : value;
    }
  }
  return out;
}
