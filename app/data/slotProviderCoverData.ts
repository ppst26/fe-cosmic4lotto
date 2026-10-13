import type { GridSlotProviderItem } from "@/app/types/providers";

/** path รูปใน public/slots (รองรับชื่อไฟล์มีช่องว่าง) */
export function slotProviderCoverSrc(file: string): string {
  return `/slots/${encodeURIComponent(file)}`;
}

const SLOT_COVER_ENTRIES = [
  {
    "file": "1Up Spin.webp",
    "id": "1up-spin",
    "name": "1Up Spin",
    "href": "/slots/1up-spin"
  },
  {
    "file": "5G Gaming.webp",
    "id": "5g-gaming",
    "name": "5G Gaming",
    "href": "/slots/5g-gaming"
  },
  {
    "file": "759 Gaming.webp",
    "id": "759-gaming",
    "name": "759 Gaming",
    "href": "/slots/759-gaming"
  },
  {
    "file": "Ace333.webp",
    "id": "ace333",
    "name": "Ace333",
    "href": "/slots/ace333"
  },
  {
    "file": "Advant Play.webp",
    "id": "advant-play",
    "name": "Advant Play",
    "href": "/slots/advant-play"
  },
  {
    "file": "afb888.webp",
    "id": "afb888",
    "name": "afb888",
    "href": "/slots/afb888"
  },
  {
    "file": "Ameba.webp",
    "id": "ameba",
    "name": "Ameba",
    "href": "/slots/ameba"
  },
  {
    "file": "Askmebet.webp",
    "id": "askmebet",
    "name": "Askmebet",
    "href": "/slots/askmebet"
  },
  {
    "file": "askmeslot.webp",
    "id": "askmeslot",
    "name": "askmeslot",
    "href": "/slots/askmeslot"
  },
  {
    "file": "Bigpot.webp",
    "id": "bigpot",
    "name": "Bigpot",
    "href": "/slots/bigpot"
  },
  {
    "file": "BigTime Gaming.webp",
    "id": "big-time-gaming",
    "name": "BigTime Gaming",
    "href": "/slots/big-time"
  },
  {
    "file": "Booming Games.webp",
    "id": "booming-games",
    "name": "Booming Games",
    "href": "/slots/booming-games"
  },
  {
    "file": "Booongo.webp",
    "id": "booongo",
    "name": "Booongo",
    "href": "/slots/booongo"
  },
  {
    "file": "cq9.webp",
    "id": "cq9",
    "name": "cq9",
    "href": "/slots/cq9"
  },
  {
    "file": "Creative Gaming.webp",
    "id": "creative-gaming",
    "name": "Creative Gaming",
    "href": "/slots/creative-gaming"
  },
  {
    "file": "Dragon Gaming.webp",
    "id": "dragon-gaming",
    "name": "Dragon Gaming",
    "href": "/slots/dragon-gaming"
  },
  {
    "file": "Eazy Gaming.webp",
    "id": "eazy-gaming",
    "name": "Eazy Gaming",
    "href": "/slots/eazy-gaming"
  },
  {
    "file": "EvoPlay.webp",
    "id": "evoplay",
    "name": "EvoPlay",
    "href": "/slots/evoplay"
  },
  {
    "file": "Expanse.webp",
    "id": "expanse",
    "name": "Expanse",
    "href": "/slots/expanse"
  },
  {
    "file": "fachai.webp",
    "id": "fa-chai",
    "name": "fachai",
    "href": "/slots/fachai"
  },
  {
    "file": "Funky Games.webp",
    "id": "funky-games",
    "name": "Funky Games",
    "href": "/slots/funky-games"
  },
  {
    "file": "Funta.webp",
    "id": "funta",
    "name": "Funta",
    "href": "/slots/funta"
  },
  {
    "file": "Goldy.webp",
    "id": "goldy",
    "name": "Goldy",
    "href": "/slots/goldy"
  },
  {
    "file": "Habanero.webp",
    "id": "habanero",
    "name": "Habanero",
    "href": "/slots/habanero"
  },
  {
    "file": "Hacksaw.webp",
    "id": "hacksaw",
    "name": "Hacksaw",
    "href": "/slots/hacksaw"
  },
  {
    "file": "Hotdog.webp",
    "id": "hotdog",
    "name": "Hotdog",
    "href": "/slots/hotdog"
  },
  {
    "file": "i8games.webp",
    "id": "i8games",
    "name": "i8games",
    "href": "/slots/i8games"
  },
  {
    "file": "JILI.webp",
    "id": "jili",
    "name": "JILI",
    "href": "/slots/jili"
  },
  {
    "file": "JIMI Gaming.webp",
    "id": "jimi-gaming",
    "name": "JIMI Gaming",
    "href": "/slots/jimi-gaming"
  },
  {
    "file": "joker.webp",
    "id": "joker",
    "name": "joker",
    "href": "/slots/joker"
  },
  {
    "file": "KA Gaming.webp",
    "id": "ka-gaming",
    "name": "KA Gaming",
    "href": "/slots/ka-gaming"
  },
  {
    "file": "live22.webp",
    "id": "live22",
    "name": "live22",
    "href": "/slots/live22"
  },
  {
    "file": "mannaplay.webp",
    "id": "manna-play",
    "name": "mannaplay",
    "href": "/slots/manna"
  },
  {
    "file": "microslot.webp",
    "id": "microgaming",
    "name": "microslot",
    "href": "/slots/microgaming"
  },
  {
    "file": "Mimi Gaming.webp",
    "id": "mimi-gaming",
    "name": "Mimi Gaming",
    "href": "/slots/mimi-gaming"
  },
  {
    "file": "NetEnt.webp",
    "id": "netent",
    "name": "NetEnt",
    "href": "/slots/netent"
  },
  {
    "file": "Nextspin.webp",
    "id": "nextspin",
    "name": "Nextspin",
    "href": "/slots/nextspin"
  },
  {
    "file": "Nines Game.webp",
    "id": "nines-game",
    "name": "Nines Game",
    "href": "/slots/nines-game"
  },
  {
    "file": "Nolimit City.webp",
    "id": "nolimit-city",
    "name": "Nolimit City",
    "href": "/slots/nolimit"
  },
  {
    "file": "octopplay.webp",
    "id": "octopplay",
    "name": "octopplay",
    "href": "/slots/octopplay"
  },
  {
    "file": "pg.webp",
    "id": "pg-soft",
    "name": "pg",
    "href": "/slots/pgsoft"
  },
  {
    "file": "playngo.webp",
    "id": "playngo",
    "name": "playngo",
    "href": "/slots/playngo"
  },
  {
    "file": "pragmaticplay.webp",
    "id": "pragmatic",
    "name": "pragmaticplay",
    "href": "/slots/pragmatic"
  },
  {
    "file": "Red Tiger.webp",
    "id": "red-tiger",
    "name": "Red Tiger",
    "href": "/slots/red-tiger"
  },
  {
    "file": "relaxgaming.webp",
    "id": "relax-gaming",
    "name": "relaxgaming",
    "href": "/slots/relax"
  },
  {
    "file": "Rich88.webp",
    "id": "rich88",
    "name": "Rich88",
    "href": "/slots/rich88"
  },
  {
    "file": "royal gaming.webp",
    "id": "royal-slot-gaming",
    "name": "royal gaming",
    "href": "/slots/royal-slot"
  },
  {
    "file": "sexyslot.webp",
    "id": "sexyslot",
    "name": "sexyslot",
    "href": "/slots/sexyslot"
  },
  {
    "file": "Simple Play.webp",
    "id": "simpleplay",
    "name": "Simple Play",
    "href": "/slots/simpleplay"
  },
  {
    "file": "slotxo.webp",
    "id": "slotxo",
    "name": "slotxo",
    "href": "/slots/slotxo"
  },
  {
    "file": "spadegaming.webp",
    "id": "spadegaming",
    "name": "spadegaming",
    "href": "/slots/spadegaming"
  },
  {
    "file": "spingo.webp",
    "id": "spingo",
    "name": "spingo",
    "href": "/slots/spingo"
  },
  {
    "file": "Sunni Games.webp",
    "id": "sunni-games",
    "name": "Sunni Games",
    "href": "/slots/sunni-games"
  },
  {
    "file": "Wazdan.webp",
    "id": "wazdan",
    "name": "Wazdan",
    "href": "/slots/wazdan"
  },
  {
    "file": "WMSlot.webp",
    "id": "wmslot",
    "name": "WMSlot",
    "href": "/slots/wmslot"
  },
  {
    "file": "Yggdrasil.webp",
    "id": "yggdrasil",
    "name": "Yggdrasil",
    "href": "/slots/yggdrasil"
  },
  {
    "file": "ygr.webp",
    "id": "ygr",
    "name": "ygr",
    "href": "/slots/ygr"
  }
] as const;

const DEFAULT_TAGS = ["all-in-one", "all-providers"] as const;

/** แท็กตัวกรองจากรายการเดิม — ค่ายที่ไม่มีใช้ DEFAULT_TAGS */
const LEGACY_TAGS: Partial<Record<string, string[]>> = {
  ygr: ["all-in-one", "all-providers", "jackpot"],
  "king-midas": ["all-in-one", "all-providers", "jackpot"],
  joker: ["all-in-one", "all-providers", "jackpot"],
  "pg-soft": ["all-in-one", "all-providers", "buy-feature"],
  hacksaw: ["all-in-one", "all-providers", "buy-feature"],
  "nolimit-city": ["all-in-one", "all-providers", "buy-feature"],
  "relax-gaming": ["all-in-one", "all-providers", "buy-feature"],
  "royal-slot-gaming": ["all-in-one", "all-providers", "megaways"],
  "red-tiger": ["all-in-one", "all-providers", "drops-and-wins", "megaways"],
  netent: ["all-in-one", "all-providers", "drops-and-wins"],
  yggdrasil: ["all-in-one", "all-providers", "drops-and-wins"],
  "big-time-gaming": ["all-in-one", "all-providers", "megaways"],
  microgaming: ["all-in-one", "all-providers", "jackpot"],
  playtech: ["all-in-one", "all-providers", "jackpot"],
  blueprint: ["all-in-one", "all-providers", "buy-feature", "megaways"],
  "push-gaming": ["all-in-one", "all-providers", "buy-feature"],
  spinomenal: ["all-in-one", "all-providers", "buy-feature"],
  betsoft: ["all-in-one", "all-providers", "jackpot"],
};

function buildGridItem(entry: (typeof SLOT_COVER_ENTRIES)[number]): GridSlotProviderItem {
  return {
    id: entry.id,
    name: entry.name,
    category: "all-providers",
    bgGradient: "from-[#12122b] to-[#0f1025]",
    borderColor: "border-[#4338ca]/20",
    href: entry.href,
    artType: "generic",
    coverSrc: slotProviderCoverSrc(entry.file),
    tags: LEGACY_TAGS[entry.id] ?? [...DEFAULT_TAGS],
  };
}

/** กริดค่ายสล็อต — รูปครบทุกไฟล์ใน public/slots */
export const GRID_SLOT_PROVIDERS: GridSlotProviderItem[] = SLOT_COVER_ENTRIES.map(buildGridItem);
