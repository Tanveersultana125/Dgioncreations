import { useEffect, useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, animate, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, ArrowUpRight, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";
import Footer from "@/components/Footer";
import { RevealCardContainer } from "@/components/ui/animated-profile-card";
import Iridescence from "@/components/ui/Iridescence";
import FloatingLines from "@/components/FloatingLines";
import "@/components/ui/industry-card.css";
import { useContent } from "@/lib/use-content";
import {
  SERVICES_CONTENT_KEY,
  defaultServicesContent,
  type ServicesContent,
  DEFAULT_HERO_KICKER_STYLE,
  DEFAULT_HERO_HEADLINE_STYLE,
  DEFAULT_HERO_HIGHLIGHT_STYLE,
  DEFAULT_HERO_DESCRIPTION_STYLE,
  DEFAULT_STAT_VALUE_STYLE,
  DEFAULT_STAT_LABEL_STYLE,
  DEFAULT_SECTION_KICKER_STYLE,
  DEFAULT_SECTION_HEADING_STYLE,
  DEFAULT_SECTION_HIGHLIGHT_STYLE,
  DEFAULT_SECTION_DESCRIPTION_STYLE,
  DEFAULT_PHASE_TITLE_STYLE,
  DEFAULT_PHASE_DESC_STYLE,
  DEFAULT_DELIVERABLE_ITEM_STYLE,
  DEFAULT_INDUSTRY_PILL_STYLE,
  DEFAULT_TESTIMONIAL_QUOTE_STYLE,
  DEFAULT_CTA_HEADING_STYLE,
  DEFAULT_CTA_HIGHLIGHT_STYLE,
  DEFAULT_CTA_DESCRIPTION_STYLE,
} from "@/content/services";
import { textStyleToCss } from "@/content/typography";
import { resolveIcon } from "@/content/icons";
import { MarkupText } from "@/lib/markup-text";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.16, 1, 0.3, 1] as const;

function StatCounter({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const numMatch = value.match(/(\d+)/);
  const targetNum = numMatch ? parseInt(numMatch[0]) : 0;
  const suffix = value.replace(numMatch ? numMatch[0] : "", "");

  useEffect(() => {
    if (isInView && ref.current && targetNum > 0) {
      const node = ref.current;
      const controls = animate(0, targetNum, {
        duration: 2,
        ease: "easeOut",
        onUpdate(latest) {
          node.textContent = Math.round(latest).toString();
        },
      });
      return () => controls.stop();
    }
  }, [isInView, targetNum]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-5 group"
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-[#837FFB]" />
      </div>
      <div>
        <div className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
          <span ref={ref}>0</span>{suffix}
        </div>
        <div className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{label}</div>
      </div>
    </motion.div>
  );
}

function CTA3DCard({ data }: { data: ServicesContent }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 150, damping: 20 });
  const glareX = useTransform(mx, [0, 1], [0, 100]);
  const glareY = useTransform(my, [0, 1], [0, 100]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative rounded-[60px] p-10 md:p-20 border border-white/5"
        style={{
          background: "rgba(131,127,251,0.03)",
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: "0 30px 60px -20px rgba(131,127,251,0.15)",
        }}
      >
        <motion.div
          className="absolute inset-0 rounded-[60px] pointer-events-none z-20"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.08) 0%, transparent 60%)`
            ),
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none rounded-[60px] overflow-hidden"
          style={{ opacity: 0.35, mixBlendMode: "screen", transform: "translateZ(0)" }}
        >
          <Iridescence
            color={[0.55, 0.5, 1.0]}
            amplitude={0.08}
            speed={0.6}
            mouseReact={false}
          />
        </div>

        <div className="absolute inset-0 bg-[#837FFB]/5 blur-[120px] rounded-full translate-y-1/2 pointer-events-none" style={{ transform: "translateZ(0)" }} />

        <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
          <h2
            className="text-5xl md:text-7xl font-bold italic tracking-tighter leading-[0.9] mb-8"
            style={textStyleToCss(data.ctaHeadingStyle, DEFAULT_CTA_HEADING_STYLE)}
          >
            {data.ctaHeadingBefore}
            <span
              className="text-[#837FFB] block md:inline md:ml-4"
              style={textStyleToCss(data.ctaHighlightStyle, DEFAULT_CTA_HIGHLIGHT_STYLE)}
            >
              {data.ctaHighlight}
            </span>
            {data.ctaHeadingAfter}
          </h2>
          <p
            className="mt-8 text-white/40 text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-medium"
            style={textStyleToCss(data.ctaDescriptionStyle, DEFAULT_CTA_DESCRIPTION_STYLE)}
          >
            {data.ctaDescription}
          </p>
          <div className="flex flex-wrap gap-5 justify-center">
            <Link
              to={data.ctaPrimaryUrl}
              className="group relative inline-flex items-center gap-3 px-7 py-4 md:px-12 md:py-6 bg-[#837FFB] text-white rounded-full font-bold text-base md:text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(131,127,251,0.4)]"
              style={{ fontFamily: "var(--site-display)" }}
            >
              <span>{data.ctaPrimaryLabel}</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/process"
              className="px-7 py-4 md:px-12 md:py-6 rounded-full font-bold text-base md:text-xl text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#837FFB]/30 transition-all"
              style={{ fontFamily: "var(--site-display)" }}
            >
              See Our Process
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Services() {
  const { data, loading } = useContent<ServicesContent>(SERVICES_CONTENT_KEY, defaultServicesContent);
  const testimonialSectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (loading || !testimonialSectionRef.current || !frameRef.current || !textRef.current) return;
    const section = testimonialSectionRef.current;
    const frame = frameRef.current;
    const text = textRef.current;

    gsap.set([frame, text], { transformOrigin: "center center" });

    const ctx = gsap.context(() => {
      gsap.fromTo(frame, { scale: 0.35, opacity: 0.5 },
        { scale: 1, opacity: 1, ease: "none",
          scrollTrigger: { trigger: section, start: "top 85%", end: "center 55%", scrub: true } });
      gsap.fromTo(text, { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, ease: "none",
          scrollTrigger: { trigger: section, start: "top 65%", end: "center 55%", scrub: true } });
      gsap.fromTo(frame, { scale: 1, opacity: 1 },
        { scale: 0.35, opacity: 0.5, ease: "none",
          scrollTrigger: { trigger: section, start: "center 45%", end: "bottom 15%", scrub: true } });
      gsap.fromTo(text, { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.9, ease: "none",
          scrollTrigger: { trigger: section, start: "center 45%", end: "bottom 25%", scrub: true } });
    }, section);

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white overflow-x-hidden selection:bg-[#837FFB]/30">
        <Navbar />
        {/* Background Texture & Glows */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-100" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3仿真%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-15 blur-[120px] bg-[#837FFB]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden selection:bg-[#837FFB]/30">
      <Navbar />

      {/* Background Texture & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-100" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3仿真%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-15 blur-[120px] bg-[#837FFB]" />
        <div className="absolute bottom-[20%] left-[-5%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px] bg-[#5B57F5]" />
      </div>

      {/* ── HERO HEADER ───────────────────────────────────────── */}
      <section className="relative pt-44 pb-24 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease }}
            className="max-w-4xl md:ml-12 lg:ml-24"
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className="px-6 py-2 rounded-full font-bold uppercase tracking-[0.3em] bg-[#837FFB]/10 border border-[#837FFB]/30 shadow-[0_0_30px_rgba(131,127,251,0.15)] backdrop-blur-sm text-white"
                style={{ ...textStyleToCss(data.heroKickerStyle, DEFAULT_HERO_KICKER_STYLE), color: "#FFFFFF" }}
              >
                {data.heroKicker}
              </div>
            </div>

            <h1
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.85] tracking-tighter italic mb-6 sm:mb-8"
              style={textStyleToCss(data.heroHeadlineStyle, DEFAULT_HERO_HEADLINE_STYLE)}
            >
              {data.heroHeadlineLine1.includes("**") ? (
                data.heroHeadlineLine1.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    <MarkupText
                      text={line}
                      highlightStyle={data.heroHighlightStyle}
                      highlightClassName="drop-shadow-[0_0_40px_rgba(131,127,251,0.5)]"
                    />
                  </span>
                ))
              ) : (
                <>
                  {data.heroHeadlineLine1}
                  <span
                    className="block text-[#837FFB] drop-shadow-[0_0_40px_rgba(131,127,251,0.5)] my-4"
                    style={textStyleToCss(data.heroHighlightStyle, DEFAULT_HERO_HIGHLIGHT_STYLE)}
                  >
                    {data.heroHighlight}
                  </span>
                  {data.heroHeadlineLine2}
                </>
              )}
            </h1>

            <p
              className="mt-10 text-white/50 text-xl md:text-2xl leading-relaxed max-w-2xl font-medium"
              style={textStyleToCss(data.heroDescriptionStyle, DEFAULT_HERO_DESCRIPTION_STYLE)}
            >
              {data.heroDescription}
            </p>

            <div className="mt-12 flex flex-wrap gap-5">
              <Link
                to={data.heroCtaPrimaryUrl}
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 md:px-10 md:py-5 bg-[#837FFB] text-white rounded-full font-bold text-sm md:text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(131,127,251,0.4)]"
                style={{ fontFamily: "var(--site-display)" }}
              >
                <span>{data.heroCtaPrimaryLabel}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={data.heroCtaSecondaryUrl}
                className="px-6 py-3.5 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-lg text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#837FFB]/30 transition-all"
                style={{ fontFamily: "var(--site-display)" }}
              >
                {data.heroCtaSecondaryLabel}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────── */}
      <section className="relative py-20 border-y border-white/5 z-10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
            {data.stats.map((stat, i) => (
              <StatCounter 
                key={i} 
                value={stat.value} 
                label={stat.label} 
                icon={resolveIcon(stat.iconKey)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES GRID ─────────────────────────────────── */}
      <div className="relative z-10">
        <ServicesSection />
      </div>

      {/* ── OUR APPROACH ──────────────────────────────────────── */}
      <section className="relative py-32 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span
              className="text-[#837FFB] tracking-[0.4em] uppercase text-xs font-bold"
              style={textStyleToCss(data.sectionKickerStyle, DEFAULT_SECTION_KICKER_STYLE)}
            >
              {data.approachKicker}
            </span>
            <h2
              className="mt-6 text-5xl md:text-7xl font-bold tracking-tighter italic"
              style={textStyleToCss(data.sectionHeadingStyle, DEFAULT_SECTION_HEADING_STYLE)}
            >
              {data.approachHeadingBefore}
              <span
                className="text-[#837FFB] block md:inline md:ml-4"
                style={textStyleToCss(data.sectionHighlightStyle, DEFAULT_SECTION_HIGHLIGHT_STYLE)}
              >
                {data.approachHighlight}
              </span>
              {data.approachHeadingAfter}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.approach.map((phase, i) => {
              const Icon = resolveIcon(phase.iconKey);
              const renderBody = (isOverlay: boolean) => (
                <div
                  className="relative h-full flex flex-col rounded-[32px] p-8 overflow-hidden transition-all duration-500"
                  style={
                    isOverlay
                      ? { background: `linear-gradient(135deg, ${phase.accent}, #08061A)`, border: `1px solid ${phase.accent}40` }
                      : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }
                  }
                >
                  <div className={`absolute top-6 right-8 text-7xl font-black italic opacity-5 ${isOverlay ? "text-white" : "text-[#837FFB]"}`}>
                    {phase.step}
                  </div>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110"
                    style={{
                      background: isOverlay ? "rgba(255,255,255,0.1)" : "rgba(131,127,251,0.08)",
                      border: isOverlay ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(131,127,251,0.2)",
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: isOverlay ? "#ffffff" : "#837FFB" }} />
                  </div>
                  <h3
                    className="text-2xl font-bold mb-4 italic tracking-tight text-white"
                    style={textStyleToCss(data.phaseTitleStyle, DEFAULT_PHASE_TITLE_STYLE)}
                  >
                    {phase.title}
                  </h3>
                  <p
                    className={`leading-relaxed text-sm ${isOverlay ? "text-white/80" : "text-white/40"}`}
                    style={textStyleToCss(data.phaseDescStyle, DEFAULT_PHASE_DESC_STYLE)}
                  >
                    {phase.desc}
                  </p>
                </div>
              );

              return (
                <motion.div
                  key={i}
                  className="h-full group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <RevealCardContainer
                    accent={phase.accent}
                    textOnAccent="#ffffff"
                    mutedOnAccent="rgba(255,255,255,0.8)"
                    className="!w-full h-full !rounded-[32px] !border-0"
                    startClip="circle(40px at 60px 60px)"
                    expandClip="circle(160% at 60px 60px)"
                    base={renderBody(false)}
                    overlay={renderBody(true)}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET + INDUSTRIES ─────────────────────────── */}
      <section className="relative py-32 z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] pointer-events-none" style={{ background: "radial-gradient(circle, #837FFB 0%, transparent 70%)" }} />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span
              className="text-[#837FFB] tracking-[0.4em] uppercase text-xs font-bold mb-6 block"
              style={textStyleToCss(data.sectionKickerStyle, DEFAULT_SECTION_KICKER_STYLE)}
            >
              {data.deliverablesKicker}
            </span>
            <h2
              className="text-5xl md:text-6xl font-bold tracking-tighter italic leading-tight mb-12"
              style={textStyleToCss(data.sectionHeadingStyle, DEFAULT_SECTION_HEADING_STYLE)}
            >
              {data.deliverablesHeading}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {data.deliverables.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#837FFB]/10 flex items-center justify-center shrink-0 border border-[#837FFB]/20 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-4 h-4 text-[#837FFB]" />
                  </div>
                  <span
                    className="text-white/60 font-medium text-sm group-hover:text-white transition-colors"
                    style={textStyleToCss(data.deliverableItemStyle, DEFAULT_DELIVERABLE_ITEM_STYLE)}
                  >
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="ind-parent"
          >
            <div className="ind-card !rounded-[40px] !bg-[#0F0D29]/60 !backdrop-blur-2xl !border-white/5">
              <div className="ind-content-box !p-6 sm:!p-8 md:!p-12">
                <span className="ind-label !text-[#837FFB] !tracking-[0.4em]">{data.industriesLabel}</span>
                <span className="ind-title !text-3xl md:!text-5xl !italic !tracking-tighter">{data.industriesTitle}</span>
                <p className="ind-desc !text-white/40 !text-lg">{data.industriesDescription}</p>

                <div className="ind-pills !gap-3 !mt-10">
                  {data.industries.map((ind, i) => (
                    <span
                      key={i}
                      className="ind-pill !bg-white/5 !border-white/10 !px-6 !py-3 !rounded-2xl !text-white/60 hover:!text-[#837FFB] hover:!border-[#837FFB]/30 !transition-all"
                      style={textStyleToCss(data.industryPillStyle, DEFAULT_INDUSTRY_PILL_STYLE)}
                    >
                      {ind.name}
                    </span>
                  ))}
                </div>

                <Link to={data.industriesCtaUrl} className="ind-cta !mt-12 !group">
                  <span>{data.industriesCtaLabel}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIAL ─── */}
      <section
        ref={testimonialSectionRef}
        className="relative py-44 overflow-hidden z-10"
      >
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none opacity-20"
          style={{
            background: "radial-gradient(circle, #837FFB 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6 lg:px-10">
          <div className="relative text-center">
            <div ref={frameRef} aria-hidden className="absolute inset-0 pointer-events-none">
              {[
                "top-0 left-0 border-t-2 border-l-2",
                "top-0 right-0 border-t-2 border-r-2",
                "bottom-0 left-0 border-b-2 border-l-2",
                "bottom-0 right-0 border-b-2 border-r-2",
              ].map((pos, i) => (
                <span
                  key={i}
                  className={`absolute w-12 h-12 border-[#837FFB] ${pos} opacity-40`}
                  style={{ boxShadow: "0 0 20px rgba(131,127,251,0.5)" }}
                />
              ))}
            </div>

            <div ref={textRef} className="py-24 px-10 md:px-20">
              <Quote className="w-16 h-16 text-[#837FFB] opacity-20 mx-auto mb-12" />
              <blockquote
                className="text-3xl md:text-5xl font-bold leading-tight italic tracking-tight"
                style={textStyleToCss(data.testimonialQuoteStyle, DEFAULT_TESTIMONIAL_QUOTE_STYLE)}
              >
                "{data.testimonialQuote}"
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="relative py-40 z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <CTA3DCard data={data} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
