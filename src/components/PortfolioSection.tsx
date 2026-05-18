import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, PlusCircle, X } from "lucide-react";
import GlassSurface from "@/components/ui/GlassSurface";
import ScrollStack, { ScrollStackItem } from "@/components/ui/ScrollStack";

import { useContent } from "@/lib/use-content";
import {
  PORTFOLIO_CONTENT_KEY,
  defaultPortfolioContent,
  type PortfolioContent,
} from "@/content/portfolio";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

// Inactive: scattered positions (% of right panel) with rotation
const scatterPositions = [
  { left: "4%",  top: "5%",  width: "42%", rotate: "-7deg",  zIndex: 6  },
  { left: "53%", top: "3%",  width: "40%", rotate: "5deg",   zIndex: 7  },
  { left: "28%", top: "38%", width: "44%", rotate: "-3deg",  zIndex: 8  },
  { left: "3%",  top: "57%", width: "39%", rotate: "6deg",   zIndex: 6  },
  { left: "53%", top: "55%", width: "41%", rotate: "-5deg",  zIndex: 7  },
];

// Active: centered, large, flat
const activePosition = {
  left: "17%",
  top: "7%",
  width: "65%",
  rotate: "0deg",
  zIndex: 20,
};

export default function PortfolioSection() {
  const navigate = useNavigate();
  const { data } = useContent<PortfolioContent>(PORTFOLIO_CONTENT_KEY, defaultPortfolioContent);
  const projects = data.projects;
  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target as Node)) {
        setActiveId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeIndex = projects.findIndex((p) => p.id === activeId);
  const active = activeIndex !== -1 ? projects[activeIndex] : null;

  const goUp = () => {
    if (!activeId) {
        setActiveId(projects[0].id);
        return;
    }
    const idx = projects.findIndex(p => p.id === activeId);
    setActiveId(projects[(idx - 1 + projects.length) % projects.length].id);
  };
  const goDown = () => {
    if (!activeId) {
        setActiveId(projects[0].id);
        return;
    }
    const idx = projects.findIndex(p => p.id === activeId);
    setActiveId(projects[(idx + 1) % projects.length].id);
  };

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative bg-[#0A0818] overflow-hidden py-16 sm:py-20 md:py-24"
    >
      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] bg-[#837FFB]/10 rounded-full blur-[180px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#5B57F5]/8 rounded-full blur-[120px]" />

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          className="text-center mb-10 sm:mb-14 md:mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
        >
          <span className="text-[#837FFB] text-sm font-bold tracking-[0.3em] uppercase">
            Portfolio
          </span>
          <h2 className="mt-3 sm:mt-4 text-white text-3xl sm:text-4xl md:text-5xl font-bold">
            Our{" "}
            <span className="text-[#837FFB] drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]">
              Work
            </span>
          </h2>
        </motion.div>
      </div>

      {/* ── Desktop: Apple-style split layout ── */}
      <div className="hidden lg:flex relative" style={{ minHeight: "620px" }}>

        {/* LEFT PANEL */}
        <motion.div
          className="flex-shrink-0 w-[42%] xl:w-[40%] self-center flex items-start gap-6
                     pl-10 xl:pl-20 2xl:pl-28 pr-10 py-14"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
        >
          {/* Up / Down navigation */}
          <div className="flex flex-col gap-2 shrink-0 pt-2">
            <button onClick={goUp} className="w-10 h-10 group transition-all duration-200">
              <GlassSurface width="100%" height="100%" borderRadius={100} className="border border-white/15 group-hover:border-white/40 text-white/40 group-hover:text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <ChevronUp className="w-5 h-5" />
              </GlassSurface>
            </button>
            <button onClick={goDown} className="w-10 h-10 group transition-all duration-200">
              <GlassSurface width="100%" height="100%" borderRadius={100} className="border border-white/15 group-hover:border-white/40 text-white/40 group-hover:text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <ChevronDown className="w-5 h-5" />
              </GlassSurface>
            </button>
          </div>

          {/* Feature list */}
          <div className="flex-1 flex flex-col gap-3.5 relative">
            <AnimatePresence mode="popLayout">
              {projects.map((project) => {
                const isActive = project.id === activeId;

                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    {isActive ? (
                      <motion.div
                        layoutId={`project-container-${project.id}`}
                        className="w-full relative z-20"
                      >
                        <GlassSurface
                          width="100%"
                          height="auto"
                          borderRadius={20}
                          className="border border-[#837FFB]/40 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.6)] items-start text-left relative overflow-hidden"
                          style={{ background: "rgba(15, 12, 45, 0.98)" }}
                          opacity={0.25}
                          displace={5}
                          blur={30}
                        >
                          {/* Close button inside */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveId(null); }}
                            className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div className="w-full">
                            <motion.span 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-[10px] font-black uppercase tracking-[0.3em] text-[#837FFB] mb-2 block"
                            >
                              {project.category}
                            </motion.span>
                            <motion.h3 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-white text-xl font-bold mb-3 leading-tight"
                            >
                                {project.title}
                            </motion.h3>
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="text-white/80 text-[14px] leading-relaxed mb-6"
                            >
                               {project.description}
                            </motion.p>
                            
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                              className="grid grid-cols-2 gap-4 mb-6 border-t border-white/10 pt-5"
                            >
                                {project.stats?.slice(0, 2).map((s, i) => (
                                    <div key={i}>
                                        <div className="text-white font-bold text-lg leading-none mb-1">{s.value}</div>
                                        <div className="text-white/40 text-[9px] uppercase tracking-widest font-bold">{s.label}</div>
                                    </div>
                                ))}
                            </motion.div>

                            <motion.div 
                               initial={{ opacity: 0 }}
                               animate={{ opacity: 1 }}
                               transition={{ delay: 0.3 }}
                               className="flex items-center justify-between"
                            >
                              <div className="flex gap-2">
                                 {project.tech?.slice(0, 2).map(t => (
                                    <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-white/50 font-medium">
                                        {t}
                                    </span>
                                 ))}
                              </div>
                              <button
                                onClick={() => navigate(`/project/${project.slug}`)}
                                className="text-[11px] font-extrabold uppercase tracking-widest text-[#837FFB] hover:text-white transition-colors flex items-center gap-2 group/btn"
                              >
                                View Case Study <span className="group-hover:translate-x-1 transition-transform">→</span>
                              </button>
                            </motion.div>
                          </div>
                        </GlassSurface>
                      </motion.div>
                    ) : (
                      <motion.button
                        layoutId={`project-container-${project.id}`}
                        onClick={(e) => { e.stopPropagation(); setActiveId(project.id); }}
                        className="w-fit text-left group block"
                        whileHover={{ x: 5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <GlassSurface
                          width="auto"
                          height="auto"
                          borderRadius={16}
                          className="inline-flex items-center gap-3 px-6 py-3.5 border border-white/[0.08] group-hover:border-[#837FFB]/50 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all duration-300"
                          opacity={0.08}
                          style={{ background: "rgba(255, 255, 255, 0.02)" }}
                        >
                          <PlusCircle className="w-4 h-4 text-[#837FFB] shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <span className="font-bold text-white/60 group-hover:text-white text-[15px] tracking-tight transition-colors">
                            {project.title}
                          </span>
                        </GlassSurface>
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* RIGHT PANEL — scattered photo wall */}
        <motion.div
          className="flex-1 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          {projects.map((project, i) => {
            const isActive = project.id === activeId;
            const pos = isActive ? activePosition : scatterPositions[i % scatterPositions.length];

            return (
              <div
                key={project.id}
                className="absolute rounded-2xl overflow-hidden ring-1 ring-white/10 group"
                style={{
                  aspectRatio: "16 / 10",
                  transition:
                    "left 580ms cubic-bezier(0.25,0.46,0.45,0.94), top 580ms cubic-bezier(0.25,0.46,0.45,0.94), width 580ms cubic-bezier(0.25,0.46,0.45,0.94), transform 580ms cubic-bezier(0.25,0.46,0.45,0.94), filter 580ms cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 580ms cubic-bezier(0.25,0.46,0.45,0.94)",
                  left:      pos.left,
                  top:       pos.top,
                  width:     pos.width,
                  transform: `rotate(${pos.rotate})`,
                  zIndex:    pos.zIndex,
                  filter:    isActive ? "brightness(1)" : "brightness(0.45)",
                  boxShadow: isActive
                    ? "0 28px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(131,127,251,0.15)"
                    : "0 8px 32px rgba(0,0,0,0.5)",
                  cursor: "pointer",
                }}
                onClick={() => isActive ? navigate(`/project/${project.slug}`) : setActiveId(project.id)}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />

                {/* Inactive dim + hover lift */}
                {!isActive && (
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10
                                  transition-colors duration-300" />
                )}

                {/* Active label overlay */}
                {isActive && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-5 z-10">
                      <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#837FFB] mb-0.5">
                        {active.category}
                      </p>
                      <h3 className="text-white font-bold text-base tracking-tight">
                        {active.title}
                      </h3>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {/* Progress dots */}
          <div className="absolute bottom-5 right-5 flex flex-col gap-1.5 z-30">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveId(p.id)}
                className={`w-1.5 rounded-full transition-all duration-300
                  ${p.id === activeId
                    ? "h-6 bg-[#837FFB] shadow-[0_0_8px_rgba(131,127,251,0.7)]"
                    : "h-1.5 bg-white/25 hover:bg-white/50"}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Mobile ScrollStack Gallery ── */}
      <div className="lg:hidden w-full h-[70vh] sm:h-[78vh] md:h-[85vh] relative px-3 sm:px-4">
        <ScrollStack 
          className="w-full h-full"
          itemDistance={30}
          itemScale={0.05}
          itemStackDistance={25}
          stackPosition="10%"
          scaleEndPosition="5%"
          baseScale={0.9}
          blurAmount={3}
        >
          {projects.map((project, i) => (
            <ScrollStackItem key={project.id}>
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden p-5 shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
                <div className="relative h-56 w-full rounded-2xl overflow-hidden mb-5 ring-1 ring-white/10">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#837FFB] mb-1 block">
                      {project.category}
                    </span>
                    <h3 className="text-white font-bold text-2xl tracking-tight">{project.title}</h3>
                  </div>
                </div>
                <div>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <button
                    onClick={() => navigate(`/project/${project.slug || ""}`)}
                    className="mt-5 text-[12px] font-bold uppercase tracking-wider text-[#837FFB] hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    View Case Study <span>→</span>
                  </button>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

    </section>
  );
}