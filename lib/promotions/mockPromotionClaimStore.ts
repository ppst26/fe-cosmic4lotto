/**
 * สถานะรับโปร mock ต่อ user — แทน DB / back office
 * ใช้ใน POST/GET /api/promotions/[id]/claim
 */

const claimsByUser = new Map<string, Map<string, string>>();

function userClaims(userId: string): Map<string, string> {
  let map = claimsByUser.get(userId);
  if (!map) {
    map = new Map();
    claimsByUser.set(userId, map);
  }
  return map;
}

export function getPromotionClaimedAt(userId: string, promotionId: string): string | null {
  return userClaims(userId).get(promotionId) ?? null;
}

export function recordPromotionClaim(userId: string, promotionId: string): string {
  const at = new Date().toISOString();
  userClaims(userId).set(promotionId, at);
  return at;
}
