import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import tailwindConfig from "../../tailwind.config";

/**
 * Guards against a silent Tailwind failure.
 *
 * The `/NN` colour modifier only works for steps that exist in `theme.opacity`.
 * A value outside the scale produces NO rule — no warning, no error, the class
 * simply does nothing. `bg-[#22175A]/98` therefore rendered the mobile nav menu
 * completely transparent instead of near-opaque, letting the hero's glow show
 * straight through the open menu.
 *
 * Anything off-scale must either be added to `theme.extend.opacity` or written
 * inline as an arbitrary value (`/[0.98]`).
 */

const DEFAULT_STEPS = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

const extendedSteps = Object.keys(
  (tailwindConfig.theme?.extend as { opacity?: Record<string, string> } | undefined)?.opacity ?? {},
).map(Number);

const ALLOWED = new Set<number>([...DEFAULT_STEPS, ...extendedSteps]);

/** Colour utilities that accept an opacity modifier. */
const COLOR_UTILITIES = [
  "bg", "text", "border", "from", "via", "to", "ring", "shadow",
  "fill", "stroke", "divide", "placeholder", "decoration", "outline",
  "accent", "caret",
].join("|");

// `left-1/2`, `w-1/2` etc. are fractions, not opacity — require the utility to
// carry a colour-ish value (a hex bracket, or a known colour word) before `/`.
const MODIFIER = new RegExp(
  String.raw`\b(?:${COLOR_UTILITIES})-(?:\[#[0-9A-Fa-f]{3,8}\]|[a-z]+(?:-\d{2,3})?)\/(\d{1,3})\b`,
  "g",
);

function sourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) sourceFiles(full, acc);
    else if (/\.tsx?$/.test(full) && !full.includes("test")) acc.push(full);
  }
  return acc;
}

describe("tailwind opacity modifiers", () => {
  it("only uses steps that exist in the theme", () => {
    const offending: string[] = [];

    for (const file of sourceFiles("src")) {
      const lines = readFileSync(file, "utf8").split("\n");
      lines.forEach((line, i) => {
        for (const match of line.matchAll(MODIFIER)) {
          const step = Number(match[1]);
          if (!ALLOWED.has(step)) {
            offending.push(`${relative(".", file)}:${i + 1}  ${match[0]}`);
          }
        }
      });
    }

    expect(
      offending,
      `These opacity modifiers are not in Tailwind's scale, so they render nothing.\n` +
        `Add the step to theme.extend.opacity in tailwind.config.ts, or use /[0.NN]:\n` +
        offending.join("\n"),
    ).toEqual([]);
  });

  it("keeps the mobile nav panel near-opaque", () => {
    // The menu sits over the hero's glow; a transparent panel makes it unreadable.
    const navbar = readFileSync("src/components/Navbar.tsx", "utf8");
    const panel = navbar.match(/bg-\[#22175A\]\/(\d+|\[[\d.]+\])/g) ?? [];
    expect(panel.length).toBeGreaterThan(0);
    for (const cls of panel) {
      const step = Number(cls.replace(/.*\//, "").replace(/[[\]]/g, ""));
      const asFraction = step > 1 ? step / 100 : step;
      expect(asFraction).toBeGreaterThanOrEqual(0.8);
    }
  });
});
