import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { render, cleanup, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

/**
 * Smoke test for the landing page.
 *
 * The performance work split routes apart, deferred the WebGL pieces behind
 * IntersectionObserver and reordered hooks in HomeOverview — all changes that
 * fail loudly at render time if they are wrong (hook-order violations, missing
 * Suspense boundaries, null refs). jsdom is enough to catch every one of those.
 */

class FakeIntersectionObserver {
  constructor(private cb: IntersectionObserverCallback) {}
  observe() {
    // Report "not visible" so nothing tries to spin up a real WebGL context.
    this.cb([{ isIntersecting: false } as IntersectionObserverEntry], this as never);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [];
}

beforeAll(() => {
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  // jsdom has no canvas backend; nothing under test should reach it, but a
  // stub keeps an accidental call from throwing an unrelated error.
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
});

afterEach(cleanup);

describe("landing page", () => {
  // Generous timeout: this is the first import in the file and pulls in the
  // whole hero dependency graph through Vite's transform pipeline.
  it("renders the hero without throwing", { timeout: 30000 }, async () => {
    const HeroSection = (await import("@/components/HeroSection")).default;
    expect(() =>
      render(
        <MemoryRouter>
          <HeroSection />
        </MemoryRouter>,
      ),
    ).not.toThrow();
  });

  it("renders HomeOverview with stable hook order across re-renders", { timeout: 20000 }, async () => {
    const HomeOverview = (await import("@/components/HomeOverview")).default;
    const { rerender } = render(
      <MemoryRouter>
        <HomeOverview />
      </MemoryRouter>,
    );
    // A second render is where a hook called after an early return blows up.
    expect(() =>
      rerender(
        <MemoryRouter>
          <HomeOverview />
        </MemoryRouter>,
      ),
    ).not.toThrow();
  });

  it("shows the Spline fallback orb instead of loading the 3D runtime", async () => {
    const { SplineScene } = await import("@/components/ui/splite");
    const { container } = render(<SplineScene scene="https://example.invalid/scene.splinecode" />);
    // Off-screen + no WebGL in jsdom => the lightweight CSS orb, never Spline.
    expect(container.querySelector("canvas")).toBeNull();
    expect(container.firstChild).not.toBeNull();
  });
});

describe("perf helpers", () => {
  it("classifies a reduced-motion / low-memory device as low tier", async () => {
    vi.resetModules();
    vi.stubGlobal("matchMedia", (q: string) => ({
      matches: q.includes("prefers-reduced-motion"),
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    const { getDeviceTier } = await import("@/lib/perf");
    expect(getDeviceTier()).toBe("low");
  });
});
