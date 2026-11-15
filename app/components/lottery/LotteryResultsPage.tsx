"use client";

import React, { useMemo, useState } from "react";
import { CalendarCheck, CheckCircle2, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { enUS, th } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { lotteryResultsDateBounds } from "@/app/data/lotteryResultsMockData";
import { useLotteryResults } from "@/app/hooks/api/lottery";
import { EmptyState, LoadingState } from "@/app/components/ui/StatusState";
import type {
  LotteryDrawResult,
  LotteryMessageKey,
  LotteryResultCategory,
  LotteryResultFigureId,
  LotteryYikiResults,
} from "@/app/types/lottery";
import { bangkokToday, isIsoDate, shiftIsoDate } from "@/lib/lottery/resultDates";
import { cn } from "@/lib/utils";
import { LotteryMarketIcon } from "@/components/lottery/hub/LotteryMarketIcon";
import { useLotteryI18n } from "./useLotteryI18n";

type CategoryFilter = "all" | "yiki" | LotteryResultCategory;

/** ลำดับหมวดบนหน้า + key ชื่อหมวด (resultsPage.categories.*) */
const CATEGORIES: readonly { id: LotteryResultCategory; labelKey: LotteryMessageKey }[] = [
  { id: "government", labelKey: "resultsPage.categories.government" },
  { id: "thai-stock", labelKey: "resultsPage.categories.thaiStock" },
  { id: "foreign-stock", labelKey: "resultsPage.categories.foreignStock" },
  { id: "laos", labelKey: "resultsPage.categories.laos" },
  { id: "hanoi", labelKey: "resultsPage.categories.hanoi" },
];

const FIGURE_LABEL: Record<LotteryResultFigureId, LotteryMessageKey> = {
  first: "resultsPage.fig.first",
  drawn: "resultsPage.fig.drawn",
  top3: "resultsPage.fig.top3",
  top2: "resultsPage.fig.top2",
  bottom2: "resultsPage.fig.bottom2",
  front3: "resultsPage.fig.front3",
  back3: "resultsPage.fig.back3",
};

/** จำนวนรอบยี่กีที่แสดงก่อนกด「ดูรอบที่เหลือ」 */
const YIKI_PREVIEW_ROUNDS = 12;

function StatusChip({ done, time }: { done: boolean; time: string }) {
  const { t } = useLotteryI18n();
  const Icon = done ? CheckCircle2 : Clock;
  return (
    <span className={cn("lottery-result-status", done ? "lottery-result-status--done" : "lottery-result-status--wait")}>
      <Icon size={14} aria-hidden="true" />
      {done ? t("resultsPage.doneAt", { time }) : t("resultsPage.waitAt", { time })}
    </span>
  );
}

/** ช่องตัวเลขหนึ่งช่อง — ยังไม่ออกผลแสดงขีด */
function Figure({ labelKey, value, digits, wide }: { labelKey: LotteryMessageKey; value: string | null; digits: number; wide?: boolean }) {
  const { t } = useLotteryI18n();
  return (
    <div className={cn("lottery-result-figure", wide && "lottery-result-figure--wide")}>
      <span className="lottery-result-figure__label">{t(labelKey)}</span>
      <b className={cn("lottery-result-figure__value tabular-nums", value === null && "is-pending")}>
        {value ?? "–".repeat(digits)}
      </b>
    </div>
  );
}

function DrawCard({ draw, dateLabel }: { draw: LotteryDrawResult; dateLabel: string }) {
  const { t } = useLotteryI18n();
  return (
    <article className="lottery-result-card">
      <header className="lottery-result-card__head">
        <LotteryMarketIcon marketSlug={draw.marketSlug} size="sm" fallbackLabel={draw.flagLabel} fallbackTone={draw.flagTone} />
        <div className="min-w-0 flex-1">
          <h3 className="lottery-result-card__name">{t(draw.titleKey)}</h3>
          <span className="lottery-result-card__date">{dateLabel}</span>
        </div>
        <StatusChip done={draw.status === "done"} time={draw.drawTime} />
      </header>
      <div className="lottery-result-card__grid">
        {draw.figures.map((figure) => (
          <Figure key={figure.id} labelKey={FIGURE_LABEL[figure.id]} value={figure.value} digits={figure.digits} wide={figure.wide} />
        ))}
      </div>
    </article>
  );
}

function YikiSection({ yiki }: { yiki: LotteryYikiResults[] }) {
  const { t } = useLotteryI18n();
  const [slug, setSlug] = useState(yiki[0]?.slug ?? "");
  const [expanded, setExpanded] = useState(false);
  const current = yiki.find((item) => item.slug === slug) ?? yiki[0];

  /** รอบที่ออกแล้ว เรียงใหม่สุดก่อน */
  const doneRounds = useMemo(() => (current ? current.rounds.filter((r) => r.status === "done").reverse() : []), [current]);
  if (!current) return null;
  const visible = expanded ? doneRounds : doneRounds.slice(0, YIKI_PREVIEW_ROUNDS);
  const hidden = doneRounds.length - visible.length;

  return (
    <section className="lottery-results-section" aria-label={t("resultsPage.categories.yiki")}>
      <div className="lottery-results-section__head">
        <h2>{t("resultsPage.categories.yiki")}</h2>
        <span className="tabular-nums">{t("resultsPage.yikiSummary", { done: doneRounds.length, total: current.total })}</span>
      </div>

      <div className="lottery-result-chips" role="tablist" aria-label={t("resultsPage.categories.yiki")}>
        {yiki.map((item) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={item.slug === current.slug}
            className="lottery-result-chip"
            onClick={() => {
              setSlug(item.slug);
              setExpanded(false);
            }}
          >
            {t("resultsPage.yikiInterval", { minutes: item.intervalMinutes })}
          </button>
        ))}
      </div>

      {doneRounds.length === 0 ? (
        <p className="lottery-results-empty">{t("resultsPage.yikiEmpty")}</p>
      ) : (
        <ul className="lottery-yiki-list">
          {visible.map((round) => (
            <li key={round.round} className="lottery-yiki-row">
              <div className="lottery-yiki-row__round">
                <b>{t("resultsPage.round", { n: round.round })}</b>
                <span className="tabular-nums">{t("resultsPage.doneAt", { time: round.time })}</span>
              </div>
              <Figure labelKey="resultsPage.fig.top3" value={round.top3} digits={3} />
              <Figure labelKey="resultsPage.fig.bottom2" value={round.bottom2} digits={2} />
            </li>
          ))}
        </ul>
      )}

      {hidden > 0 || expanded ? (
        <button type="button" className="lottery-results-more" onClick={() => setExpanded((open) => !open)}>
          {expanded ? t("resultsPage.showLess") : t("resultsPage.showMore", { count: hidden })}
        </button>
      ) : null}
    </section>
  );
}

/**
 * หน้าผลรางวัล — ผลหวยทุกตลาดของแต่ละวัน แยกหมวด · เลือกวันที่ · ยี่กีรายรอบ
 * ข้อมูลจาก useLotteryResults(date) (GET /api/lottery/results) — ไม่มีผล/เวลาฝังในคอมโพเนนต์
 */
export function LotteryResultsPage() {
  const { t, locale } = useLotteryI18n();
  const bounds = useMemo(() => lotteryResultsDateBounds(), []);
  const [date, setDate] = useState(bounds.max);
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [pickerOpen, setPickerOpen] = useState(false);
  const results = useLotteryResults(date);

  const isToday = date === bangkokToday();
  const dateLabel = useMemo(() => {
    const [y, m, d] = date.split("-").map(Number);
    const base = locale === "th" ? "th-TH-u-ca-buddhist" : `${locale}-u-ca-gregory`;
    return new Intl.DateTimeFormat(base, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
      new Date(Date.UTC(y, m - 1, d, 12)),
    );
  }, [date, locale]);
  const shortDateLabel = useMemo(() => {
    const [y, m, d] = date.split("-").map(Number);
    const base = locale === "th" ? "th-TH-u-ca-buddhist" : `${locale}-u-ca-gregory`;
    return new Intl.DateTimeFormat(base, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
      new Date(Date.UTC(y, m - 1, d, 12)),
    );
  }, [date, locale]);

  const draws = useMemo(() => results.data?.draws ?? [], [results.data]);
  const counts = useMemo(() => {
    const map = new Map<LotteryResultCategory, number>();
    for (const draw of draws) map.set(draw.category, (map.get(draw.category) ?? 0) + 1);
    return map;
  }, [draws]);
  const yikiCount = results.data?.yiki.length ?? 0;
  const doneDraws = draws.filter((draw) => draw.status === "done").length;

  /** แปลง ISO (YYYY-MM-DD) <-> Date ในเวลาท้องถิ่น สำหรับ Calendar */
  const toDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const fromDate = (value: Date) =>
    `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;

  const goTo = (next: string) => {
    if (isIsoDate(next) && next >= bounds.min && next <= bounds.max) setDate(next);
  };

  const showYiki = category === "all" || category === "yiki";
  const visibleCategories = CATEGORIES.filter((c) => (category === "all" || category === c.id) && (counts.get(c.id) ?? 0) > 0);

  return (
    <div className="lottery-results flex min-w-0 flex-col gap-4">
      {/* ชื่อหน้า (h1) อยู่ใน SubPageShell แล้ว — ที่นี่แสดงเฉพาะคำอธิบาย */}
      <header className="flex flex-col gap-1">
        <p className="m-0 text-sm text-[var(--text-secondary)]">{t("resultsPage.subtitle")}</p>
      </header>

      {/* เลือกวันที่ — shadcn Popover + Calendar แสดงใต้แถบนี้ ภายในหน้า */}
      <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
        <PopoverAnchor asChild>
          <section className="lottery-results-date" aria-label={t("resultsPage.pickDate")}>
            <button
              type="button"
              className="lottery-results-date__nav"
              aria-label={t("resultsPage.prevDay")}
              disabled={date <= bounds.min}
              onClick={() => goTo(shiftIsoDate(date, -1))}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="lottery-results-date__value"
              aria-haspopup="dialog"
              aria-expanded={pickerOpen}
              onClick={() => setPickerOpen((open) => !open)}
            >
              <span className="lottery-results-date__label">
                {t("resultsPage.dateLabel")}
                {isToday ? <em>{t("resultsPage.today")}</em> : null}
              </span>
              <b className="tabular-nums">{dateLabel}</b>
            </button>
            <button
              type="button"
              className="lottery-results-date__nav"
              aria-label={t("resultsPage.nextDay")}
              disabled={date >= bounds.max}
              onClick={() => goTo(shiftIsoDate(date, 1))}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
            <PopoverTrigger asChild>
              <button type="button" className="lottery-results-date__pick" aria-label={t("resultsPage.pickDate")}>
                <CalendarCheck size={16} aria-hidden="true" />
              </button>
            </PopoverTrigger>
          </section>
        </PopoverAnchor>
        <PopoverContent align="center" className="w-fit max-w-[calc(100vw-1.5rem)]">
          <Calendar
            mode="single"
            locale={locale === "th" ? th : enUS}
            formatters={{
              formatCaption: (month) =>
                new Intl.DateTimeFormat(locale === "th" ? "th-TH-u-ca-buddhist" : `${locale}-u-ca-gregory`, {
                  month: "long",
                  year: "numeric",
                }).format(month),
            }}
            selected={toDate(date)}
            defaultMonth={toDate(date)}
            onSelect={(picked) => {
              if (!picked) return;
              goTo(fromDate(picked));
              setPickerOpen(false);
            }}
            disabled={[{ before: toDate(bounds.min) }, { after: toDate(bounds.max) }]}
          />
        </PopoverContent>
      </Popover>

      {/* ตัวกรองหมวด */}
      <div className="lottery-result-chips" role="tablist" aria-label={t("resultsPage.filterAria")}>
        <button type="button" role="tab" aria-selected={category === "all"} className="lottery-result-chip" onClick={() => setCategory("all")}>
          {t("resultsPage.categories.all")}
          <span className="lottery-result-chip__n tabular-nums">{draws.length + yikiCount}</span>
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={category === c.id}
            className="lottery-result-chip"
            onClick={() => setCategory(c.id)}
          >
            {t(c.labelKey)}
            <span className="lottery-result-chip__n tabular-nums">{counts.get(c.id) ?? 0}</span>
          </button>
        ))}
        <button type="button" role="tab" aria-selected={category === "yiki"} className="lottery-result-chip" onClick={() => setCategory("yiki")}>
          {t("resultsPage.categories.yiki")}
          <span className="lottery-result-chip__n tabular-nums">{yikiCount}</span>
        </button>
      </div>

      {results.data ? (
        <p className="m-0 text-sm text-[var(--text-secondary)] tabular-nums">
          {t("resultsPage.summary", { done: doneDraws, total: draws.length })}
        </p>
      ) : null}

      {!results.data ? (
        results.error ? (
          <EmptyState title={t("resultsPage.loadError")} />
        ) : (
          <LoadingState label={t("resultsPage.loading")} />
        )
      ) : (
        <>
          {visibleCategories.length === 0 && !showYiki ? <p className="lottery-results-empty">{t("resultsPage.empty")}</p> : null}

          {visibleCategories.map((c) => {
            const list = draws.filter((draw) => draw.category === c.id);
            return (
              <section key={c.id} className="lottery-results-section" aria-label={t(c.labelKey)}>
                <div className="lottery-results-section__head">
                  <h2>{t(c.labelKey)}</h2>
                  <span className="tabular-nums">{list.length}</span>
                </div>
                <div className="lottery-results-grid">
                  {list.map((draw) => (
                    <DrawCard key={draw.id} draw={draw} dateLabel={shortDateLabel} />
                  ))}
                </div>
              </section>
            );
          })}

          {showYiki && results.data.yiki.length > 0 ? <YikiSection key={date} yiki={results.data.yiki} /> : null}
        </>
      )}
    </div>
  );
}
