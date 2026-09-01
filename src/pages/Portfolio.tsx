import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy, TrendingUp, DollarSign, Globe, ArrowUpRight, Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PortfolioSection from "@/components/PortfolioSection";
import Footer from "@/components/Footer";
import { Tilt3DCard } from "@/components/ui/tilt-3d-card";
import { ParticleCard, GlobalSpotlight, BentoCardGrid, useMobileDetection } from "@/components/ui/MagicBento";
import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";
import { useContent } from "@/lib/use-content";
import { 
  PORTFOLIO_CONTENT_KEY, 
  defaultPortfolioContent, 
  type PortfolioContent,
  DEFAULT_HERO_KICKER_STYLE,
  DEFAULT_HERO_TITLE_STYLE,
  DEFAULT_HERO_HIGHLIGHT_STYLE,
  DEFAULT_HERO_DESC_STYLE
} from "@/content/portfolio";
import { textStyleToCss } from "@/content/typography";
import { resolveIcon } from "@/content/icons";
import { MarkupText } from "@/lib/markup-text";

import { StatCounter } from "@/components/ui/StatCounter";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Portfolio() {
  const { data } = useContent<PortfolioContent>(PORTFOLIO_CONTENT_KEY, defaultPortfolioContent);
  const testimonialsGridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-24 overflow-hidden" style={{ background: "linear-gradient(160deg, hsl(var(--background)) 0%, #0D0B24 50%, hsl(var(--background)) 100%)" }}>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="max-w-3xl">
            <div className="flex items-center justify-start gap-4 mb-8">
              <div 
                className="px-6 py-2 rounded-full font-bold uppercase tracking-[0.3em] bg-[#837FFB]/10 border border-[#837FFB]/30 shadow-[0_0_30px_rgba(131,127,251,0.15)] backdrop-blur-sm text-white"
                style={{ ...textStyleToCss(data.heroKickerStyle, DEFAULT_HERO_KICKER_STYLE), color: "#FFFFFF" }}
              >
                {data.heroKicker}
              </div>
            </div>
            <h1
              className="mt-5 font-display leading-[1.05]"
              style={textStyleToCss(data.heroTitleStyle, DEFAULT_HERO_TITLE_STYLE)}
            >
              {data.heroTitle.includes("**") ? (
                data.heroTitle.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    <MarkupText
                      text={line}
                      highlightStyle={data.heroHighlightStyle}
                      highlightClassName="drop-shadow-[0_0_28px_rgba(131,127,251,0.6)]"
                    />
                  </span>
                ))
              ) : (
                <>
                  {data.heroTitle}{" "}
                  <span
                    className="drop-shadow-[0_0_28px_rgba(131,127,251,0.6)]"
                    style={textStyleToCss(data.heroHighlightStyle, DEFAULT_HERO_HIGHLIGHT_STYLE)}
                  >
                    {data.heroHighlight}
                  </span>
                </>
              )}
            </h1>
            <p 
              className="mt-7 text-lg md:text-xl leading-relaxed max-w-2xl"
              style={textStyleToCss(data.heroDescStyle, DEFAULT_HERO_DESC_STYLE)}
            >
              {data.heroDesc}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/contact" className="glow-button font-display inline-flex items-center gap-2">Start a Project <ArrowUpRight className="w-4 h-4" /></Link>
              <Link to="/services" className="glass-hover px-8 py-4 rounded-2xl font-bold text-base text-white hover:text-[#837FFB] transition-all">What We Do</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* METRICS */}
      <section className="relative py-16 bg-background border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.metrics.map((m, i) => {
            const Icon = resolveIcon(m.iconKey);
            return (
              <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease, delay: i * 0.08 }} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(131,127,251,0.1)", border: "1px solid rgba(131,127,251,0.2)" }}>
                  <Icon className="w-5 h-5 text-[#837FFB]" />
                </div>
                <div>
                  <div className="text-white font-bold text-3xl leading-none">
                    <StatCounter value={m.value} />
                  </div>
                  <div className="text-white/40 text-xs mt-1 uppercase tracking-wider">{m.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FEATURED CASE STUDIES (existing) */}
      <PortfolioSection />

      {/* OUTCOMES BY NUMBERS */}
      <section className="relative py-28" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, #0D0B24 100%)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <span className="text-[#837FFB] text-sm font-bold tracking-[0.3em] uppercase">Outcomes</span>
            <h2 className="mt-4 text-white text-4xl md:text-5xl font-bold">
              Numbers that{" "}
              <span className="text-[#837FFB] drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]">moved</span>
            </h2>
          </motion.div>
          <div className="w-full h-[80vh] relative">
            <ScrollStack 
              className="w-full h-full"
              itemDistance={25}
              itemScale={0.04}
              itemStackDistance={25}
              stackPosition="15%"
              scaleEndPosition="5%"
              baseScale={0.88}
              blurAmount={2}
            >
              {data.outcomes.map((o, i) => (
                <ScrollStackItem key={o.title}>
                  <Tilt3DCard accent={o.color} className="rounded-3xl p-8 md:p-12 overflow-hidden w-full max-w-4xl mx-auto shadow-[0_15px_45px_rgba(0,0,0,0.5)]" style={{ background: "rgba(27, 20, 74, 0.85)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                      <div className="text-5xl md:text-8xl font-black leading-none" style={{ color: o.color, textShadow: `0 0 40px ${o.color}40` }}>
                        <StatCounter value={o.metric} />
                      </div>
                      <span className="text-sm font-bold uppercase tracking-[0.18em]" style={{ color: o.color }}>{o.tag}</span>
                    </div>
                    <h3 className="text-white font-bold text-2xl md:text-3xl mb-4">{o.title}</h3>
                    <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl">{o.desc}</p>
                  </Tilt3DCard>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative py-28 bg-[#1B144A]">
        <GlobalSpotlight gridRef={testimonialsGridRef} disableAnimations={isMobile} glowColor="131, 127, 251" spotlightRadius={400} />
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <span className="text-[#837FFB] text-sm font-bold tracking-[0.3em] uppercase">Client Voices</span>
            <h2 className="mt-4 text-white text-4xl md:text-5xl font-bold">
              What it's like to{" "}
              <span className="text-[#837FFB] drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]">work with us</span>
            </h2>
          </motion.div>
          <BentoCardGrid gridRef={testimonialsGridRef} className="!grid grid-cols-1 md:grid-cols-3 gap-5 !p-0 !max-w-none">
            {data.testimonials.map((t, i) => (
              <motion.div key={t.author} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease, delay: i * 0.1 }} className="h-full">
                <ParticleCard 
                  className="rounded-2xl p-7 h-full w-full flex flex-col" 
                  style={{ background: "hsl(var(--background))", border: "1px solid rgba(255,255,255,0.08)" }}
                  disableAnimations={isMobile}
                  glowColor="131, 127, 251"
                  enableTilt={true}
                  enableMagnetism={true}
                  clickEffect={true}
                >
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.rating }).map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-[#837FFB] text-[#837FFB]" />
                    ))}
                  </div>
                  <p className="text-white/75 text-[15px] leading-relaxed mb-6">"{t.quote}"</p>
                  <div className="pt-5 border-t border-white/8 mt-auto">
                    <div className="text-white font-bold text-sm">{t.author}</div>
                    <div className="text-white/40 text-xs">{t.role}</div>
                  </div>
                </ParticleCard>
              </motion.div>
            ))}
          </BentoCardGrid>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28" style={{ background: "linear-gradient(160deg, #0D0B24 0%, hsl(var(--background)) 100%)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight">
              Your project could be{" "}
              <span className="text-[#837FFB] drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]">next</span>
            </h2>
            <p className="mt-6 text-white/55 text-lg max-w-xl mx-auto">Tell us what you're building. 30-minute discovery call, no obligations.</p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="glow-button font-display inline-flex items-center gap-2">Start Here <ArrowUpRight className="w-4 h-4" /></Link>
              <Link to="/process" className="glass-hover px-8 py-4 rounded-2xl font-bold text-base text-white hover:text-[#837FFB] transition-all">Our Process</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}