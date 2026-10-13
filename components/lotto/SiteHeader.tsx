import type { WalletSnapshot } from "@/lib/lotto/load-wallet-snapshot";
import { LottoSiteHeader } from "./LottoSiteHeader";

type Props = { loggedIn?: boolean; wallet?: WalletSnapshot };

/** @deprecated ใช้ LottoSiteHeader */
export function SiteHeader(props: Props) {
  return <LottoSiteHeader {...props} />;
}
