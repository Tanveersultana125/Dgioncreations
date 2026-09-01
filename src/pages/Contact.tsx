import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// Content & Typography
import { useContent } from "@/lib/use-content";
import {
  CONTACT_CONTENT_KEY,
  defaultContactContent,
  type ContactContent,
  type QuickAction,
} from "@/content/contact";
import { textStyleToCss } from "@/content/typography";
import { resolveIcon } from "@/content/icons";
import { MarkupText } from "@/lib/markup-text";

import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { Tilt3DCard } from "@/components/ui/tilt-3d-card";
import { TextRevealInline } from "@/components/ui/text-reveal-inline";

const ease = [0.25, 0.46, 0.45, 0.94] as const;
const DGION_PURPLE = "#837FFB";


export default function Contact() {
  const { data } = useContent<ContactContent>(CONTACT_CONTENT_KEY, defaultContactContent);

  const titleLines = data.heroTitle.split("\n");

  return (
    <div className="min-h-screen bg-background text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-24 overflow-hidden" style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="max-w-3xl"
          >
            <div className="mb-6">
              <span
                className="inline-block px-4 py-1.5 rounded-full font-bold uppercase tracking-[0.3em] bg-white/5 border border-white/10"
                style={textStyleToCss(data.heroKickerStyle)}
              >
                {data.heroKicker}
              </span>
            </div>

            <h1
              className="font-bold font-display leading-[1.05] tracking-tight"
              style={textStyleToCss(data.heroTitleStyle)}
            >
              {titleLines.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  <MarkupText
                    text={line}
                    highlightStyle={data.heroHighlightStyle}
                    highlightClassName="drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]"
                  />
                </span>
              ))}
            </h1>

            <p
              className="mt-6 text-white/55 leading-relaxed max-w-2xl"
              style={textStyleToCss(data.heroDescStyle)}
            >
              {data.heroDesc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CONTACT CHANNELS */}
      <section className="relative py-16 border-y border-[#837FFB]/15">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {(data.trustBadges ?? []).map((c, i) => {
            const Icon = resolveIcon(c.iconKey);
            return (
              <motion.div key={`${c.label}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease, delay: i * 0.08 }} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${c.color}15`, border: `1px solid ${c.color}30` }}>
                  <Icon className="w-5 h-5" style={{ color: c.color }} />
                </div>
                <div>
                  <div className="mb-1" style={textStyleToCss(c.labelStyle)}>{c.label}</div>
                  <div style={textStyleToCss(c.valueStyle)}>{c.value}</div>
                  <div className="mt-1" style={textStyleToCss(c.subStyle)}>{c.sub}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FORM + ORBIT (existing) */}
      <ContactSection />

      {/* QUICK ACTIONS */}
      <section className="relative py-28 overflow-hidden" style={{ background: "#08061A" }}>
        {/* Ambient background effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-[#837FFB] blur-[140px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, -40, 0],
              y: [0, 60, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full bg-[#5B57F5] blur-[120px]"
          />
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{ 
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <span className="mb-4 block" style={textStyleToCss(data.otherWaysKickerStyle)}>{data.otherWaysKicker}</span>
            <h2 className="mt-4 font-bold" style={textStyleToCss(data.otherWaysTitleStyle)}>
              {data.otherWaysTitle}{" "}
              <span style={textStyleToCss(data.otherWaysHighlightStyle)}>{data.otherWaysHighlight}</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(data.quickActions ?? []).map((a, i) => (
              <QuickActionCard key={`${a.title}-${i}`} action={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-28" style={{ background: "linear-gradient(160deg, #1B1A4E 0%, #13113A 50%, #1B1A4E 100%)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <span className="mb-4" style={textStyleToCss(data.faqKickerStyle)}>{data.faqKicker}</span>
            <h2 className="mt-4 font-bold" style={textStyleToCss(data.faqTitleStyle)}>
              {data.faqTitle}{" "}
              <span style={textStyleToCss(data.faqHighlightStyle)}>{data.faqHighlight}</span>
            </h2>
          </motion.div>
          <div className="space-y-3">
            {(data.faqs ?? []).map((f, i) => (
              <motion.details 
                key={f.q} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, ease, delay: i * 0.06 }} 
                className="group px-2 py-6 cursor-pointer overflow-hidden"
              >
                <summary className="flex items-center justify-between text-white font-semibold text-lg list-none transition-all duration-300 group-hover:text-[#837FFB] group-hover:pl-2">
                  <span className="flex-1">{f.q}</span>
                  <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                    <span className="absolute inset-0 bg-[#837FFB]/0 group-open:bg-[#837FFB]/20 rounded-full blur-md transition-all duration-500" />
                    <span className="text-[#837FFB] text-2xl font-light transition-all duration-500 group-open:rotate-[135deg] group-open:scale-125 relative z-10">+</span>
                  </div>
                </summary>
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="overflow-hidden"
                >
                  <p className="text-white/50 text-base leading-relaxed mt-6 max-w-3xl pr-8 border-l-2 border-[#837FFB]/30 pl-6 py-1 italic">
                    {f.a}
                  </p>
                </motion.div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28" style={{ background: "linear-gradient(160deg, #0D0B24 0%, #08061A 100%)" }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight">
              Still deciding?{" "}
              <span className="text-[#837FFB] drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]">No pressure</span>
            </h2>
            <p className="mt-6 text-white/55 text-lg max-w-xl mx-auto">Browse our work, read the process, come back when ready. We'll be here.</p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link to="/portfolio" className="glow-button font-display inline-flex items-center gap-2">See Our Work <ArrowUpRight className="w-4 h-4" /></Link>
              <Link to="/process" className="glass-hover px-8 py-4 rounded-2xl font-bold text-base text-white hover:text-[#837FFB] transition-all">Our Process</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/**
 * QuickActionCard — single contact-action card.
 */
function QuickActionCard({ action, index }: { action: QuickAction; index: number }) {
  const [ctaHover, setCtaHover] = useState(false);
  const cardAccent = DGION_PURPLE;
  const iconAccent = action.accent || cardAccent;
  const Icon = resolveIcon(action.iconKey);
  const isExternal = /^(https?:|mailto:|tel:)/.test(action.href);
  const opensInNewTab = isExternal && !action.href.startsWith("mailto:") && !action.href.startsWith("tel:");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease, delay: index * 0.1 }}
      className="group h-full"
    >
      <Tilt3DCard
        accent={cardAccent}
        className="relative rounded-3xl p-8 overflow-hidden h-full flex flex-col"
        style={{
          background: `linear-gradient(160deg, ${cardAccent}0F 0%, rgba(255,255,255,0.02) 45%, rgba(255,255,255,0.015) 100%)`,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: `0 1px 0 rgba(255,255,255,0.04) inset, 0 30px 60px -20px rgba(0,0,0,0.5)`,
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${cardAccent}, transparent)` }} />
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-25 blur-3xl pointer-events-none transition-opacity duration-500 group-hover:opacity-50" style={{ background: cardAccent }} />
        <span className="absolute top-6 right-6 text-[11px] font-bold tracking-[0.25em] opacity-50" style={{ color: cardAccent }}>{String(index + 1).padStart(2, "0")}</span>

        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" style={{ background: cardAccent }} />
          <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110" style={{ background: `linear-gradient(135deg, ${cardAccent}28, ${cardAccent}10)`, border: `1px solid ${cardAccent}50`, boxShadow: `0 8px 24px -8px ${cardAccent}55` }}>
            <Icon className="w-6 h-6" style={{ color: iconAccent }} />
          </div>
        </div>

        <h3 className="mb-3" style={textStyleToCss(action.titleStyle)}>
          {action.revealText ? (
            <TextRevealInline text={action.title} revealText={action.revealText} accent={cardAccent} />
          ) : (
            action.title
          )}
        </h3>
        <p className="mb-8 flex-1" style={textStyleToCss(action.descStyle)}>{action.desc}</p>

        <a
          href={action.href}
          target={opensInNewTab ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          onMouseEnter={() => setCtaHover(true)}
          onMouseLeave={() => setCtaHover(false)}
          className="inline-flex items-center gap-2 self-start px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 cursor-pointer"
          style={{
            ...textStyleToCss(action.ctaStyle),
            color: ctaHover ? "#FFFFFF" : cardAccent,
            background: ctaHover ? cardAccent : `${cardAccent}12`,
            border: `1px solid ${ctaHover ? cardAccent : `${cardAccent}30`}`,
            boxShadow: ctaHover ? `0 8px 24px -6px ${cardAccent}99` : "none",
          }}
        >
          {action.cta}
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
        </a>
      </Tilt3DCard>
    </motion.div>
  );
}