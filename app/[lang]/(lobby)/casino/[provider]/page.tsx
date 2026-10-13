import { localizedRedirect } from "@/lib/i18n/server";
import { CASINO_ITEMS } from "@/app/data/casinoProvidersData";
import { buildCasinoProviderPlayHref } from "@/lib/gamePlayPaths";

/**
 * คาสิโนไม่มีหน้ารายการเกม — redirect ไป /play (ลิงก์เก่า /casino/[slug]) เหมือน glass
 */
export default async function CasinoProviderLegacyRedirect({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug).toLowerCase();

  const fromCatalog = CASINO_ITEMS.find((item) => item.href.includes(`/play/casino-${slug}-live`));
  if (fromCatalog) {
    await localizedRedirect(fromCatalog.href);
  }

  const title = slug.replace(/-/g, " ");
  await localizedRedirect(buildCasinoProviderPlayHref({ slug, title, provider: title }));
}
