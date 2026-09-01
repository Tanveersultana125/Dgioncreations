import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Briefcase, BarChart3, Server, Cloud,
  ArrowUpRight, TrendingUp, Shield, Users,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import IndustriesSection from "@/components/IndustriesSection";
import Footer from "@/components/Footer";
import PixelCard from "@/components/ui/PixelCard";
import GridDistortion from "@/components/ui/GridDistortion";
import { StatCounter } from "@/components/ui/StatCounter";
import { useContent } from "@/lib/use-content";
import { 
  INDUSTRIES_CONTENT_KEY, 
  defaultIndustriesContent, 
  type IndustriesContent,
  DEFAULT_DEEPDIVE_TITLE_STYLE,
  DEFAULT_DEEPDIVE_HIGHLIGHT_STYLE
} from "@/content/industries";
import { resolveIcon } from "@/content/icons";
import { textStyleToCss } from "@/content/typography";
import { MarkupText } from "@/lib/markup-text";





const ease = [0.25, 0.46, 0.45, 0.94] as const;

const strengths = [
  { value: "12+",  label: "Sectors Served",        icon: Cloud },
  { value: "45",   label: "Global Markets",        icon: TrendingUp },
  { value: "100%", label: "Compliance Track",      icon: Shield },
  { value: "500K+", label: "End-Users Reached",    icon: Users },
];



export default function Industries() {
  const { data } = useContent<IndustriesContent>(INDUSTRIES_CONTENT_KEY, defaultIndustriesContent);

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />

      {/* HERO */}
      <section
        className="relative pt-40 pb-24 overflow-hidden"
        style={{ background: "linear-gradient(160deg, hsl(var(--background)) 0%, #0D0B24 50%, hsl(var(--background)) 100%)" }}
      >
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold font-display leading-[1.05]">
              Our Strategic{" "}
              <span className="text-[#837FFB] drop-shadow-[0_0_24px_rgba(131,127,251,0.6)]">Impact</span>
            </h1>
            <p className="mt-7 text-lg md:text-xl text-white/55 leading-relaxed max-w-2xl">
              From regulated healthcare to high-frequency finance — our playbook bends to sector-specific realities without sacrificing speed or polish.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/contact" className="glow-button font-display inline-flex items-center gap-2">Discuss Your Sector <ArrowUpRight className="w-4 h-4" /></Link>
              <Link to="/portfolio" className="glass-hover px-8 py-4 rounded-2xl font-bold text-base text-white hover:text-[#837FFB] transition-all">See Case Studies</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="relative py-16 bg-background border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {strengths.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease, delay: i * 0.08 }} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(131,127,251,0.1)", border: "1px solid rgba(131,127,251,0.2)" }}>
                  <Icon className="w-5 h-5 text-[#837FFB]" />
                </div>
                <div>
                  <div className="text-white font-bold text-3xl leading-none">
                    <StatCounter value={s.value} />
                  </div>
                  <div className="text-white/40 text-xs mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* INTERACTIVE GLOBE SECTION */}
      <IndustriesSection />

      {/* SECTOR DEEP-DIVE CARDS */}
      <section className="relative py-28 overflow-hidden bg-background">
        
        {/* Section-wide Grid Distortion Background */}
        <div className="absolute inset-0 z-0 opacity-30">
          <GridDistortion
            imageSrc="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"
            grid={20}
            mouse={0.2}
            strength={0.15}
            relaxation={0.9}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
          <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <span className="text-[#837FFB] text-sm font-bold tracking-[0.3em] uppercase">Deep Dive</span>
            <h2 className="mt-4" style={textStyleToCss(data.deepDiveTitleStyle, DEFAULT_DEEPDIVE_TITLE_STYLE)}>
              <MarkupText
                text={data.deepDiveTitle}
                highlightStyle={data.deepDiveHighlightStyle ?? DEFAULT_DEEPDIVE_HIGHLIGHT_STYLE}
              />
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.deepDiveSectors.map((s, i) => {
              const Icon = resolveIcon(s.iconKey);
              const palette = `${s.color},${s.color}dd,${s.color}88`;
              
              return (
                <motion.div 
                  key={s.label} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ duration: 0.55, ease, delay: i * 0.08 }}
                >
                  <PixelCard 
                    colors={palette}
                    gap={6}
                    speed={35}
                    className="w-full !h-auto min-h-[440px] rounded-[32px] border-white/5 hover:border-white/10 transition-all duration-500"
                    style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(12px)" }}
                  >
                    <div className="relative z-20 p-8 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-xl" 
                          style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: s.color }} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: s.color }}>{s.tag}</span>
                      </div>
                      
                      <h3 className="text-white font-bold text-3xl mb-4 font-display tracking-tight">{s.label}</h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-8 flex-1">{s.desc}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {s.wins.map((w) => (
                          <span 
                            key={w} 
                            className="px-4 py-2 rounded-xl text-[10px] font-bold bg-white/[0.03] border border-white/10 text-white/70 backdrop-blur-md"
                          >
                            <StatCounter value={w} duration={1} />
                          </span>
                        ))}
                      </div>
                    </div>
                  </PixelCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="relative py-28 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight">
              Your sector{" "}
              <span className="text-[#837FFB] drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]">isn't listed</span>
              ?
            </h2>
            <p className="mt-6 text-white/55 text-lg max-w-xl mx-auto">We adapt fast. Tell us your industry — chances are we've shipped something adjacent.</p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="glow-button font-display inline-flex items-center gap-2">Talk to Us <ArrowUpRight className="w-4 h-4" /></Link>
              <Link to="/services" className="glass-hover px-8 py-4 rounded-2xl font-bold text-base text-white hover:text-[#837FFB] transition-all">Explore Services</Link>
            </div>
          </motion.div>
        </div>
      </section>




      <Footer />
    </div>
  );
}