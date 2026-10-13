import type { HallOfFameRow, HallOfFameTabId } from "../types/lobby";

/** รูป placeholder จาก public/slots — แทน thumbnail เกมใน mock */
const thumb = (file: string) => `/slots/${encodeURIComponent(file)}`;

/** แท็บ Latest Winner — Game / Player / Payout */
const LATEST_WINNER_ROWS: HallOfFameRow[] = [
  {
    id: "hof-lw-1",
    gameName: "Wild Spirit",
    playerMasked: "mfx***832",
    payout: 17596.0,
    wonAtLabel: "18/09/2026 03:12:56",
    coverSrc: thumb("cq9.webp"),
    gameIcon: "flame",
  },
  {
    id: "hof-lw-2",
    gameName: "Viking Forge",
    playerMasked: "mpe***wxq",
    payout: 35180.0,
    wonAtLabel: "18/09/2026 03:11:02",
    coverSrc: thumb("Booongo.webp"),
    gameIcon: "flame",
  },
  {
    id: "hof-lw-3",
    gameName: "Mahjong King",
    playerMasked: "qpl***u4o",
    payout: 21024.5,
    wonAtLabel: "18/09/2026 03:08:41",
    coverSrc: thumb("Creative Gaming.webp"),
    coverTone: "emerald",
    gameIcon: "cherries",
  },
  {
    id: "hof-lw-4",
    gameName: "Sweet Bonanza",
    playerMasked: "rtt***9ab",
    payout: 8912.0,
    wonAtLabel: "18/09/2026 03:05:18",
    coverSrc: thumb("pragmaticplay.webp"),
    gameIcon: "cherries",
  },
  {
    id: "hof-lw-5",
    gameName: "Gates of Olympus",
    playerMasked: "hvn***2k1",
    payout: 52340.75,
    wonAtLabel: "18/09/2026 02:58:33",
    coverSrc: thumb("Spadegaming.webp"),
    coverTone: "violet",
    gameIcon: "sparkle",
  },
  {
    id: "hof-lw-6",
    gameName: "Sugar Rush",
    playerMasked: "jwe***7mn",
    payout: 11205.2,
    wonAtLabel: "18/09/2026 02:51:09",
    coverSrc: thumb("relaxgaming.webp"),
    coverTone: "rose",
    gameIcon: "cherries",
  },
  {
    id: "hof-lw-7",
    gameName: "Starlight Princess",
    playerMasked: "pxs***0vc",
    payout: 29880.4,
    wonAtLabel: "18/09/2026 02:44:27",
    coverSrc: thumb("pg.webp"),
    gameIcon: "sparkle",
  },
  {
    id: "hof-lw-8",
    gameName: "Big Bass Bonanza",
    playerMasked: "zlc***8fh",
    payout: 6742.15,
    wonAtLabel: "18/09/2026 02:39:55",
    coverSrc: thumb("fachai.webp"),
    coverTone: "sky",
    gameIcon: "fish",
  },
];

/** แท็บ Top Win Multiple — Game / Player / Time / Multiple */
const TOP_WIN_MULTIPLE_ROWS: HallOfFameRow[] = [
  {
    id: "hof-twm-1",
    gameName: "Epic Dreams",
    playerMasked: "kok***tc",
    winMultiple: 100,
    wonAtLabel: "18/09/2026 05:12:41",
    coverSrc: thumb("Hacksaw.webp"),
    gameIcon: "sparkle",
  },
  {
    id: "hof-twm-2",
    gameName: "Tropical Tiki",
    playerMasked: "ivz***168",
    winMultiple: 87,
    wonAtLabel: "18/09/2026 05:11:18",
    coverSrc: thumb("Jili.webp"),
    coverTone: "emerald",
    gameIcon: "flame",
  },
  {
    id: "hof-twm-3",
    gameName: "Wanted Dead or Wild",
    playerMasked: "bmn***4rs",
    winMultiple: 72,
    wonAtLabel: "18/09/2026 05:09:55",
    coverSrc: thumb("Nolimit City.webp"),
    gameIcon: "flame",
  },
  {
    id: "hof-twm-4",
    gameName: "Starlight Princess",
    playerMasked: "tqa***9lm",
    winMultiple: 65,
    wonAtLabel: "18/09/2026 05:08:02",
    coverSrc: thumb("PG Soft.webp"),
    gameIcon: "sparkle",
  },
  {
    id: "hof-twm-5",
    gameName: "Sugar Rush",
    playerMasked: "wop***2jk",
    winMultiple: 58,
    wonAtLabel: "18/09/2026 05:06:33",
    coverSrc: thumb("Relax Gaming.webp"),
    coverTone: "rose",
    gameIcon: "cherries",
  },
  {
    id: "hof-twm-6",
    gameName: "Gates of Olympus",
    playerMasked: "dke***7xy",
    winMultiple: 51,
    wonAtLabel: "18/09/2026 05:04:47",
    coverSrc: thumb("Pragmatic Play.webp"),
    gameIcon: "sparkle",
  },
  {
    id: "hof-twm-7",
    gameName: "Mahjong Ways",
    playerMasked: "fgh***3pp",
    winMultiple: 46,
    wonAtLabel: "18/09/2026 05:03:12",
    coverSrc: thumb("microslot.webp"),
    coverTone: "amber",
    gameIcon: "cherries",
  },
  {
    id: "hof-twm-8",
    gameName: "Wild West Gold",
    playerMasked: "nmr***0zt",
    winMultiple: 40,
    wonAtLabel: "18/09/2026 05:01:28",
    coverSrc: thumb("playngo.webp"),
    coverTone: "indigo",
    gameIcon: "flame",
  },
];

/**
 * Hall of Fame — 2 แท็บตาม mock (Latest Winner / Top Win Multiple)
 * ถูกเรียกใช้โดย HallOfFame.tsx ผ่าน lobbyMockData
 */
export const HALL_OF_FAME_DATA: Record<HallOfFameTabId, HallOfFameRow[]> = {
  "latest-winner": LATEST_WINNER_ROWS,
  "top-win-multiple": TOP_WIN_MULTIPLE_ROWS,
};
