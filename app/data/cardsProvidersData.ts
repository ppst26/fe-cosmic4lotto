/**
 * Mock ค่ายเกมไพ่ — หน้า /cards และ lobby หมวดเกมไพ่
 */

import type { CardsCardItem } from "@/app/types/providers";

const CARDS_DEFAULT_TAGS = ["all-in-one", "all-providers"] as const;

export const CARDS_ITEMS: CardsCardItem[] = [
  {
    id: "cards-joker",
    title: "Joker Gaming",
    provider: "Joker",
    badges: ["HOT", "LIVE"],
    bgGradient: "from-[#4c1d95] to-[#1e1b4b]",
    artType: "default",
    tags: [...CARDS_DEFAULT_TAGS],
    href: "/cards/joker",
  },
  {
    id: "cards-king-midas",
    title: "King Midas",
    provider: "King Midas",
    badges: ["EXCLUSIVE"],
    bgGradient: "from-[#78350f] to-[#1c1917]",
    artType: "default",
    tags: [...CARDS_DEFAULT_TAGS],
    href: "/cards/king-midas",
  },
  {
    id: "cards-fa-chai",
    title: "FA CHAI",
    provider: "FA CHAI",
    badges: ["LIVE"],
    bgGradient: "from-[#7f1d1d] to-[#0f172a]",
    artType: "default",
    tags: [...CARDS_DEFAULT_TAGS],
    href: "/cards/fa-chai",
  },
  {
    id: "cards-spadegaming",
    title: "Spadegaming",
    provider: "Spadegaming",
    badges: ["HOT"],
    bgGradient: "from-[#1e3a8a] to-[#0f172a]",
    artType: "default",
    tags: [...CARDS_DEFAULT_TAGS],
    href: "/cards/spadegaming",
  },
  {
    id: "cards-jili",
    title: "JILI Table",
    provider: "JILI",
    badges: ["EXCLUSIVE", "HOT"],
    bgGradient: "from-[#be185d] to-[#1e1b4b]",
    artType: "default",
    tags: [...CARDS_DEFAULT_TAGS],
    href: "/cards/jili",
  },
  {
    id: "cards-royal",
    title: "Royal Slot Gaming",
    provider: "RSG",
    badges: ["LIVE"],
    bgGradient: "from-[#065f46] to-[#0f172a]",
    artType: "default",
    tags: [...CARDS_DEFAULT_TAGS],
    href: "/cards/royal-slot-gaming",
  },
];
