import { useRef, useState, useEffect } from "react";
import { motion, useAnimate, AnimatePresence } from "framer-motion";
import { useContent } from "@/lib/use-content";
import {
  CLIENTS_CONTENT_KEY,
  defaultClientsContent,
  type ClientsContent,
  DEFAULT_KICKER_STYLE,
  DEFAULT_HEADING_STYLE,
  DEFAULT_HIGHLIGHT_STYLE,
  DEFAULT_DESCRIPTION_STYLE,
  DEFAULT_LOGO_LABEL_STYLE,
} from "@/content/clients";
import { textStyleToCss } from "@/content/typography";
import { useInView } from "framer-motion";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

/* ── Pure CSS Directional Reveal — The "Ultimate" Fix ── */
/* 
   By using 4 invisible triangles that catch the hover, we can trigger 
   different directions using PURE CSS or very simple JS that works 
   perfectly in simulators.
*/

type Side = "left" | "right" | "top" | "bottom";

function LinkBox({
  id,
  name,
  imgSrc,
  href,
  index = 0,
  labelStyle,
}: {
  id: string;
  name: string;
  imgSrc: string;
  href: string;
  index?: number;
  labelStyle?: React.CSSProperties;
}) {
  const [scope, animate] = useAnimate();
  const [activeSide, setActiveSide] = useState<Side>("bottom");

  const handleEnter = (side: Side) => {
    setActiveSide(side);
    const initials: Record<Side, string> = {
      left:   "inset(0 100% 0 0)",
      right:  "inset(0 0 0 100%)",
      top:    "inset(0 0 100% 0)",
      bottom: "inset(100% 0 0 0)",
    };

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    animate(scope.current, 
      { clipPath: [initials[side], "inset(0 0 0 0)"], opacity: 1 }, 
      { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
    );

    // On mobile, keep it visible for a moment so the user can see the effect
    if (isMobile) {
      if ((window as any)._clientTimeout) clearTimeout((window as any)._clientTimeout);
      (window as any)._clientTimeout = setTimeout(() => {
        handleLeave();
      }, 1500);
    }
  };

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleLeave = () => {
    setTilt({ x: 0, y: 0 });
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile && (window as any)._clientTimeout) return;
    animate(scope.current, { opacity: 0 }, { duration: 0.3 });
  };

  const handlePointer = (e: React.PointerEvent | React.TouchEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.PointerEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.PointerEvent).clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    // Calculate Tilt
    const tiltX = (y / h - 0.5) * -12;
    const tiltY = (x / w - 0.5) * 16;
    setTilt({ x: tiltX, y: tiltY });

    // Side detection for reveal
    const distLeft = x;
    const distRight = w - x;
    const distTop = y;
    const distBottom = h - y;
    const minDist = Math.min(distLeft, distRight, distTop, distBottom);
    let side: Side = "bottom";
    if (minDist === distLeft) side = "left";
    else if (minDist === distRight) side = "right";
    else if (minDist === distTop) side = "top";
    else side = "bottom";

    handleEnter(side);
  };

  // Passive reveal on mobile when card is in center of viewport
  const cardRef = useRef<HTMLAnchorElement>(null);
  const isCentered = useInView(cardRef, { 
    margin: "-40% 0px -40% 0px", // Trigger when in the middle 20% of screen
    once: false 
  });

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      if (isCentered) {
        handleEnter("bottom");
      } else {
        handleLeave();
      }
    }
  }, [isCentered]);

  return (
    <motion.a
      ref={cardRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative grid h-24 sm:h-32 md:h-48 w-full place-content-center group overflow-hidden"
      onPointerEnter={handlePointer}
      onPointerMove={handlePointer}
      onPointerLeave={handleLeave}
      onTouchStart={handlePointer}
      onTouchMove={handlePointer}
      onTouchEnd={handleLeave}
      initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
      whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
      whileTap={{ scale: 0.95 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease, delay: index * 0.08 }}
      style={{
        background: "linear-gradient(180deg, #1B1A4E 0%, #13113A 100%)",
        transformStyle: "preserve-3d",
        perspective: "1000px",
        touchAction: "pan-y",
        rotateX: tilt.x,
        rotateY: tilt.y
      }}
    >
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none"
        whileHover={{ rotateY: 8, rotateX: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />

      <div className="flex flex-col items-center gap-2 text-white/80 relative z-10 pointer-events-none">
        <img
          src={imgSrc}
          alt={name}
          className="h-7 sm:h-9 md:h-10 w-auto object-contain"
          style={{ filter: "grayscale(100%) brightness(1.4)" }}
        />
        <span className="uppercase tracking-[0.2em]" style={labelStyle}>
          {name}
        </span>
      </div>

      <motion.div
        ref={scope}
        initial={{ opacity: 0 }}
        className="absolute inset-0 grid place-content-center bg-[#837FFB] z-20 pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2 text-white">
          <img
            src={imgSrc}
            alt={name}
            className="h-7 sm:h-9 md:h-10 w-auto object-contain"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <span className="text-[8px] sm:text-xs uppercase tracking-[0.2em] font-bold">
            {name}
          </span>
        </div>
      </motion.div>
    </motion.a>
  );
}

export default function ClientsSection() {
  const { data } = useContent<ClientsContent>(CLIENTS_CONTENT_KEY, defaultClientsContent);
  const logos = data.logos;
  const row1 = logos.slice(0, 2);
  const row2 = logos.slice(2, 6);
  const row3 = logos.slice(6, 10);
  const rest = logos.slice(10);
  const labelStyle = textStyleToCss(data.logoLabelStyle, DEFAULT_LOGO_LABEL_STYLE);

  return (
    <section
      id="clients"
      className="relative overflow-hidden py-16 sm:py-20 md:py-28"
      style={{
        background: "linear-gradient(160deg, #1B1A4E 0%, #13113A 50%, #1B1A4E 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#837FFB]/12 blur-[140px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#5B57F5]/12 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full px-6 md:px-12 lg:px-20">
        <motion.span
          className="block tracking-[0.3em] uppercase mb-4"
          style={textStyleToCss(data.kickerStyle, DEFAULT_KICKER_STYLE)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          {data.kicker}
        </motion.span>

        <motion.h2
          className="leading-[1.05] uppercase tracking-tight max-w-4xl"
          style={textStyleToCss(data.headingStyle, DEFAULT_HEADING_STYLE)}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease }}
        >
          {data.headingBefore}
          <span
            className="drop-shadow-[0_0_20px_rgba(131,127,251,0.5)]"
            style={textStyleToCss(data.highlightStyle, DEFAULT_HIGHLIGHT_STYLE)}
          >
            {data.headingHighlight}
          </span>
          {data.headingAfter}
        </motion.h2>

        <motion.p
          className="mt-6 max-w-3xl"
          style={textStyleToCss(data.descriptionStyle, DEFAULT_DESCRIPTION_STYLE)}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
        >
          {data.description}
        </motion.p>

        <motion.div
          className="mt-12 sm:mt-16 md:mt-24 divide-y border border-white/10 divide-white/10 overflow-hidden backdrop-blur-md rounded-2xl md:rounded-3xl shadow-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease, delay: 0.25 }}
        >
          {row1.length > 0 && (
            <div className="grid grid-cols-2 divide-x divide-white/10">
              {row1.map((c, i) => (
                <LinkBox key={c.id} index={i} {...c} labelStyle={labelStyle} />
              ))}
            </div>
          )}
          {row2.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {row2.map((c, i) => (
                <LinkBox key={c.id} index={i + 2} {...c} labelStyle={labelStyle} />
              ))}
            </div>
          )}
          {row3.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {row3.map((c, i) => (
                <LinkBox key={c.id} index={i + 6} {...c} labelStyle={labelStyle} />
              ))}
            </div>
          )}
          {rest.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {rest.map((c, i) => (
                <LinkBox key={c.id} index={i + 10} {...c} labelStyle={labelStyle} />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}