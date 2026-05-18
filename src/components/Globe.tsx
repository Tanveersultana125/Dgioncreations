import { useRef, useMemo, useEffect, useState, Suspense, Component, type ReactNode } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { getProjectByIndustry } from "@/data/projects";
import { isWebGLSupported } from "@/lib/webgl";

class WebGLErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch() {}
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

/* Earth texture URLs (three.js examples CDN — NASA visible earth) */
const EARTH_MAP    = "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg";
const EARTH_NORMAL = "https://threejs.org/examples/textures/planets/earth_normal_2048.jpg";
const EARTH_SPEC   = "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg";
const EARTH_CLOUDS = "https://threejs.org/examples/textures/planets/earth_clouds_1024.png";

/* ── marker data ── */
const MARKERS = [
  { label: "Healthcare",  lat: 40,  lng: -74  },
  { label: "Finance",     lat: 51,  lng: 0    },
  { label: "E-commerce",  lat: 35,  lng: 139  },
  { label: "Education",   lat: -33, lng: 151  },
  { label: "Logistics",   lat: 1,   lng: 103  },
];

const getGlobeRadius = () => {
  if (typeof window === 'undefined') return 2.0;
  return window.innerWidth < 768 ? 1.65 : 2.0;
};

const R = getGlobeRadius();
const ATMOSPHERE_R = R + (typeof window !== 'undefined' && window.innerWidth < 768 ? 0.01 : 0.015);

function latLng(lat: number, lng: number, r = R + 0.18) {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

/* ── Fresnel atmosphere shader ── */
const fresnelVertex = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vNormal  = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fresnelFragment = `
  uniform vec3 glowColor;
  uniform float intensity;
  uniform float power;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), power);
    gl_FragColor = vec4(glowColor, fresnel * intensity);
  }
`;

/* ── atmosphere glow mesh ── */
function Atmosphere({ color, radius, intensity, power }: {
  color: string; radius: number; intensity: number; power: number;
}) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: fresnelVertex,
        fragmentShader: fresnelFragment,
        uniforms: {
          glowColor: { value: new THREE.Color(color) },
          intensity: { value: intensity },
          power:     { value: power },
        },
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [color, intensity, power]
  );

  return (
    <mesh material={mat}>
      <sphereGeometry args={[radius, 64, 64]} />
    </mesh>
  );
}

/* ── Realistic textured Earth + cloud layer ── */
function EarthMesh() {
  const cloudRef = useRef<THREE.Mesh>(null);
  const [map, normal, spec, clouds] = useLoader(THREE.TextureLoader, [
    EARTH_MAP, EARTH_NORMAL, EARTH_SPEC, EARTH_CLOUDS,
  ]);

  useEffect(() => {
    [map, normal, spec, clouds].forEach((t) => {
      t.anisotropy = 8;
      t.colorSpace = THREE.SRGBColorSpace;
    });
  }, [map, normal, spec, clouds]);

  useFrame((_, delta) => {
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.02;
  });

  return (
    <>
      <mesh>
        <sphereGeometry args={[getGlobeRadius() - 0.01, 96, 96]} />
        <meshPhongMaterial
          map={map}
          normalMap={normal}
          specularMap={spec}
          specular={new THREE.Color("#4a5a8a")}
          shininess={14}
          bumpScale={0.04}
        />
      </mesh>
      {/* cloud layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[R + 0.008, 64, 64]} />
        <meshPhongMaterial
          map={clouds}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

/* ──────────────── main scene ──────────────── */
function GlobeScene({
  activeIndex,
  onMarkerClick,
}: {
  activeIndex: number | null;
  onMarkerClick: (l: string) => void;
}) {
  const groupRef  = useRef<THREE.Group>(null);
  const dragging  = useRef(false);
  const activeRef = useRef(activeIndex);
  const targetRotY = useRef(0);
  const targetRotX = useRef(0);
  useEffect(() => { activeRef.current = activeIndex; }, [activeIndex]);

  /* marker 3D positions */
  const mPos = useMemo(() => MARKERS.map(m => latLng(m.lat, m.lng)), []);

  /* when activeIndex changes, compute target rotation to face that marker to camera */
  useEffect(() => {
    if (activeIndex === null) return;
    const p = mPos[activeIndex];
    // rotate globe so marker ends up at (0, 0, +Z) facing camera
    // Y rotation: atan2(-px, pz) brings marker into XZ-plane front
    targetRotY.current = Math.atan2(-p.x, p.z);
    // X rotation: atan2(py, horizDist) tilts marker up/down to equator plane
    const horizDist = Math.sqrt(p.x * p.x + p.z * p.z);
    targetRotX.current = Math.atan2(p.y, horizDist);
  }, [activeIndex, mPos]);

  /* shortest-path angle delta */
  const normalizeAngle = (a: number) => {
    while (a >  Math.PI) a -= 2 * Math.PI;
    while (a < -Math.PI) a += 2 * Math.PI;
    return a;
  };

  /* arcs between all marker pairs */
  const { arcGeos, arcCurves, arcPairs } = useMemo(() => {
    const arcGeos:   THREE.BufferGeometry[]             = [];
    const arcCurves: THREE.QuadraticBezierCurve3[]      = [];
    const arcPairs:  { from: number; to: number }[]     = [];
    for (let i = 0; i < mPos.length; i++) {
      for (let j = i + 1; j < mPos.length; j++) {
        const s = mPos[i], e = mPos[j];
        const mid = s.clone().add(e).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.65);
        const curve = new THREE.QuadraticBezierCurve3(s, mid, e);
        arcCurves.push(curve);
        arcGeos.push(new THREE.BufferGeometry().setFromPoints(curve.getPoints(80)));
        arcPairs.push({ from: i, to: j });
      }
    }
    return { arcGeos, arcCurves, arcPairs };
  }, [mPos]);

  /* mutable refs for animation */
  const pulseRefs   = useRef<(THREE.Mesh | null)[]>([]);
  const travRefs    = useRef<(THREE.Mesh | null)[]>([]);
  const arcProgress = useRef<number[]>(arcCurves.map(() => Math.random()));

  useFrame((state, delta) => {
    const t  = state.clock.getElapsedTime();
    const ai = activeRef.current;
    const g  = groupRef.current;

    /* rotate: auto when no selection, smooth-target when selection is active */
    if (g && !dragging.current) {
      if (ai !== null) {
        const dy = normalizeAngle(targetRotY.current - g.rotation.y);
        g.rotation.y += dy * 0.08;
        g.rotation.x += (targetRotX.current - g.rotation.x) * 0.08;
      } else {
        g.rotation.y += delta * 0.08;
        g.rotation.x += (0 - g.rotation.x) * 0.05;
      }
    }

    /* pulse rings */
    pulseRefs.current.forEach((ring, i) => {
      if (!ring) return;
      if (i === ai) {
        ring.visible = true;
        const p = (Math.sin(t * 2.8 + i) + 1) / 2;
        ring.scale.setScalar(1 + p * 1.5);
        (ring.material as THREE.MeshBasicMaterial).opacity = 0.8 - p * 0.7;
      } else {
        ring.visible = false;
      }
    });

    /* traveling particles */
    arcProgress.current.forEach((prog, i) => {
      const tr = travRefs.current[i];
      if (!tr) return;
      const { from, to } = arcPairs[i];
      const conn = ai !== null && (from === ai || to === ai);
      tr.visible = conn;
      if (!conn) return;
      const np = (prog + delta * 0.3) % 1;
      arcProgress.current[i] = np;
      tr.position.copy(arcCurves[i].getPoint(np));
    });
  });

  return (
    <>
      {/* ── Lighting — sun-like directional + subtle rim fills ── */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 3, 5]} intensity={1.8} color="#ffffff" />
      <pointLight position={[-6, -2, -4]} intensity={0.6} color="#837FFB" distance={25} />
      <pointLight position={[0, 5, -5]} intensity={0.4} color="#837FFB" distance={20} />

      <group ref={groupRef}>

        {/* realistic Earth */}
        <Suspense fallback={null}>
          <EarthMesh />
        </Suspense>

        {/* thin Fresnel rim — tight to the surface, no wide halo */}
        <Atmosphere color="#4a9eff" radius={ATMOSPHERE_R} intensity={0.6} power={4.5} />

        {/* Arc network */}
        {arcGeos.map((geo, i) => {
          const { from, to } = arcPairs[i];
          const conn = activeIndex !== null && (from === activeIndex || to === activeIndex);
          return (
            <lineSegments key={`arc-${i}`} geometry={geo}>
              <lineBasicMaterial
                color={conn ? "#837FFB" : "#837FFB"}
                transparent
                opacity={conn ? 0.6 : 0.08}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </lineSegments>
          );
        })}

        {/* Traveling glow particles */}
        {arcCurves.map((_, i) => (
          <mesh key={`trav-${i}`} ref={el => { travRefs.current[i] = el; }} visible={false}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshBasicMaterial
              color="#837FFB"
              transparent
              opacity={0.95}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* Industry markers with floating labels */}
        {mPos.map((pos, i) => {
          const isActive = i === activeIndex;
          const proj = getProjectByIndustry(MARKERS[i].label);
          return (
            <group key={`marker-${i}`} position={pos}>
              <mesh onClick={e => { e.stopPropagation(); onMarkerClick(MARKERS[i].label); }}>
                <sphereGeometry args={[isActive ? 0.12 : 0.075, 16, 16]} />
                <meshBasicMaterial
                  color={isActive ? "#837FFB" : "#4f4bc7"}
                  blending={THREE.AdditiveBlending}
                  depthWrite={false}
                />
              </mesh>

              {proj && (
                <Html
                  position={[typeof window !== 'undefined' && window.innerWidth < 768 ? 0.7 : 0, 0.28, 0]}
                  center
                  distanceFactor={isActive ? 5 : 7}
                  style={{ pointerEvents: "auto", userSelect: "none" }}
                  zIndexRange={[isActive ? 100 : 10, 0]}
                >
                  <div
                    onClick={(e) => { e.stopPropagation(); onMarkerClick(MARKERS[i].label); }}
                    className="cursor-pointer group"
                    style={{
                      opacity: activeIndex === null || isActive ? 1 : 0.35,
                      transform: isActive ? "scale(1.15)" : (typeof window !== 'undefined' && window.innerWidth < 768 ? "scale(0.7)" : "scale(1)"),
                      transition: "opacity 0.35s, transform 0.35s",
                    }}
                  >
                    <div
                      style={{
                        background: isActive ? "rgba(8,6,26,0.95)" : "rgba(8,6,26,0.85)",
                        backdropFilter: "blur(12px)",
                        border: isActive
                          ? "1.5px solid rgba(131,127,251,0.7)"
                          : "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 8,
                        padding: typeof window !== 'undefined' && window.innerWidth < 768 ? "2px 4px" : "5px 7px",
                        display: "flex",
                        alignItems: "center",
                        gap: typeof window !== 'undefined' && window.innerWidth < 768 ? 4 : 6,
                        minWidth: typeof window !== 'undefined' && window.innerWidth < 768 ? 70 : 100,
                        boxShadow: isActive
                          ? "0 0 30px rgba(131,127,251,0.45), 0 0 60px rgba(131,127,251,0.25)"
                          : "0 4px 16px rgba(0,0,0,0.5)",
                        transition: "all 0.35s",
                      }}
                    >
                      <img
                        src={proj.thumb}
                        alt={proj.title}
                        style={{
                          width: typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 26,
                          height: typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 26,
                          borderRadius: 5,
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <p style={{
                          color: "#fff",
                          fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 10,
                          fontWeight: 700,
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}>
                          {proj.title}
                        </p>
                        <p style={{
                          color: "rgba(131,127,251,0.7)",
                          fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 8,
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                        }}>
                          {proj.industry}
                        </p>
                      </div>
                    </div>
                  </div>
                </Html>
              )}

              {isActive && (
                <mesh>
                  <sphereGeometry args={[0.2, 16, 16]} />
                  <meshBasicMaterial
                    color="#837FFB"
                    transparent
                    opacity={0.15}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                  />
                </mesh>
              )}

              {isActive && (
                <mesh>
                  <torusGeometry args={[0.16, 0.01, 8, 32]} />
                  <meshBasicMaterial color="#837FFB" transparent opacity={0.7} />
                </mesh>
              )}

              <mesh ref={el => { pulseRefs.current[i] = el; }} visible={false}>
                <torusGeometry args={[0.2, 0.02, 8, 32]} />
                <meshBasicMaterial color="#837FFB" transparent opacity={0} />
              </mesh>
            </group>
          );
        })}

      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        onStart={() => { dragging.current = true;  }}
        onEnd={()   => { dragging.current = false; }}
      />
    </>
  );
}

/* ──────────────── exported wrapper — lazy mount on scroll ──────────────── */
export default function Globe({
  activeIndex,
  onMarkerClick,
}: {
  activeIndex: number | null;
  onMarkerClick: (label: string) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    setWebglOk(isWebGLSupported());
  }, []);

  useEffect(() => {
    if (!webglOk) return;
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [webglOk]);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-[320px] sm:h-[400px] md:h-[520px] lg:h-[620px] relative"
      style={{ overflow: "visible" }}
    >
      {!webglOk ? (
        <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#837FFB]/10 border border-[#837FFB]/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-[#837FFB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <p>Globe requires WebGL</p>
          </div>
        </div>
      ) : inView ? (
        <WebGLErrorBoundary
          fallback={
            <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">
              3D Globe requires WebGL support
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 6.2], fov: 42 }}
            // Dropped `failIfMajorPerformanceCaveat` — it was refusing WebGL on
            // machines that technically support it but run software rendering
            // (e.g. Chrome with hardware acceleration off). Better to let it
            // render slowly than to show the "WebGL required" message.
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            style={{ position: "relative", zIndex: 1, overflow: "visible" }}
          >
            <GlobeScene activeIndex={activeIndex} onMarkerClick={onMarkerClick} />
          </Canvas>
        </WebGLErrorBoundary>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-[#837FFB]/30 border-t-[#837FFB] animate-spin" />
        </div>
      )}
    </div>
  );
}