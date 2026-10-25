import type { ReactNode } from "react";
import { ApiSeed, type ApiSeedEntry } from "@/app/components/ApiSeed";
import { fetchRandomCard } from "@/lib/api/rewardFeatures";

export default async function Layout({ children }: { children: ReactNode }) {
  const res = await fetchRandomCard();
  const entries: ApiSeedEntry[] = res.ok ? [{ key: ["random-card"], data: res.data }] : [];
  return <ApiSeed entries={entries}>{children}</ApiSeed>;
}
