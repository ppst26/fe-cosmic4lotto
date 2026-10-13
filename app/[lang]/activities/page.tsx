import { localizedRedirect } from "@/lib/i18n/server";

/** path เก่า (sport/glass) — ย้ายไป /event */
export default async function ActivitiesLegacyRedirect() {
  await localizedRedirect("/event");
}
