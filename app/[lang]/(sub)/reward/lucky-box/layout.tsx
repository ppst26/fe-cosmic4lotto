import type { ReactNode } from "react";
import { ApiSeed, type ApiSeedEntry } from "@/app/components/ApiSeed";
import { fetchLuckyBox } from "@/lib/api/rewardFeatures";

export default async function Layout({ children }: { children: ReactNode }) {
  const res = await fetchLuckyBox();
  const entries: ApiSeedEntry[] = res.ok ? [{ key: ["lucky-box"], data: res.data }] : [];
  return <ApiSeed entries={entries}>{children}</ApiSeed>;
}
