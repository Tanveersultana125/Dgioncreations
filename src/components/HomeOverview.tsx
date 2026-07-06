import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useContent } from "@/lib/use-content";
import {
  EXPLORE_CONTENT_KEY,
  defaultExploreContent,
  type ExploreContent,
  DEFAULT_HEADING_STYLE,
  DEFAULT_HIGHLIGHT_STYLE,
} from "@/content/explore";
import { textStyleToCss } from "@/content/typography";
import { MarkupText } from "@/lib/markup-text";
import CircularGallery from "@/components/ui/CircularGallery";

export default function HomeOverview() {
  const { data } = useContent<ExploreContent>(EXPLORE_CONTENT_KEY, defaultExploreContent);
  const items = data.cards || [];
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const handleItemClick = (item: any) => {
    if (item.url) {
      navigate(item.url);
    }
  };

  return (
    <section ref={containerRef} className="relative z-0 bg-[#0A0818] pt-10 pb-4 md:pt-32 md:pb-12 h-auto flex flex-col">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 mb-0 md:mb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-[1200px]"
        >
          {/* Small eyebrow — kept intentionally tiny so it never competes with
              or overlaps the heading on narrow phones. Only the admin colour is
              honoured; the large editor fontSize is deliberately ignored here. */}
          <span
            className="text-[11px] md:text-sm font-black tracking-[0.3em] md:tracking-[0.4em] uppercase block mb-3 md:mb-4 leading-tight"
            style={{ color: data.highlightStyle?.color || DEFAULT_HIGHLIGHT_STYLE.color }}
          >
            {data.kicker || "OUR FOCUS"}
          </span>
          <h2
            className="text-white font-sans font-extrabold leading-[1.15] tracking-tight mb-8 break-words"
            style={textStyleToCss(data.headingStyle, DEFAULT_HEADING_STYLE)}
          >
            <MarkupText 
               text={`${data.headingBefore} **${data.headingHighlight}** ${data.headingAfter}`} 
               highlightStyle={data.highlightStyle || DEFAULT_HIGHLIGHT_STYLE}
               highlightClassName="text-[#837FFB]"
            />
          </h2>
        </motion.div>
      </div>

      {/* Single Unified Circular Gallery for all items */}
      <div className="flex-grow relative flex items-center justify-center -mt-8 md:-mt-48 overflow-visible">
        <div className="relative w-full flex items-center justify-center">
             {/* Floating Glow Blobs */}
             <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[150px] opacity-20 animate-pulse bg-[#837FFB]/30" />
             <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[180px] opacity-10 bg-white/5" />

             <div className="relative w-full h-[520px] md:h-[950px] mt-0">
                <CircularGallery 
                  bend={1.2} 
                  textColor="#ffffff" 
                  borderRadius={0.06} 
                  scrollEase={0.03}
                  onItemClick={handleItemClick}
                  items={items.map(item => ({
                    image: item.image,
                    text: item.title,
                    summary: item.summary,
                    url: item.url
                  }))}
                />
             </div>
        </div>
      </div>
    </section>
  );
}