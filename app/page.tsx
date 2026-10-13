import { LottoHomePage } from "@/components/lotto/LottoHomePage";

type PageProps = {
  searchParams?: Promise<{ guest?: string }>;
};

export default async function Home({ searchParams }: PageProps) {
  const sp = (await searchParams) ?? {};
  const loggedIn = sp.guest !== "1";
  return <LottoHomePage loggedIn={loggedIn} />;
}
