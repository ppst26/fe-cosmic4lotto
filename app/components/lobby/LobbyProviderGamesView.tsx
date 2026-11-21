"use client";

import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import Link from "@/lib/i18n/navigation";
import { useT } from "@/lib/i18n/I18nProvider";
import { getGamesByProvider } from "@/app/data/providerGamesData";
import { buildGamePlayHref } from "@/lib/gamePlayPaths";
import type { ProviderGameItem } from "@/app/types/providers";
import { ArrowLeft } from "lucide-react";
import { LobbySearchBar } from "./LobbySearchBar";
import { gameCardEnterClassName, gameCardEnterStyle } from "@/lib/gameCardEnterMotion";

type LobbyProviderGamesViewProps = {
  /** providerId สำหรับ getGamesByProvider (สล็อตใช้ slug ตรง) */
  providerId: string;
  providerName: string;
  /** ชื่อหมวด (สล็อต/ยิงปลา/เกมไพ่) — ใช้ใน aria-label ปุ่มกลับ */
  categoryLabel: string;
  /** หน้ารายการค่ายของหมวด — ปุ่มกลับพาไปที่นี่ */
  backHref: string;
};

function GameTile({
  game,
  favorite,
  onToggleFavorite,
  favoriteLabel,
}: {
  game: ProviderGameItem;
  favorite: boolean;
  onToggleFavorite: () => void;
  favoriteLabel: string;
}) {
  const href = buildGamePlayHref({ id: game.id, title: game.title, provider: game.providerId });
  return (
    <div className="group relative flex min-w-0 flex-col gap-1.5">
      <Link
        href={href}
        aria-label={game.title}
        className={`relative block aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${game.bgGradient} transition group-hover:border-[var(--brand)]/60 group-active:scale-[0.97]`}
      >
        <span
          className="absolute inset-0 flex items-center justify-center text-4xl font-semibold opacity-40"
          style={{ color: game.accentColor }}
          aria-hidden
        >
          {game.title.charAt(0).toUpperCase()}
        </span>
        {game.badge ? (
          <span className="absolute bottom-1 left-1 rounded bg-[var(--brand)] px-1.5 py-0.5 text-[9px] font-semibold leading-none text-[#2a0607]">
            {game.badge}
          </span>
        ) : null}
      </Link>
      <button
        type="button"
        onClick={onToggleFavorite}
        aria-label={favoriteLabel}
        aria-pressed={favorite}
        className="absolute right-1 top-1 z-10 cursor-pointer rounded-full border-0 bg-black/50 p-1.5 text-white"
      >
        <Heart className={`h-3.5 w-3.5 ${favorite ? "fill-rose-500 text-rose-500" : ""}`} />
      </button>
      <p className="truncate text-center text-xs font-medium text-[var(--text-on-light)]">{game.title}</p>
    </div>
  );
}

/**
 * รายการเกมในค่ายสล็อต — ตรรกะเดียวกับ LobbyProviderGamesView + ProviderGameGrid ของ glass
 * (ค้นหาตามชื่อเกม · หัวใจโปรดเก็บใน state หน้านี้ · กดการ์ด → /play/[id])
 */
export function LobbyProviderGamesView({ providerId, providerName, categoryLabel, backHref }: LobbyProviderGamesViewProps) {
  const t = useT("games");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const games = useMemo(() => {
    const all = getGamesByProvider(providerId);
    const q = query.toLowerCase().trim();
    if (!q) return all;
    return all.filter((game) => game.title.toLowerCase().includes(q));
  }, [providerId, query]);

  return (
    <section className="flex min-w-0 flex-col gap-4" aria-label={providerName}>
      {/* แถวหัว (เหมือน glass): [ปุ่มกลับวงกลม · ชื่อค่าย (จำนวนเกม)] ชิดซ้าย · ช่องค้นหาชิดขวา — อยู่ใน layout หน้าแรก ไม่เปิดหน้าใหม่ */}
      <div className="flex min-w-0 items-center justify-between gap-3 px-3 py-2.5 lg:px-0">
        <div className="flex min-w-0 items-center gap-2.5">
          <Link href={backHref} className="cosmic-back-btn" aria-label={`${categoryLabel}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex min-w-0 items-baseline gap-1.5">
            <h1 className="m-0 truncate text-base font-medium uppercase text-[var(--text-on-light)] sm:text-lg">{providerName}</h1>
            <span className="whitespace-nowrap text-xs text-[var(--text-muted)]">
              {t("providerGames.gameCount", { count: games.length })}
            </span>
          </div>
        </div>
        <div className="w-[42%] min-w-0 shrink-0 sm:w-[38%] lg:w-72">
          <LobbySearchBar value={query} onChange={setQuery} placeholder={t("providerGames.searchPlaceholder")} />
        </div>
      </div>

      {games.length === 0 ? (
        <div className="my-10 flex flex-col items-center text-center">
          <h3 className="text-base font-medium text-[var(--text-on-light)]">{t("providerGames.notFoundTitle")}</h3>
          <p className="mt-1 text-xs text-[var(--text-muted)]">{t("providerGames.notFoundHint")}</p>
        </div>
      ) : (
        <div
          key={games.map((game) => game.id).join("|")}
          className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
        >
          {games.map((game, index) => {
            const favorite = Boolean(favorites[game.id] ?? game.isFavorite);
            return (
              <div key={game.id} className={gameCardEnterClassName("min-w-0")} style={gameCardEnterStyle(index)}>
                <GameTile
                  game={game}
                  favorite={favorite}
                  favoriteLabel={favorite ? t("providerGames.favoriteRemove") : t("providerGames.favoriteAdd")}
                  onToggleFavorite={() => setFavorites((prev) => ({ ...prev, [game.id]: !favorite }))}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
