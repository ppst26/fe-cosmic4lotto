import { LobbyProviderGamesView } from "@/app/components/lobby/LobbyProviderGamesView";
import { PROVIDER_INFO_MAP } from "@/app/data/providerGamesData";
import { SubPageShell } from "@/components/layout/SubPageShell";

type PageProps = {
  params: Promise<{ provider: string }>;
};

/** เกมในค่ายสล็อต — /slots/[provider] (ชื่อค่ายสำรองจาก slug เหมือน LobbyProviderGamesView ของ glass) */
export default async function SlotsProviderPage({ params }: PageProps) {
  const { provider: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug).toLowerCase();
  const providerName = PROVIDER_INFO_MAP[slug]?.name ?? slug.replace(/-/g, " ").toUpperCase();

  return (
    <SubPageShell title={providerName} breadcrumbLabel={providerName} parentLabel="สล็อต" backHref="/slots">
      <LobbyProviderGamesView providerId={slug} providerName={providerName} />
    </SubPageShell>
  );
}
