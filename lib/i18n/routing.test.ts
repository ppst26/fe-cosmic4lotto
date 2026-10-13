import assert from "node:assert/strict";
import test from "node:test";
import { PROTECTED_PREFIXES } from "@/lib/auth/protectedPaths";
import { decideProxyAction, parseAcceptLanguage, splitLocale, withLocale } from "./routing";

test("splitLocale strips a supported prefix only", () => {
  assert.deepEqual(splitLocale("/en/vip"), { locale: "en", path: "/vip" });
  assert.deepEqual(splitLocale("/fil"), { locale: "fil", path: "/" });
  assert.deepEqual(splitLocale("/vip"), { locale: null, path: "/vip" });
  assert.deepEqual(splitLocale("/eng/vip"), { locale: null, path: "/eng/vip" });
});

test("withLocale: th has no prefix, others do; keeps query/hash", () => {
  assert.equal(withLocale("/", "th"), "/");
  assert.equal(withLocale("/vip", "th"), "/vip");
  assert.equal(withLocale("/en/vip?tab=rank", "th"), "/vip?tab=rank");
  assert.equal(withLocale("/th/vip", "th"), "/vip");
  assert.equal(withLocale("/vip?tab=rank", "en"), "/en/vip?tab=rank");
  assert.equal(withLocale("/en/vip#top", "km"), "/km/vip#top");
  assert.equal(withLocale("/?layer=login", "en"), "/en?layer=login");
  assert.equal(withLocale("https://x.com/a", "en"), "https://x.com/a");
  assert.equal(withLocale("//x.com/a", "en"), "//x.com/a");
  assert.equal(withLocale("#section", "en"), "#section");
});

test("parseAcceptLanguage honours q-values, regions and aliases", () => {
  assert.equal(parseAcceptLanguage("vi-VN,vi;q=0.9,en;q=0.8"), "vi");
  assert.equal(parseAcceptLanguage("fr;q=1,en;q=0.5"), "en");
  assert.equal(parseAcceptLanguage("de;q=0.9, km;q=0.95"), "km");
  assert.equal(parseAcceptLanguage("tl-PH"), "fil");
  assert.equal(parseAcceptLanguage("zh-TW"), "zh");
  assert.equal(parseAcceptLanguage("de,fr"), null);
  assert.equal(parseAcceptLanguage(undefined), null);
});

const base = { search: "", cookieLocale: undefined, acceptLanguage: null, hasSession: false };

test("Thai URLs have no prefix and are rewritten internally to /th", () => {
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/" }), { type: "rewrite", pathname: "/th" });
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/casino" }), { type: "rewrite", pathname: "/th/casino" });
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/casino", cookieLocale: "th", acceptLanguage: "en" }), {
    type: "rewrite",
    pathname: "/th/casino",
  });
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/", cookieLocale: "xx" }), { type: "rewrite", pathname: "/th" });
});

test("explicit /th prefix redirects to the unprefixed URL", () => {
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/th/vip", search: "?tab=rank" }), {
    type: "redirect",
    pathname: "/vip",
    search: "?tab=rank",
  });
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/th" }), { type: "redirect", pathname: "/", search: "" });
});

test("unprefixed URL redirects to a preferred non-Thai locale (cookie, then header)", () => {
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/vip", search: "?tab=rank", cookieLocale: "km" }), {
    type: "redirect",
    pathname: "/km/vip",
    search: "?tab=rank",
  });
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/", acceptLanguage: "en-US" }), {
    type: "redirect",
    pathname: "/en",
    search: "",
  });
});

test("every protected path stays guarded in every locale", () => {
  for (const prefix of PROTECTED_PREFIXES) {
    for (const sub of ["", "/x"]) {
      const thai = `${prefix}${sub}`;
      assert.deepEqual(
        decideProxyAction({ ...base, pathname: thai }),
        { type: "redirect", pathname: "/", search: "?layer=login" },
        thai,
      );
      assert.deepEqual(decideProxyAction({ ...base, pathname: thai, hasSession: true }), {
        type: "rewrite",
        pathname: `/th${thai}`,
      });

      for (const locale of ["en", "km"] as const) {
        const pathname = `/${locale}${prefix}${sub}`;
        assert.deepEqual(
          decideProxyAction({ ...base, pathname }),
          { type: "redirect", pathname: `/${locale}`, search: "?layer=login" },
          pathname,
        );
        assert.deepEqual(decideProxyAction({ ...base, pathname, hasSession: true }), { type: "next" });
      }
    }
  }
});

test("public pages pass through without a session", () => {
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/en/casino" }), { type: "next" });
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/en/vipx" }), { type: "next" });
  assert.deepEqual(decideProxyAction({ ...base, pathname: "/vipx" }), { type: "rewrite", pathname: "/th/vipx" });
});
