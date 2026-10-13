import { LobbyProvidersView } from "@/app/components/lobby/LobbyProvidersView";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { getT } from "@/lib/i18n/server";

/** หมวดคาสิโน — /casino (รายการค่ายเกม เหมือน glass) */
export default async function CasinoPage() {
  const t = await getT("home");
  return (
    <SubPageShell title={t("categoryProviders.liveCasino")}>
      <LobbyProvidersView categoryId="casino" />
    </SubPageShell>
  );
}
