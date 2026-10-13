import { glassLotteryPathForLottoId } from "@/lib/lotto/glass-market-slugs";
import { localizedRedirect } from "@/lib/i18n/server";

type PageProps = { searchParams?: Promise<{ lotto?: string }> };

/** เส้นทางเดิมของหน้าแรก lotto (/enterlotto?lotto=<id>) — ไปหน้าตลาดหวยของ glass */
export default async function EnterLottoAlias({ searchParams }: PageProps) {
  const { lotto } = (await searchParams) ?? {};
  await localizedRedirect(glassLotteryPathForLottoId(lotto));
}
