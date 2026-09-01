import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useContent, saveContent } from "@/lib/use-content";
import { MarkupText } from "@/lib/markup-text";
import { useToast } from "@/components/ui/use-toast";
import { 
  TESTIMONIALS_CONTENT_KEY, 
  defaultTestimonialsContent, 
  type TestimonialsContent,
  DEFAULT_TESTIMONIALS_KICKER_STYLE,
  DEFAULT_TESTIMONIALS_TITLE_STYLE,
  DEFAULT_TESTIMONIALS_HIGHLIGHT_STYLE,
  DEFAULT_QUOTE_STYLE,
  DEFAULT_AUTHOR_STYLE
} from "@/content/testimonials";
import { textStyleToCss } from "@/content/typography";
import { Tilt3DCard } from "@/components/ui/tilt-3d-card";
import TestimonialsSection from "@/components/TestimonialsSection";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Reviews() {
  const { data } = useContent<TestimonialsContent>(TESTIMONIALS_CONTENT_KEY, defaultTestimonialsContent);
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", quote: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quote) return;
    
    setIsSubmitting(true);
    try {
      const newTestimonial = {
        name: formData.name,
        role: formData.role || "Client",
        quote: formData.quote,
        avatar: formData.name.substring(0, 2).toUpperCase(),
      };

      const updatedTestimonials = [newTestimonial, ...data.testimonials];
      
      await saveContent(TESTIMONIALS_CONTENT_KEY, { 
        ...data, 
        testimonials: updatedTestimonials 
      });

      toast({
        title: "Review Published!",
        description: "Thank you for sharing your experience with us.",
      });
      
      setFormData({ name: "", role: "", quote: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not post your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08061A] text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-44 pb-24 overflow-hidden z-10">
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, ease }} 
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div 
                className="px-6 py-2 rounded-full font-bold uppercase tracking-[0.3em] bg-[#837FFB]/10 border border-[#837FFB]/30 shadow-[0_0_30px_rgba(131,127,251,0.15)] backdrop-blur-sm text-white"
                style={textStyleToCss(data.heroKickerStyle, { ...DEFAULT_TESTIMONIALS_KICKER_STYLE, color: "#FFFFFF" })}
              >
                {data.heroKicker}
              </div>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[1.1] mb-8 sm:mb-10 italic"
              style={textStyleToCss(data.heroTitleStyle, DEFAULT_TESTIMONIALS_TITLE_STYLE)}
            >
              {data.heroTitle.includes("**") ? (
                <MarkupText
                  text={data.heroTitle}
                  highlightStyle={data.heroHighlightStyle}
                  highlightClassName="drop-shadow-[0_0_40px_rgba(131,127,251,0.5)]"
                />
              ) : (
                <>
                  {data.heroTitle}{" "}
                  {data.heroHighlight && (
                    <span
                      className="drop-shadow-[0_0_40px_rgba(131,127,251,0.5)]"
                      style={{ 
                        ...textStyleToCss(data.heroHighlightStyle, DEFAULT_TESTIMONIALS_HIGHLIGHT_STYLE),
                        fontSize: data.heroHighlightStyle?.fontSize ? `${data.heroHighlightStyle.fontSize}px` : (data.heroTitleStyle?.fontSize ? `${data.heroTitleStyle.fontSize}px` : "inherit")
                      }}
                    >
                      {data.heroHighlight}
                    </span>
                  )}
                </>
              )}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* REVIEWS SHOWCASE */}
      <section className="relative pb-24">
        <AnimatedTestimonials 
          title={data.showcaseTitle}
          titleStyle={data.showcaseTitleStyle}
          subtitle={data.showcaseSubtitle}
          subtitleStyle={data.showcaseSubtitleStyle}
          badgeText={data.showcaseBadge}
          badgeStyle={data.showcaseBadgeStyle}
          testimonials={data.testimonials.map((t, i) => ({
            id: i,
            name: t.name,
            role: t.role.split(",")[0].trim(),
            company: t.role.includes(",") ? t.role.split(",")[1].trim() : "Partner",
            content: t.quote,
            rating: 5,
            avatar: t.name.charAt(0)
          }))}
          trustedCompaniesTitle={data.trustedCompaniesTitle}
          trustedCompaniesStyle={data.trustedCompaniesStyle}
          trustedCompanies={data.trustedCompanies}
          className="!py-0"
        />
      </section>

      {/* 3D TESTIMONIALS WALL */}
      <TestimonialsSection hideHeader={true} />



      {/* LEAVE A REVIEW FORM */}
      <section className="relative py-32 border-t border-white/5" style={{ background: "#050505" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: The Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-10 rounded-3xl"
              style={{ 
                background: "linear-gradient(145deg, rgba(131,127,251,0.1) 0%, rgba(27,20,74,0.8) 100%)", 
                border: "1px solid rgba(131,127,251,0.3)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 0 40px rgba(131,127,251,0.05)"
              }}
            >
              <div className="mb-10">
                <h2 className="text-3xl font-bold font-display text-white mb-3">Share Your Experience</h2>
                <p className="text-white/50 text-sm">We value your feedback. Leave a live review below.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#837FFB] transition-colors"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Company / Role</label>
                    <input 
                      type="text" 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#837FFB] transition-colors"
                      placeholder="CEO, TechCorp"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Your Review</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.quote}
                    onChange={(e) => setFormData({...formData, quote: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#837FFB] transition-colors resize-none"
                    placeholder="How was your experience working with Dgion?"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold tracking-wide text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #837FFB, #5B57F5)", boxShadow: "0 10px 30px rgba(131,127,251,0.3)" }}
                >
                  {isSubmitting ? "PUBLISHING..." : "POST REVIEW LIVE"}
                </button>
              </form>
            </motion.div>

            {/* Right: Why Review? */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-12"
            >
              <div>
                <span 
                  className="text-[#837FFB] font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
                  style={textStyleToCss(data.whyKickerStyle, { fontSize: 12, fontFamily: "inter", bold: true, color: "#837FFB" })}
                >
                  {data.whyKicker}
                </span>
                <h2 
                  className="text-4xl md:text-5xl font-bold text-white leading-tight"
                  style={textStyleToCss(data.whyTitleStyle, { fontSize: 48, fontFamily: "the-seasons", bold: true, color: "#FFFFFF" })}
                >
                  <MarkupText
                    text={data.whyTitle}
                    highlightStyle={data.heroHighlightStyle}
                    highlightClassName="text-[#837FFB]"
                  />
                </h2>
                <p 
                  className="mt-6 text-white/50 text-lg leading-relaxed"
                  style={textStyleToCss(data.whySubtitleStyle, { fontSize: 18, fontFamily: "inter", color: "rgba(255,255,255,0.5)" })}
                >
                  {data.whySubtitle}
                </p>
              </div>

              <div className="space-y-8">
                {data.whyItems.map((item, i) => (
                    <div className="flex gap-5 items-start group">
                      <div className="w-10 h-10 rounded-xl bg-[#837FFB]/10 border border-[#837FFB]/20 flex items-center justify-center shrink-0 group-hover:bg-[#837FFB] group-hover:text-white transition-all duration-500">
                        <Star className="w-4 h-4 text-[#837FFB] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <h3 
                          className="text-white font-bold text-lg mb-1 leading-tight"
                          style={{ fontFamily: "the-seasons" }}
                        >
                          {item.title}
                        </h3>
                        <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
