import { LobbyProviderDrilldown } from "@/components/gaming/LobbyProviderDrilldown";

type PageProps = {
  params: Promise<{ provider: string }>;
};

/** เกมในค่าย /fishing/[provider] — แสดงใน (tabs) layout เดียวกับหน้าแรก (ไม่ใช้หน้า standalone) */
export default async function FishingProviderPage({ params }: PageProps) {
  const { provider: rawSlug } = await params;
  return <LobbyProviderDrilldown categoryId="fishing" slug={decodeURIComponent(rawSlug).toLowerCase()} />;
}
