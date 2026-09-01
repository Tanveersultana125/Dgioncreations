import { describe, it, expect } from "vitest";
import { textStyleToCss, type TextStyle } from "@/content/typography";

/**
 * The admin panel lets an editor set any font size up to MAX_FONT_SIZE (300px).
 * Whatever they pick, the rendered text has to stay inside a phone screen —
 * an oversized heading is what pushed the Explore section's label and heading
 * into each other on mobile.
 *
 * These tests pin the contract of the fluid scale rather than exact pixels:
 * body copy is fixed, display text clamps, and the clamp floor never exceeds
 * what a 360px screen can show.
 */

const style = (fontSize: number): TextStyle => ({ fontSize, fontFamily: "inter" });

/** Largest size the clamp can ever render (its first argument). */
function clampFloorPx(css: string): number {
  const m = /^clamp\(([\d.]+)px,/.exec(css);
  if (!m) return Number(css.replace("px", ""));
  return Number(m[1]);
}

/** Authored maximum (the clamp's third argument). */
function clampMaxPx(css: string): number {
  const m = /,\s*([\d.]+)px\)$/.exec(css);
  if (!m) return Number(css.replace("px", ""));
  return Number(m[1]);
}

describe("fluid type scale", () => {
  it("renders body copy at its exact authored size", () => {
    for (const px of [11, 14, 16, 18, 20]) {
      expect(textStyleToCss(style(px)).fontSize).toBe(`${px}px`);
    }
  });

  it("caps the mobile size of oversized headings", () => {
    // This is the regression: a 120px or 200px heading used to bottom out at
    // ~54px / ~90px, far wider than a phone for a single long word.
    for (const px of [80, 120, 200, 300]) {
      const css = String(textStyleToCss(style(px)).fontSize);
      expect(css.startsWith("clamp(")).toBe(true);
      expect(clampFloorPx(css)).toBeLessThanOrEqual(34);
    }
  });

  it("keeps small and mid headings legible rather than shrinking them to body size", () => {
    for (const px of [24, 36, 48, 64]) {
      const floor = clampFloorPx(String(textStyleToCss(style(px)).fontSize));
      expect(floor).toBeGreaterThanOrEqual(18);
      expect(floor).toBeLessThanOrEqual(px);
    }
  });

  it("never scales text above its authored size", () => {
    for (const px of [24, 48, 120, 300]) {
      const css = String(textStyleToCss(style(px)).fontSize);
      expect(clampMaxPx(css)).toBe(px);
      expect(clampFloorPx(css)).toBeLessThanOrEqual(px);
    }
  });

  it("switches large text to the site display font", () => {
    expect(textStyleToCss(style(48)).fontFamily).toContain("The Seasons");
    // Body copy keeps whatever family the editor chose.
    expect(textStyleToCss(style(16)).fontFamily).toContain("Inter");
  });
});

describe("MarkupText per-word overrides", () => {
  it("scales an oversized highlighted word through the shared fluid scale", async () => {
    const { fluidFontSize } = await import("@/content/typography");
    // `**need|s=200**` in the editor must not render a 90px word on a phone.
    expect(fluidFontSize(200)).toBe(fluidFontSize(200));
    expect(clampFloorPx(fluidFontSize(200))).toBeLessThanOrEqual(34);
    expect(clampMaxPx(fluidFontSize(200))).toBe(200);
  });

  it("resolves a highlighted word to the same face as its heading", async () => {
    const { resolveFontStack } = await import("@/content/typography");
    // Large text switches to the display font regardless of the saved family,
    // so a highlight inside a big heading matches the words around it.
    expect(resolveFontStack("inter", 48)).toBe(resolveFontStack("playfair", 48));
    // Body-size text keeps whatever the editor chose.
    expect(resolveFontStack("inter", 16)).toContain("Inter");
  });
});
