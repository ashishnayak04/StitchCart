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
        duration: 30,
        repeat: -1,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const handleEnter = () => {
    if (tweenRef.current) {
      tweenRef.current.timeScale(0.25);
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
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <p className="overline text-muted text-center mb-8">
          Filter by the brands you trust
        </p>
      </div>

      <div
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="relative"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-28 z-10 bg-gradient-to-r from-surface-raised to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-28 z-10 bg-gradient-to-l from-surface-raised to-transparent" />

        <div className="flex overflow-hidden">
          <div ref={trackRef} data-track className="flex shrink-0 items-center gap-20 pr-20 whitespace-nowrap">
            {[...BRANDS, ...BRANDS].map((brand, i) => (
              <Link
                key={`${brand.id}-${i}`}
                to="/shop/listing"
                className={`font-serif text-2xl sm:text-3xl text-taupe hover:text-espresso transition-colors duration-base ${brand.style} group`}
              >
                {brand.label}
                <span className="block text-[10px] uppercase tracking-[0.24em] text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-fast">
                  shop {brand.label.toLowerCase()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] uppercase tracking-[0.2em] text-taupe/70 mt-8">
        Pause on hover — filter the shop instantly
      </p>
    </section>
  );
}

export default BrandStrip;
