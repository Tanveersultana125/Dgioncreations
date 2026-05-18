import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';
import { StatCounter } from "@/components/ui/StatCounter";

interface AnimatedFeatureSpotlightProps extends React.HTMLAttributes<HTMLElement> {
  preheaderIcon?: React.ReactNode;
  preheaderText: string;
  heading: React.ReactNode;
  description: string;
  buttonText: string;
  buttonProps?: ButtonProps;
  imageUrl: string;
  imageAlt?: string;
  /** Trust strip shown below the button. Pass an empty array to hide. */
  stats?: string[];
  /** Inline CSS typography overrides — driven by the admin's TextStyleEditor. */
  preheaderStyle?: React.CSSProperties;
  headingStyle?: React.CSSProperties;
  descriptionStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  statStyle?: React.CSSProperties;
}

const AnimatedFeatureSpotlight = React.forwardRef<HTMLElement, AnimatedFeatureSpotlightProps>(
  (
    {
      className,
      preheaderIcon,
      preheaderText,
      heading,
      description,
      buttonText,
      buttonProps,
      imageUrl,
      imageAlt = 'Feature illustration',
      stats = ['100+ Projects', '99.9% Uptime', '24/7 Support'],
      preheaderStyle,
      headingStyle,
      descriptionStyle,
      buttonStyle,
      statStyle,
      ...props
    },
    ref
  ) => {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = React.useState({ rx: 0, ry: 0, shine: { x: '50%', y: '50%' } });

    const handleMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const cx = (clientX - rect.left - rect.width / 2) / rect.width;
      const cy = (clientY - rect.top - rect.height / 2) / rect.height;
      setTilt({
        rx: -cy * 18,
        ry: cx * 18,
        shine: {
          x: `${((clientX - rect.left) / rect.width) * 100}%`,
          y: `${((clientY - rect.top) / rect.height) * 100}%`,
        },
      });
    };
    const handleLeave = () => setTilt({ rx: 0, ry: 0, shine: { x: '50%', y: '50%' } });

    // Google-level Senior UI/UX Fix: Passive activation on scroll for mobile parity
    const isInView = useInView(cardRef, { margin: "-20%", once: false });
    React.useEffect(() => {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      if (isMobile && isInView) {
        setTilt({ rx: -2, ry: 2, shine: { x: '40%', y: '40%' } });
        const t = setTimeout(() => handleLeave(), 800);
        return () => clearTimeout(t);
      }
    }, [isInView]);

    return (
      <section
        ref={ref}
        className={cn('w-full max-w-6xl mx-auto', className)}
        aria-labelledby="feature-spotlight-heading"
        style={{ perspective: '1400px', touchAction: 'pan-y' }} // Allow vertical scroll but capture horizontal for tilt
        {...props}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMove}
          onMouseLeave={handleLeave}
          onTouchStart={handleMove}
          onTouchMove={handleMove}
          onTouchEnd={handleLeave}
          className="relative p-5 sm:p-8 md:p-12 rounded-2xl overflow-hidden transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* card bg */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'inherit',
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'inherit',
              boxShadow: 'inherit',
            }}
          />

          {/* iridescent border */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              padding: 1.5,
              background: 'linear-gradient(135deg, rgba(131,127,251,0.45) 0%, transparent 30%, transparent 70%, rgba(165,160,255,0.35) 100%)',
              WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />

          {/* mouse shine */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
            style={{
              background: `radial-gradient(600px circle at ${tilt.shine.x} ${tilt.shine.y}, rgba(131,127,251,0.12), transparent 55%)`,
            }}
          />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* left text — each element at different depth */}
            <div
              className="flex flex-col space-y-6 text-center md:text-left items-center md:items-start"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* preheader — Z:70 */}
              <div
                className="flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-700"
                style={{ transform: 'translateZ(70px)', ...preheaderStyle }}
              >
                <div className="p-2 rounded-lg" style={{ background: 'rgba(131,127,251,0.12)', border: '1px solid rgba(131,127,251,0.25)' }}>
                  {preheaderIcon}
                </div>
                <span>{preheaderText}</span>
              </div>

              {/* heading — Z:55 */}
              <h2
                id="feature-spotlight-heading"
                className="tracking-tight text-foreground animate-in fade-in slide-in-from-top-4 duration-700 delay-150 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold px-4 sm:px-0"
                style={{ 
                  transform: 'translateZ(55px)', 
                  ...headingStyle,
                  fontSize: undefined // Allow Tailwind classes to handle responsiveness if style doesn't explicitly override it with a fixed px
                }}
              >
                {heading}
              </h2>

              {/* description — Z:35 */}
              <p
                className="leading-relaxed animate-in fade-in slide-in-from-top-4 duration-700 delay-300"
                style={{ transform: 'translateZ(35px)', ...descriptionStyle }}
              >
                {description}
              </p>

              {/* button — Z:65 */}
              <div
                className="animate-in fade-in slide-in-from-top-4 duration-700 delay-400"
                style={{ transform: 'translateZ(65px)' }}
              >
                <Button size="lg" {...buttonProps} style={{ ...buttonStyle, ...(buttonProps?.style) }}>
                  {buttonText}
                </Button>
              </div>

              {/* trust line — Z:25 */}
              {stats.length > 0 && (
                <div
                  className="flex items-center gap-6 pt-2 animate-in fade-in duration-700 delay-500 flex-wrap"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  {stats.map((t) => (
                    <span
                      key={t}
                      className="tracking-wider uppercase"
                      style={statStyle}
                    >
                      <StatCounter value={t} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* right image — 3D pop-out with stacked depth cards */}
            <div
              className="relative w-full aspect-[4/3] md:aspect-auto md:min-h-[360px] flex items-center justify-center animate-in fade-in zoom-in-95 duration-700 delay-200"
              style={{ transform: 'translateZ(80px)', transformStyle: 'preserve-3d' }}
            >

              {/* main image card — full width */}
              <div
                className="relative rounded-2xl overflow-hidden w-full"
                style={{
                  border: '1px solid rgba(131,127,251,0.25)',
                  boxShadow: '0 30px 70px rgba(0,0,0,0.5), 0 0 40px rgba(131,127,251,0.12)',
                }}
              >
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className="w-full h-full object-cover object-center animate-float"
                  style={{ filter: 'brightness(0.85) saturate(0.9)' }}
                />
                {/* purple tint */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(131,127,251,0.12) 0%, transparent 60%)' }} />
                {/* glass shine band */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.08) 48%, rgba(255,255,255,0.12) 52%, transparent 70%)' }} />
                {/* top reflection */}
                <div className="absolute inset-x-0 top-0 h-1/3" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)' }} />
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  }
);
AnimatedFeatureSpotlight.displayName = 'AnimatedFeatureSpotlight';

export { AnimatedFeatureSpotlight };