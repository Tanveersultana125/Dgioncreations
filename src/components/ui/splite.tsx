'use client'

import { Suspense, lazy, Component, useEffect, useRef, useState, type ReactNode } from 'react'
import { getDeviceTier, useLazyMount } from '@/lib/perf'

// Flip to `false` to disable Spline and force the CSS orb fallback.
const SPLINE_ENABLED = true

const Spline = lazy(() => import('@splinetool/react-spline'))

/** Returns true if the browser can create a WebGL context (HW accel + driver ok). */
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    return !!gl
  } catch {
    return false
  }
}

function FallbackOrb({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}>
      <div
        className="absolute w-[75%] aspect-square rounded-full animate-[pulse-glow_5s_ease-in-out_infinite]"
        style={{
          background:
            'radial-gradient(circle at 35% 30%, rgba(131,127,251,0.55), rgba(91,87,245,0.2) 45%, transparent 72%)',
          filter: 'blur(32px)',
        }}
      />
      <div
        className="relative w-[58%] aspect-square rounded-full animate-[spin_28s_linear_infinite]"
        style={{
          background:
            'conic-gradient(from 120deg, #837FFB 0%, #5B57F5 35%, #3330C9 60%, #837FFB 100%)',
          boxShadow: '0 0 80px rgba(131,127,251,0.45)',
        }}
      />
      <div
        className="absolute w-[50%] aspect-square rounded-full bg-[#0A0818]"
        style={{ boxShadow: 'inset 0 0 90px rgba(131,127,251,0.35)' }}
      />
      <div
        className="absolute w-[28%] aspect-square rounded-full animate-[pulse-glow_3.5s_ease-in-out_infinite]"
        style={{
          background:
            'radial-gradient(circle, rgba(131,127,251,0.9), rgba(131,127,251,0.1) 60%, transparent 80%)',
          filter: 'blur(8px)',
        }}
      />
      {[0, 72, 144, 216, 288].map((deg, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#837FFB] animate-[spin_14s_linear_infinite]"
          style={{
            boxShadow: '0 0 12px rgba(131,127,251,0.9)',
            transform: `rotate(${deg}deg) translateY(-42%)`,
            animationDelay: `${-i * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

class SplineBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return <FallbackOrb />
    return this.props.children
  }
}

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [webGL, setWebGL] = useState<boolean | null>(null)
  const [idle, setIdle] = useState(false)

  // Only start downloading the ~4 MB Spline runtime once the hero is on screen.
  const near = useLazyMount(hostRef, '200px')

  useEffect(() => { setWebGL(detectWebGL()) }, [])

  /**
   * Wait for the browser to finish the work that actually matters — first
   * paint, fonts, the real content — before handing it a 3D engine. Without
   * this, Spline's parse + compile lands right in the middle of page load and
   * blocks the main thread for seconds, which reads to the user as the site
   * being frozen.
   */
  useEffect(() => {
    if (!near) return
    const ric = (window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
    }).requestIdleCallback
    if (ric) {
      const id = ric(() => setIdle(true), { timeout: 2000 })
      return () => (window as Window & { cancelIdleCallback?: (id: number) => void })
        .cancelIdleCallback?.(id)
    }
    const t = window.setTimeout(() => setIdle(true), 600)
    return () => window.clearTimeout(t)
  }, [near])

  // Kill-switch: skip Spline entirely and render the lightweight fallback.
  if (!SPLINE_ENABLED) return <FallbackOrb className={className} />

  // Low-end devices get the CSS orb permanently. A smooth gradient beats a
  // 3-frames-per-second 3D scene, and it saves them the 4 MB download.
  if (webGL === false || (webGL !== null && getDeviceTier() === 'low')) {
    return <FallbackOrb className={className} />
  }

  return (
    <div ref={hostRef} className={`w-full h-full ${className ?? ''}`}>
      {webGL === null || !idle ? (
        // The orb doubles as the loading state, so there is never a blank gap
        // or a spinner-then-content flash while the runtime arrives.
        <FallbackOrb />
      ) : (
        <SplineBoundary>
          <Suspense fallback={<FallbackOrb />}>
            <Spline scene={scene} className="w-full h-full" />
          </Suspense>
        </SplineBoundary>
      )}
    </div>
  )
}