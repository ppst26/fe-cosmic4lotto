import type { ReactNode } from "react";
import { ApiSeed, type ApiSeedEntry } from "@/app/components/ApiSeed";
import { fetchExchangeMoney } from "@/lib/api/rewardFeatures";

export default async function Layout({ children }: { children: ReactNode }) {
  const res = await fetchExchangeMoney();
  const entries: ApiSeedEntry[] = res.ok ? [{ key: ["exchange-money"], data: res.data }] : [];
  return <ApiSeed entries={entries}>{children}</ApiSeed>;
}
