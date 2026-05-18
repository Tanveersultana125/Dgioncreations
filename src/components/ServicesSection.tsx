import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import FloatingLines from "./FloatingLines";
import { useContent } from "@/lib/use-content";
import {
  SERVICES_CONTENT_KEY,
  defaultServicesContent,
  type ServicesContent,
  type ServiceCard as ServiceCardType,
  DEFAULT_SERVICES_SECTION_TITLE_STYLE,
  DEFAULT_SERVICE_CARD_TITLE_STYLE,
  DEFAULT_SERVICE_CARD_DESC_STYLE,
} from "@/content/services";
import { textStyleToCss } from "@/content/typography";
import { resolveIcon } from "@/content/icons";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * One card in the expanding services row. Pulled into its own component so
 * each card owns its mouse-tilt motion values (hooks can't live inside a map).
 */
function ServiceCardItem({
  svc,
  index,
  isHovered,
  titleStyle,
  descStyle,
  onEnter,
  onLeave,
  onClick,
}: {
  svc: ServiceCardType;
  index: number;
  isHovered: boolean;
  titleStyle: React.CSSProperties;
  descStyle: React.CSSProperties;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const Icon = resolveIcon(svc.iconKey);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position normalised to 0–1 across the card; springs smooth the tilt.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 200, damping: 22 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 200, damping: 22 });

  // Glare follows the cursor for a parallax sheen on top of the card.
  const glareX = useTransform(mx, [0, 1], [0, 100]);
  const glareY = useTransform(my, [0, 1], [0, 100]);
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.18) 0%, transparent 55%)`
  );

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    mx.set((clientX - rect.left) / rect.width);
    my.set((clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mx.set(0.5);
    my.set(0.5);
    onLeave();
  };

  const src = svc.imageUrl || svc.iconImageUrl || `https://picsum.photos/seed/${svc.id}/800/600`;

  return (
    <motion.div
      ref={cardRef}
      className="relative h-full overflow-hidden cursor-pointer select-none"
      style={{
        // Flex sits on the card itself so all 9 cards distribute evenly
        // across the row — wrapping in another flex item was capping them.
        flex: isHovered ? 4 : 1,
        minWidth: 0,
        background: "transparent",
        transformStyle: "preserve-3d",
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transition: "flex 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
        touchAction: "pan-y"
      }}
      onMouseEnter={onEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={(e) => { onEnter(); handleMouseMove(e); }}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease, delay: index * 0.05 }}
    >
        {/* hero backdrop image — falls back to a deterministic picsum photo */}
        <img
          src={src}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            opacity: isHovered ? 1 : 0.2,
            transition: "opacity 0.5s",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,15,42,0.3) 0%, rgba(11,15,42,0.55) 70%, rgba(11,15,42,0.75) 100%)",
            opacity: isHovered ? 0 : 1,
            transition: "opacity 0.5s",
          }}
        />

        {/* mouse-tracking glare — visible only while hovered */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: glareBg,
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.3s",
            transform: "translateZ(8px)",
          }}
        />

        {/* radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(131,127,251,0.1) 0%, transparent 60%)",
            opacity: isHovered ? 1 : 0,
            transition: "opacity 0.4s",
          }}
        />

        {/* top-edge accent highlight pops forward in 3D */}
        <div
          aria-hidden
          className="absolute top-0 left-[10%] right-[10%] h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(131,127,251,0.55), transparent)",
            transform: "translateZ(6px)",
            opacity: isHovered ? 1 : 0.4,
            transition: "opacity 0.3s",
          }}
        />

        {/* glare */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 40%)",
          }}
        />

        {/* content sits on its own depth plane so it lifts during tilt */}
        <div className="relative z-10 h-full p-6 flex flex-col" style={{ transform: "translateZ(20px)" }}>
          {/* collapsed state — vertical text + icon */}
          <div
            className="flex flex-col items-center justify-between h-full"
            style={{
              opacity: isHovered ? 0 : 1,
              transition: "opacity 0.3s",
              position: isHovered ? "absolute" : "relative",
              inset: isHovered ? 0 : undefined,
              padding: isHovered ? 24 : 0,
              pointerEvents: isHovered ? "none" : "auto",
            }}
          >
            <span className="text-[#837FFB]/30 text-xs font-bold tracking-widest">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div
              className="flex-1 flex items-center justify-center"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              <span className="text-sm font-bold uppercase tracking-[0.15em]">{svc.full}</span>
            </div>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden"
              style={{
                background: "rgba(131,127,251,0.1)",
                borderWidth: 1, borderStyle: "solid", borderColor: "rgba(131,127,251,0.2)",
              }}
            >
              <Icon className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* text area has been moved outside the cards entirely */}
        </div>
      </motion.div>
  );
}

export default function ServicesSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data } = useContent<ServicesContent>(SERVICES_CONTENT_KEY, defaultServicesContent);
  const servicesData = data.services;

  const hoveredService = hoveredId ? servicesData.find((s) => s.id === hoveredId) : null;
  const hoveredIndex = hoveredService ? servicesData.findIndex((s) => s.id === hoveredId) : -1;

  return (
    <section
      id="services"
      className="relative overflow-hidden py-16 sm:py-20 md:py-28"
      style={{ background: "linear-gradient(160deg, #0B0F2A 0%, #141A42 30%, #1A1F4F 60%, #0B0F2A 100%)" }}
    >
      {/* floating lines background */}
      <div className="absolute inset-0 z-0">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={8}
          lineDistance={8}
          bendRadius={8}
          bendStrength={-2}
          interactive
          parallax
          animationSpeed={1}
          gradientStart="#e945f5"
          gradientMid="#6f6f6f"
          gradientEnd="#6a6a6a"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* header */}
        <motion.div
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <h2
            className=""
            style={textStyleToCss(data.servicesSectionTitleStyle, DEFAULT_SERVICES_SECTION_TITLE_STYLE)}
          >
            {data.servicesSectionTitle}{" "}
            <span className="drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]">
              {data.servicesSectionHighlight}
            </span>
          </h2>
        </motion.div>

        {/* ── horizontal expand cards (desktop / tablet) ── */}
        <div className="hidden md:flex gap-2 h-[420px]" style={{ perspective: 1200 }}>
          {servicesData.map((svc, i) => (
            <ServiceCardItem
              key={svc.id}
              svc={svc}
              index={i}
              isHovered={hoveredId === svc.id}
              titleStyle={textStyleToCss(data.serviceCardTitleStyle, DEFAULT_SERVICE_CARD_TITLE_STYLE)}
              descStyle={textStyleToCss(data.serviceCardDescStyle, DEFAULT_SERVICE_CARD_DESC_STYLE)}
              onEnter={() => setHoveredId(svc.id)}
              onLeave={() => setHoveredId(null)}
              onClick={() => navigate(`/service/${svc.id}`)}
            />
          ))}
        </div>

        {/* ── mobile vertical stack — premium cards with images, matching laptop aesthetic ── */}
        <div className="md:hidden flex flex-col gap-4">
          {servicesData.map((svc, i) => {
            const Icon = resolveIcon(svc.iconKey);
            const isActive = hoveredId === svc.id;
            const src = svc.imageUrl || svc.iconImageUrl || `https://picsum.photos/seed/${svc.id}/800/600`;
            
            return (
              <motion.div
                key={svc.id}
                onClick={() => {
                  if (isActive) navigate(`/service/${svc.id}`);
                  else setHoveredId(svc.id);
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease }}
                className="group relative w-full rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  height: isActive ? "220px" : "100px",
                  transition: "height 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
                  transformStyle: "preserve-3d",
                  perspective: "1000px"
                }}
              >
                {/* Background Image */}
                <img
                  src={src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
                  style={{ 
                    opacity: isActive ? 0.6 : 0.15,
                    filter: isActive ? "grayscale(0%)" : "grayscale(100%)",
                    transform: isActive ? "scale(1.05)" : "scale(1)"
                  }}
                />
                
                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F2A]/90 via-[#0B0F2A]/40 to-transparent" />
                <div 
                  className="absolute inset-0 border border-white/10 rounded-2xl transition-colors duration-300"
                  style={{ borderColor: isActive ? "rgba(131,127,251,0.5)" : "rgba(255,255,255,0.1)" }}
                />

                {/* Content */}
                <div className="relative z-10 h-full p-5 flex flex-col justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                      style={{
                        background: isActive ? "rgba(131,127,251,0.3)" : "rgba(131,127,251,0.1)",
                        border: isActive ? "1px solid rgba(131,127,251,0.5)" : "1px solid rgba(131,127,251,0.2)",
                      }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[#837FFB]/60 text-[10px] font-bold tracking-widest">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3
                          className="uppercase tracking-wide leading-tight text-sm font-bold truncate text-white"
                          style={textStyleToCss(data.serviceCardTitleStyle, DEFAULT_SERVICE_CARD_TITLE_STYLE)}
                        >
                          {svc.full}
                        </h3>
                      </div>
                      <p
                        className="text-white/70 text-xs leading-snug line-clamp-1 transition-all duration-300"
                        style={{ 
                          opacity: isActive ? 1 : 0.6,
                          ...textStyleToCss(data.serviceCardDescStyle, DEFAULT_SERVICE_CARD_DESC_STYLE)
                        }}
                      >
                        {svc.desc}
                      </p>
                    </div>
                    <span className="text-[#837FFB] text-lg shrink-0 transition-transform duration-300" style={{ transform: isActive ? "translateX(4px)" : "none" }}>→</span>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="mt-4 pt-4 border-t border-white/10"
                      >
                        <button 
                          className="w-full py-2 bg-[#837FFB] rounded-xl text-white text-xs font-bold uppercase tracking-wider"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/service/${svc.id}`);
                          }}
                        >
                          Learn More Details
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Glare effect on active */}
                {isActive && (
                   <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-30" />
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="hidden md:block h-[120px] mt-10 relative pointer-events-none">
          <AnimatePresence mode="wait">
            {hoveredService ? (
              <motion.div
                key={hoveredService.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-auto"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[#837FFB]/40 text-xs font-bold tracking-widest">
                    {String(hoveredIndex + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="uppercase tracking-wide leading-tight text-xl font-bold"
                    style={textStyleToCss(data.serviceCardTitleStyle, DEFAULT_SERVICE_CARD_TITLE_STYLE)}
                  >
                    {hoveredService.full}
                  </h3>
                </div>
                <p
                  className="leading-relaxed max-w-lg text-white/60 mb-4 text-sm"
                  style={textStyleToCss(data.serviceCardDescStyle, DEFAULT_SERVICE_CARD_DESC_STYLE)}
                >
                  {hoveredService.desc}
                </p>
                <button
                  onClick={() => navigate(`/service/${hoveredService.id}`)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all group"
                >
                  <span className="text-[#837FFB] text-[10px] font-bold uppercase tracking-wider">Learn More</span>
                  <span className="text-[#837FFB] text-[10px] group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <p className="text-white/15 text-xs select-none">Hover any card to expand</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}