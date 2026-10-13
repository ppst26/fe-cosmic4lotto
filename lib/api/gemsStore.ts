import {
  GEMS_STORE_BALANCE_MOCK,
  GEMS_STORE_COIN_ASSETS,
  GEMS_STORE_EXCHANGE_RATE_LABEL,
  GEMS_STORE_GEM_ASSET,
  GEMS_STORE_PACKAGES,
  GEMS_STORE_REDEEM_QUOTA_MOCK,
  GEMS_STORE_RESET_NOTICE,
  GEMS_STORE_TERMS,
} from "@/app/data/gemsStoreMockData";
import type { ApiResult } from "./http";
import { mockResult } from "./mock";

function gemsStoreMock() {
  return {
    balance: GEMS_STORE_BALANCE_MOCK,
    quota: GEMS_STORE_REDEEM_QUOTA_MOCK,
    packages: GEMS_STORE_PACKAGES,
    terms: GEMS_STORE_TERMS,
    gemAsset: GEMS_STORE_GEM_ASSET,
    coinAssets: GEMS_STORE_COIN_ASSETS,
    rateLabel: GEMS_STORE_EXCHANGE_RATE_LABEL,
    resetNotice: GEMS_STORE_RESET_NOTICE,
  };
}

/** รูปข้อมูลที่ backend ต้องส่ง — GET /api/gems-store (ตอนนี้อนุมานจาก mock) */
export type GemsStoreData = ReturnType<typeof gemsStoreMock>;

/**
 * ต่อ backend: return apiFetch<GemsStoreData>("/api/gems-store")
 */
export function fetchGemsStore(): Promise<ApiResult<GemsStoreData>> {
  return mockResult(gemsStoreMock());
}
