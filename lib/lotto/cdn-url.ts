/** Map origin CDN URL → local mirror under `/public/_cdn`. */
export function toLocalCdn(url: string): string {
  if (!url.startsWith("http")) return url;
  try {
    const u = new URL(url);
    return `/_cdn/${u.hostname}${u.pathname}`;
  } catch {
    return url;
  }
}
