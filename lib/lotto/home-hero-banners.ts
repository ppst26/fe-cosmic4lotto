/** อัตราส่วนต้นฉบับ HomeProBanner (Mbanner-1.png 1916×821) */
export const HOME_HERO_BANNER_ASPECT = {
  width: 1916,
  height: 821,
} as const;

/** สไลด์แบนเนอร์หน้าแรก — public/HomeProBanner */
export type HomeHeroBannerSlide = {
  id: string;
  src: string;
  alt: string;
};

export const HOME_HERO_BANNER_SLIDES: HomeHeroBannerSlide[] = [
  {
    id: "home-pro-mbanner-1",
    src: "/HomeProBanner/Mbanner-1.avif",
    alt: "CM-SaturnLotto — แพลตฟอร์มหวยออนไลน์",
  },
  {
    id: "home-pro-mbanner-2",
    src: "/HomeProBanner/Mbanner-2.avif",
    alt: "CM-SaturnLotto — โปรโมชัน",
  },
];
