import type { ReactNode } from "react";
import { I18nProvider } from "./I18nProvider";
import { pickNamespaces, type Namespace } from "./messages";
import { getLocale, getMessages } from "./server";

/** ส่ง namespace ที่ segment นี้ใช้เข้า client — วางใน layout ของ segment */
export async function MessagesBoundary({
  namespaces,
  children,
}: {
  namespaces: readonly Namespace[];
  children: ReactNode;
}) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()]);
  return (
    <I18nProvider locale={locale} messages={pickNamespaces(messages, namespaces)}>
      {children}
    </I18nProvider>
  );
}
