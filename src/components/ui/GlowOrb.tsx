import { cn } from "@/lib/utils";

interface GlowOrbProps {
  /** Any CSS colour — the orb fades from this to transparent. */
  color: string;
  /** Peak opacity at the centre of the orb. */
  opacity?: number;
  /** Positioning / sizing utilities, e.g. "top-[-10%] left-[-10%] w-[60%] h-[60%]". */
  className?: string;
  /** Breathe in and out. Costs one composited opacity animation, nothing more. */
  pulse?: boolean;
  /** Seconds for one full pulse cycle. */
  duration?: number;
}

/**
 * A soft ambient glow.
 *
 * Deliberately *not* `filter: blur(120px)` on a solid circle. A blur that large
 * on a viewport-sized element makes the browser allocate and filter an enormous
 * backing texture, and animating anything on top of it re-runs that work. A
 * radial gradient produces the same soft falloff as a plain paint — no filter
 * pass, no giant intermediate surface — so it stays cheap even when animated.
 */
export function GlowOrb({
  color,
  opacity = 0.2,
  className,
  pulse = false,
  duration = 8,
}: GlowOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute rounded-full pointer-events-none",
        pulse && "motion-safe:animate-[glow-breathe_var(--glow-duration)_ease-in-out_infinite]",
        className,
      )}
      style={{
        opacity,
        background: `radial-gradient(circle closest-side, ${color} 0%, transparent 100%)`,
        ["--glow-duration" as string]: `${duration}s`,
      }}
    />
  );
}
