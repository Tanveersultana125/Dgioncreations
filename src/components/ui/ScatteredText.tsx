import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScatteredTextProps {
  text: string;
  className?: string;
  charClassName?: string;
  style?: React.CSSProperties;
  speed?: number;
  trigger?: "view" | "hover";
}

export default function ScatteredText({
  text,
  className = "",
  charClassName = "",
  style = {},
  speed = 0.06,
  trigger = "view",
}: ScatteredTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [assembled, setAssembled] = useState(trigger === "hover");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (trigger === "view" && isInView) {
      const t = setTimeout(() => setAssembled(true), 300);
      return () => clearTimeout(t);
    }
  }, [isInView, trigger]);

  const isActive = trigger === "hover" ? hovered : assembled;

  const words = text.split(" ");
  let globalIndex = 0;

  return (
    <motion.span
      ref={ref}
      className={`inline-block ${className}`}
      onMouseEnter={() => trigger === "hover" && setHovered(true)}
      onMouseLeave={() => trigger === "hover" && setHovered(false)}
      style={{ cursor: trigger === "hover" ? "pointer" : "default", ...style }}
    >
      {words.map((word, wIdx) => {
        const isLastWord = wIdx === words.length - 1;
        
        return (
          <span key={wIdx} className="inline-block whitespace-nowrap">
            {word.split("").map((char, cIdx) => {
              const i = globalIndex++;
              const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
              const scatterMultiplier = isMobile ? 0.3 : 1.0; // Reduce scatter on mobile

              const seed = (i * 137.508 + 42) % 1;
              const randomX = (seed - 0.5) * 300 * scatterMultiplier;
              const randomY = ((i * 73.13 + 17) % 1 - 0.5) * 250 * scatterMultiplier;
              const randomRotate = (seed - 0.5) * 360;
              const randomScale = 0.3 + seed * 1.5;

              return (
                <motion.span
                  key={cIdx}
                  className={`inline-block ${charClassName}`}
                  initial={
                    trigger === "view"
                      ? {
                          x: randomX,
                          y: randomY,
                          rotate: randomRotate,
                          scale: randomScale,
                          opacity: 0.6,
                        }
                      : false
                  }
                  animate={
                    isActive
                      ? {
                          x: 0,
                          y: 0,
                          rotate: 0,
                          scale: 1,
                          opacity: 1,
                        }
                      : {
                          x: randomX,
                          y: randomY,
                          rotate: randomRotate,
                          scale: randomScale,
                          opacity: 0.6,
                        }
                  }
                  transition={{
                    duration: 0.8,
                    delay: i * speed,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    display: "inline-block",
                    transformOrigin: "center",
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
            {!isLastWord && (
              <span className="inline-block" style={{ width: "0.25em" }}>
                {"\u00A0"}
              </span>
            )}
          </span>
        );
      })}
    </motion.span>
  );
}