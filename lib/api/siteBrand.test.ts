import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_SITE_BRAND, isSafeIconUrl, resolveSiteBrand } from "./siteBrand";

test("resolveSiteBrand uses defaults for missing or invalid fields", () => {
  assert.deepEqual(resolveSiteBrand(null), DEFAULT_SITE_BRAND);
  assert.deepEqual(resolveSiteBrand({ title: "  ", faviconUrl: "javascript:alert(1)" }), DEFAULT_SITE_BRAND);
});

test("resolveSiteBrand keeps valid values from the API", () => {
  const brand = resolveSiteBrand({
    title: " My Title ",
    faviconUrl: "https://cdn.example.com/fav.png",
    appleTouchIconUrl: "/x.png",
  });
  assert.equal(brand.title, "My Title");
  assert.equal(brand.faviconUrl, "https://cdn.example.com/fav.png");
  assert.equal(brand.appleTouchIconUrl, "/x.png");
});

test("isSafeIconUrl accepts only site paths and https", () => {
  assert.equal(isSafeIconUrl("/brand/favicon.png"), true);
  assert.equal(isSafeIconUrl("https://cdn.example.com/a.png"), true);
  assert.equal(isSafeIconUrl("//evil.com/a.png"), false);
  assert.equal(isSafeIconUrl("http://evil.com/a.png"), false);
  assert.equal(isSafeIconUrl("data:image/png;base64,AAAA"), false);
  assert.equal(isSafeIconUrl(""), false);
});
