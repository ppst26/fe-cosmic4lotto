import fs from "fs";
import path from "path";
import { toLocalCdn } from "./cdn-url";

export type LobbyGameItem = {
  id: string;
  title: string;
  image: string;
  isHot?: boolean;
  isNew?: boolean;
  live?: boolean;
  players: number;
};

type RawGame = {
  _id?: string;
  gameId?: string;
  description?: string;
  image?: string;
  categories?: string[];
  status?: string;
  hits?: boolean;
  news?: boolean;
  online?: string;
  ranking?: number;
};

function gamesListPath() {
  return path.join(
    process.cwd(),
    "../dump/bblotto.iltx.cc/_external/gamesList.json",
  );
}

function readGamesList(): RawGame[] {
  const file = gamesListPath();
  if (!fs.existsSync(file)) return [];
  const json = JSON.parse(fs.readFileSync(file, "utf8")) as {
    data?: { list?: RawGame[] };
  };
  return json.data?.list ?? [];
}

function stablePlayers(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return 1700 + (h % 900);
}

function mapGame(g: RawGame): LobbyGameItem | null {
  if (g.status !== "active" || !g.image) return null;
  const id = g._id ?? g.gameId ?? g.description ?? "";
  return {
    id,
    title: g.description ?? "",
    image: toLocalCdn(g.image),
    isHot: Boolean(g.hits),
    isNew: Boolean(g.news),
    live: g.online === "active" && (g.categories ?? []).includes("casino"),
    players: stablePlayers(id),
  };
}

function byRanking(a: RawGame, b: RawGame) {
  return (a.ranking ?? 999) - (b.ranking ?? 999);
}

export function loadCasinoShowcase(limit = 24): LobbyGameItem[] {
  const list = readGamesList()
    .filter((g) => (g.categories ?? []).includes("casino"))
    .sort(byRanking);
  const out: LobbyGameItem[] = [];
  for (const g of list) {
    const item = mapGame(g);
    if (item) out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

const SPORT_CATEGORIES = new Set([
  "sport",
  "sports",
  "sportsbook",
  "sportbook",
]);

export function loadSportsShowcase(limit = 24): LobbyGameItem[] {
  const list = readGamesList().filter((g) =>
    (g.categories ?? []).some((c) => SPORT_CATEGORIES.has(c.toLowerCase())),
  );
  list.sort(byRanking);
  const out: LobbyGameItem[] = [];
  for (const g of list) {
    const item = mapGame(g);
    if (item) out.push(item);
    if (out.length >= limit) break;
  }
  return out.length > 0 ? out : SPORTS_SHOWCASE_FALLBACK.slice(0, limit);
}

export function loadSlotShowcase(limit = 24): LobbyGameItem[] {
  const list = readGamesList().filter((g) =>
    (g.categories ?? []).includes("slot"),
  );
  list.sort((a, b) => {
    const score = (x: RawGame) =>
      (x.hits ? 0 : 4) + (x.news ? 1 : 2) + (x.ranking ?? 50) / 100;
    return score(a) - score(b);
  });
  const out: LobbyGameItem[] = [];
  for (const g of list) {
    const item = mapGame(g);
    if (item) out.push(item);
    if (out.length >= limit) break;
  }
  return out;
}

/** fallback เมื่อไม่มี gamesList */
export const SPORTS_SHOWCASE_FALLBACK: LobbyGameItem[] = [
  {
    id: "sport-1",
    title: "SBO Sports",
    image: "/_nuxt/png/casino-icon.DHi208DR.png",
    isHot: true,
    players: 2840,
  },
  {
    id: "sport-2",
    title: "IBC Sports",
    image: "/_nuxt/png/games.Br3sScDj.png",
    players: 2512,
  },
  {
    id: "sport-3",
    title: "BTi Sports",
    image: "/_nuxt/png/casino-icon.DHi208DR.png",
    isNew: true,
    players: 1988,
  },
  {
    id: "sport-4",
    title: "UM Sports",
    image: "/_nuxt/png/games.Br3sScDj.png",
    players: 1765,
  },
  {
    id: "sport-5",
    title: "CMD368",
    image: "/_nuxt/png/casino-icon.DHi208DR.png",
    players: 2104,
  },
  {
    id: "sport-6",
    title: "PINNACLE",
    image: "/_nuxt/png/games.Br3sScDj.png",
    isHot: true,
    players: 1933,
  },
  {
    id: "sport-7",
    title: "WS Sports",
    image: "/_nuxt/png/casino-icon.DHi208DR.png",
    players: 1650,
  },
  {
    id: "sport-8",
    title: "TF Gaming",
    image: "/_nuxt/png/games.Br3sScDj.png",
    players: 1422,
  },
];

export const LOTTO_PROVIDER_SHOWCASE: LobbyGameItem[] = [
  {
    id: "lotto-1",
    title: "Everyday Lotto",
    image: "/_nuxt/png/QSsZ__qzb2HU0pejrkOXe.Bt7B9op7.png",
    players: 2216,
  },
  {
    id: "lotto-2",
    title: "AskMeLotto",
    image: "/_nuxt/png/3Clj6v3rDH2Brji-CIO-l.DeZ7Xf2T.png",
    players: 1928,
  },
  {
    id: "lotto-3",
    title: "Mega Lotto",
    image: "/_nuxt/png/mWs-3LPfgI0mucWjyQ5WT.CA7d3GTV.png",
    players: 2094,
  },
  {
    id: "lotto-4",
    title: "Huay Dragon",
    image: "/_nuxt/png/yx8fLhDR5-xwsG9neE99L.BhKXCBA1.png",
    players: 2040,
  },
];
