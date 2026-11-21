import { LobbyProviderDrilldown } from "@/components/gaming/LobbyProviderDrilldown";

type PageProps = {
  params: Promise<{ provider: string }>;
};

/** เกมในค่าย /slots/[provider] — แสดงใน (tabs) layout เดียวกับหน้าแรก (ไม่ใช้หน้า standalone) */
export default async function SlotsProviderPage({ params }: PageProps) {
  const { provider: rawSlug } = await params;
  return <LobbyProviderDrilldown categoryId="slots" slug={decodeURIComponent(rawSlug).toLowerCase()} />;
}
