import { LobbyProvidersView } from "@/app/components/lobby/LobbyProvidersView";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { getT } from "@/lib/i18n/server";

/** หมวดสล็อต — /slots (รายการค่ายเกม เหมือน glass) */
export default async function SlotsPage() {
  const t = await getT("home");
  return (
    <SubPageShell title={t("categories.slots")}>
      <LobbyProvidersView categoryId="slots" />
    </SubPageShell>
  );
}
