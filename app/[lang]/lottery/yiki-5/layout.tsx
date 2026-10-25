import type { ReactNode } from "react";
import { ApiSeed, type ApiSeedEntry } from "@/app/components/ApiSeed";
import { fetchYikiBoard } from "@/lib/api/lotteryContent";

export default async function Layout({ children }: { children: ReactNode }) {
  const entries: ApiSeedEntry[] = [];
  const board = await fetchYikiBoard();
  if (board.ok) entries.push({ key: ["yiki-board"], data: board.data });
  return <ApiSeed entries={entries}>{children}</ApiSeed>;
}
