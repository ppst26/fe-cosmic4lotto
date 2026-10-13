"use client";

import { useMemo, useState } from "react";
import { useReferralUsers } from "@/app/hooks/api/member";
import { ResourceGate } from "@/app/components/ui/ResourceGate";
import { REFERRAL_USERS_PAGE_SIZE } from "@/lib/uiConstants";
import { formatReferralRegisteredAt } from "@/lib/format";
import type { ReferralUserRow } from "@/app/types/referral";
import { useT } from "@/lib/i18n/I18nProvider";
import { useFormat } from "@/lib/i18n/useFormat";
import { ReferralPager } from "./ReferralPager";

/** แท็บเพื่อนที่แนะนำ — รายชื่อ + เปลี่ยนหน้า (10 แถว/หน้า) */
export function ReferralUsersPanel() {
  const usersResource = useReferralUsers();
  const t = useT("referral");
  return (
    <ResourceGate resource={usersResource} loadingLabel={t("status.usersLoading")} errorTitle={t("status.usersError")}>
      {(users) => <ReferralUsersList users={users} />}
    </ResourceGate>
  );
}

function ReferralUsersList({ users }: { users: ReferralUserRow[] }) {
  const t = useT("referral");
  const fmt = useFormat();
  const [page, setPage] = useState(1);
  const total = users.length;
  const pageSize = REFERRAL_USERS_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, currentPage, pageSize]);

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, total);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-[var(--text-on-light)]">{t("tabs.users")}</h2>
        <span className="rounded-full border border-white/10 bg-[var(--soft-card)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-muted)]">
          {fmt.people(total)}
        </span>
      </div>

      {pageRows.length === 0 ? (
        <p className="soft-panel p-6 text-center text-sm text-[var(--text-muted)]">{t("users.empty")}</p>
      ) : (
        <ul className="space-y-2">
          {pageRows.map((row) => (
            <li key={row.id} className="soft-card flex items-center justify-between gap-3 p-3 text-sm">
              <span className="min-w-0 truncate font-semibold">{row.username}</span>
              <span className="shrink-0 text-xs tabular-nums text-[var(--text-muted)]">
                {t("users.registeredAt")} {formatReferralRegisteredAt(row.registeredAt)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {total > 0 ? (
        <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[var(--text-muted)]">
            {t("pagination.showing", { start: rangeStart, end: rangeEnd, total: fmt.people(total) })}
          </p>
          <ReferralPager
            page={currentPage}
            totalPages={totalPages}
            onPageChange={setPage}
            aria-label={t("users.paginationAriaLabel")}
          />
        </div>
      ) : null}
    </div>
  );
}
