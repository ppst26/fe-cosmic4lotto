import { LobbyProviderDrilldown } from "@/components/gaming/LobbyProviderDrilldown";

type PageProps = {
  params: Promise<{ provider: string }>;
};

/** เกมในค่าย /sport/[provider] — แสดงใน (tabs) layout เดียวกับหน้าแรก (ไม่ใช้หน้า standalone) */
export default async function SportProviderPage({ params }: PageProps) {
  const { provider: rawSlug } = await params;
  return <LobbyProviderDrilldown categoryId="sports" slug={decodeURIComponent(rawSlug).toLowerCase()} />;
}
