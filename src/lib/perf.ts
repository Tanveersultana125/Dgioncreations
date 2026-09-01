import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Shared performance primitives.
 *
 * The site runs a lot of canvas / WebGL decoration. Left unmanaged every one of
 * those pieces keeps its own requestAnimationFrame loop alive for the lifetime
 * of the page — even scrolled far out of view, even in a background tab. Twelve
 * such loops on one page is what makes scrolling feel stuck.
 *
 * The rules here are simple and apply everywhere:
 *   1. Never animate what nobody can see  -> useInViewport
 *   2. Never mount heavy WebGL until it is nearly on screen -> useLazyMount
 *   3. Never run full-fat effects on a weak device -> getDeviceTier
 */

/* ------------------------------------------------------------------ */
/* Viewport visibility                                                 */
/* ------------------------------------------------------------------ */

/**
 * True while the element is intersecting the viewport AND the tab is visible.
 * Animation loops should bail out on every frame where this is false.
 *
 * `rootMargin` lets an element "wake up" slightly before it scrolls into view
 * so the first visible frame is already rendered.
 */
export function useInViewport<T extends Element>(
  ref: RefObject<T>,
  rootMargin = "200px",
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // No IntersectionObserver (very old browsers) -> assume visible, degrade to
    // the previous always-on behaviour rather than showing nothing.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    let onScreen = false;
    const sync = () => setVisible(onScreen && !document.hidden);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin },
    );
    io.observe(el);

    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref, rootMargin]);

  return visible;
}

/**
 * One-way latch: flips to true the first time the element comes near the
 * viewport and never flips back. Use it to defer *mounting* an expensive
 * component (Spline, OGL, three.js) instead of paying for it on first paint.
 */
export function useLazyMount<T extends Element>(
  ref: RefObject<T>,
  rootMargin = "300px",
): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, mounted]);

  return mounted;
}

/**
 * A rAF loop that only ticks while `active` is true, and is torn down cleanly.
 * `cb` receives the timestamp exactly like a raw requestAnimationFrame callback.
 */
export function useRafLoop(cb: (time: number) => void, active: boolean) {
  const cbRef = useRef(cb);
  cbRef.current = cb;

  useEffect(() => {
    if (!active) return;
    let id = 0;
    const tick = (t: number) => {
      cbRef.current(t);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [active]);
}

/* ------------------------------------------------------------------ */
/* Device capability                                                   */
/* ------------------------------------------------------------------ */

export type DeviceTier = "low" | "high";

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

let cachedTier: DeviceTier | null = null;

/**
 * Coarse "can this machine afford WebGL decoration?" check.
 *
 * Low tier -> skip 3D scenes and canvas effects entirely and render the static
 * fallback. This is deliberately conservative: a phone that renders a clean
 * gradient beats a phone that renders a stuttering 3D scene.
 */
export function getDeviceTier(): DeviceTier {
  if (cachedTier) return cachedTier;
  if (typeof window === "undefined") return "high";

  const nav = navigator as NavigatorWithHints;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = nav.connection?.saveData === true;
  const slowNetwork = /(^|\b)(slow-)?2g$/.test(nav.connection?.effectiveType ?? "");
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const fewCores = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const smallScreen = window.matchMedia("(max-width: 768px)").matches;

  const low =
    reducedMotion ||
    saveData ||
    slowNetwork ||
    lowMemory ||
    fewCores ||
    (coarsePointer && smallScreen);

  cachedTier = low ? "low" : "high";
  return cachedTier;
}

export function useDeviceTier(): DeviceTier {
  // Read once on mount so SSR/first paint never branches on browser-only APIs.
  const [tier, setTier] = useState<DeviceTier>("high");
  useEffect(() => setTier(getDeviceTier()), []);
  return tier;
}

/** True when the user asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Device pixel ratio, capped. Rendering a WebGL canvas at DPR 3 costs 9x the
 * fragments of DPR 1 for detail nobody perceives on a decorative background.
 */
export function cappedDpr(max = 2): number {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, max);
}
