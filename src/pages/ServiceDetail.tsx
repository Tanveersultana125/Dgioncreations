import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, animate, useInView } from "framer-motion";
import { ArrowLeft, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { getServiceById } from "@/data/services";
import { useContent } from "@/lib/use-content";
import { SERVICES_CONTENT_KEY, defaultServicesContent, type ServicesContent } from "@/content/services";
import FloatingLines from "@/components/FloatingLines";
import { GlowOrb } from "@/components/ui/GlowOrb";
import Iridescence from "@/components/ui/Iridescence";
import { useMotionValue, useSpring, useTransform } from "framer-motion";
import { Carousel_004 } from "@/components/ui/carousel-004";

const ease = [0.16, 1, 0.3, 1] as const;

function StatCounter({ value, color }: { value: string; color: string }) {
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
    <div className="flex flex-col">
      <div className="text-4xl md:text-5xl font-bold tracking-tighter" style={{ color }}>
        <span ref={ref}>0</span>{suffix}
      </div>
    </div>
  );
}

function ServiceCTACard({ service, navigate }: { service: any, navigate: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 150, damping: 20 });
  const glareX = useTransform(mx, [0, 1], [0, 100]);
  const glareY = useTransform(my, [0, 1], [0, 100]);

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        onMouseMove={(e) => {
          if (!ref.current) return;
          const rect = ref.current.getBoundingClientRect();
          mx.set((e.clientX - rect.left) / rect.width);
          my.set((e.clientY - rect.top) / rect.height);
        }}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative rounded-[60px] p-10 md:p-20 border border-white/5 text-center"
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
            color={[0.55, 0.5, 1.0] as any}
            amplitude={0.08}
            speed={0.6}
            mouseReact={false}
          />
        </div>

        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[#837FFB]/10 blur-[120px] rounded-full pointer-events-none" style={{ transform: "translateZ(0)" }} />

        <div className="relative z-10" style={{ transform: "translateZ(50px)" }}>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 italic tracking-tighter">
            Ready to dominate with <br/>
            <span style={{ color: service.color }}>{service.full}</span>?
          </h2>
          <p className="text-white/40 text-xl max-w-xl mx-auto mb-12">
            Let's architect your brand's digital future together.
          </p>
          
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }, 50);
            }}
            className="group relative inline-flex items-center gap-3 px-6 py-3.5 md:px-10 md:py-5 bg-white text-black rounded-full font-bold text-sm md:text-lg hover:scale-105 active:scale-95 transition-all"
          >
            <span>Start Project</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Base details (features, overview, stats) from hardcoded data
  const baseService = id ? getServiceById(id) : undefined;
  
  // Custom details (imageUrl, custom title/desc) from CMS
  const { data } = useContent<ServicesContent>(SERVICES_CONTENT_KEY, defaultServicesContent);
  const cmsService = data.services.find((s) => s.id === id);

  // Merge so the user's uploaded images show up!
  const service = (baseService && cmsService ? { ...baseService, ...cmsService } : baseService) as any;

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08061A] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
          <button onClick={() => navigate("/services")} className="text-[#837FFB] underline">
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen w-full text-white overflow-x-hidden selection:bg-[#837FFB]/30" style={{ background: "#08061A" }}>
      {/* Background Texture & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Cinematic Noise / Grain */}
        <div className="absolute inset-0 opacity-[0.05] contrast-150 brightness-100 mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        
        {/* Soft Ambient Glows */}
        <GlowOrb color={service.color} opacity={0.12} pulse duration={8} className="top-[-20%] left-[-10%] w-[70%] h-[70%]" />
        <GlowOrb color="#5B57F5" opacity={0.08} pulse duration={10} className="bottom-[-10%] right-[-10%] w-[60%] h-[60%]" />
        
        {/* Volumetric Light Ray */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            background: `linear-gradient(135deg, ${service.color} 0%, transparent 50%, #5B57F5 100%)`,
            clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
            filter: 'blur(80px)'
          }} 
        />
      </div>

      {/* Nav bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 bg-[#08061A]/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2.5 text-white/50 hover:text-white transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#837FFB]/20 group-hover:border-[#837FFB]/30 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Back</span>
          </button>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{service.title} Expert</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-44 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease }}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] bg-white/5 border border-white/10" style={{ color: service.color }}>
                    Digital Excellence
                  </div>
                  <div className="h-px w-12 bg-white/10" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Service Detail</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tighter mb-6 sm:mb-8 italic">
                  {service.full.split(' ').map((word, i) => (
                    <span key={i} className="inline-block mr-4">
                      {word === 'SEO' || word === 'Search' ? <span style={{ color: service.color }}>{word}</span> : word}
                    </span>
                  ))}
                </h1>

                <p className="text-white/50 text-xl md:text-2xl max-w-2xl leading-relaxed font-medium mb-12">
                  {service.desc}
                </p>

                <div className="flex flex-wrap gap-6 md:gap-12 pt-8 md:pt-12 border-t border-white/5">
                  {service.stats.map((stat) => (
                    <div key={stat.label}>
                      <StatCounter value={stat.value} color={service.color} />
                      <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-5 hidden lg:block sticky top-44" style={{ height: "550px" }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease }}
                className="w-full h-full"
              >
                <Carousel_004
                  images={[
                    { src: service.imageUrl || service.hero, alt: service.title },
                    { src: `https://picsum.photos/seed/${service.id}-1/800/600`, alt: service.title },
                    { src: `https://picsum.photos/seed/${service.id}-2/800/600`, alt: service.title },
                    { src: `https://picsum.photos/seed/${service.id}-3/800/600`, alt: service.title },
                  ]}
                  autoplay={true}
                  loop={true}
                  showPagination={true}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Content */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24">
            {/* Left: Overview */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Zap className="w-5 h-5" style={{ color: service.color }} />
                  </div>
                  <h2 className="text-2xl font-bold uppercase tracking-widest italic">Overview</h2>
                </div>
                <p className="text-white/40 text-lg leading-relaxed mb-8">
                  {service.overview}
                </p>
                
                <div className="flex flex-wrap gap-3 mt-8">
                  {service.features.slice(0, 3).map((f: any, i: number) => (
                    <div key={i} className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl hover:bg-white/[0.08] hover:border-white/[0.2] transition-all cursor-default group shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
                      <div className="w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-150" style={{ background: service.color, boxShadow: `0 0 10px ${service.color}` }} />
                      <span className="text-xs font-bold tracking-wider uppercase text-white/60 group-hover:text-white transition-colors">{f.title}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: Feature Cards */}
            <div className="grid grid-cols-1 gap-6">
              {service.features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="relative group p-8 rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Glassmorphism Backgrounds & Glows */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                  <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] group-hover:border-white/[0.2] rounded-[32px] transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-0" />
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-0 pointer-events-none" style={{ background: service.color, transform: 'translate(30%, -30%)' }} />

                  <div className="relative z-10 flex items-start gap-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-[#08061A]/80 border border-white/10 group-hover:scale-110 group-hover:border-white/20 transition-all duration-500 shadow-inner">
                      <CheckCircle2 className="w-7 h-7" style={{ color: service.color, filter: `drop-shadow(0 0 8px ${service.color})` }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-3 text-white/90 group-hover:text-white transition-colors tracking-tight">{feature.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/70 transition-colors">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Immersive CTA */}
      <section className="py-32 relative">
        <div className="max-w-5xl mx-auto px-6">
          <ServiceCTACard service={service} navigate={navigate} />
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-24" />
    </div>
  );
}