/**
 * Shared typography primitives — used by every admin editor + renderer.
 * One place to add a new font, tweak preset sizes, or change how a
 * `TextStyle` object maps to CSS.
 */
import type React from "react";

/**
 * Font family tokens — short, stable identifiers stored in Firestore.
 * The actual CSS font-family stack lives in FONT_FAMILIES so the stored
 * value stays small and we can rename font stacks centrally.
 */
export type FontFamily =
  | "inter"
  | "space-grotesk"
  | "roboto"
  | "poppins"
  | "montserrat"
  | "oswald"
  | "bebas"
  | "playfair"
  | "merriweather"
  | "lora"
  | "cormorant"
  | "italiana"
  | "dm-serif-display"
  | "the-seasons"
  | "dancing-script"
  | "pacifico"
  | "caveat"
  | "bangers"
  | "jetbrains-mono"
  | "system"
  | "serif"
  | "mono";

/** Category label — used by the picker to render grouped option headings. */
export type FontCategory = "Sans-serif" | "Serif" | "Display" | "Handwritten" | "Monospace" | "System";

export interface FontDef {
  label: string;
  stack: string;
  category: FontCategory;
}

/**
 * Token → (display label, CSS font-family stack, category).
 * Adding a new font: add the token to FontFamily above, an entry here, and
 * add its <link> to index.html if it's a web font.
 */
export const FONT_FAMILIES: Record<FontFamily, FontDef> = {
  inter:           { label: "Inter",              stack: "'Inter', system-ui, sans-serif",                        category: "Sans-serif" },
  "space-grotesk": { label: "Space Grotesk",      stack: "'Space Grotesk', 'Inter', sans-serif",                  category: "Sans-serif" },
  roboto:          { label: "Roboto",             stack: "'Roboto', 'Helvetica', sans-serif",                     category: "Sans-serif" },
  poppins:         { label: "Poppins",            stack: "'Poppins', 'Inter', sans-serif",                        category: "Sans-serif" },
  montserrat:      { label: "Montserrat",         stack: "'Montserrat', 'Inter', sans-serif",                     category: "Sans-serif" },
  oswald:          { label: "Oswald",             stack: "'Oswald', 'Impact', sans-serif",                        category: "Display" },
  bebas:           { label: "Bebas Neue",         stack: "'Bebas Neue', 'Impact', sans-serif",                    category: "Display" },
  playfair:        { label: "Playfair Display",   stack: "'Playfair Display', Georgia, serif",                    category: "Serif" },
  merriweather:    { label: "Merriweather",       stack: "'Merriweather', Georgia, serif",                        category: "Serif" },
  lora:            { label: "Lora",               stack: "'Lora', Georgia, serif",                                category: "Serif" },
  cormorant:       { label: "Cormorant Garamond", stack: "'Cormorant Garamond', Georgia, serif",                  category: "Serif" },
  italiana:        { label: "Italiana",           stack: "'Italiana', 'Cormorant Garamond', Georgia, serif",      category: "Serif" },
  "dm-serif-display":{ label: "DM Serif Display", stack: "'DM Serif Display', 'Playfair Display', Georgia, serif", category: "Serif" },
  "the-seasons":   { label: "The Seasons",        stack: "'The Seasons', 'Italiana', 'Cormorant Garamond', Georgia, serif", category: "Serif" },
  "dancing-script":{ label: "Dancing Script",     stack: "'Dancing Script', cursive",                             category: "Handwritten" },
  pacifico:        { label: "Pacifico",           stack: "'Pacifico', cursive",                                   category: "Handwritten" },
  caveat:          { label: "Caveat",             stack: "'Caveat', cursive",                                     category: "Handwritten" },
  bangers:         { label: "Bangers",            stack: "'Bangers', 'Impact', sans-serif",                       category: "Display" },
  "jetbrains-mono":{ label: "JetBrains Mono",     stack: "'JetBrains Mono', ui-monospace, monospace",             category: "Monospace" },
  system:          { label: "System sans",        stack: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif", category: "System" },
  serif:           { label: "System serif",       stack: "ui-serif, Georgia, Cambria, 'Times New Roman', serif",   category: "System" },
  mono:            { label: "System mono",        stack: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", category: "System" },
};

/** Grouping order in the picker — matches Word's "Theme Fonts / All Fonts" feel. */
export const FONT_CATEGORY_ORDER: FontCategory[] = [
  "Sans-serif",
  "Serif",
  "Display",
  "Handwritten",
  "Monospace",
  "System",
];

/**
 * Excel-style text styling: pixel font size + family + bold/italic/underline.
 * Applied inline via `style={{ fontSize, fontFamily, fontWeight, ... }}` so
 * every knob is directly reflected without a Tailwind class round-trip.
 */
export interface TextStyle {
  /** Desktop font size in pixels. */
  fontSize: number;
  /** Key into FONT_FAMILIES. */
  fontFamily: FontFamily;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  /** CSS color value (hex, rgba, etc.) */
  color?: string;
  /** Opacity from 0 to 1 */
  opacity?: number;
}

/** Word/Excel-style preset size list. */
export const FONT_SIZE_PRESETS: number[] = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
];

/** Clamps used by the editor's +/- buttons and numeric input. */
export const MIN_FONT_SIZE = 6;
export const MAX_FONT_SIZE = 300;

/**
 * Default fallback style used when no style is defined.
 */
export const defaultTextStyle: TextStyle = {
  fontSize: 16,
  fontFamily: "inter",
  bold: false,
  italic: false,
  underline: false,
  color: "#ffffff",
  opacity: 1,
};

export const DEFAULT_TEXT_STYLE = defaultTextStyle;

/**
 * Site-wide display-font override — applied to TextStyles whose fontSize is
 * at least DISPLAY_FONT_THRESHOLD. Smaller text (descriptions, labels, body
 * copy) keeps its saved fontFamily so paragraphs stay readable.
 *
 * Set to null to honour each TextStyle's own fontFamily completely.
 */
export const SITE_DISPLAY_FONT: FontFamily | null = "the-seasons";
export const DISPLAY_FONT_THRESHOLD = 30;

/**
 * Convert a TextStyle (or fallback) into a React.CSSProperties object.
 * Centralising the mapping keeps the renderer and the editor preview 1:1.
 */
export function textStyleToCss(style?: TextStyle, fallback: TextStyle = defaultTextStyle): React.CSSProperties {
  const s = style ?? fallback;
  const familyKey =
    SITE_DISPLAY_FONT && s.fontSize >= DISPLAY_FONT_THRESHOLD
      ? SITE_DISPLAY_FONT
      : s.fontFamily;
      
  // For mobile responsiveness: text smaller than 20px stays fixed.
  // Larger text uses clamp() to scale down on small viewports.
  const fontSize = s.fontSize <= 20 
    ? `${s.fontSize}px` 
    : `clamp(${Math.max(16, s.fontSize * 0.45)}px, ${s.fontSize * 0.08}vw + ${s.fontSize * 0.25}px, ${s.fontSize}px)`;

  return {
    fontSize,
    fontFamily: FONT_FAMILIES[familyKey]?.stack ?? FONT_FAMILIES.inter.stack,
    fontWeight: s.bold ? 700 : 400,
    fontStyle: s.italic ? "italic" : "normal",
    textDecoration: s.underline ? "underline" : "none",
    color: s.color,
    opacity: s.opacity ?? 1,
  };
}
