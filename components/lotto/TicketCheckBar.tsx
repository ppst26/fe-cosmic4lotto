export function TicketCheckBar() {
  return (
    <section className="motion-reveal mt-3 rounded-xl bg-[var(--BG-Surface-Darker)] p-3">
      <div className="flex flex-row items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="กรอกเลขสลาก 6 หลัก"
          className="lotto-field min-w-0 flex-1 rounded-lg border border-white/10 bg-[var(--Card-Normal)] px-3 py-2.5 text-sm text-white outline-none focus:border-[var(--Main-Secondary)]"
        />
        <button type="button" className="btn-gold shrink-0 whitespace-nowrap rounded-lg! px-4 py-2.5 text-sm">
          ตรวจผลสลาก
        </button>
      </div>
    </section>
  );
}
