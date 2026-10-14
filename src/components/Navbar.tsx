import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import GooeyNav from "./GooeyNav";
import { LiquidButton, LiquidGlassFilter } from "@/components/ui/liquid-glass-button";
import { useContent } from "@/lib/use-content";
import { NAVBAR_CONTENT_KEY, defaultNavbarContent, type NavbarContent } from "@/content/navbar";
import { textStyleToCss } from "@/content/typography";
import { PremiumButton } from "@/components/ui/PremiumButton";

export default function Navbar() {
  const { data } = useContent<NavbarContent>(NAVBAR_CONTENT_KEY, defaultNavbarContent);
  const [open, setOpen] = useState(false);

  // Mouse tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["2deg", "-2deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-2deg", "2deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <nav className="fixed top-3 sm:top-4 md:top-8 left-0 right-0 z-50 flex justify-center w-full px-3 sm:px-4 md:px-6">
      <LiquidGlassFilter />
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full"
      >
        {/* Main Body - Stretched Oval with background RESTORED for readability */}
        <div className="relative w-full px-4 sm:px-5 md:px-10 py-2 bg-[#22175A]/80 backdrop-blur-3xl rounded-[100px] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between min-h-[60px] sm:min-h-[70px] md:min-h-[80px]">

            {/* Logo Section - New Dgion Logo */}
            <Link to={data.logoHref} className="relative flex items-center group shrink-0">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-white tracking-tight text-base sm:text-xl md:text-2xl whitespace-nowrap"
                style={textStyleToCss(data.logoStyle)}
              >
                {data.logoText}
              </motion.span>
              <div className="ml-1 w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#837FFB] opacity-0 group-hover:opacity-100 transition-opacity self-end mb-2 md:mb-2.5" />
            </Link>

          {/* Desktop Links - Flex Centered to prevent overlap */}
          <div className="hidden xl:flex items-center justify-center flex-1 mx-2 h-full pb-1">
            <GooeyNav 
              items={(data.links.some(l => l.href === "/reviews") 
                ? data.links 
                : [...data.links, { label: "Reviews", href: "/reviews" }]
              ).map(l => ({
                ...l,
                href: l.href.startsWith("http") || l.href.startsWith("/") ? l.href : (l.href.startsWith("#") ? `/${l.href}` : `/${l.href}`),
                subItems: (l.label.toLowerCase() === "portfolio" || l.label.toLowerCase() === "work") ? [
                  { label: "Branding",          href: "/service/brand" },
                  { label: "Digital Marketing", href: "/service/seo" },
                  { label: "Website & App",     href: "/service/web-app" },
                  { label: "Production",        href: "/service/production" },
                ] : undefined
              }))} 
              textStyle={data.linksStyle} 
            />
          </div>
 
          {/* Action Button - Right Corner */}
          <div className="hidden md:flex items-center justify-end gap-4 shrink-0 relative z-20">
            <PremiumButton href={data.ctaHref} className="!h-9 md:!h-10 !px-4 md:!px-5 whitespace-nowrap text-xs md:text-sm">
              {data.ctaText}
            </PremiumButton>
          </div>

          {/* Mobile Toggle — 44pt minimum touch target */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="xl:hidden text-white p-2 -mr-1 inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute top-full left-0 right-0 mt-3 sm:mt-4 bg-[#1A1145] backdrop-blur-3xl rounded-[28px] sm:rounded-[40px] border border-[#837FFB]/30 p-5 sm:p-7 md:p-10 flex flex-col gap-2 sm:gap-3 shadow-2xl z-[100]"
          >
            {(data.links.some(l => l.href === "/reviews") 
              ? data.links 
              : [...data.links, { label: "Reviews", href: "/reviews" }]
            ).map((l) => {
              const hasSubItems = l.label.toLowerCase() === "portfolio" || l.label.toLowerCase() === "work";
              const subItems = (l.label.toLowerCase() === "portfolio" || l.label.toLowerCase() === "work") ? [
                { label: "Branding",          href: "/service/brand" },
                { label: "Digital Marketing", href: "/service/seo" },
                { label: "Website & App",     href: "/service/web-app" },
                { label: "Production",        href: "/service/production" },
              ] : [];

              return (
                <div key={l.label} className="flex flex-col">
                  <Link
                    to={l.href}
                    onClick={() => setOpen(false)}
                    className="text-white hover:text-[#837FFB] transition-colors py-3 sm:py-4 font-black text-base sm:text-lg md:text-xl flex justify-between items-center min-h-[44px]"
                    style={{ ...textStyleToCss(data.linksStyle), color: "#ffffff" }}
                  >
                    {l.label}
                    <span className="opacity-60">→</span>
                  </Link>
                  {hasSubItems && (
                    <div className="flex flex-col gap-2 pl-4 mb-2 border-l border-white/20">
                      {subItems.map((sub) => (
                        <Link
                          key={sub.label}
                          to={sub.href}
                          onClick={() => setOpen(false)}
                          className="py-2 text-sm font-bold text-white/90 hover:text-[#837FFB] transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="flex flex-col gap-4 pt-4 sm:pt-6 mt-2 border-t border-white/10">
                <Link
                  to={data.ctaHref}
                  onClick={() => setOpen(false)}
                  className="glow-button text-center !py-3 sm:!py-4 rounded-3xl text-sm sm:text-base"
                  style={textStyleToCss(data.ctaStyle)}
                >
                  {data.ctaText}
                </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </nav>
  );
}
