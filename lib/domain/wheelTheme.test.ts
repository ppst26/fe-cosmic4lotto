import assert from "node:assert/strict";
import test from "node:test";
import {
  WHEEL_DEFAULT_SPIN_MS,
  resolveWheelTheme,
  safeCssColor,
  safeImageUrl,
  segmentFill,
  wheelThemeCssVars,
} from "./wheelTheme";

test("safeCssColor accepts colors and gradients, rejects injection", () => {
  assert.equal(safeCssColor("#7c3aed"), "#7c3aed");
  assert.equal(safeCssColor("rgba(255, 255, 255, 0.6)"), "rgba(255, 255, 255, 0.6)");
  assert.equal(safeCssColor("linear-gradient(135deg, #241442, #140b28)"), "linear-gradient(135deg, #241442, #140b28)");
  assert.equal(safeCssColor("hsl(270 80% 60% / 0.5)"), "hsl(270 80% 60% / 0.5)");
  assert.equal(safeCssColor("red; background: url(x)"), undefined);
  assert.equal(safeCssColor("url(https://evil.com/x.png)"), undefined);
  assert.equal(safeCssColor("expression(alert(1))"), undefined);
  assert.equal(safeCssColor("</style>"), undefined);
  assert.equal(safeCssColor(42), undefined);
});

test("safeImageUrl allows site paths and https only", () => {
  assert.equal(safeImageUrl("/wheel/frame.png"), "/wheel/frame.png");
  assert.equal(safeImageUrl("https://cdn.example.com/a.png"), "https://cdn.example.com/a.png");
  assert.equal(safeImageUrl("//evil.com/a.png"), undefined);
  assert.equal(safeImageUrl("http://cdn.example.com/a.png"), undefined);
  assert.equal(safeImageUrl("javascript:alert(1)"), undefined);
  assert.equal(safeImageUrl("data:image/png;base64,AAA"), undefined);
});

test("empty theme keeps the default design", () => {
  assert.deepEqual(wheelThemeCssVars(undefined), {});
  const t = resolveWheelTheme(undefined);
  assert.equal(t.lightCount, 24);
  assert.equal(t.hubLabel, "SPIN");
  assert.equal(t.spinDurationMs, WHEEL_DEFAULT_SPIN_MS);
  assert.deepEqual(t.segmentColors, []);
});

test("theme values become css vars and clamped settings", () => {
  const vars = wheelThemeCssVars({
    rim: { color: "#ffd700" },
    hub: { sizePercent: 22, background: "radial-gradient(#fff, #000)" },
    pointer: { color: "bad;color" },
    background: { imageUrl: "/wheel/bg.webp" },
  }) as Record<string, string>;
  assert.equal(vars["--wheel-rim-color"], "#ffd700");
  assert.equal(vars["--wheel-hub-size"], "22%");
  assert.equal(vars["--wheel-hub-bg"], "radial-gradient(#fff, #000)");
  assert.equal(vars["--wheel-pointer-color"], undefined);
  assert.equal(vars["--wheel-stage-image"], 'url("/wheel/bg.webp")');

  const t = resolveWheelTheme({ lights: { count: 500, animation: "chase" }, spinDurationMs: 1, hub: { label: "  หมุน  " } });
  assert.equal(t.lightCount, 24);
  assert.equal(t.lightAnimation, "chase");
  assert.equal(t.spinDurationMs, WHEEL_DEFAULT_SPIN_MS);
  assert.equal(t.hubLabel, "หมุน");
});

test("segment fill: per-segment color, then cycling theme colors, else default", () => {
  const colors = ["#111111", "#222222"];
  assert.equal(segmentFill(0, {}, colors), "#111111");
  assert.equal(segmentFill(3, {}, colors), "#222222");
  assert.equal(segmentFill(1, { color: "#ff0000" }, colors), "#ff0000");
  assert.equal(segmentFill(1, {}, []), undefined);
});
