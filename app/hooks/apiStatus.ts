export type ResourceStatus = "idle" | "loading" | "ready" | "error";

/**
 * คำนวณสถานะจากค่า SWR (pure — มี test ใน apiStatus.test.ts · ใช้ใน useApi)
 */
export function resolveApiStatus(input: {
  hasKey: boolean;
  hasData: boolean;
  hasError: boolean;
  isValidating: boolean;
}): ResourceStatus {
  const { hasKey, hasData, hasError, isValidating } = input;
  if (!hasKey) return "idle";
  if (!hasData) return hasError && !isValidating ? "error" : "loading";
  return hasError && !isValidating ? "error" : "ready";
}
