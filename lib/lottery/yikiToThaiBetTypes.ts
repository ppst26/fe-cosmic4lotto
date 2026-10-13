import type { ThaiLottoBetType, ThaiLottoBetTypeId } from "@/app/types/lottery";
import type { YikiBetType, YikiSettlementType, YikiSettlementTypeId } from "@/app/types/yiki";

/**
 * แปลงปุ่มประเภทยี่กีเป็นรูปแบบ picker หวยรัฐบาล — UI เดียวกันทุกตลาด
 */
export function mapYikiBetTypesForPicker(
  betTypes: YikiBetType[],
  settlementTypes: Record<YikiSettlementTypeId, YikiSettlementType>,
): ThaiLottoBetType[] {
  return betTypes.map((type) => {
    const primary = settlementTypes[type.settlementTypeIds[0]];
    const payoutRate =
      type.settlementTypeIds.length > 1
        ? Math.max(...type.settlementTypeIds.map((id) => settlementTypes[id]?.payoutRate ?? 0))
        : (primary?.payoutRate ?? 0);

    return {
      id: type.id as ThaiLottoBetTypeId,
      labelKey: type.labelKey,
      group: type.group,
      digits: type.digits,
      payoutRate,
    };
  });
}
