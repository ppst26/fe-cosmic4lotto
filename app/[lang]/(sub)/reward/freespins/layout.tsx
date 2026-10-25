import type { ReactNode } from "react";
import { ApiSeed, type ApiSeedEntry } from "@/app/components/ApiSeed";
import { fetchFreespins } from "@/lib/api/rewardFeatures";

export default async function Layout({ children }: { children: ReactNode }) {
  const res = await fetchFreespins();
  const entries: ApiSeedEntry[] = res.ok ? [{ key: ["freespins"], data: res.data }] : [];
  return <ApiSeed entries={entries}>{children}</ApiSeed>;
}
