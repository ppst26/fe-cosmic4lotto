"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "./config";
import type { Messages, Namespace } from "./messages";
import { createTranslator, deepMerge, type MessageTree, type MessageVars, type NestedKey } from "./translate";

const I18nContext = createContext<{ locale: Locale; messages: MessageTree } | null>(null);

/** provider ซ้อนได้ — ชั้นในรวม namespace ของชั้นนอกไว้ด้วย */
export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: MessageTree;
  children: ReactNode;
}) {
  const parent = useContext(I18nContext);
  const value = useMemo(
    () => ({ locale, messages: parent ? deepMerge(parent.messages, messages) : messages }),
    [locale, messages, parent],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/** const t = useT("lottery"); t("betSlip.title") */
export function useT<N extends Namespace>(namespace: N) {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT ต้องอยู่ใต้ I18nProvider");
  return useMemo(() => {
    const t = createTranslator(ctx.messages, ctx.locale);
    return (key: NestedKey<Messages[N]>, vars?: MessageVars) => t(`${namespace}.${key}`, vars);
  }, [ctx, namespace]);
}
