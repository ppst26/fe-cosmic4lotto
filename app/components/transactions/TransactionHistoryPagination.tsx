"use client";

import React from "react";
import { SoftPagination } from "../ui/SoftPagination";
import { useT } from "@/lib/i18n/I18nProvider";

/** เลขหน้าตารางธุรกรรม — ใช้กับแท็บเดิมพัน */
export function TransactionHistoryPagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const t = useT("transactions");
  return (
    <SoftPagination
      page={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      className="pt-2"
      aria-label={t("paginationAria")}
    />
  );
}
