import { useRef, useEffect, useCallback } from "react";
import { getDeviceTier, useInViewport } from "@/lib/perf";

interface FloatingLinesProps {
  enabledWaves?: ("top" | "middle" | "bottom")[];
  lineCount?: number | number[];
  lineDistance?: number | number[];
  bendRadius?: number;
  bendStrength?: number;
  interactive?: boolean;
  parallax?: boolean;
  animationSpeed?: number;
  gradientStart?: string;
  gradientMid?: string;
  gradientEnd?: string;
}

export default function FloatingLines({
  enabledWaves = ["top", "middle", "bottom"],
  lineCount = 8,
  lineDistance = 8,
  bendRadius = 8,
  bendStrength = -2,
  interactive = true,
  parallax = true,
  animationSpeed = 1,
  gradientStart = "#0106e7",
  gradientMid = "#6f6f6f",
  gradientEnd = "#6a6a6a",
}: FloatingLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const timeRef = useRef(0);
  const animRef = useRef<number>(0);

  // Idle while scrolled away or in a background tab.
  const visible = useInViewport(canvasRef, "150px");
  const visibleRef = useRef(visible);
  visibleRef.current = visible;

  // Array props are new identities on every parent render; compare by value so
  // the canvas is not torn down and rebuilt each time.
  const wavesKey = enabledWaves.join(",");

  const getCount = useCallback(
    (waveIdx: number) =>
      Array.isArray(lineCount) ? lineCount[waveIdx] ?? 8 : lineCount,
    [lineCount]
  );

  const getDist = useCallback(
    (waveIdx: number) =>
      Array.isArray(lineDistance) ? lineDistance[waveIdx] ?? 8 : lineDistance,
    [lineDistance]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cached CSS size. Reading getBoundingClientRect() inside the draw loop
    // forced a synchronous layout on every frame — the single most expensive
    // thing this component did.
    let cssWidth = 0;
    let cssHeight = 0;

    const lowEnd = getDeviceTier() === "low";
    const dprCap = lowEnd ? 1 : 2;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const rect = canvas.getBoundingClientRect();
      cssWidth = rect.width;
      cssHeight = rect.height;
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      // setTransform, not scale — scale() compounds on every resize.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };
    if (interactive) canvas.addEventListener("mousemove", onMouseMove, { passive: true });

    const waveConfigs = enabledWaves.map((pos, wi) => {
      const baseY = pos === "top" ? 0.22 : pos === "middle" ? 0.5 : 0.78;
      const count = getCount(wi);
      // Colours depend only on the line index, so resolve the hex maths once at
      // setup instead of parsing strings for every line on every frame.
      const colors = Array.from({ length: count }, (_, li) => {
        const ratio = li / Math.max(1, count - 1);
        return ratio < 0.5
          ? lerpColor(gradientStart, gradientMid, ratio * 2)
          : lerpColor(gradientMid, gradientEnd, (ratio - 0.5) * 2);
      });
      return { baseY, count, dist: getDist(wi), waveIdx: wi, colors };
    });

    const segments = lowEnd ? 32 : 60;

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      if (!visibleRef.current) return;

      const w = cssWidth;
      const h = cssHeight;
      if (w === 0 || h === 0) return;
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.008 * animationSpeed;
      const t = timeRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      waveConfigs.forEach((wave) => {
        for (let li = 0; li < wave.count; li++) {
          const offset = (li - wave.count / 2) * wave.dist;
          const baseY = wave.baseY * h + offset;

          // color interpolation
          ctx.beginPath();
          ctx.strokeStyle = wave.colors[li];
          ctx.lineWidth = 1.2;
          ctx.globalAlpha = 0.5 + 0.3 * Math.sin(t + li * 0.5);

          for (let s = 0; s <= segments; s++) {
            const sx = (s / segments) * w;
            const progress = s / segments;

            // wave motion
            const wave1 = Math.sin(progress * Math.PI * 2 + t + li * 0.3) * 20 * bendRadius * 0.3;
            const wave2 = Math.sin(progress * Math.PI * 3.5 + t * 0.7 + li * 0.2) * 12 * bendRadius * 0.2;

            // mouse bend
            let mouseBend = 0;
            if (interactive) {
              const dx = progress - mx;
              const dy = (baseY + wave1) / h - my;
              const dist = Math.sqrt(dx * dx + dy * dy);
              mouseBend = Math.exp(-dist * dist * 8) * bendStrength * 40;
            }

            // parallax
            let pOffset = 0;
            if (parallax) {
              pOffset = (mx - 0.5) * 30 * (wave.waveIdx * 0.5 + 0.5);
            }

            const sy = baseY + wave1 + wave2 + mouseBend + pOffset * 0.3;

            if (s === 0) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      if (interactive) canvas.removeEventListener("mousemove", onMouseMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wavesKey, getCount, getDist, bendRadius, bendStrength, interactive, parallax, animationSpeed, gradientStart, gradientMid, gradientEnd]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ zIndex: 0 }}
    />
  );
}

/* helper: lerp between two hex colors */
function lerpColor(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  if (!pa || !pb) return a;
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bl = Math.round(pa.b + (pb.b - pa.b) * t);
  return `rgb(${r},${g},${bl})`;
}

function hexToRgb(hex: string) {
  const m = hex.replace("#", "").match(/.{2}/g);
  if (!m) return null;
  return { r: parseInt(m[0], 16), g: parseInt(m[1], 16), b: parseInt(m[2], 16) };
}