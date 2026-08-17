import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, prefersReducedMotion } from "./gsap-setup";
import { BRANDS } from "./data";

function BrandStrip() {
  const root = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);

  useLayoutEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(root.current.querySelector("[data-track]"), {
          clearProps: "all",
        });
        return;
      }
      tweenRef.current = gsap.to(trackRef.current, {
        xPercent: -50,
        ease: "none",
        duration: 32,
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const handleEnter = () => {
    if (tweenRef.current) {
      tweenRef.current.timeScale(0.2);
    }
  };
  const handleLeave = () => {
    if (tweenRef.current) {
      tweenRef.current.timeScale(1);
    }
  };

  return (
    <section
      ref={root}
      className="py-16 bg-surface-raised border-y border-border overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 text-center mb-8">
        <p className="overline text-accent text-xs">
          Heritage Houses &amp; Contemporary Labels
        </p>
      </div>

      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative"
      >
        {/* Left/Right Fading Gradients */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r from-surface-raised to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-surface-raised to-transparent" />

        <div className="flex overflow-hidden">
          <div
            ref={trackRef}
            data-track
            className="flex shrink-0 items-center gap-16 sm:gap-24 pr-16 sm:pr-24 whitespace-nowrap"
          >
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <Link
                key={`${brand.id}-${i}`}
                to="/shop/listing"
                className={`font-serif text-2xl sm:text-3xl text-taupe hover:text-espresso transition-colors duration-base ${brand.style} group flex flex-col items-center`}
              >
                <span>{brand.label}</span>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
                  {brand.tag}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] uppercase tracking-[0.2em] text-taupe/70 mt-8">
        Hover to inspect brand collections · Direct filter links
      </p>
    </section>
  );
}

export default BrandStrip;
