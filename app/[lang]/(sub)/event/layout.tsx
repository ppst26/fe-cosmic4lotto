import type { ReactNode } from "react";
import { ApiSeed, type ApiSeedEntry } from "@/app/components/ApiSeed";
import { fetchActivities } from "@/lib/api/activities";

export default async function Layout({ children }: { children: ReactNode }) {
  const entries: ApiSeedEntry[] = [];
  const res = await fetchActivities();
  if (res.ok) entries.push({ key: ["activities"], data: res.data });
  return <ApiSeed entries={entries}>{children}</ApiSeed>;
}
