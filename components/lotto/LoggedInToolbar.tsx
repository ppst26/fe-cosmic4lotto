import type { WalletSnapshot } from "@/lib/lotto/load-wallet-snapshot";

type Props = {
  wallet: WalletSnapshot;
  className?: string;
};

export function LoggedInToolbar({ wallet, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 py-1 ${className}`.trim()}>
      <div className="flex flex-1 items-center justify-end gap-3 text-xs text-[var(--Text-Icon-Body)]">
        <span>
          เงิน <strong className="text-white">{wallet.money}</strong>
        </span>
        <span>
          เครดิต <strong className="text-white">{wallet.credit}</strong>
        </span>
      </div>
      <button type="button" className="btn-gold text-xs">
        ฝากเงิน
      </button>
      <button type="button" className="btn-outline-gold text-xs">
        ถอนเงิน
      </button>
    </div>
  );
}
