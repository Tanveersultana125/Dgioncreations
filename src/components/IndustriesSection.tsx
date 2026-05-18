import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { Heart, DollarSign, ShoppingCart, GraduationCap, Truck, ChevronRight } from "lucide-react";
import Globe from "./Globe";
import { getProjectByIndustry } from "@/data/projects";
import GlassSurface from "./ui/GlassSurface";
import { CardContainer, CardBody, CardItem } from "./ui/3d-card-effect";

import { useContent } from "@/lib/use-content";
import {
  INDUSTRIES_CONTENT_KEY,
  defaultIndustriesContent,
  type IndustriesContent,
  DEFAULT_INDUSTRIES_TITLE_STYLE,
  DEFAULT_INDUSTRIES_HIGHLIGHT_STYLE,
} from "@/content/industries";
import { textStyleToCss } from "@/content/typography";
import { resolveIcon } from "@/content/icons";
import { MarkupText } from "@/lib/markup-text";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function IndustriesSection() {
  const { data, loading } = useContent<IndustriesContent>(INDUSTRIES_CONTENT_KEY, defaultIndustriesContent);
  const industries = data.industries;

  const [active, setActive] = useState<number | null>(null);

  /* ── mouse parallax for the globe ── */
  const sectionRef = useRef<HTMLElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const springX = useSpring(rawX, { stiffness: 60, damping: 18 });
  const springY = useSpring(rawY, { stiffness: 60, damping: 18 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = (e.clientX - rect.left - rect.width  / 2) / rect.width;
      const cy = (e.clientY - rect.top  - rect.height / 2) / rect.height;
      rawX.set(cx * 18);   // ± 18px
      rawY.set(cy * 12);
    },
    [rawX, rawY]
  );

  const navigate = useNavigate();

  const handleMarkerClick = (label: string) => {
    const proj = getProjectByIndustry(label);
    if (proj) navigate(`/project/${proj.id}`);
  };

  if (loading) {
    return (
      <section
        className="relative py-28 min-h-[600px]"
        style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}
      />
    );
  }

  return (
    <section
      ref={sectionRef}
      id="industries"
      className="relative py-28"
      style={{
        background:
          "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)",
      }}
      onMouseMove={handleMouseMove}
      onClick={() => setActive(null)}
    >
      {/* ── ambient orbs (clipped to section) ── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#837FFB]/15 blur-[140px]"
        />
        <motion.div
          animate={{ scale: [1, 1.22, 1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#5B57F5]/15 blur-[120px]"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(131,127,251,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* ── content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        {/* header */}
        <motion.div
          className="text-center mb-10 sm:mb-14 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <h2
            className="text-white font-bold"
            style={textStyleToCss(data.heroTitleStyle, DEFAULT_INDUSTRIES_TITLE_STYLE)}
          >
            {data.heroTitle.includes("**") ? (
              data.heroTitle.split("\n").map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  <MarkupText
                    text={line}
                    highlightStyle={data.heroHighlightStyle}
                    highlightClassName="drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]"
                  />
                </span>
              ))
            ) : (
              <>
                {data.heroTitle}{" "}
                <span
                  className="drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]"
                  style={textStyleToCss(data.heroHighlightStyle, DEFAULT_INDUSTRIES_HIGHLIGHT_STYLE)}
                >
                  {data.heroHighlight}
                </span>
              </>
            )}
          </h2>
        </motion.div>

        {/* 2-column: globe + accordion — vertical on mobile, grid on desktop */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1.25fr_1fr] gap-10 sm:gap-14 lg:gap-12 items-center">

          {/* ── LEFT — globe with parallax ── */}
          <motion.div
            className="w-full flex justify-center lg:justify-start lg:pl-4"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease }}
            style={{ x: springX, y: springY }}
          >
            <div
              className="relative w-full max-w-none flex justify-center"
              style={{ overflow: "visible" }}
            >
              <Globe activeIndex={active} onMarkerClick={handleMarkerClick} />
            </div>
          </motion.div>

          {/* ── RIGHT — accordion — Aggressive Centering with Strong Right Nudge ── */}
          <motion.div
            className="w-full flex flex-col gap-4 items-center justify-center lg:items-stretch lg:pl-12 xl:pl-20 pl-10 sm:pl-0 pr-0"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
          >
            {industries.map((ind, i) => {
              const Icon = resolveIcon(ind.iconKey);
              const isActive = active === i;

              return (
                <motion.div
                  key={ind.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease, delay: i * 0.08 }}
                  className="w-full flex flex-col items-center justify-center mx-auto"
                >
                  <CardContainer className="w-[85%] sm:w-full max-w-[420px] sm:max-w-none py-0 mx-auto" containerClassName="w-full flex justify-center items-center">
                    <CardBody className="w-full">
                      <GlassSurface
                        borderRadius={24}
                        displace={0.6}
                        distortionScale={isActive ? -200 : -140}
                        redOffset={0}
                        greenOffset={10}
                        blueOffset={20}
                        brightness={isActive ? 70 : 45}
                        opacity={0.96}
                        className="cursor-pointer group/glass overflow-hidden"
                        style={{
                          borderColor: isActive ? ind.glassBorder : "rgba(255,255,255,0.08)",
                          boxShadow: isActive
                            ? `0 20px 50px -12px ${ind.glow}, inset 0 1px 0 rgba(255,255,255,0.2)`
                            : "0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                          transition: "all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                        }}
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          setActive(isActive ? null : i);
                        }}
                      >
                        {/* Glass Reflection Sweep */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover/glass:translate-x-full transition-transform duration-1000" />
                        
                        {/* accent glow when active */}
                        {isActive && (
                          <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background: `radial-gradient(circle at 0% 50%, ${ind.glassBg} 0%, transparent 60%)`,
                            }}
                          />
                        )}

                        {/* active left accent bar */}
                        {isActive && (
                          <motion.div
                            layoutId="accent-bar"
                            className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                            style={{ background: ind.accent }}
                            transition={{ duration: 0.35, ease }}
                          />
                        )}

                        {/* header row */}
                        <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-7 lg:px-9 py-4 sm:py-6 lg:py-7">
                          {/* icon */}
                          <CardItem translateZ={50}>
                            <div
                              className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-400"
                              style={{
                                background: isActive ? `${ind.accent}22` : "rgba(255,255,255,0.06)",
                                border: `1px solid ${isActive ? ind.accent + "55" : "rgba(255,255,255,0.1)"}`,
                                boxShadow: isActive ? `0 0 18px ${ind.glow}` : "none",
                              }}
                            >
                              <Icon
                                className="w-5 h-5 md:w-6 md:h-6"
                                style={{ color: isActive ? ind.accent : "rgba(255,255,255,0.5)" }}
                              />
                            </div>
                          </CardItem>

                          {/* label + tag */}
                          <CardItem translateZ={40} className="flex-1 min-w-0">
                            <div>
                              <p
                                className="font-bold text-[15px] sm:text-[17px] lg:text-[19px] leading-none transition-colors duration-300"
                                style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.75)" }}
                              >
                                {ind.label}
                              </p>
                              <span
                                className="text-[11px] font-bold uppercase tracking-[0.22em] mt-1.5 block transition-colors duration-300"
                                style={{ color: isActive ? ind.accent : "rgba(255,255,255,0.25)" }}
                              >
                                {ind.tag}
                              </span>
                            </div>
                          </CardItem>

                          {/* chevron */}
                          <CardItem translateZ={30}>
                            <motion.div
                              animate={{ rotate: isActive ? 90 : 0 }}
                              transition={{ duration: 0.3, ease }}
                              style={{ color: isActive ? ind.accent : "rgba(255,255,255,0.25)" }}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </motion.div>
                          </CardItem>
                        </div>

                        {/* expandable body */}
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div
                              key="body"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease }}
                              className="overflow-hidden"
                            >
                              <CardItem translateZ={20}>
                                <p
                                  className="px-5 sm:px-7 lg:px-9 pb-5 sm:pb-6 lg:pb-7 text-[13px] sm:text-[14px] lg:text-[15px] leading-relaxed pl-[4rem] sm:pl-[4.75rem] lg:pl-[5.5rem]"
                                  style={{ color: "rgba(255,255,255,0.65)" }}
                                >
                                  {ind.desc}
                                </p>
                              </CardItem>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassSurface>
                    </CardBody>
                  </CardContainer>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}