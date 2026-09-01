import React from "react";
import { fluidFontSize, resolveFontStack, type TextStyle } from "@/content/typography";

const HL_RE = /\*\*([^*\n]+?)\*\*/g;

export type WordAttrs = { text: string; size?: number; color?: string };

/**
 * Parse the inner content of a `**...**` block.
 * Supports optional attributes after `|`, e.g. `Next-Gen|s=80;c=#ff0000`.
 *   s=NN   → fontSize override (pixels)
 *   c=HEX  → color override
 */
export function parseHighlightInner(inner: string): WordAttrs {
  const pipe = inner.indexOf("|");
  if (pipe === -1) return { text: inner };
  const text = inner.slice(0, pipe);
  const attrs = inner.slice(pipe + 1);
  const out: WordAttrs = { text };
  for (const kv of attrs.split(";")) {
    const eq = kv.indexOf("=");
    if (eq === -1) continue;
    const k = kv.slice(0, eq).trim();
    const v = kv.slice(eq + 1).trim();
    if (k === "s") {
      const n = Number(v);
      if (!Number.isNaN(n) && n > 0) out.size = n;
    } else if (k === "c") {
      out.color = v;
    }
  }
  return out;
}

/**
 * Renders text with `**word**` markup applied as highlight style.
 * Per-word size/color overrides via `**word|s=80;c=#ff0000**`.
 */
export function MarkupText({
  text,
  highlightStyle,
  highlightClassName,
}: {
  text: string;
  highlightStyle?: TextStyle;
  /** Kept for backward compat — no longer used. */
  highlightFallback?: TextStyle;
  highlightClassName?: string;
}) {
  if (!text) return null;

  // fontSize intentionally NOT applied from highlightStyle — highlighted words
  // inherit size from the parent so the line stays visually consistent. Use the
  // per-word `s=NN` override (from the picker) when a single word needs a
  // different size.
  const baseCss: React.CSSProperties = highlightStyle
    ? {
        color: highlightStyle.color || undefined,
        fontWeight: highlightStyle.bold ? 700 : undefined,
        fontStyle: highlightStyle.italic ? "italic" : undefined,
        textDecoration: highlightStyle.underline ? "underline" : undefined,
        // Resolve through the same rule the parent heading uses, so a
        // highlighted word never renders in a different face than the words
        // around it (large text site-wide switches to the display font).
        fontFamily: highlightStyle.fontFamily
          ? resolveFontStack(highlightStyle.fontFamily, highlightStyle.fontSize)
          : undefined,
      }
    : {};

  const parts: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  HL_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = HL_RE.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const { text: word, size, color } = parseHighlightInner(m[1]);
    const css: React.CSSProperties = { ...baseCss };
    if (size) {
      css.fontSize = fluidFontSize(size);
      // A per-word size override changes which face the shared rule picks, so
      // re-resolve the family against the overridden size too.
      if (highlightStyle?.fontFamily) {
        css.fontFamily = resolveFontStack(highlightStyle.fontFamily, size);
      }
    }
    if (color) css.color = color;
    parts.push(
      <span key={key++} className={highlightClassName} style={css}>
        {word}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
