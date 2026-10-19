"use client";

import { ActivitiesHubPageContent } from "@/app/components/activities/ActivitiesHubPageContent";
import { SubPageShell } from "@/components/layout/SubPageShell";
import { useT } from "@/lib/i18n/I18nProvider";

export default function ActivitiesPage() {
  const t = useT("rewards");
  return (
    <SubPageShell title={t("activities.title")} nav="events">
      <ActivitiesHubPageContent />
    </SubPageShell>
  );
}
