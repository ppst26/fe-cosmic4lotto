import type { ReactNode } from "react";
import { ApiSeed, type ApiSeedEntry } from "@/app/components/ApiSeed";
import { fetchVipBenefits, fetchVipRanks } from "@/lib/api/vip";

export default async function Layout({ children }: { children: ReactNode }) {
  const [ranks, benefits] = await Promise.all([fetchVipRanks(), fetchVipBenefits()]);
  const entries: ApiSeedEntry[] = [];
  if (ranks.ok) entries.push({ key: ["vip-ranks"], data: ranks.data });
  if (benefits.ok) entries.push({ key: ["vip-benefits"], data: benefits.data });
  return <ApiSeed entries={entries}>{children}</ApiSeed>;
}
