import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, animate, useInView } from "framer-motion";
import { ArrowLeft, ExternalLink, ChevronRight, Globe, Target, Lightbulb, Trophy } from "lucide-react";
import { useContent } from "@/lib/use-content";
import { textStyleToCss } from "@/content/typography";
import { 
  PORTFOLIO_CONTENT_KEY, 
  defaultPortfolioContent, 
  type PortfolioContent,
  DEFAULT_PROJECT_TITLE_STYLE,
  DEFAULT_PROJECT_TAGLINE_STYLE,
  DEFAULT_PROJECT_HEADING_STYLE,
  DEFAULT_PROJECT_BODY_STYLE
} from "@/content/portfolio";
import staticProjects from "@/data/projects";

const ease = [0.16, 1, 0.3, 1] as const;

function StatCounter({ value, label }: { value: string; label: string }) {
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
    <div className="flex flex-col items-center md:items-start">
      <div className="text-3xl md:text-5xl font-bold tracking-tighter text-[#837FFB]">
        <span ref={ref}>0</span>{suffix}
      </div>
      <div className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">{label}</div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: portfolioData, loading } = useContent<PortfolioContent>(PORTFOLIO_CONTENT_KEY, defaultPortfolioContent);
  
  // Find project by ID or slug
  const project = portfolioData.projects.find((p) => p.id === id || p.slug === id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08061A] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#837FFB]/20 border-t-[#837FFB] rounded-full animate-spin" />
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Loading Project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08061A] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <button onClick={() => navigate("/")} className="text-[#837FFB] underline">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full text-white overflow-x-hidden selection:bg-[#837FFB]/30" style={{ background: "#08061A" }}>
      {/* Background Texture & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.02] contrast-150 brightness-100" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3仿真%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full opacity-20 blur-[140px] bg-[#837FFB]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-10 blur-[120px] bg-[#5B57F5]" />
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
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hidden sm:block">Case Study</span>
            <div className="w-px h-4 bg-white/10 hidden sm:block" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#837FFB]">{project.industry}</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 lg:items-end mb-10 md:mb-16">
              <div className="flex-1">
                <h1 
                  className="tracking-tighter leading-[0.9] mb-8"
                  style={textStyleToCss(project.titleStyle, DEFAULT_PROJECT_TITLE_STYLE)}
                >
                  {project.title}
                </h1>
                <p 
                  className="max-w-2xl leading-relaxed"
                  style={textStyleToCss(project.taglineStyle, DEFAULT_PROJECT_TAGLINE_STYLE)}
                >
                  {project.tagline}
                </p>
              </div>
              <div className="lg:w-1/3 flex flex-wrap gap-6 md:gap-10 border-l border-white/10 pl-5 md:pl-10">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Client</span>
                  <span className="text-white font-bold">{project.client}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Sector</span>
                  <span className="text-white font-bold">{project.industry}</span>
                </div>
              </div>
            </div>

            <div className="relative aspect-[21/9] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08061A] via-transparent to-transparent opacity-60" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
            {project.stats.map((stat, i) => (
              <StatCounter key={i} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-24">
            {/* Left: Overview */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 
                  className="tracking-widest mb-8"
                  style={textStyleToCss(project.headingStyle, DEFAULT_PROJECT_HEADING_STYLE)}
                >
                  Executive Overview
                </h2>
                <p 
                  className="leading-relaxed mb-16"
                  style={textStyleToCss(project.bodyStyle, DEFAULT_PROJECT_BODY_STYLE)}
                >
                  {project.description}
                </p>

                <div className="space-y-8">
                  <CaseBlock 
                    title="The Challenge" 
                    body={project.challenge} 
                    icon={Target} 
                    color="#F43F5E" 
                    headingStyle={project.headingStyle}
                    bodyStyle={project.bodyStyle}
                  />
                  <CaseBlock 
                    title="Our Solution" 
                    body={project.solution} 
                    icon={Lightbulb} 
                    color="#837FFB" 
                    headingStyle={project.headingStyle}
                    bodyStyle={project.bodyStyle}
                  />
                  <CaseBlock 
                    title="The Results" 
                    body={project.results} 
                    icon={Trophy} 
                    color="#4ADE80" 
                    headingStyle={project.headingStyle}
                    bodyStyle={project.bodyStyle}
                  />
                </div>
              </motion.div>
            </div>

            {/* Right: Sidebar */}
            <div className="lg:col-span-5 space-y-16">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-[40px] bg-white/2 border border-white/5 backdrop-blur-xl"
              >
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#837FFB] mb-8">Key Deliverables</h3>
                <div className="space-y-4">
                  {project.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 group hover:bg-white/5 transition-all">
                      <div className="w-8 h-8 rounded-full bg-[#837FFB]/10 flex items-center justify-center text-[10px] font-bold text-[#837FFB]">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <span className="text-white/60 text-sm group-hover:text-white transition-colors">{feat}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="p-8 rounded-[40px] bg-white/2 border border-white/5 backdrop-blur-xl"
              >
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#837FFB] mb-8">Technology Stack</h3>
                <div className="flex flex-wrap gap-3">
                  {project.tech.map((t) => (
                    <div key={t} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-white/40 hover:text-white hover:border-[#837FFB]/40 transition-all">
                      {t}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-40 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter italic mb-12">
              Transform your <br/>
              <span className="text-[#837FFB]">vision into reality.</span>
            </h2>
            <button
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }, 50);
              }}
              className="group relative inline-flex items-center gap-3 px-7 py-4 md:px-12 md:py-6 bg-white text-black rounded-full font-bold text-base md:text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              <span>Build Something Great</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      <div className="h-24" />
    </div>
  );
}

function CaseBlock({ title, body, icon: Icon, color, headingStyle, bodyStyle }: any) {
  return (
    <div className="relative group p-8 rounded-[32px] bg-white/2 border border-white/5 hover:border-white/10 transition-all overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 rounded-full" style={{ background: color }} />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <h3 
            className="font-bold" 
            style={{ ...textStyleToCss(headingStyle, DEFAULT_PROJECT_HEADING_STYLE), color }}
          >
            {title}
          </h3>
        </div>
        <p 
          className="leading-relaxed"
          style={textStyleToCss(bodyStyle, DEFAULT_PROJECT_BODY_STYLE)}
        >
          {body}
        </p>
      </div>
    </div>
  );
}