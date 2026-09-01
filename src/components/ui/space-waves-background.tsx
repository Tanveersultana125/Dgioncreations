"use client";
import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { getDeviceTier, useInViewport } from "@/lib/perf";

export const SpaceWavesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const visible = useInViewport(canvasRef, "150px");
  const visibleRef = useRef(visible);
  visibleRef.current = visible;
  
  // Parallax tracking
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -80]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth - 0.5) * 20); // Very subtle parallax
      mouseY.set((e.clientY / innerHeight - 0.5) * 20);
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Particle Network Canvas Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = canvas.parentElement?.clientHeight || 800;

    // Connections are O(n^2): 60 particles is 1,770 distance checks per frame.
    // Halving the count on weak hardware quarters that work.
    const getParticleCount = () => {
      if (getDeviceTier() === "low") return 18;
      return window.innerWidth < 768 ? 24 : 48;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseOpacity: number;
      color: string;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.15; // Drift very slowly
        this.vy = (Math.random() - 0.5) * 0.15;
        this.size = Math.random() * 1.5 + 0.5;
        this.baseOpacity = Math.random() * 0.1 + 0.05; // 5% - 15% opacity
        
        // Deep blue and cyan tones for premium feel
        const colors = ["131, 127, 251", "0, 255, 255", "100, 150, 255"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
      }

      // Hide particles in the center UI area
      getCenterFade() {
        const centerX = w / 2;
        const centerY = h / 2;
        const dist = Math.sqrt(Math.pow(this.x - centerX, 2) + Math.pow(this.y - centerY, 2));
        // Invisible within 250px of center, fully visible past 450px
        return Math.max(0, Math.min(1, (dist - 250) / 200));
      }

      draw() {
        if (!ctx) return;
        const fade = this.getCenterFade();
        if (fade <= 0) return;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.baseOpacity * fade})`;
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      // Keep the loop scheduled but do zero work while off-screen or hidden.
      if (!visibleRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        const fadeI = particles[i].getCenterFade();
        if (fadeI <= 0) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const fadeJ = particles[j].getCenterFade();
          if (fadeJ <= 0) continue;

          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq >= 140 * 140) continue;
          const dist = Math.sqrt(distSq);

          {
            ctx.beginPath();
            const lineOpacity = 0.1 * (1 - dist / 140) * Math.min(fadeI, fadeJ);
            ctx.strokeStyle = `rgba(131, 127, 251, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = canvas.parentElement?.clientHeight || 800;
      init();
    };

    window.addEventListener("resize", handleResize, { passive: true });
    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#050816] to-[#0a0f2c] pointer-events-none">
      
      {/* 4. NETWORK PARTICLES (Canvas) - rendered below everything to sit in the deep background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
        style={{ mixBlendMode: "screen" }}
      />
      
      {/* CENTER FOCUS: Very faint radial glow behind the circular UI */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#837FFB]/5 via-transparent to-transparent opacity-70 z-0" />
      
      {/* DEPTH ELEMENTS: Large, blurred circular gradient shapes */}
      <motion.div style={{ x: smoothX, y: smoothY, translateY: yParallax }} className="absolute inset-0 z-0">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.06, 0.1, 0.06] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[20%] w-[35vw] h-[35vw] bg-[#837FFB] rounded-full blur-[130px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.04, 0.08, 0.04] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] right-[15%] w-[45vw] h-[45vw] bg-[#00FFFF] rounded-full blur-[150px]"
        />
      </motion.div>
      
    </div>
  );
};
