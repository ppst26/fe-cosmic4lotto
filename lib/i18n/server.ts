import { cache } from "react";
import { lang } from "next/root-params";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { hasLocale, type Locale } from "./config";
import { loadMessages, type Messages, type Namespace } from "./messages";
import { withLocale } from "./routing";
import { createTranslator, type MessageVars, type NestedKey } from "./translate";

/** ภาษาของ request ปัจจุบัน (Server Component เท่านั้น) — ไม่รองรับ → 404 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

export const getMessages = cache(async () => loadMessages(await getLocale()));

/** t ฝั่ง server ต่อ namespace — const t = await getT("meta"); t("title") */
export async function getT<N extends Namespace>(namespace: N) {
  const locale = await getLocale();
  const t = createTranslator(await getMessages(), locale);
  return (key: NestedKey<Messages[N]>, vars?: MessageVars) => t(`${namespace}.${key}`, vars);
}

/** redirect() ที่คงภาษาปัจจุบัน — ใช้แทน redirect จาก next/navigation ใน page */
export async function localizedRedirect(path: string): Promise<never> {
  redirect(withLocale(path, await getLocale()));
}

export async function localizedPermanentRedirect(path: string): Promise<never> {
  permanentRedirect(withLocale(path, await getLocale()));
}
