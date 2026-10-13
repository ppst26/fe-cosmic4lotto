"use client";

import { useMemo } from "react";
import type { TransactionKind, TransactionKindTab } from "@/app/types/transaction";
import { SoftLineTabs } from "../ui/SoftLineTabs";
import { useT } from "@/lib/i18n/I18nProvider";

interface TransactionKindTabsProps {
  tabs: TransactionKindTab[];
  activeKind: TransactionKind;
  onSelect: (kind: TransactionKind) => void;
}

/** แท็บฝาก / ถอน / โปรโมชัน / เดิมพัน */
export function TransactionKindTabs({ tabs, activeKind, onSelect }: TransactionKindTabsProps) {
  const t = useT("transactions");
  const items = useMemo(() => tabs.map((tab) => ({ id: tab.id, label: t(tab.labelKey) })), [tabs, t]);
  return <SoftLineTabs tabs={items} activeId={activeKind} onSelect={onSelect} ariaLabel={t("kindTabs.aria")} />;
}
