import { lazy, Suspense, useCallback, useMemo, useRef } from "react";
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
// The gallery pulls in the OGL WebGL runtime. It lives below the fold, so it
// has no business being in the first-paint bundle.
const CircularGallery = lazy(() => import("@/components/ui/CircularGallery"));

export default function HomeOverview() {
  const { data } = useContent<ExploreContent>(EXPLORE_CONTENT_KEY, defaultExploreContent);
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const items = data.cards || [];

  // Stable identity — CircularGallery keys its WebGL setup off these props, so
  // a fresh function/array on every render used to tear the whole scene down
  // and rebuild it. Both hooks must run before any early return.
  const handleItemClick = useCallback(
    (item: any) => {
      if (item.url) navigate(item.url);
    },
    [navigate],
  );

  const galleryItems = useMemo(
    () =>
      items.map((item) => ({
        image: item.image,
        text: item.title,
        summary: item.summary,
        url: item.url,
      })),
    // `data.cards` is a fresh array each render; the contents are what matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(items)],
  );

  if (items.length === 0) return null;

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
            className="text-[11px] md:text-sm font-black tracking-[0.3em] md:tracking-[0.4em] uppercase block mb-3 md:mb-4 leading-[1.5] break-words"
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
             {/* Floating glow blobs.
                 These used to be `blur-[150px]` + `animate-pulse`, i.e. the GPU
                 re-blurred a 384px surface every single frame. Painted as radial
                 gradients they look identical and cost one composite, once. */}
             <div
               className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 pointer-events-none"
               style={{
                 background:
                   "radial-gradient(circle, rgba(131,127,251,0.30) 0%, rgba(131,127,251,0.12) 45%, transparent 70%)",
               }}
             />
             <div
               className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none"
               style={{
                 background:
                   "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)",
               }}
             />

             <div className="relative w-full h-[520px] md:h-[950px] mt-0">
                <Suspense fallback={null}>
                <CircularGallery 
                  bend={1.2} 
                  textColor="#ffffff" 
                  borderRadius={0.06} 
                  scrollEase={0.03}
                  onItemClick={handleItemClick}
                  items={galleryItems}
                />
                </Suspense>
             </div>
        </div>
      </div>
    </section>
  );
}