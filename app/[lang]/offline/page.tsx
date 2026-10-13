import { withLocale } from "@/lib/i18n/routing";
import { getLocale, getT } from "@/lib/i18n/server";

/**
 * หน้าสำรองเมื่อเปิดแอปที่ติดตั้งแล้วแต่ไม่มีเน็ต
 * ถูกอ้างจาก fallback ของ service worker ใน app/sw.ts (precache ทุกภาษา)
 */
export default async function OfflinePage() {
  const locale = await getLocale();
  const t = await getT("errors");
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[var(--body)] px-6 text-center">
      <h1 className="text-xl font-semibold text-[var(--text-on-light)]">{t("offline.title")}</h1>
      <p className="max-w-xs text-sm text-[var(--text-muted)]">{t("offline.description")}</p>
      <a href={withLocale("/", locale)} className="soft-btn-primary mt-2 inline-flex min-h-11 items-center justify-center px-5 text-sm font-semibold">
        {t("backHome")}
      </a>
    </main>
  );
}
