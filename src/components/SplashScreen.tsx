import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [stage, setStage] = useState<"motion" | "settled" | "fade">("motion");
  const letters = ["D", "G", "I", "O", "N"];
  
  const entryPositions = [
    { x: -800, y: -200, rotate: -180 },
    { x: 200,  y: -800, rotate: 90 },
    { x: -200, y: 800,  rotate: -90 },
    { x: 800,  y: 200,  rotate: 180 },
    { x: 600,  y: -600, rotate: 270 },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStage("settled"), 500);
    const timer2 = setTimeout(() => setStage("fade"), 2400);
    const timer3 = setTimeout(() => onFinish(), 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: stage === "fade" ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden"
      style={{ willChange: "opacity" }}
    >
      {/* Optimized Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#837FFB]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative flex items-center justify-center -gap-6">
        {letters.map((letter, index) => (
          <div key={index} className="relative">
            {/* Particle Trail (Simplified for Performance) */}
            {stage === "motion" && (
                <motion.div
                    initial={{ x: entryPositions[index].x, y: entryPositions[index].y, opacity: 1, scale: 0.8 }}
                    animate={{ x: 0, y: 0, opacity: 0, scale: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center z-0"
                    style={{ willChange: "transform, opacity" }}
                >
                    <div className="w-8 h-8 bg-[#837FFB] rounded-full shadow-[0_0_20px_#837FFB]" />
                </motion.div>
            )}

            <motion.span
              initial={{ 
                x: entryPositions[index].x, 
                y: entryPositions[index].y, 
                rotate: entryPositions[index].rotate,
                opacity: 0,
                scale: 0.1,
                color: "#837FFB"
              }}
              animate={{ 
                x: stage === "motion" ? entryPositions[index].x : 0,
                y: stage === "motion" ? entryPositions[index].y : 0,
                rotate: stage === "motion" ? entryPositions[index].rotate : 0,
                opacity: 1,
                scale: stage === "settled" ? 1 : 0.2,
                color: stage === "settled" ? "#FFFFFF" : "#837FFB"
              }}
              transition={{ 
                type: "spring",
                stiffness: 220,
                damping: 14,
                mass: 0.6,
                delay: index * 0.05
              }}
              className="text-[clamp(3rem,19vw,8rem)] md:text-[13rem] font-black tracking-[-0.15em] italic select-none inline-block relative z-10"
              style={{
                  fontFamily: "'Inter', sans-serif",
                  willChange: "transform, opacity",
                  transform: "translateZ(0)", // Force GPU
                  textShadow: stage === "settled" 
                      ? "0 0 30px rgba(255,255,255,0.4)" 
                      : "0 0 50px rgba(131,127,251,0.6)"
              }}
            >
              {letter}
            </motion.span>
          </div>
        ))}
      </div>

      {/* Optimized Background Particles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
          {[...Array(10)].map((_, i) => (
              <motion.div
                  key={i}
                  initial={{ 
                    x: Math.random() * 1200, 
                    y: Math.random() * 800,
                    scale: 0
                  }}
                  animate={{ 
                    y: [null, -100], 
                    opacity: [0, 0.5, 0],
                    scale: [0, 0.5, 0]
                  }}
                  transition={{ 
                    duration: 2 + Math.random() * 2, 
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute w-1.5 h-1.5 bg-[#837FFB] rounded-full"
              />
          ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === "settled" ? 0.6 : 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-12 text-white/50 text-[11px] font-bold tracking-[0.8em] uppercase"
      >
        Digital Innovation Agency
      </motion.div>
    </motion.div>
  );
}
