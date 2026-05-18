import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContent } from "@/lib/use-content";
import {
  EXPLORE_CONTENT_KEY,
  defaultExploreContent,
  type ExploreContent,
} from "@/content/explore";

export default function HomeDetailsSection() {
  const { data } = useContent<ExploreContent>(EXPLORE_CONTENT_KEY, defaultExploreContent);
  const navigate = useNavigate();
  
  // Use the dedicated pillar cards for this section
  const items = data.pillarCards || [];

  if (items.length === 0) return null;

  return (
    <section className="bg-[#0A0818] pt-4 pb-12 overflow-hidden">
      {/* Removed duplicated header as it's now handled by HomeOverview */}


      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="space-y-12 md:space-y-20">
          {items.map((item, index) => {
            const isEven = index % 2 === 1;
            
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-24`}
              >
                {/* Text Content */}
                <div className="flex-[1.2] space-y-8">
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <div className="inline-flex px-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-8">
                      <span className="text-[#837FFB] text-[10px] font-black tracking-[0.3em] uppercase">
                        {item.badge}
                      </span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-8">
                      {item.title}
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl">
                      {item.summary}
                    </p>
                    
                    <button
                      onClick={() => navigate(item.url)}
                      className="mt-12 group relative inline-flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-bold transition-all hover:bg-[#837FFB] hover:border-[#837FFB] active:scale-95"
                    >
                      EXPLORE {item.title.toUpperCase()}
                      <svg 
                        className="w-5 h-5 transition-transform group-hover:translate-x-2" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </motion.div>
                </div>

                {/* Visual Content */}
                <div className="flex-[0.8] w-full max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    {/* Decorative Background Glow */}
                    <div 
                      className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl transition-opacity group-hover:opacity-40"
                      style={{ backgroundColor: item.accent }}
                    />
                    
                    {/* Main Image Container */}
                    <motion.div 
                      whileHover={{ scale: 1.02, rotateY: isEven ? -5 : 5, rotateX: 2 }}
                      whileTap={{ scale: 0.98, rotateY: isEven ? -8 : 8, rotateX: 4 }}
                      // Google-level Senior UI/UX Fix: Passive parallax for mobile parity
                      animate={{ 
                        rotateY: typeof window !== 'undefined' && window.innerWidth < 768 ? (isEven ? -3 : 3) : 0,
                        rotateX: typeof window !== 'undefined' && window.innerWidth < 768 ? 2 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                      className="relative aspect-[3/2] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0F0D21] cursor-pointer"
                    >
                      <img 
                        src={item.detailsImage || item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                      
                      {/* Interaction Shine */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 pointer-events-none transition-opacity" />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
