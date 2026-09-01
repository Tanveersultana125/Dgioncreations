import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScrollProvider
 *
 * One rAF loop, one scroll source. Lenis drives momentum; GSAP's ticker drives
 * Lenis; ScrollTrigger listens to Lenis. No duplicate frame loops, no scroll
 * handlers fighting each other.
 *
 * - Lenis is the single source of scroll truth
 * - gsap.ticker.lagSmoothing(0) → GSAP owns the frame delta
 * - ScrollTrigger.update fires only when Lenis says scroll changed
 * - prefers-reduced-motion → skip Lenis, leave native scroll in place
 * - ScrollTrigger defaults make scroll-in animations play-once by default
 */

/**
 * The live Lenis instance, or null when smooth scrolling is disabled
 * (reduced-motion) or not mounted yet.
 *
 * Anything that wants to move the page MUST go through `scrollToTop` below
 * rather than calling `window.scrollTo`. While Lenis is running it owns the
 * scroll position, and a raw `window.scrollTo` leaves Lenis's internal target
 * pointing at the old offset — the next wheel event snaps the page back to
 * where it was, which reads exactly like the page being stuck.
 */
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/** Jump to the top of the page, correctly, whether or not Lenis is active. */
export function scrollToTop(immediate = true) {
  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate });
    return;
  }
  window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Respect user accessibility setting — no smooth scroll, no GSAP animations
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Uniform play-once behaviour for every ScrollTrigger in the app
    ScrollTrigger.defaults({ toggleActions: "play none none none" });

    if (reduced) {
      // Even without Lenis, keep ScrollTrigger ticking on native scroll
      return;
    }

    const lenis = new Lenis({
      // 1.2s of momentum on every wheel tick reads as lag on a content site —
      // the page keeps gliding after the user has stopped. `lerp` gives a
      // shorter, more responsive settle that still feels smooth.
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      // Touch devices already have excellent native momentum scrolling, and
      // hijacking it is the single most common cause of "the site feels broken
      // on my phone". Leave phones and tablets alone.
      syncTouch: false,
    });
    lenisInstance = lenis;

    // Every Lenis frame → tell ScrollTrigger to re-evaluate triggers
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's ticker so the whole app runs on one rAF loop
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Once the DOM settles after first paint (images / fonts), recompute
    // all ScrollTrigger start/end positions so they land where the eye expects.
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      window.clearTimeout(refreshId);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
