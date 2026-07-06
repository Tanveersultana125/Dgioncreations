import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SplineScene } from "@/components/ui/splite";
import { useContent } from "@/lib/use-content";
import {
  HERO_CONTENT_KEY,
  defaultHeroContent,
  DEFAULT_BADGE_STYLE,
  DEFAULT_HEADLINE_STYLE,
  DEFAULT_HIGHLIGHT_STYLE,
  DEFAULT_DESCRIPTION_STYLE,
  DEFAULT_STAT_VALUE_STYLE,
  DEFAULT_STAT_LABEL_STYLE,
  DEFAULT_CTA_PRIMARY_STYLE,
  DEFAULT_CTA_SECONDARY_STYLE,
  type HeroContent,
} from "@/content/hero";
import { textStyleToCss } from "@/content/typography";
import { StatCounter } from "@/components/ui/StatCounter";
import { MarkupText } from "@/lib/markup-text";
import { PremiumButton } from "@/components/ui/PremiumButton";

export default function HeroSection() {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Firestore-backed content — falls back to defaults until admin publishes.
  const { data: content, loading } = useContent<HeroContent>(HERO_CONTENT_KEY, defaultHeroContent);

  useEffect(() => {
    if (!loading) {
      headlineRef.current?.classList.add("animate-slide-up");
    }
  }, [loading]);

  if (loading) {
    return (
      <section className="relative w-full min-h-screen overflow-hidden bg-background">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px] bg-[#837FFB]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px] bg-[#5B57F5]" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-background">
      {/* Background Texture & Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] contrast-150 brightness-100" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3仿真%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full opacity-20 blur-[120px] bg-[#837FFB]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px] bg-[#5B57F5]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row w-full min-h-screen">

        {/* ── Left: Text ────────────────────────────────────────────── */}
        <div className="w-full lg:w-[48%] xl:w-[44%] flex flex-col justify-start lg:justify-center items-center lg:items-start text-center lg:text-left
                        pt-28 sm:pt-32 md:pt-44 lg:pt-32 pb-12 sm:pb-16 px-5 sm:px-8 md:px-14 lg:pl-20 lg:pr-12
                        shrink-0 relative z-10">

          <div
            className="inline-flex w-fit glass px-3 sm:px-4 py-1.5 sm:py-2 mb-6 sm:mb-8
                       tracking-wider uppercase rounded-full
                       border border-[#837FFB]/25 text-[10px] sm:text-xs"
            style={textStyleToCss(content.badgeStyle, DEFAULT_BADGE_STYLE)}
          >
            {content.badge}
          </div>

          <h1
            ref={headlineRef}
            className="flex flex-col !flex-col !gap-4 leading-relaxed mb-6 opacity-0"
            style={textStyleToCss(content.headlineStyle, DEFAULT_HEADLINE_STYLE)}
          >
            {content.headlineTop.includes("**") ? (
              content.headlineTop.split("\n").map((line, i) => (
                <div key={i} className="block !block leading-[1.4] lg:leading-[1.1] min-h-fit">
                  <MarkupText
                    text={line}
                    highlightStyle={content.highlightStyle}
                    highlightClassName="drop-shadow-[0_0_36px_rgba(131,127,251,0.7)]"
                  />
                </div>
              ))
            ) : (
              <>
                <div className="block !block leading-[1.4] lg:leading-[1.1] min-h-fit">{content.headlineTop}</div>
                <div
                  className="block !block leading-[1.4] lg:leading-[0.95] my-2 lg:my-2 drop-shadow-[0_0_36px_rgba(131,127,251,0.7)] min-h-fit"
                  style={textStyleToCss(content.highlightStyle, DEFAULT_HIGHLIGHT_STYLE)}
                >
                  {content.headlineHighlight}
                </div>
                <div className="block !block leading-[1.4] lg:leading-[1.1] min-h-fit">{content.headlineBottom}</div>
              </>
            )}
          </h1>

          <p
            className="max-w-md w-full mb-8 sm:mb-10 leading-relaxed text-sm sm:text-base break-words hyphens-none px-1"
            style={textStyleToCss(content.descriptionStyle, DEFAULT_DESCRIPTION_STYLE)}
          >
            {content.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
            <PremiumButton href="/contact" className="w-full sm:w-auto">
              {content.ctaPrimaryLabel}
            </PremiumButton>
            <Link
              to="/services"
              className="glass-hover w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-3 rounded-full
                         text-center hover:text-[#837FFB] transition-all min-h-[44px]
                         flex items-center justify-center
                         text-[11px] font-black uppercase tracking-[0.25em]"
              style={textStyleToCss(content.ctaSecondaryStyle, DEFAULT_CTA_SECONDARY_STYLE)}
            >
              {content.ctaSecondaryLabel}
            </Link>
          </div>

          {/* Stats — now driven by Firestore content */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 md:gap-10 mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10 w-full">
            {content.stats.map((stat) => (
              <div key={stat.label}>
                <div
                  className=""
                  style={textStyleToCss(content.statValueStyle, DEFAULT_STAT_VALUE_STYLE)}
                >
                  <StatCounter value={stat.value} />
                </div>
                <div
                  className="mt-0.5"
                  style={textStyleToCss(content.statLabelStyle, DEFAULT_STAT_LABEL_STYLE)}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Spline 3D robot ──────────────────────────── */}
        <div className="flex-1 relative min-h-[320px] sm:min-h-[400px] md:min-h-[480px] lg:min-h-0">
          <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px
                          bg-gradient-to-b from-transparent via-[#837FFB]/25 to-transparent z-20" />

          <div className="absolute inset-0">
            {content.heroImageUrl ? (
              <img
                src={content.heroImageUrl}
                alt=""
                className="w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            )}
          </div>

          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#0A0818] to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0A0818] to-transparent pointer-events-none z-10" />
        </div>
      </div>

      <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2">
        <span className="text-xs text-gray-500 tracking-widest uppercase font-bold">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-[#837FFB]/60 to-transparent animate-pulse-glow" />
      </div>
    </section>
  );
}
