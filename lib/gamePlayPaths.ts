/**
 * path หน้าเล่นเกม mock — ใช้ใน GameCard · ProviderGameGrid · mock data
 */

export interface GamePlayHrefInput {
  id: string;
  title?: string;
  provider?: string;
}

/** สร้าง URL หน้า mock เล่นเกม (/play/[id]) */
export function buildGamePlayHref({ id, title, provider }: GamePlayHrefInput): string {
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (provider) params.set("provider", provider);
  const qs = params.toString();
  return qs ? `/play/${encodeURIComponent(id)}?${qs}` : `/play/${encodeURIComponent(id)}`;
}

/** คาสิโนสด — กดค่ายแล้วเข้า mock เล่นเลย (ไม่มีรายการเกม) */
export function buildCasinoProviderPlayHref(input: {
  slug: string;
  title: string;
  provider: string;
}): string {
  const slug = input.slug.toLowerCase().trim();
  return buildGamePlayHref({
    id: `casino-${slug}-live`,
    title: input.title,
    provider: input.provider,
  });
}
