import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, animate, useInView, useScroll, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import {
  Sparkles, Target, Heart, Rocket, ArrowUpRight, Linkedin, Twitter, Github, ChevronRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { Tilt3DCard } from "@/components/ui/tilt-3d-card";
import {
  IdentityCardBody,
  RevealCardContainer,
  } from "@/components/ui/animated-profile-card";
import GalleryHoverCarousel from "@/components/ui/gallery-hover-carousel";
import { useContent } from "@/lib/use-content";
import { 
  ABOUT_CONTENT_KEY, 
  defaultAboutContent, 
  type AboutContent,
  DEFAULT_ABOUT_KICKER_STYLE,
  DEFAULT_ABOUT_TITLE_STYLE,
  DEFAULT_ABOUT_HIGHLIGHT_STYLE,
  DEFAULT_ABOUT_DESC_STYLE
} from "@/content/about";
import { textStyleToCss } from "@/content/typography";
import { MarkupText } from "@/lib/markup-text";

const ease = [0.16, 1, 0.3, 1] as const;

const values = [
  { icon: Sparkles, title: "Craft",   desc: "We sweat the details. Pixel alignment matters. API design matters. Every commit is a small act of pride." },
  { icon: Target,   title: "Clarity", desc: "Honest scoping, transparent pricing, zero buzzwords. If we don't know, we say so." },
  { icon: Heart,    title: "Care",    desc: "Your product is our product for the duration. We show up, we follow through, we don't ghost." },
  { icon: Rocket,   title: "Speed",   desc: "Velocity without corners cut. First demo in two weeks, production-ready from day one." },
];

const team = [
  {
    name: "Alex Morgan",
    role: "Founder & CEO",
    avatar: "AM",
    color: "#837FFB",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&h=256&fit=crop&crop=faces",
    bio: "Product-led founder. 15 years building studios that ship. Obsessed with outcomes over output.",
  },
  {
    name: "Priya Singh",
    role: "Head of Design",
    avatar: "PS",
    color: "#f43f5e",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop&crop=faces",
    bio: "Design-systems specialist, previously at Linear and Framer. Believes interfaces should disappear.",
  },
  {
    name: "Marcus Kim",
    role: "Head of Engineering",
    avatar: "MK",
    color: "#38bdf8",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop&crop=faces",
    bio: "Staff engineer. Scaled payment platforms to 10M+ users. Go, Rust and TypeScript at production scale.",
  },
  {
    name: "Lisa Wright",
    role: "Head of Strategy",
    avatar: "LW",
    color: "#10b981",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop&crop=faces",
    bio: "Strategy lead, ex-McKinsey and Deloitte Digital. Turns ambiguous goals into shipped plans.",
  },
];

const milestones = [
  { year: "2013", title: "Founded", desc: "Started as a 3-person shop in Brooklyn with one client and a big idea." },
  { year: "2017", title: "First $1M year", desc: "Scaled to 15 people. Shipped our first enterprise healthcare platform." },
  { year: "2021", title: "Global expansion", desc: "Opened offices in London and Singapore. Team crossed 50." },
  { year: "2024", title: "AI-native", desc: "Rebuilt our entire toolchain around AI agents. 3× output, half the team size." },
];

export default function About() {
  const { data, loading } = useContent<AboutContent>(ABOUT_CONTENT_KEY, defaultAboutContent);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white overflow-x-hidden selection:bg-[#837FFB]/30">
        <Navbar />
        {/* Background Texture & Glows */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-100" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3仿真%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-15 blur-[120px] bg-[#837FFB]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden selection:bg-[#837FFB]/30">
      <Navbar />

      {/* Background Atmosphere & High-End Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-100" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3仿真%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        
        {/* Animated Digital Dust Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#837FFB]/40 rounded-full"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: Math.random() * 0.5 
              }}
              animate={{ 
                y: ["-10%", "110%"],
                opacity: [0, 0.5, 0]
              }}
              transition={{ 
                duration: 10 + Math.random() * 20, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 10
              }}
            />
          ))}
        </div>

        {/* Deep Radiant Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[120px] bg-[#837FFB] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[20%] right-[-5%] w-[40%] h-[40%] rounded-full opacity-15 blur-[100px] bg-[#5B57F5]" />
        <div className="absolute top-[40%] right-[10%] w-32 h-32 bg-[#837FFB]/20 blur-[60px] rounded-full" />
      </div>

      {/* HERO */}
      <section id="story" className="relative pt-44 pb-24 overflow-hidden z-10">
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 flex justify-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease }} className="max-w-4xl text-left">
            <div className="flex items-center justify-start gap-4 mb-8">
              <div 
                className="px-6 py-2 rounded-full font-bold uppercase tracking-[0.3em] bg-[#837FFB]/10 border border-[#837FFB]/30 shadow-[0_0_30px_rgba(131,127,251,0.15)] backdrop-blur-sm text-white"
                style={{ ...textStyleToCss(data.heroKickerStyle), color: "#FFFFFF" }}
              >
                {data.heroKicker}
              </div>
            </div>

            <h1
              className="font-bold tracking-tighter leading-[1.1] italic mb-10"
              style={textStyleToCss(data.heroTitleStyle)}
            >
              {data.heroTitle.includes("**") ? (
                // Naya markup-based mode — heroTitle has **word** picks inside it.
                data.heroTitle.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    <MarkupText
                      text={line}
                      highlightStyle={data.heroHighlightStyle}
                      highlightClassName="drop-shadow-[0_0_40px_rgba(131,127,251,0.5)]"
                    />
                  </span>
                ))
              ) : (
                // Legacy two-field mode — heroTitle + separate heroHighlight on a new line.
                <>
                  {data.heroTitle}
                  {data.heroHighlight && (
                    <>
                      <br />
                      <span
                        className="block mt-2 drop-shadow-[0_0_40px_rgba(131,127,251,0.5)]"
                        style={{ color: data.heroHighlightStyle?.color || "#837FFB" }}
                      >
                        {data.heroHighlight}
                      </span>
                    </>
                  )}
                </>
              )}
            </h1>
            
            <p 
              className="mt-10 text-white/50 leading-relaxed max-w-2xl font-medium mb-12 mr-auto"
              style={textStyleToCss(data.heroDescStyle)}
            >
              {data.heroDesc}
            </p>
            
            <div className="flex flex-wrap gap-5 justify-start">
              <Link to="/contact" className="group relative inline-flex items-center gap-3 px-10 py-5 bg-[#837FFB] text-white rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(131,127,251,0.3)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#837FFB] to-[#5B57F5] group-hover:opacity-90 transition-opacity" />
                <span className="relative z-10">Get in Touch</span>
                <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/portfolio" className="px-10 py-5 rounded-full font-bold text-lg text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#837FFB]/30 transition-all backdrop-blur-sm">
                See Our Work
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALUES (Section 2) */}
      <div id="values">
        <GalleryHoverCarousel 
          heading={data.valuesTitle || "Four values, zero"}
          subHeading={data.valuesHighlight || "fluff."}
          items={data.values.map((v, i) => ({
            id: `value-${i}`,
            title: v.title,
            summary: v.desc,
            url: v.url || "#",
            image: v.image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop"
          }))}
        />
      </div>

      {/* BEHIND THE SCENES (Spiral Timeline - Section 3) */}
      <div id="behind-scenes" className="relative z-10 pt-12">
        <AboutSection />
      </div>

      {/* WHY CHOOSE (Pillars - Section 4) */}
      <div id="different" className="relative z-10">
        <WhyChooseSection />
      </div>

      {/* TIMELINE (OUR MILESTONES - Vertical Glider - Section 5) */}
      <section id="timeline" className="relative py-32 z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <motion.div className="mb-24" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <span 
              className="text-[#837FFB] text-xs font-bold tracking-[0.4em] uppercase mb-6 block"
              style={textStyleToCss(data.sectionKickerStyle, DEFAULT_ABOUT_KICKER_STYLE)}
            >
              {data.journeyKicker || "OUR MILESTONES"}
            </span>
            <h2 
              className="text-5xl md:text-7xl font-bold tracking-tighter italic"
              style={textStyleToCss(data.sectionTitleStyle, DEFAULT_ABOUT_TITLE_STYLE)}
            >
              <MarkupText 
                text={
                  data.journeyTitle?.includes("**") 
                    ? data.journeyTitle 
                    : (data.journeyTitle || "Journey").replace(/Journey/g, "**Journey.**")
                } 
                highlightStyle={data.sectionHighlightStyle || DEFAULT_ABOUT_HIGHLIGHT_STYLE}
                highlightClassName="drop-shadow-[0_0_40px_rgba(131,127,251,0.5)]"
              />
            </h2>
            <p 
              className="mt-8 text-white/40 text-xl max-w-2xl font-medium"
              style={textStyleToCss(data.sectionDescStyle, DEFAULT_ABOUT_DESC_STYLE)}
            >
              {data.journeyDesc || "From a small creative studio to a global innovation partner."}
            </p>
          </motion.div>
          
          <TimelineWithGlider 
            milestones={data.journeyTimeline} 
            titleStyle={data.journeyItemTitleStyle}
            descStyle={data.journeyItemDescStyle}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-40 z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.8 }} 
            className="relative rounded-[30px] md:rounded-[60px] p-8 md:p-20 overflow-hidden border border-white/5" 
            style={{ background: "rgba(131,127,251,0.03)" }}
          >
            <div className="absolute inset-0 bg-[#837FFB]/5 blur-[120px] rounded-full translate-y-1/2" />
            
            <div className="relative z-10">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter italic leading-[0.9] mb-10">
                Want to{" "}
                <span className="text-[#837FFB] block md:inline md:ml-4">work with us?</span>
              </h2>
              <p className="mt-8 text-white/40 text-xl md:text-2xl max-w-2xl mx-auto mb-12 font-medium">We're selective — 1 in 10 inquiries become clients. Tell us what you're building.</p>
              <div className="flex flex-wrap gap-5 justify-center">
                <Link to="/contact" className="group relative inline-flex items-center gap-3 px-12 py-6 bg-white text-black rounded-full font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  <span>Get in Touch</span>
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/services" className="px-12 py-6 rounded-full font-bold text-xl text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#837FFB]/30 transition-all">Our Services</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function TimelineWithGlider({ milestones, titleStyle, descStyle }: { milestones: any[], titleStyle?: any, descStyle?: any }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // High-performance scroll tracking for 100% mobile reliability
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Buttery smooth mapping for the light trail
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const gliderTop = useTransform(smoothProgress, [0, 1], ["0%", "92%"]);

  // Sync activeIndex with scroll progress for text highlights
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(
      Math.floor(latest * milestones.length + 0.2), // Offset slightly to trigger earlier
      milestones.length - 1
    );
    if (index !== activeIndex) setActiveIndex(index);
  });

  return (
    <div ref={containerRef} className="relative px-2">
      {/* Vertical Track */}
      <div className="absolute left-[23px] top-6 bottom-12 w-[2px] bg-white/[0.05] overflow-visible">
        {/* Radiant High-End Glider */}
        <motion.div 
          style={{ top: gliderTop }}
          className="absolute left-[-4px] w-[10px] h-[40px] z-30"
        >
          {/* Glowing Head */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_20px_#fff,0_0_40px_#837FFB] z-10" />
          {/* Light Trail */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[4px] h-full bg-gradient-to-b from-[#837FFB] to-transparent opacity-60" />
          {/* Aura */}
          <div className="absolute top-[-10px] left-[-15px] w-12 h-12 bg-[#837FFB]/30 blur-[15px] rounded-full" />
        </motion.div>
      </div>

      {/* Milestone Items */}
      {milestones.map((m, i) => (
        <motion.div 
          key={i} 
          className="relative flex items-start gap-10 pb-20 last:pb-0 cursor-pointer group"
          onClick={() => setActiveIndex(i)}
          initial={false}
          animate={{ opacity: activeIndex === i ? 1 : 0.3 }}
        >
          {/* Year Circle */}
          <div 
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-sm font-bold relative z-10 transition-all duration-700 ${
              activeIndex === i 
                ? "text-white scale-110" 
                : "text-white/20 scale-90"
            }`}
            style={{ 
              background: activeIndex === i ? "linear-gradient(135deg, #837FFB, #5B57F5)" : "rgba(255,255,255,0.03)",
              boxShadow: activeIndex === i ? "0 0 40px rgba(131,127,251,0.5)" : "none",
              border: activeIndex === i ? "none" : "1px solid rgba(255,255,255,0.05)"
            }}
          >
            {m.year.slice(-2)}
          </div>

          {/* Content — With 3D Parallax Tilt */}
          <motion.div 
            className="pt-1 flex-1 transition-all duration-700"
            animate={{ 
              translateX: activeIndex === i ? 16 : 0,
              rotateX: activeIndex === i ? 0 : -10,
              scale: activeIndex === i ? 1.02 : 1
            }}
            style={{ perspective: 1000 }}
          >
            <div className={`text-[10px] font-black tracking-[0.4em] uppercase mb-3 transition-colors duration-700 ${activeIndex === i ? "text-[#837FFB]" : "text-white/20"}`}>
              {m.year}
            </div>
            <h3 
              className={`text-2xl font-bold italic tracking-tight transition-colors duration-700 ${activeIndex === i ? "text-white" : "text-white/30"}`}
              style={textStyleToCss(m.titleStyle || titleStyle)}
            >
              {m.title}
            </h3>
            <p 
              className={`leading-relaxed max-w-2xl transition-all duration-700 mt-4 ${activeIndex === i ? "text-white/60" : "text-white/10"}`}
              style={textStyleToCss(m.descStyle || descStyle)}
            >
              {m.desc}
            </p>
            
            {/* Liquid Glow Overlay */}
            {activeIndex === i && (
              <motion.div 
                layoutId="liquid-glow"
                className="absolute -inset-10 bg-[#837FFB]/5 blur-[60px] rounded-full pointer-events-none z-[-1]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}