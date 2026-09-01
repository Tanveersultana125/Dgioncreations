import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, Clock, FileCheck, MessageSquare, ArrowUpRight,
  CheckCircle2, Zap, Award,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ProcessSection from "@/components/ProcessSection";
import Footer from "@/components/Footer";
import { Tilt3DCard } from "@/components/ui/tilt-3d-card";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import { SpaceWavesBackground } from "@/components/ui/space-waves-background";
import Iridescence from "@/components/ui/Iridescence";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

const principles = [
  { icon: Calendar, title: "Weekly Sprints", desc: "Two-week cycles with demo days, retrospectives, and transparent velocity tracking." },
  { icon: Clock,    title: "Fixed Timeline", desc: "We commit to delivery dates. Scope flexes, timeline doesn't — that's the deal." },
  { icon: FileCheck, title: "Living Docs",    desc: "Every decision documented. Notion + Figma + Linear, accessible to you in real-time." },
  { icon: MessageSquare, title: "Slack Access", desc: "Dedicated Slack channel with your team. Async by default, sync when it matters." },
];

const faqs = [
  { q: "How long does a typical engagement take?", a: "Most projects run 8–16 weeks depending on scope. We scope aggressively upfront so there are no month-over-month surprises. Retainers run monthly with 30-day exit clauses." },
  { q: "Do you work fixed-scope or time & materials?", a: "Both. We prefer fixed-scope for well-defined outcomes and retainer for ongoing work. Hybrid engagements are common — fixed for the build, retainer for optimisation." },
  { q: "Who owns the IP at the end?", a: "You do. Full IP transfer on final invoice, including code, designs, documentation, access to analytics and hosting. No hidden vendor lock-in." },
  { q: "What if we need to pivot mid-project?", a: "Change requests are scoped and repriced transparently. We keep a change-log of decisions so nothing gets lost. Scope creep is a two-way conversation, not a surprise invoice." },
  { q: "Can we meet the team before signing?", a: "Absolutely. First two discovery calls are free, and you meet the actual humans who'll be on your project — no bait-and-switch with juniors after signing." },
];

export default function Process() {

  return (
    <div 
      className="min-h-screen text-white relative"
      style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}
    >
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-24 overflow-hidden" style={{ background: "linear-gradient(160deg, #0F0D26 0%, #08061A 50%, #0F0D26 100%)" }}>
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="max-w-3xl">
            <span className="text-[#837FFB] text-sm font-bold tracking-[0.3em] uppercase">How We Work</span>
            <h1 className="mt-5 text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold font-display leading-[1.05]">
              A process built for{" "}
              <span className="text-[#837FFB] drop-shadow-[0_0_28px_rgba(131,127,251,0.6)]">speed</span>{" "}
              &amp; certainty
            </h1>
            <p className="mt-7 text-lg md:text-xl text-white/55 leading-relaxed max-w-2xl">
              Five stages. Zero theatre. Every engagement runs on the same playbook — so you know exactly what happens, when, and why.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/contact" className="glow-button font-display inline-flex items-center gap-2">Start Discovery <ArrowUpRight className="w-4 h-4" /></Link>
              <Link to="/services" className="glass-hover px-8 py-4 rounded-2xl font-bold text-base text-white hover:text-[#837FFB] transition-all">See Services</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5-STEP PROCESS */}
      <div className="relative bg-transparent">
        <ProcessSection />
      </div>

      {/* PRINCIPLES */}
      <section className="relative py-12 sm:py-14 md:py-16 overflow-hidden bg-transparent">
        <SpaceWavesBackground />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <span className="text-[#837FFB] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase">Operating Principles</span>
            <h2 className="mt-3 sm:mt-4 text-white text-3xl sm:text-4xl md:text-5xl font-bold">
              How we{" "}
              <span className="text-[#837FFB] drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]">actually</span>{" "}
              work
            </h2>
          </motion.div>

          <div className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[500px] flex items-center justify-center">
            <RadialOrbitalTimeline 
              timelineData={principles.map((p, i) => ({
                id: i + 1,
                title: p.title,
                date: "Standard",
                content: p.desc,
                category: "Principle",
                icon: p.icon,
                relatedIds: i === principles.length - 1 ? [i] : [i + 2],
                status: (i < 2 ? "completed" : "in-progress") as any,
                energy: 100 - (i * 15)
              }))} 
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section 
        className="relative py-16 sm:py-20 md:py-28" 
        style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div className="text-center mb-10 sm:mb-12 md:mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <span className="text-[#837FFB] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase">FAQ</span>
            <h2 className="mt-3 sm:mt-4 text-white text-3xl sm:text-4xl md:text-5xl font-bold">
              Questions, answered{" "}
              <span className="text-[#837FFB] drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]">straight</span>
            </h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <motion.details 
                key={f.q} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, ease, delay: i * 0.06 }} 
                className="group px-2 py-6 cursor-pointer border-b border-white/5 overflow-hidden transition-all duration-500 hover:border-[#837FFB]/20"
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
                  <p className="text-white/50 text-base leading-relaxed mt-6 max-w-3xl pr-8 border-l-2 border-[#837FFB]/30 pl-6 py-1 italic font-serif">
                    {f.a}
                  </p>
                </motion.div>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section 
        className="relative py-24 border-y border-white/5 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #08061A 0%, #0D0B24 50%, #08061A 100%)" }}
      >
        
        {/* 2. High-Tech Glowing Grid */}
        <div 
          className="absolute inset-0 z-0 opacity-30 pointer-events-none"
          style={{ 
            backgroundImage: `linear-gradient(rgba(131,127,251,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(131,127,251,0.15) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
          }}
        />
        
        {/* 4. Vignette to blend edges smoothly into the page */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#08061A_100%)] pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(131,127,251,0.1)", border: "1px solid rgba(131,127,251,0.2)" }}>
              <Zap className="w-6 h-6 text-[#837FFB]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-2 font-display">Deliver Fast</h3>
              <p className="text-white/40 text-sm leading-relaxed">First production release within 4 weeks on most projects.</p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(131,127,251,0.1)", border: "1px solid rgba(131,127,251,0.2)" }}>
              <Award className="w-6 h-6 text-[#837FFB]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-2 font-display">Ship Quality</h3>
              <p className="text-white/40 text-sm leading-relaxed">Automated tests + code review on every PR. No cowboy code.</p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: "rgba(131,127,251,0.1)", border: "1px solid rgba(131,127,251,0.2)" }}>
              <MessageSquare className="w-6 h-6 text-[#837FFB]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xl mb-2 font-display">Stay Close</h3>
              <p className="text-white/40 text-sm leading-relaxed">Weekly demos, async Slack, and a dedicated project lead.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 bg-transparent">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
            <h2 className="text-white text-4xl md:text-5xl font-bold leading-tight">
              Want to see the{" "}
              <span className="text-[#837FFB] drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]">full playbook</span>
              ?
            </h2>
            <p className="mt-6 text-white/55 text-lg max-w-xl mx-auto">Book a 30-min call. We'll walk through the exact steps for your project.</p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="glow-button font-display inline-flex items-center gap-2">Book a Call <ArrowUpRight className="w-4 h-4" /></Link>
              <Link to="/portfolio" className="glass-hover px-8 py-4 rounded-2xl font-bold text-base text-white hover:text-[#837FFB] transition-all">See Work</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}