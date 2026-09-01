import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToTop } from "@/lib/smooth-scroll";

/**
 * Resets scroll on every navigation, in the one place that knows about Lenis.
 *
 * Individual pages used to each call `window.scrollTo(0, 0)` in their own
 * effect. That fights Lenis for control of the scroll position and leaves its
 * internal target stale, so the next wheel tick yanks the page back down.
 *
 * It also refreshes ScrollTrigger after the new route has laid out — the new
 * page has entirely different section offsets, and without a refresh every
 * scroll-triggered animation measures against the previous page's geometry and
 * simply never fires.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop(true);

    // Wait for the route's first paint (and lazy chunk swap) before measuring.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
