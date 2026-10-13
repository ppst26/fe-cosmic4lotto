import Image from "next/image";

export function HeroBanner() {
  return (
    <section className="overflow-hidden rounded-xl" aria-label="แบนเนอร์">
      <Image
        src="/_cdn/d29xpgmn3rqne6.cloudfront.net/bblotto/cms/1786720403059"
        alt="BB LOTTO — The Best Lottery Betting Platform"
        width={638}
        height={220}
        className="h-auto w-full object-cover"
        priority
      />
    </section>
  );
}
